import fs from "fs";
import gulp from "gulp";
import color from "gulp-color";
import nunjucksRender from "gulp-nunjucks-render";
import index from "gulp-index";
import gulpif from "gulp-if";
import rename from "gulp-rename";
import replace from "gulp-replace";
import plumber from "gulp-plumber";
import notify from "gulp-notify";
import sourcemaps from "gulp-sourcemaps";
import concat from "gulp-concat";
import dartSass from "sass";
import gulpSass from "gulp-sass";
import autoprefixer from "gulp-autoprefixer";
import cleanCSS from "gulp-clean-css";
import terser from "gulp-terser";
import babel from "gulp-babel";

import { deleteSync } from "del";
import { create } from "browser-sync";

const { watch } = gulp;
const sass = gulpSass(dartSass);
const browsersync = create();

const packageJSON = JSON.parse(fs.readFileSync("./package.json"));

const output_paths = function (rootPath, servePath) {
    this.root = rootPath;
    // server
    this.servePath = servePath || rootPath;
    this.html = `${this.servePath}/pages/`;
    // assets
    this.static = `${this.root}/static/`;
    this.css = `${this.root}/css/`;
    this.js = `${this.root}/js/`;
    this.vendorjs = `${this.root}/js/`;
};

let ENV_VARS = {
    // ENV_BUILDMODE: "development",
    ENV_BUILDMODE: "production",
    ENV_PAGE_TITLE: packageJSON.config.title,
};
Object.entries(process.env).forEach(([key, value]) => {
    if (key.indexOf("ENV_") === 0) {
        ENV_VARS[key] = value;
    }
});

//! DO NOT put a trailing slash on the paths.
// If you want the HTML pages (dev only) to be output to a different location than the assets, add the path as the 2nd parameter. eg/ const build_path =  output_paths(`./build/fe`,`./build`);
const build_path = new output_paths(`./build`);
const deploy_path = new output_paths("./dep/fe/aemoservices"); // set to new output_paths("") to not use
const final_package_path = new output_paths(""); // set to new output_paths("") to not use

console.log(color(`******************************************************************`, "YELLOW"));
console.log(color(`*`, "YELLOW"));
console.log(color(`*  Starting Gulp Tasks for '${ENV_VARS.ENV_PAGE_TITLE}'`, "YELLOW"));
console.log(color(`*  Build Mode: '${ENV_VARS.ENV_BUILDMODE}'`, "YELLOW"));
console.log(color(`*`, "YELLOW"));
console.log(color(`******************************************************************`, "YELLOW"));
console.log(color(`************************** OUTPUT PATHS **************************`, "GREEN"));
console.log(color(`*`, "GREEN"));
if (ENV_VARS.ENV_BUILDMODE !== "production") console.log(color(`*  build_path:         '${build_path.root}'`, "GREEN"));
if (ENV_VARS.ENV_BUILDMODE === "production") console.log(color(`*  deploy_path:        '${deploy_path.root === "" ? "NOT SET" : deploy_path.root}'`, "GREEN"));
if (ENV_VARS.ENV_BUILDMODE === "production") console.log(color(`*  final_package_path: '${final_package_path.root === "" ? "NOT SET" : final_package_path.root}'`, "GREEN"));
console.log(color(`*`, "GREEN"));
console.log(color(`******************************************************************`, "GREEN"));

gulp.task("generate:pages", () => {
    console.log(color(`>>>> Generating HTML pages into '${build_path.html}'`, "YELLOW"));
    deleteSync([build_path.html + "/**/*.*"]);
    return gulp
        .src(["./src/pages/**/*.nunjucks"])
        .pipe(plumber(notify.onError("Error: <%= error.message %>")))
        .pipe(
            nunjucksRender({
                path: ["src/templates", "src/pages"],
                ext: "", // omit the extension, as it's already in the .nunjucks filename (the .nunjucks ext just gets removed)
                data: ENV_VARS, // this will replace ANYTHING with a matching key in the ENV_VARS
            })
        )
        .pipe(gulp.dest(build_path.html));
});

gulp.task(
    "generate:index",
    gulp.series("generate:pages", function InjectFilenames() {
        console.log(color(`>>>> Generating HTML Index into '${build_path.html}'`, "YELLOW"));

        let lastPath = "";
        let title = ENV_VARS.ENV_PAGE_TITLE + " Pages";

        return gulp
            .src(`${build_path.html}/**/*.*`)
            .pipe(
                index({
                    relativePath: build_path.servePath,
                    title: title,
                    "prepend-to-output": () => `<html>
      <head>
        <title>${title}</title>
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;700;900&display=swap" rel="stylesheet">
        <style type="text/css">
            body {
                font-family: Poppins, Calibri, Arial;
                font-size: 16px;
                padding: 20px;
                margin: 0px;
            }
            section {
              margin: 0px;
              padding: 0px;
            }
            h1 {
              text-align: center;
              font-size: 50px;
              line-height: 0.8;
            }
            h2 {
              text-transform: uppercase;
              font-size: 30px;
            }
            ul {
              margin: 0px;
              padding: 0px;
            }
            ul li {
              margin-left: 20px;
              padding-bottom: 3px;
            }
            ul li.new-folder {
              margin-top: 20px;
            }
            ul li a, ul li a:visited {
              text-decoration: none;
              color: inherit;
            }
            ul li a:hover, ul li a:active {
              text-decoration: underline;
            }
            span {
              opacity: 0.6;
            }

        </style>
      </head>
      <body>`,
                    "append-to-output": () => `</body></html>`,
                    "item-template": (filepath, filename) => {
                        var isNewFolder = false;
                        var thisFileNamePath = filename.split("\\");
                        var thisFileName = thisFileNamePath.pop();
                        var thisFolderPath = thisFileNamePath.join("/");
                        if (lastPath !== thisFolderPath) isNewFolder = true;
                        lastPath = thisFolderPath;

                        if (thisFolderPath.length > 0) thisFolderPath = "[/" + thisFolderPath + "] ";

                        return `<li class="${isNewFolder ? "new-folder" : ""}"><span>${thisFolderPath}</span><a href="${filepath}/${filename}">${thisFileName}</a></li>`;
                    },
                })
            )
            .pipe(gulp.dest(build_path.servePath));
    })
);

gulp.task("compile:css", () => {
    console.log(color(`>>>> Compiling SASS files into CSS`, "YELLOW"));
    return gulp
        .src("./src/scss/styles.scss") // scss files in scss folder and sub folders
        .pipe(plumber({ errorHandler: notify.onError("Error: <%= error.message %>") }))
        .pipe(gulpif(ENV_VARS.ENV_BUILDMODE !== "production", sourcemaps.init()))
        .pipe(sass()) // process sass
        .pipe(autoprefixer({ env: ENV_VARS.ENV_BUILDMODE })) // browser prefixer (gets settings from packages.json)
        .pipe(concat("styles.css")) // combine src files into this file
        .pipe(gulpif(ENV_VARS.ENV_BUILDMODE !== "production", sourcemaps.write(".")))
        .pipe(gulpif(ENV_VARS.ENV_BUILDMODE !== "production", gulp.dest(build_path.css)))
        .pipe(cleanCSS()) // minify combined css
        .pipe(rename({ suffix: ".min" }))
        .pipe(gulpif(ENV_VARS.ENV_BUILDMODE === "production" && deploy_path.root !== "", gulp.dest(deploy_path.css)))
        .pipe(gulpif(ENV_VARS.ENV_BUILDMODE === "production" && final_package_path.root !== "", gulp.dest(final_package_path.css)));
});
gulp.task("compile:scripts:components", () => {
    console.log(color(`>>>> Generating Component Javascript files`, "YELLOW"));
    return (
        gulp
            .src(["./src/scripts/index.js", "./src/templates/components/**/*.js", "./src/templates/components/**/*.jsx"]) // Get all JS files in the Components directory.
            .pipe(concat("scripts.js")) // Concatenate them into one JavaScript file named: "main.js".
            .pipe(
                replace(/process\.env\.(\w+)/g, (match, p1, offset, string) => {
                    return process.env[p1] ? `"${process.env[p1]}"` : undefined;
                })
            )
            // babel to transcode latest ECMAScript code formats
            .pipe(
                babel({
                    presets: ["@babel/preset-env"],
                })
            )
            .pipe(gulpif(ENV_VARS.ENV_BUILDMODE !== "production", gulp.dest(build_path.js)))
            .pipe(rename({ suffix: ".min" }))
            // terser to shrink it down for prod.
            .pipe(
                terser({
                    compress: {
                        drop_console: true,
                    },
                })
            )
            .pipe(gulpif(ENV_VARS.ENV_BUILDMODE === "production" && deploy_path.root !== "", gulp.dest(deploy_path.js)))
            .pipe(gulpif(ENV_VARS.ENV_BUILDMODE === "production" && final_package_path.root !== "", gulp.dest(final_package_path.js)))
    );
});
gulp.task("compile:scripts:vendor", () => {
    console.log(color(`>>>> Generating Vendor Javascript files`, "YELLOW"));
    return (
        gulp
            .src(["./src/scripts/lib/*.js"]) // Get all JS files in the Vendor JS directory.
            .pipe(concat("lib.js")) // Concatenate them into one JavaScript file named: "lib.js".
            .pipe(
                replace(/process\.env\.(\w+)/g, (match, p1, offset, string) => {
                    return process.env[p1] ? `"${process.env[p1]}"` : undefined;
                })
            )
            // babel to transcode latest ECMAScript code formats
            .pipe(
                babel({
                    presets: ["@babel/preset-env"],
                })
            )
            .pipe(gulpif(ENV_VARS.ENV_BUILDMODE !== "production", gulp.dest(build_path.vendorjs)))
            .pipe(rename({ suffix: ".min" }))
            // terser to shrink it down for prod.
            .pipe(
                terser({
                    compress: {
                        drop_console: true,
                    },
                })
            )
            .pipe(gulpif(ENV_VARS.ENV_BUILDMODE === "production" && deploy_path.root !== "", gulp.dest(deploy_path.vendorjs)))
            .pipe(gulpif(ENV_VARS.ENV_BUILDMODE === "production" && final_package_path.root !== "", gulp.dest(final_package_path.vendorjs)))
    );
});
gulp.task("copy:static", () => {
    console.log(color(`>>>> Copying Images`, "YELLOW"));
    return gulp
        .src([`src/static/**/*.*`])
        .pipe(gulpif(ENV_VARS.ENV_BUILDMODE !== "production", gulp.dest(build_path.static)))
        .pipe(gulpif(ENV_VARS.ENV_BUILDMODE === "production" && deploy_path.root !== "", gulp.dest(deploy_path.static)))
        .pipe(gulpif(ENV_VARS.ENV_BUILDMODE === "production" && final_package_path.root !== "", gulp.dest(final_package_path.static)));
});

gulp.task("browsersync:start", () => {
    console.log("Starting Dev Server");
    browsersync.init({
        port: ENV_VARS.ENV_PORT || 3000,
        notify: false,
        ghostMode: false,
        server: {
            baseDir: build_path.servePath,
            injectChanges: false,
        },
    });
    return Promise.resolve();
});
gulp.task("browsersync:reload", () => {
    browsersync.reload();
    return Promise.resolve();
});
gulp.task("watch", () => {
    console.log(`Watching Dev Server`);
    console.info(color(`Watching files for changes:`, `YELLOW`));
    console.info(color(` - src/**/*.nunjucks`, `YELLOW`));
    console.info(color(` - src/**/*.scss`, `YELLOW`));
    console.info(color(` - src/**/*.js`, `YELLOW`));
    console.info(color(` - src/static/**/*.*`, `YELLOW`));

    watch(["./src/**/*.nunjucks"], gulp.series("generate:index", "browsersync:reload")).on("change", function (path) {
        console.log(color("File Changed: ", "GREEN"), color(path, "YELLOW"));
    });
    watch(["./src/**/*.scss"], gulp.series("compile:css", "browsersync:reload")).on("change", function (path) {
        console.log(color("File Changed: ", "GREEN"), color(path, "YELLOW"));
    });
    watch(["./src/scripts/index.js", "./src/templates/components/**/*.js", "./src/templates/components/**/*.jsx"], gulp.series("compile:scripts:components", "browsersync:reload")).on(
        "change",
        function (path) {
            console.log(color("File Changed: ", "GREEN"), color(path, "YELLOW"));
        }
    );
    watch(["./src/scripts/lib/*.js"], gulp.series("compile:scripts:vendor", "browsersync:reload")).on("change", function (path) {
        console.log(color("File Changed: ", "GREEN"), color(path, "YELLOW"));
    });
    watch([`./src/static/**/*.*`], gulp.series("copy:static", "browsersync:reload")).on("change", function (path) {
        console.log(color("File Changed: ", "GREEN"), color(path, "YELLOW"));
    });
});

gulp.task("build", gulp.series("compile:scripts:components", "compile:scripts:vendor", "compile:css", "copy:static"));
gulp.task("start", gulp.series("build", "generate:index", "browsersync:start", "watch"));
gulp.task("default", gulp.series("start"));

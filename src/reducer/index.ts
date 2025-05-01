import { createSlice, PayloadAction } from "@reduxjs/toolkit";
// COMMENT: Add TMenu in below import statement
import { TFooterData, THeaderData, THomePageData, TMenu, TAboutusPageData, TPageData } from "../types";

interface AppState {
  headerData: THeaderData;
  footerData: TFooterData;
  homePageData: THomePageData;
  // COMMENT: Uncomment below line
  menuPageData: TMenu[];
  aboutusPageData: TAboutusPageData;
  pageData: TPageData;
}

const initialState: AppState = {
  headerData: {
    website_title: "",
    logo: {
      url: "",
    },
    navigation_links: {
      link: [
        {
          href: "",
          title: "",
        },
      ],
    },
  },
  footerData: {
    title: "",
    navigation_links: {
      title: "",
      link: [
        {
          href: "",
          title: "",
        },
      ],
    },
    information_section: {
      logo: {
        url: "",
      },
      descrption: "",
      timings: "",
      holiday: "",
    },
    copyright: "",
  },
  homePageData: {
    sections: [
      {
        home: {
          hero_section: {
            banner: {
              url: "",
            },
            heading: "",
            description: "",
            primary_cta: "",
          },
        },
      },
    ],
  },
  // COMMENT: Uncomment below lines
  menuPageData: [
    {
      course_name: "",
      dishes: [
        {
          uid: "",
          image: {
            url: "",
          },
          title: "",
          description: "",
          price: 0,
        },
      ],
    },
  ],
  // COMMENT: About us page
  aboutusPageData: {
    sections: [
      {
        about: {
          about: ""
        },
      },
    ],
  }, 
  // COMMENT: Page
  pageData: {
    sections: [
      {
        contact: {
          contact: ""
        },
      },
    ],
  }, 
};

const mainSlice = createSlice({
  name: "main",
  initialState,
  reducers: {
    setHeaderData: (state, action: PayloadAction<THeaderData>) => {
      state.headerData = action.payload;
    },
    setFooterData: (state, action: PayloadAction<TFooterData>) => {
      state.footerData = action.payload;
    },
    setHomePageData: (state, action: PayloadAction<THomePageData>) => {
      state.homePageData = action.payload;
    },
    // COMMENT: Uncomment below lines
    setMenuPageData: (state, action: PayloadAction<TMenu[]>) => {
      state.menuPageData = action.payload;
    },
    // COMMENT: About us page 
    setAboutusPageData: (state, action: PayloadAction<TAboutusPageData>) => {
      state.aboutusPageData = action.payload;
    },
    // COMMENT: Page
    setPageData: (state, action: PayloadAction<TPageData>) => {
      state.pageData = action.payload;
    }, 
  },
});

export const {
  setHeaderData,
  setFooterData,
  setHomePageData,
  // COMMENT: Uncomment below line
  setMenuPageData,
  // COMMENT: About us page
  setAboutusPageData,
  // COMMENT: Page
  setPageData,
} = mainSlice.actions;

export default mainSlice.reducer;

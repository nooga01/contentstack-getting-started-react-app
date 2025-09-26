(function () {
    var projectsData;
    var mapRef;
    var currentMapMarkersBounds;
    var currentMapMarkers = [];
    var geoLocateControl;
    let clusterIndex;
    let firstLoad = true;

    const australiaBounds = [
        [112.0, -44.0],
        [154.0, -10.0],
    ];

    const nswBounds = [
        [140.55, -38.05], // southwest corner (approx. west of Albury, south of Eden)
        [154.0, -27.75], // northeast corner (approx. past Tweed Heads, east of Port Macquarie)
    ];

    const zoomBtnAmount = 0.75; // how much to zoom in/out with each click
    const mapAccessToken = $(".InteractiveMap").data("mapbox-access-token");
    const apiUrl = $(".InteractiveMap").data("projects-data-api-url");
    const pageSize = parseInt($(".InteractiveMap").data("data-page-size")) || 6;

    const $SearchByLocationElem = $(".InteractiveMap .InteractiveMap-MapEmbed-Controls-SearchByLocation");
    let searchByLocationRequest;
    let searchByLocationDebounceTimeout;

    const $pagingationTemplate = $(`<div class="Pagination" role="navigation" aria-labelledby="Pagination-heading" data-mode="javascript">
        <div class="grid-container no-padding-if-inside-grid-container">
            <div class="Pagination-Inner">
                <h4 id="Pagination-heading" class="show-for-sr">Pagination</h4>
                <div class="Pagination-result"></div>
                <div class="Pagination-buttons"></div>
            </div>
        </div>
    </div>`);

    if (!mapAccessToken) return;
    if (typeof mapboxgl !== "object") return;

    $(".InteractiveMap .InteractiveMap-MapEmbed-Controls button.btn-fullscreen").click(function () {
        if (!document.fullscreenElement) {
            $(".InteractiveMap [data-fullscreen-element]").get(0).requestFullscreen();
        } else {
            if (document.exitFullscreen) {
                document.exitFullscreen();
            }
        }
    });

    $(".InteractiveMap .InteractiveMap-MapEmbed-Controls button.btn-home").click(function () {
        $(".InteractiveMap .InteractiveMap-MapEmbed-CurrentItemCard > div").addClass("hide");
        $(".InteractiveMap .InteractiveMap-MapEmbed-CurrentItemCard .InteractiveMap-WelcomeCard").removeClass("hide");
        fitMapToCurrentMarkers();
    });

    $(".InteractiveMap .InteractiveMap-MapEmbed-Controls button.btn-zoom-in").click(function () {
        if (!mapRef) return;
        const currentZoom = mapRef.getZoom();
        mapRef.zoomTo(currentZoom + zoomBtnAmount);
    });

    $(".InteractiveMap .InteractiveMap-MapEmbed-Controls button.btn-zoom-out").click(function () {
        if (!mapRef) return;
        const currentZoom = mapRef.getZoom();
        mapRef.zoomTo(currentZoom - zoomBtnAmount);
    });

    $(".InteractiveMap .InteractiveMap-MapEmbed-Controls-LegendDisclaimer button.btn-disclaimer").click(function () {
        $(".InteractiveMap .InteractiveMap-MapEmbed-Legend").removeClass("visible");
        $(".InteractiveMap .InteractiveMap-MapEmbed-Disclaimer").toggleClass("visible");
    });

    $(".InteractiveMap .InteractiveMap-MapEmbed-Controls-LegendDisclaimer button.btn-legend").click(function () {
        $(".InteractiveMap .InteractiveMap-MapEmbed-Disclaimer").removeClass("visible");
        $(".InteractiveMap .InteractiveMap-MapEmbed-Legend").toggleClass("visible");
    });

    $(".InteractiveMap .InteractiveMap-MapEmbed-Legend .btn-close, .InteractiveMap .InteractiveMap-MapEmbed-Disclaimer .btn-close").click(function () {
        $(this).parent().removeClass("visible");
    });

    $(".InteractiveMap .InteractiveMap-MapEmbed-CurrentItemCard .btn-close").click(function () {
        if ($(this).data("mode") === "destroy") {
            $(this).parent().remove();
        } else {
            $(this).parent().addClass("hide");
        }
    });

    $(".InteractiveMap-ProjectCards-SortBy")
        .val(getQuerystringParameterValue("sort") || "default")
        .change(function () {
            const sortValue = $(this).val();
            const newUrl = new URL(window.location.href);
            newUrl.searchParams.set("sort", sortValue);
            if (sortValue === "default") newUrl.searchParams.delete("sort");
            window.history.replaceState({}, "", newUrl.toString());
            applyFilters();
        });

    $(".InteractiveMap .InteractiveMap-Filters .btn-clear-filters").click(function () {
        const newUrl = new URL(window.location.href);
        newUrl.searchParams.delete("schemes");
        newUrl.searchParams.delete("energyGenerationTypes");
        newUrl.searchParams.delete("projectStages");
        window.history.replaceState({}, "", newUrl.toString());
        applyFilters();
    });

    const loadAllData = () => {
        //  apiUrl = "/pages/ajax/interactive-map-data.json";
        $.ajax({
            type: "get",
            url: apiUrl,
            dataType: "json",
        }).done(function (data) {
            data.projects = data.projects.map((projectData) => {
                const { schemeId, energyGenerationTypeId, projectStageId, rezId, ...rest } = projectData;
                return {
                    ...rest,
                    scheme: data.schemes.find((scheme) => scheme.id === schemeId) || null,
                    energyGenerationType: data.energyGenerationTypes.find((type) => type.id === energyGenerationTypeId) || null,
                    projectStage: data.projectStages.find((stage) => stage.id === projectStageId) || null,
                    rez: data.rezItems.find((rezItem) => rezItem.id === rezId) || null,
                };
            });
            projectsData = data;

            initFilters(data);
        });
    };

    const initFilters = () => {
        const addFilterOption = (type, item) => {
            let selected = false;
            let filterTypeSelectedValues = getQuerystringParameterValue(type).split(",").filter(Boolean);
            if (filterTypeSelectedValues.includes(item.value)) selected = true;

            $(`.InteractiveMap .InteractiveMap-Filters .ddl-${type} .FilterDropdown-ItemsContainer ul`).append(`
                <li>
                    <button type="button" data-type="${type}" data-value="${item.value}" data-selected="${selected ? "true" : "false"}">
                        <span class="icon-tick"></span>
                        ${item.label}
                    </button>
                </li>
            `);
        };

        // # region: Set up dropdowns etc
        // add each of the energy generation types to the legend.
        projectsData.schemes.forEach((item) => {
            if (!projectsData.projects.some((project) => project.scheme?.id === item.id)) return; // if there are no matching projects, don't add this anywhere
            addFilterOption("schemes", item);
        });
        projectsData.energyGenerationTypes.forEach((item) => {
            if (!projectsData.projects.some((project) => project.energyGenerationType?.id === item.id)) return; // if there are no matching projects, don't add this anywhere
            $(".InteractiveMap .InteractiveMap-MapEmbed-Legend ul").append(`<li><div class="EnergyGenerationTypeIcon" data-type="${item.value}"></div><span>${item.label}</span></li>`);
            addFilterOption("energyGenerationTypes", item);
        });
        projectsData.projectStages.forEach((item) => {
            if (!projectsData.projects.some((project) => project.projectStage?.id === item.id)) return; // if there are no matching projects, don't add this anywhere
            addFilterOption("projectStages", item);
        });

        if (projectsData.rezItems.length === 0) {
            $(".InteractiveMap .InteractiveMap-MapEmbed-Legend .rez-zones").remove();
        }

        $(".InteractiveMap .InteractiveMap-Filters .FilterDropdown .FilterDropdown-Trigger")
            .removeAttr("disabled")
            .click(function () {
                $(this).parent().toggleClass("open");
            });

        // Handle focusout for dropdowns to close them
        $(".InteractiveMap .InteractiveMap-Filters .FilterDropdown").on("focusout", function () {
            setTimeout(() => {
                const closestDropdown = $(document.activeElement).closest(".FilterDropdown");
                if (closestDropdown?.[0] === $(this)[0]) return;
                $(this).removeClass("open");
            }, 0);
        });

        $(".InteractiveMap .InteractiveMap-Filters .FilterDropdown .FilterDropdown-ItemsContainer ul li button").click(function () {
            const value = $(this).attr("data-value");
            const type = $(this).attr("data-type");

            // update the querystring with the selected value (or remove it if it's already selected)
            let currentlySelected = false;
            let filterTypeSelectedValues = getQuerystringParameterValue(type).split(",").filter(Boolean);
            if (filterTypeSelectedValues.includes(value)) currentlySelected = true;

            if (!currentlySelected) {
                filterTypeSelectedValues.push(value);
            } else {
                filterTypeSelectedValues = filterTypeSelectedValues.filter((v) => v !== value);
            }

            const newUrl = new URL(window.location.href);
            newUrl.searchParams.delete("page"); // if they chamge filters, then reset to page 1
            newUrl.searchParams.set(type, filterTypeSelectedValues.join(","));
            if (filterTypeSelectedValues.length === 0) newUrl.searchParams.delete(type);

            window.history.replaceState({}, "", newUrl.toString());
            applyFilters();
        });

        applyFilters();

        // # endregion: Set up dropdowns etc
    };

    const applyFilters = () => {
        // update all the filter dropdowns to reflect the current querystring values
        $(".InteractiveMap .InteractiveMap-Filters .FilterDropdown .FilterDropdown-ItemsContainer ul li button").each(function () {
            const value = $(this).attr("data-value");
            const type = $(this).attr("data-type");

            let filterTypeSelectedValues = getQuerystringParameterValue(type).split(",").filter(Boolean);
            if (filterTypeSelectedValues.includes(value)) {
                $(this).attr("data-selected", "true");
            } else {
                $(this).attr("data-selected", "false");
            }
        });

        // update the Filter dropdowns to show the count of filters enabled
        let hasActiveFilters = false;
        $(".InteractiveMap .InteractiveMap-Filters .FilterDropdown").each(function () {
            const selectedItems = $(this).find(".FilterDropdown-ItemsContainer ul li button[data-selected='true']");
            $(".FilterDropdown-Trigger .count", $(this)).text(selectedItems.length).addClass("hide");
            if (selectedItems.length > 0) {
                $(".FilterDropdown-Trigger .count", $(this)).removeClass("hide");
                hasActiveFilters = true;
            }
        });

        // hide/show the "Clear Filters" button based on whether there are any active filters
        $(".InteractiveMap .InteractiveMap-Filters .btn-clear-filters").addClass("hide");
        if (hasActiveFilters) $(".InteractiveMap .InteractiveMap-Filters .btn-clear-filters").removeClass("hide");

        // filter the results, and update the map markers and project cards
        if (projectsData?.projects) {
            const filteredProjects = projectsData.projects.filter((project) => {
                // filter by scheme
                const schemeFilter = getQuerystringParameterValue("schemes").split(",").filter(Boolean);
                if (schemeFilter.length > 0 && !schemeFilter.includes(project.scheme?.value)) {
                    return false;
                }

                // filter by energy generation type
                const energyGenerationTypeFilter = getQuerystringParameterValue("energyGenerationTypes").split(",").filter(Boolean);
                if (energyGenerationTypeFilter.length > 0 && !energyGenerationTypeFilter.includes(project.energyGenerationType?.value)) {
                    return false;
                }
                // filter by project stage
                const projectStageFilter = getQuerystringParameterValue("projectStages").split(",").filter(Boolean);
                if (projectStageFilter.length > 0 && !projectStageFilter.includes(project.projectStage?.value)) {
                    return false;
                }
                return true; // if all filters pass, include this project
            });

            const sortValue = getQuerystringParameterValue("sort");
            if (sortValue) {
                filteredProjects.sort((a, b) => {
                    if (sortValue === "title-asc") {
                        return a.title.localeCompare(b.title);
                    } else if (sortValue === "title-desc") {
                        return b.title.localeCompare(a.title);
                    } else if (sortValue === "energyGenerationType") {
                        return (a.energyGenerationType?.label || 0) - (b.energyGenerationType?.label || 0);
                    }
                });
            }

            if (filteredProjects.length > 0) {
                $(".InteractiveMap .InteractiveMap-MapEmbed-CurrentItemCard > div").addClass("hide");
                if (firstLoad) {
                    // show the welcome card
                    $(".InteractiveMap .InteractiveMap-MapEmbed-CurrentItemCard .InteractiveMap-WelcomeCard").removeClass("hide");
                    firstLoad = false;
                }
            } else {
                // we have no matching projects.
                $(".InteractiveMap .InteractiveMap-MapEmbed-CurrentItemCard > div").addClass("hide");
                $(".InteractiveMap .InteractiveMap-MapEmbed-CurrentItemCard .InteractiveMap-ErrorCard").removeClass("hide");
            }
            addCardsToGrid(filteredProjects);
            addMarkersToMap(filteredProjects);
        }
    };

    //#region: Map Functions
    const initMap = () => {
        const mapStyle = $(".InteractiveMap").data("mapbox-style");

        const defaultBounds = new mapboxgl.LngLatBounds(nswBounds); //australiaBounds

        mapboxgl.accessToken = mapAccessToken;
        mapRef = new mapboxgl.Map({
            container: $(".InteractiveMap .InteractiveMap-MapEmbed-Map")[0],
            style: mapStyle,
            bounds: defaultBounds,
            attributionControl: false, // disables the default bottom-right control
            minZoom: getMapMinZoom(),
            maxZoom: getMapMaxZoom(),
            projection: "mercator", // use mercator projection
            cooperativeGestures: true,
        });

        mapRef.on("zoom", () => {
            const currentZoom = mapRef.getZoom();
            $(".InteractiveMap .InteractiveMap-MapEmbed-Controls button.btn-zoom-out").attr("disabled", currentZoom <= mapRef.getMinZoom() + 0.01);
            $(".InteractiveMap .InteractiveMap-MapEmbed-Controls button.btn-zoom-in").attr("disabled", currentZoom >= mapRef.getMaxZoom() - 0.01);
        });
        window.addEventListener("resize", () => {
            mapRef.setMinZoom(getMapMinZoom());
            mapRef.setMaxZoom(getMapMaxZoom());
        });

        mapRef.addControl(
            new mapboxgl.AttributionControl({
                compact: true, // makes the attribution control more compact
            })
        );

        const mapAttribNode = $(".InteractiveMap .mapboxgl-ctrl-attrib");
        const mapLogoNode = $(".InteractiveMap .mapboxgl-ctrl-logo");
        $(".InteractiveMap-MapEmbed-Controls-LegendDisclaimer").prepend(mapLogoNode);
        $(".InteractiveMap-MapEmbed-Controls-LegendDisclaimer").prepend(mapAttribNode);

        geoLocateControl = new mapboxgl.GeolocateControl({
            fitBoundsOptions: {
                maxZoom: 9, // ensure we don't zoom in too much
            },
            positionOptions: {
                enableHighAccuracy: true,
            },
            trackUserLocation: false,
            showUserHeading: false,
        });
        geoLocateControl.on("geolocate", () => {
            setSearchByLocationStatus("user-location-found");
            $(".txt-search", $SearchByLocationElem).val("Using your location").attr("readonly", true);
        });
        geoLocateControl.on("error", () => {
            alert("There was an errer getting your location. " + error?.message);
            setSearchByLocationStatus("user-location-error");
            $(".txt-search", $SearchByLocationElem).val("").removeAttr("readonly");
        });

        mapRef.addControl(geoLocateControl, "top-left"); // is hidden  with CSS. We just add it so we can use it with our own button to trigger it.

        $(".InteractiveMap .InteractiveMap-MapEmbed-Controls-SearchByLocation").removeClass("hide");
        $(".InteractiveMap .InteractiveMap-MapEmbed-Controls-MapControls button").removeClass("hide");
        $(".InteractiveMap .InteractiveMap-MapEmbed-Controls-LegendDisclaimer button").removeClass("hide");
        $(".InteractiveMap .InteractiveMap-MapEmbed-CurrentItemCard").removeClass("hide");

        applyFilters();
    };
    const createClusterIndex = (projects) => {
        const geoJsonPoints = projects.map((proj, i) => ({
            type: "Feature",
            properties: {
                index: i,
                title: proj.title,
                energyType: proj.energyGenerationType.value,
            },
            geometry: {
                type: "Point",
                coordinates: [proj.position.lng, proj.position.lat],
            },
        }));

        clusterIndex = new Supercluster({
            radius: 30,
            maxZoom: 16,
        });

        clusterIndex.load(geoJsonPoints);
    };

    const addMarkersToMap = (projects) => {
        if (!mapboxgl || !mapRef) return;
        if (!Array.isArray(projects)) return;

        $(".InteractiveMap .InteractiveMap-MapEmbed-Container > .LoaderAni, .InteractiveMap .InteractiveMap-ProjectCards-TitleSortBy .LoaderAni").removeClass("isLoading");

        // Remove existing markers
        currentMapMarkers.forEach((marker) => marker.remove());
        currentMapMarkers = [];

        currentMapMarkersBounds = new mapboxgl.LngLatBounds();

        // Recreate cluster index
        createClusterIndex(projects);

        const renderClusters = () => {
            // Clear existing markers again (on zoom/pan)
            currentMapMarkers.forEach((marker) => marker.remove());
            currentMapMarkers = [];

            const zoom = mapRef.getZoom();
            const clusters = clusterIndex.getClusters([-180, -85, 180, 85], Math.floor(zoom));

            clusters.forEach((cluster) => {
                const [lng, lat] = cluster.geometry.coordinates;

                if (cluster.properties.cluster) {
                    // It's a cluster
                    const count = cluster.properties.point_count;
                    const clusterElem = document.createElement("button");
                    const $clusterBtn = $(clusterElem);

                    let clusterSize = "smallest";
                    if (count > 7) {
                        clusterSize = "large";
                    } else if (count > 4) {
                        clusterSize = "medium";
                    } else if (count > 2) {
                        clusterSize = "small";
                    }

                    const expansionZoom = clusterIndex.getClusterExpansionZoom(cluster.properties.cluster_id);


                    $clusterBtn.addClass("MarkerCluster");
                    $clusterBtn.attr("data-cluster-size", clusterSize);
                    $clusterBtn.text(count);
                    $clusterBtn.click(function () {
                        // for some reason the map clusters don't register a "click"/"focus" event, so focus doesn't change from dropdown.. weird.
                        $(this).focus();

                        mapRef.flyTo({
                            center: [lng, lat],
                            zoom: expansionZoom,
                        });
                    });

                    const clusterMarker = new mapboxgl.Marker(clusterElem).setLngLat([lng, lat]).addTo(mapRef);

                    currentMapMarkers.push(clusterMarker);
                    currentMapMarkersBounds.extend([lng, lat]);
                } else {
                    // It's a single point (project)
                    const project = projects[cluster.properties.index];
                    if (!project) return;

                    const elem = document.createElement("button");
                    const markerElem = $(elem);
                    markerElem.addClass("MarkerProject EnergyGenerationTypeIcon");
                    markerElem.attr("data-type", project.energyGenerationType.value);
                    markerElem.attr("title", project.title);
                    markerElem.data("itemdata", project);

                    markerElem.click(function () {
                        // for some reason the map markers don't register a "click"/"focus" event, so focus doesn't change from dropdown.. weird.
                        $(this).focus();
                        handleMapMarkerOnClick($(this));
                    });

                    const mapMarker = new mapboxgl.Marker(elem).setLngLat([project.position.lng, project.position.lat]).addTo(mapRef);

                    currentMapMarkers.push(mapMarker);
                    currentMapMarkersBounds.extend([project.position.lng, project.position.lat]);
                }
            });
        };

        mapRef.off("zoomend", renderClusters); // update clusters when map zooms
        mapRef.on("zoomend", renderClusters); // update clusters when map zooms        

        renderClusters(); // initial render
        fitMapToCurrentMarkers();

        // if the map is still zooming to fit clusters, and then expanding them after zooming in (on zoomend), 
        // which results in map markers being off screen, we'll have to do something here.


    };

    const handleMapMarkerOnClick = ($markerElem) => {
        const markerData = $markerElem.data("itemdata");

        // set the current card item info to be based on the markerData.
        // show the current card item

        const interactiveMapMapEmbedCurrentItemCard = $(".InteractiveMap .InteractiveMap-MapEmbed-CurrentItemCard");

        $(".InteractiveMap-ProjectCard", interactiveMapMapEmbedCurrentItemCard).remove();
        $("> div", interactiveMapMapEmbedCurrentItemCard).addClass("hide"); // hide the other cards (welcome/error)

        const projectCard = getClonedProjectCardElemFromTemplate(markerData, true, true);

        interactiveMapMapEmbedCurrentItemCard.append(projectCard);

        flyMapToLocation(markerData.position.lat, markerData.position.lng);
    };
    const getMapBoundsPadding = () => {
        if (window.innerWidth < 640) {
            return { left: 40, top: 95, right: 40, bottom: 70 };
        }
        if (window.innerWidth < 1024) {
            return { left: 60, top: 95, right: 130, bottom: 120 };
        }

        let leftOffset = $(".InteractiveMap-MapEmbed-CurrentItemCard > div:not(.hide)")?.outerWidth() || 0;
        return { left: leftOffset + 80, top: 95, right: 130, bottom: 100 };
    };

    const getMapMinZoom = () => {
        // 0.5 - 22
        if (window.innerWidth > 640) return 3.42;
        return 2.65;
    };
    const getMapMaxZoom = () => {
        // 0.5 - 22
        return 14;
    };

    const flyMapToLocation = (lat, lng, bbox, isAddressLocation) => {
        if (bbox) {
            // it's a bounding box
            const bounds = new mapboxgl.LngLatBounds(bbox);
            mapRef.fitBounds(bounds, {
                padding: getMapBoundsPadding(),
                // maxZoom: 8, // ensure we don't zoom in too much
            });
        } else {
            // get the current Zoom. Zoom in if needed, but if already zoomed in, just fly to the location.
            const currentZoom = mapRef.getZoom();
            const zoom = isAddressLocation ? getMapMaxZoom() : Math.max(currentZoom, 9);
            mapRef.flyTo({
                center: [lng, lat],
                zoom,
                essential: true, // this animation is considered essential with respect to prefers-reduced-motion
                padding: getMapBoundsPadding(),
            });
        }
    };

    const fitMapToCurrentMarkers = (duration = 1000) => {
        if (!mapRef || !currentMapMarkersBounds) return;
        if (currentMapMarkersBounds.isEmpty()) {
            const auBounds = new mapboxgl.LngLatBounds(australiaBounds);
            mapRef.fitBounds(auBounds, {
                padding: getMapBoundsPadding(),
                duration,
            });
        } else {
            mapRef.fitBounds(currentMapMarkersBounds, {
                padding: getMapBoundsPadding(),
                maxZoom: 8, // ensure we don't zoom in too much
                duration,
            });
        }
    };
    //#endregion: Map Functions

    const addCardsToGrid = (projects) => {
        $(".InteractiveMap-ProjectCards-SortBy").attr("disabled", true);
        $(".InteractiveMap .InteractiveMap-ProjectCards-TitleSortBy").addClass("hide");
        $(".InteractiveMap .InteractiveMap-ProjectCards-Container .Pagination").remove();
        $(".InteractiveMap .InteractiveMap-ProjectCardsGrid").empty();

        if (!Array.isArray(projects)) return;
        if (projects.length === 0) return;

        $(".InteractiveMap .InteractiveMap-ProjectCards-TitleSortBy").removeClass("hide");
        $(".InteractiveMap-ProjectCards-SortBy").attr("disabled", false);

        $(".InteractiveMap .InteractiveMap-ProjectCards-TitleSortBy .LoaderAni").removeClass("isLoading");

        const pageNumber = parseInt(getQuerystringParameterValue("page")) || 1;
        const $paginationClone = $pagingationTemplate.clone();
        $(".InteractiveMap-ProjectCards-Container").append($paginationClone);

        let isInitialLoad = true;
        $(".Pagination-buttons", $paginationClone).pagination({
            dataSource: projects,
            pageSize,
            pageNumber,
            pageRange: 4,
            prevText: `<span class="icon icon-arrow"></span> Prev`,
            nextText: `Next <span class="icon icon-arrow"></span>`,
            prevClassName: "PagedList-skipToPrevious",
            nextClassName: "PagedList-skipToNext",
            ulClassName: "pagination",
            className: "pagination-container",
            callback: function (data, pagination) {
                // set the results text
                $(".Pagination-result", $paginationClone).text(
                    `Showing ${(pagination.pageNumber - 1) * pageSize + 1}-${Math.min(pagination.totalNumber, pagination.pageNumber * pageSize)} of ${pagination.totalNumber} results`
                );

                // update the URL with the current page number
                const newUrl = new URL(window.location.href);
                newUrl.searchParams.set("page", pagination.pageNumber);
                if (pagination.pageNumber === 1) newUrl.searchParams.delete("page");
                window.history.replaceState({}, "", newUrl.toString());

                // remove existing and add the cards to the grid
                $(".InteractiveMap .InteractiveMap-ProjectCardsGrid").empty();
                data.forEach((project) => {
                    const projectCard = getClonedProjectCardElemFromTemplate(project, true);
                    $(".InteractiveMap .InteractiveMap-ProjectCardsGrid").append(projectCard);
                });

                // if there is only one page of results, hide the pagination entirely (the hideOnlyOnePage option only hides the buttons)
                if (pagination.totalNumber <= pageSize) {
                    $(".InteractiveMap-ProjectCards-Container .Pagination").addClass("hide");
                }

                if (!isInitialLoad) {
                    const scrollTop = $(".InteractiveMap-ProjectCards-Container").offset().top - $(".header-wrapper").outerHeight();
                    window.scrollTo(0, scrollTop);
                }

                isInitialLoad = false;
            },
        });
    };

    const getClonedProjectCardElemFromTemplate = (project, addEffects, showCloseBtn) => {
        let projectCard = $(".InteractiveMap .InteractiveMap-ProjectCard[data-template='true']").clone();
        projectCard.removeAttr("data-template").addClass(addEffects ? "fade-in" : "");
        projectCard.attr("data-scheme", project.scheme?.value);
        projectCard.attr("data-id", project.id);

        $(".EnergyGenerationTypeIcon", projectCard).attr("data-type", project.energyGenerationType.value);
        $(".Card-ProjectType", projectCard).text(project.energyGenerationType.label);
        $(".Card-Title", projectCard).text(project.title);

        if (project.scheme?.label) {
            $(".Card-SchemeTag", projectCard).text(project.scheme.label);
        } else {
            $(".Card-SchemeTag", projectCard).remove();
        }

        if (project.info?.energy) {
            $(".Card-ProjectInfoTable .energy span", projectCard).text(project.info.energy);
        } else {
            $(".Card-ProjectInfoTable .energy", projectCard).remove();
        }
        if (project.info?.status) {
            $(".Card-ProjectInfoTable .status span", projectCard).text(project.info.status);
        } else {
            $(".Card-ProjectInfoTable .status", projectCard).remove();
        }
        if (project.info?.location) {
            $(".Card-ProjectInfoTable .location span", projectCard).text(project.info.location);
        } else {
            $(".Card-ProjectInfoTable .location", projectCard).remove();
        }
        if (project.info?.contractor) {
            $(".Card-ProjectInfoTable .contractor span", projectCard).text(project.info.contractor);
        } else {
            $(".Card-ProjectInfoTable .contractor", projectCard).remove();
        }

        if (project.rez) {
            $(".Card-ProjectInfoTable .rez span", projectCard).text(project.rez.label);
        } else {
            $(".Card-ProjectInfoTable .rez", projectCard).remove();
        }

        if (project.projectStage?.label) {
            $(".Card-ProjectInfoTable .stage span", projectCard).text(project.projectStage.label);
        } else {
            $(".Card-ProjectInfoTable .stage", projectCard).remove();
        }

        $(".Card-CTA a", projectCard).attr("href", project.link);

        if (showCloseBtn) {
            $(".btn-close", projectCard)
                .removeClass("hide")
                .click(function () {
                    $(this).parent().addClass("hide");
                });
        }

        return projectCard;
    };

    // #region: Search Functionality

    const cancelSearchByLocationRequest = () => {
        if (searchByLocationRequest) searchByLocationRequest.abort();
    };

    const cancelSearchByLocationDebounce = () => {
        if (searchByLocationDebounceTimeout) clearTimeout(searchByLocationDebounceTimeout);
    };

    const setSearchByLocationStatus = (status) => {
        $SearchByLocationElem.attr("data-status", status);
    };

    $(".btn-use-location", $SearchByLocationElem).click(function () {
        setSearchByLocationStatus("getting-user-location");
        $(".txt-search", $SearchByLocationElem).val("Getting your location...").attr("readonly", true);
        if (geoLocateControl) {
            geoLocateControl.trigger();
        }
    });

    $(".btn-clear", $SearchByLocationElem).click(function () {
        $(".txt-search", $SearchByLocationElem).val("").removeAttr("readonly");
        setSearchByLocationStatus("");
    });

    $(".txt-search", $SearchByLocationElem).on("keyup", function () {
        cancelSearchByLocationDebounce();
        cancelSearchByLocationRequest();
        if ($(this).attr("readonly") === "true") return;

        if ($SearchByLocationElem.attr("data-status") !== "loading" && $SearchByLocationElem.attr("data-status") !== "has-results") {
            setSearchByLocationStatus("");
        }

        const searchQuery = $(this).val().trim();
        searchByLocationDebounceTimeout = setTimeout(() => {
            loadSearchResults(searchQuery);
        }, 300);
    });

    const loadSearchResults = (query) => {
        if (query.length < 3) return;
        $(".LoaderAni", $SearchByLocationElem).addClass("isLoading");
        $(".InteractiveMap-MapEmbed-Controls-SearchByLocation-Suggestions ul", $SearchByLocationElem).empty();

        setSearchByLocationStatus("loading");

        cancelSearchByLocationRequest();

        const apiUrl = new URL("https://api.mapbox.com/search/geocode/v6/forward");
        apiUrl.searchParams.append("access_token", mapAccessToken);
        apiUrl.searchParams.append("country", "au");
        apiUrl.searchParams.append("limit", "3");
        apiUrl.searchParams.append("q", query);

        // Store the current AJAX request
        searchByLocationRequest = $.ajax({
            type: "get",
            url: apiUrl,
            dataType: "json",
        })
            .done(function (data) {
                // Process the search results
                const resultsContainer = $(".InteractiveMap-MapEmbed-Controls-SearchByLocation-Suggestions ul");
                resultsContainer.empty();

                data.features.forEach((feature) => {
                    let subLabel = feature.properties.place_formatted;
                    if (feature.properties.feature_type === "address") subLabel = feature.properties.full_address;

                    const resultItem = $(`<button type="button">${feature.properties.name_preferred}</button>`);
                    if (subLabel) resultItem.append(`<span>${subLabel}</span>`);
                    resultItem.click(() => handleSearchItemOnClick(feature));

                    const li = $("<li>");
                    li.append(resultItem);
                    resultsContainer.append(li);
                });

                if (data.features.length > 0) {
                    setSearchByLocationStatus("has-results");
                } else {
                    setSearchByLocationStatus("");
                }
            })
            .fail(function (jqXHR, textStatus) {
                if (textStatus !== "abort") {
                }
            })
            .always(() => {
                $(".LoaderAni", $SearchByLocationElem).removeClass("isLoading");
            });
    };

    const handleSearchItemOnClick = (item) => {
        $(".txt-search", $SearchByLocationElem).attr("readonly", true).val(item.properties.full_address);
        setSearchByLocationStatus("result-selected");
        if (item.properties.bbox) {
            flyMapToLocation(null, null, item.properties.bbox);
        } else {
            flyMapToLocation(item.properties.coordinates.latitude, item.properties.coordinates.longitude, null, true);
        }
    };

    // #endregion: Search Functionality

    initMap();
    loadAllData();
})();

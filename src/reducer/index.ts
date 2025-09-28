import { createSlice, PayloadAction } from "@reduxjs/toolkit";
// COMMENT: Add TMenu in below import statement
import { TFooterData, THeaderData, THomePageData, TMenu, TAboutusPageData, TPageData, TPageWithHeroBannerData } from "../types";
import { THeroBanner } from "../types/herobanner";

interface AppState {
  headerData: THeaderData;
  footerData: TFooterData;
  homePageData: THomePageData;
  // COMMENT: Uncomment below line
  menuPageData: TMenu[];
  aboutusPageData: TAboutusPageData;
  pageData: TPageData;
  pageWithHeroBannerData: TPageWithHeroBannerData;
  heroBannerData: THeroBanner[];
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
  // COMMENT: PageWithHeroBanner
  pageWithHeroBannerData: {
      title: "",
      description: "",
      hero_banner: [
        {
          uid: "",
          title: "",
          background_color: {
            hex: "",
          },
          text_color: {
            hex: "",
          },
          banner_description: "", 
          banner_image: {
            url: "",
          },
          banner_image_alignment: "",
          call_to_action: {
            title: "",
            href: "",
          },
          content_title_alignment: "",
          is_banner_image_full_width: true,
        },
      ],
      sections: [
        {
          card_collection: {
            title: "",
            card_items: [
              {
                title: "",
                description: "",
                image: {
                  url: "",
                },
                link: {
                  href: "",
                  title: "",
                }
              }
            ]
          }
        }
      ]
  },
  heroBannerData: [
    {
      uid: "",
      title: "",
      background_color: {
        hex: "",
      },
      text_color: {
        hex: "",
      },
      banner_description: "", 
      banner_image: {
        url: "",
      },
      banner_image_alignment: "",
      call_to_action: {
        title: "",
        href: "",
      },
      content_title_alignment: "",
      is_banner_image_full_width: true,
    }
  ],
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
    // COMMENT: PageWithHeroBanner
    setPageWithHeroBannerData: (state, action: PayloadAction<TPageWithHeroBannerData>) => {
      state.pageWithHeroBannerData = action.payload;
    },
    // COMMENT: PageWithHeroBanner
    setHeroBannerData: (state, action: PayloadAction<THeroBanner[]>) => {
      state.heroBannerData = action.payload;
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
  // COMMENT: PageWithHeroBanner
  setPageWithHeroBannerData,
  setHeroBannerData,
} = mainSlice.actions;

export default mainSlice.reducer;

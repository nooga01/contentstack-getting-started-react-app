export type THeaderData = {
  website_title: string;
  logo: {
    url: string;
  };
  navigation_links: {
    link: {
      href: string;
      title: string;
    }[];
  };
};

export type TFooterData = {
  title: string;

  navigation_links?: {
    title?: string;
    link?: TLink[];
  };

  information_section?: {
    logo?: {
      url?: string;
    };
    descrption?: string;
    timings?: string;
    holiday?: string;
  };

  copyright?: string;
};

export type THomePageData = {
  sections: {
    home: {
      hero_section?: {
        banner?: {
          url: string;
        };
        heading?: string;
        description?: string;
        primary_cta?: string;
      };
    };
  }[];
};

export type TLink = {
  href: string;
  title: string;
};

// COMMENT: Uncomment below lines

export type TDishes = {
  uid: string;
  image: {
    url: string;
  };
  title: string;
  description: string;
  price: number;
};

export type TMenu = {
  course_name: string;
  dishes: TDishes[];
};

export type TAboutusPageData = {
  sections: {
    home?: {
      hero_section?: {
        banner?: {
          url: string;
        };
        heading?: string;
        description?: string;
        primary_cta?: string;
      };
    },    
    about?: {
      about?: string;
    };
  }[];
};

export type TPageData = {
  sections: {
    contact?: {
      contact?: string;
    };
  }[];
};

export type TPageWithHeroBannerData = {
    title: string;
    description: string;
    hero_banner: THeroBanner[];
};

export type THeroBanner = {
  uid: string;
  title: string;
  background_color: {
    hex: string;
  };
  banner_description: string;  
  banner_image: {
    url: string;
  };
  banner_image_alignment: string;
  call_to_action: {
    title: string;
    href: string;
  };  
  content_title_alignment: string;
  is_banner_image_full_width: boolean;
};

export type THeroBannerProps = {
  uid: string;
};
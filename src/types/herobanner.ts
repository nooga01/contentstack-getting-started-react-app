export type THeroBanner = {
  uid: string;
  title: string;
  background_color: {
    hex: string;
  };
  text_color: {
    hex: string,
  }  
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
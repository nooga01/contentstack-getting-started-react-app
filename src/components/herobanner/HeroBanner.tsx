import React from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { RootState } from "../../store";
import { TLink } from "../../types";
import { THeroBannerProps } from "../../types";

const HeroBanner: React.FC<THeroBannerProps> = ({ hero_banner }) => {

  console.log(hero_banner);

  return (
    <div className="hero-banner">
        <p>{ hero_banner.title }</p>
        <p>{ hero_banner.banner_description }</p>
        <p>{ hero_banner.background_color.hex }</p>
        <p>{ hero_banner.banner_image.url }</p>
        <p>{ hero_banner.call_to_action.title }</p>
        <p>{ hero_banner.call_to_action.href }</p>
        <p>{ hero_banner.banner_image_alignment }</p>
        <p>{ hero_banner.content_title_alignment }</p>
        <p>{ hero_banner.is_banner_image_full_width }</p>
    </div>
   );   
  };

export default HeroBanner;  
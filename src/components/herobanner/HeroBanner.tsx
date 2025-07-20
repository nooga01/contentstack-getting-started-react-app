import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { RootState } from "../../store";
import { TLink } from "../../types";
import { THeroBannerProps } from "../../types";

const HeroBanner: React.FC<THeroBannerProps> = ({ uid }) => {
  const heroBannerData = useSelector((state: RootState) =>
      state.main.heroBannerData.find((item) => item.uid == uid)
  );

  console.log("heroBannerData", heroBannerData);
  console.log("uid", uid);

  return (
    <div className="hero-banner">
        <p>{ heroBannerData?.title }</p>
        <p>{ heroBannerData?.banner_description }</p>
        <p>{ heroBannerData?.background_color.hex }</p>
        <p>{ heroBannerData?.banner_image.url }</p>
        <p>{ heroBannerData?.call_to_action.title }</p>
        <p>{ heroBannerData?.call_to_action.href }</p>
        <p>{ heroBannerData?.content_title_alignment }</p>
        <p>{ heroBannerData?.is_banner_image_full_width }</p>
    </div>
   );   
  };

export default HeroBanner;  
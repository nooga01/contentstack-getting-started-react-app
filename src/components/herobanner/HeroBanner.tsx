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

  //console.log("heroBannerData", heroBannerData);
  //console.log("uid", uid);

  return (
      <a href="#0" className="banner" aria-label="Shop now">
        <div className="banner__grid">
          <div aria-hidden="true">
            <figure className="banner__figure" style={{ backgroundImage: heroBannerData?.banner_image.url ? `url(${heroBannerData?.banner_image.url})` : '' }}></figure>
          </div>

          <div className="banner__text">
            { heroBannerData?.title && (
               <h2 style={{ color: heroBannerData?.text_color?.hex ? heroBannerData?.text_color?.hex : "#000000" }}>{ heroBannerData?.title }</h2>
            )}

            { heroBannerData?.banner_description && (
              <p style={{ color: heroBannerData?.text_color?.hex ? heroBannerData?.text_color?.hex : "#e2e2e2" }}>{heroBannerData?.banner_description}</p>
            )}

            { heroBannerData?.call_to_action?.title && (
              <p className="banner__link-wrapper">
                <span className="banner__link"><i>{ heroBannerData?.call_to_action.title }</i></span>
              </p>
            )}
          </div>
        </div>
      </a>
   );   
  };

export default HeroBanner;  
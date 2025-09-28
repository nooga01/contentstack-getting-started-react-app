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
    <div className="HeroBanner banner-with-image">
        <div className="HeroBanner-wrapper">
            <div className="HeroBanner-content">

                <div className="Headings">
                    <div className="grid-container">
                        <div className="Headings-inner">
                            <div className="inner-wrapper">

                                { heroBannerData?.title && (
                                  <h1 className="title">{ heroBannerData?.title }</h1>
                                )}                              
								
                            </div>

                            { heroBannerData?.banner_description && (
                              <div className="inner-wrapper summary">
                                  <p>{ heroBannerData?.banner_description }</p>
                              </div>
                            )}

                            { heroBannerData?.call_to_action?.title && (
                              <a href={ heroBannerData?.call_to_action.href } className="button text-primary" title={ heroBannerData?.call_to_action.title }>
                                <span>{ heroBannerData?.call_to_action.title }</span>
                                <span className="icon icon-arrow"></span>
                              </a>
                            )}                                          

                        </div>
                    </div>
                </div>
            </div>

            { heroBannerData?.banner_image.url && (
              <div className="HeroBanner-image">
                  <img src={ heroBannerData?.banner_image.url } alt="" />
              </div>
            )} 
 
        </div>
    </div>
)};

export default HeroBanner;  
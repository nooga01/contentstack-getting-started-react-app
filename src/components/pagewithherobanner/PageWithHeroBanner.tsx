import React, { useMemo, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../store";
import { Button } from "@contentstack/venus-components";
import { useNavigate } from "react-router-dom";
import { TPageWithHeroBannerData } from "../../types";
import { getHeroBannerById } from "../../helper"
import HeroBanner from "../herobanner/HeroBanner";

const PageWithHeroBanner: React.FC = () => {
  const pageWithHeroBannerData = useSelector(
    (state: RootState) => state.main.pageWithHeroBannerData
  );

  console.log("pageWithHeroBannerData", pageWithHeroBannerData);

  const navigate = useNavigate();

  const herobanner = getHeroBannerById(pageWithHeroBannerData.hero_banner[0].uid);
  console.log(herobanner);

  const title = pageWithHeroBannerData.title ?? "Default Title";
  const description = pageWithHeroBannerData.description ?? "Default Description";

  return (
    <div className="home-page">
      <div className="hero-section">
        <div className="hero-content">

            <HeroBanner
            />

          { title }
          { description }
          { pageWithHeroBannerData.hero_banner[0].uid }

        </div>
      </div>
    </div>
  );
};

export default PageWithHeroBanner;
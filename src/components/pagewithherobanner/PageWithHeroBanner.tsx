import React, { useMemo, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../store";
import { Button } from "@contentstack/venus-components";
import { useNavigate } from "react-router-dom";
import HeroBanner from "../herobanner/HeroBanner";

const PageWithHeroBanner: React.FC = () => {
  const page = useSelector(
    (state: RootState) => state.main.pageWithHeroBannerData
  );
  
  console.log("page", page);
  console.log("uid", page.hero_banner[0].uid);

  const navigate = useNavigate();

  return (
    <div className="home-page">
      <div className="hero-section">
        <div className="hero-content">

          <HeroBanner
            uid={ page.hero_banner[0].uid }
          />

          <p>{ page.title }</p>
          <p>{ page.description }</p>

        </div>
      </div>
    </div>
  );
};

export default PageWithHeroBanner;
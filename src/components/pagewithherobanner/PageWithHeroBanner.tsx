import React, { useMemo, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../store";
import { Button } from "@contentstack/venus-components";
import { useNavigate } from "react-router-dom";
import { THeroBanner } from "../../types";
import { getHeroBannerById } from "../../helper"
import HeroBanner from "../herobanner/HeroBanner";

const PageWithHeroBanner: React.FC = () => {
  const page = useSelector(
    (state: RootState) => state.main.pageWithHeroBannerData
  );
  
  //console.log("pageWithHeroBannerData", pageWithHeroBannerData);

  const navigate = useNavigate();

  const [error, setError] = useState(false);
  const [hero_banner, setEntry] = useState({} as THeroBanner);

  async function fetchData() {
    try {
      const herobanner = await getHeroBannerById(page.hero_banner[0].uid);
      setEntry(herobanner);
    } 
    catch (error) {
      console.error(error);
      setError(true);
    }
  } 

  useEffect(() => {
    fetchData();
  }, [error]);

  // console.log(hero_banner);

  return (
    <div className="home-page">
      <div className="hero-section">
        <div className="hero-content">

            <HeroBanner
              hero_banner={ hero_banner }
            />

          <p>{ page.title }</p>
          <p>{ page.description }</p>

        </div>
      </div>
    </div>
  );
};

export default PageWithHeroBanner;
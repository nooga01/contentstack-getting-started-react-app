import React, { useMemo } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../store";
import { Button } from "@contentstack/venus-components";
import { useNavigate } from "react-router-dom";
import { TPageWithHeroBannerData } from "../../types";
import HeroBanner from "../herobanner/HeroBanner";


const PageWithHeroBanner: React.FC = () => {
  const pageWithHeroBannerData = useSelector(
    (state: RootState) => state.main.pageWithHeroBannerData
  );

  const navigate = useNavigate();

  const memoizedPageData = useMemo(() => pageWithHeroBannerData, [pageWithHeroBannerData]);
  //console.log("pageWithHeroBannerData", pageWithHeroBannerData);
  //console.log("pageWithHeroBannerData.hero_banner", pageWithHeroBannerData.hero_banner[0].banner_title);
  console.log("memoizedPageData", memoizedPageData);

  //const title = memoizedPageData.title ?? "Default Title";
  //const description = memoizedPageData.description ?? "Default Description";

  //const heroBannerData = memoizedPageData.hero_banner;

    //const heroBannerData = memoizedPageData.hero_banner?.map(
    //  (banner: THeroBanner) => banner.banner_title
    //);

    //console.log("hero_banners", memoizedPageData.hero_banner);
    //console.log("uid", memoizedPageData.hero_banner.uid);

    //const banners = memoizedPageData?.map((page: TPageWithHeroBannerData) => page.hero_banner);
    //console.log("banners", banners);

  return (
    <div className="home-page">
      <div className="hero-section">
        <div className="hero-content">
        </div>
      </div>
    </div>
  );
};

export default PageWithHeroBanner;
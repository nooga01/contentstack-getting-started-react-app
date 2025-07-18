import React, { useMemo } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../store";
import { Button } from "@contentstack/venus-components";
import { useNavigate } from "react-router-dom";

const AboutUs: React.FC = () => {
  const aboutusPageData = useSelector(
    (state: RootState) => state.main.aboutusPageData
  );
  const navigate = useNavigate();

  const memoizedAboutusPageData = useMemo(() => aboutusPageData, [aboutusPageData]);

  console.log("memoizedAboutusPageData", memoizedAboutusPageData);

  const { home } = memoizedAboutusPageData.sections[0];
  const { about } = memoizedAboutusPageData.sections[1];

  return (
    <div className="home-page">
      <div className="hero-section">
        <div className="hero-content">
        {home?.hero_section?.banner?.url && (
          <div className="hero-banner">
            <img src={home?.hero_section.banner.url} alt="Hero Banner" />
          </div>
        )}
        {home?.hero_section?.heading && (
          <h1>{home?.hero_section?.heading}</h1>
        )}
        <p>{about?.about}</p>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;

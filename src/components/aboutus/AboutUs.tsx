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

  const { about } = memoizedAboutusPageData.sections[0];

  return (
    <div className="home-page">
      <div className="hero-section">
        <div className="hero-content">
        <p>{about?.about}</p>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;

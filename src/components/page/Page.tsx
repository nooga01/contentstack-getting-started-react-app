import React, { useMemo } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../store";
import { Button } from "@contentstack/venus-components";
import { useNavigate } from "react-router-dom";

const Page: React.FC = () => {
  const pageData = useSelector(
    (state: RootState) => state.main.pageData
  );
  const navigate = useNavigate();

  const memoizedPageData = useMemo(() => pageData, [pageData]);

  const { contact } = memoizedPageData.sections[0];

  return (
    <div className="home-page">
      <div className="hero-section">
        <div className="hero-content">
        <p>{contact?.contact}</p>
        </div>
      </div>
    </div>
  );
};

export default Page;
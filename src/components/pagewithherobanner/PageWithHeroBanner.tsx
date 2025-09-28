import React, { useMemo, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../store";
import { Button } from "@contentstack/venus-components";
import { useNavigate } from "react-router-dom";
import HeroBanner from "../herobanner/HeroBanner";
import CardCollection from "../cardcollection/CardCollection";

const PageWithHeroBanner: React.FC = () => {
  const page = useSelector(
    (state: RootState) => state.main.pageWithHeroBannerData
  );
  
  //console.log("page", page);
  //console.log("uid", page.hero_banner[0]?.uid);

  const navigate = useNavigate();

  //console.log("page", page.sections[0].card_collection);
  const { card_collection } = page.sections[0];
  
  return (
    <div>
      { page.hero_banner[0]?.uid && (
        <HeroBanner
          uid={ page.hero_banner[0]?.uid }
        />
      )}

      <div className="grid-padding-x">

        { page.title && (
          <div className="cell">
            <h1>{ page.title }</h1>
          </div>
        )}

        { page.description && (
          <div className="cell">
            <p>{ page.description }</p>
          </div>
        )}

        <CardCollection
          card_collection={ card_collection }
        />

      </div>
    </div>
  );
};

export default PageWithHeroBanner;
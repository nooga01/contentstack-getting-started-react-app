import React from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { RootState } from "../../store";
import { TLink } from "../../types";
import { THeroBannerProps } from "../../types";

const HeroBanner: React.FC<THeroBannerProps> = ({ hero_banner }) => {
  return (
    <div className="hero-banner">
        HEADER BANNER
        { hero_banner.title }
    </div>
   );   
  };

export default HeroBanner;  
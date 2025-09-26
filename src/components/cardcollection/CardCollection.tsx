import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { RootState } from "../../store";
import { TLink } from "../../types";
import { TCardCollectionProps } from "../../types";

const CardCollection: React.FC<TCardCollectionProps> = ({ card_items }) => {
  return (
    <div className="grid-container">
        <div className="grid-x grid-margin-x small-up-2 medium-up-3">
            {card_items.map((item) => (
                <div className="cell">
                    <div className="card">
                        <div className="card-section">
                            <h4>{ item.title }</h4>
                            <p>{ item.description }</p>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    </div>
   );   
  };

export default CardCollection;  
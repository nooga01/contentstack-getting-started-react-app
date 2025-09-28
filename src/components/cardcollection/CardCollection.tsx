import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { RootState } from "../../store";
import { TLink } from "../../types";
import { TCardCollectionProps } from "../../types";

const CardCollection: React.FC<TCardCollectionProps> = ({ card_items }) => {

console.log(card_items);
    
  return (
    <div className="CardCollection">
        <div className="grid-container">
            <h2 className="section-title">How to - Guides and Data</h2>
            <div className="grid-x grid-margin-x grid-margin-y">

                {card_items.map((item) => (

				    <a className="CardItem cell medium-6" href={ item.link.href }>

                        { item.image?.url && (
                            <div className="card-image" style={{ backgroundImage: `url(${item.image?.url})` }}></div>
                        )}

                        <div className="card-content">

                            { item.title && (
                                <div className="content-title">
                                    { item.title }
                                </div>
                            )}

                            { item.title && (
                                <div className="content-description">
                                    { item.description }
                                </div>
                            )}

                            { item.link.title && (
                                <button type="button" className="button text-primary " title={ item.link.title } >
                                    <span>{ item.link.title }</span>
                                </button>
                            )}
                        </div>
    				</a>
                ))}

            </div>
        </div>
    </div>
   );   
  };

export default CardCollection;  
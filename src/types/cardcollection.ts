export type TCardCollection = {
    title: string;
    card_items: TCardItem[];
};

export type TCardItem = {
   title: string;
   description: string;
   image: {
     url: string;
   };
   link: {
     href: string;
     title: string;
   }
};

export type TCardCollectionProps = {
  card_collection: TCardCollection;
};
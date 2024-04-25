interface Review{
    by:string,
    rating:number,
    comment:string
}
export interface Product {
  _id:string;
  id: string;
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
  rating: {
    rate: number;
    count: number;
  };
  quantity:number,
  reviews:Review[]
}


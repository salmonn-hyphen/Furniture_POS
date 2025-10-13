export interface Image {
  id: string;
  path: string;
}
export interface Posts {
  id: string;
  name: string;
  description: string;
  images: Image[];
  categoryId: string;
  price: number;
  discount: number;
  rating: number;
  inventory: number;
  status: string;
}

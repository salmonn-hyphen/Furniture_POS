export interface NavItem {
  title: string;
  href?: string;
  description?: string;
}

export interface NavItemWithChildren extends NavItem {
  card?: NavItemWithChildren[];
  menu?: NavItemWithChildren[];
}

export type MainNavItem = NavItemWithChildren;

export type Products = {
  id: string;
  name: string;
  description: string;
  images: string[];
  categoryId: string;
  price: number;
  discount: number;
  rating: number;
  inventory: number;
  status: string;
};

export interface Posts {
  id: string;
  author: string;
  title: string;
  content: string;
  image: string;
  body: string;
  updated_at: string;
  tags: string[];
}

export interface Category {
  id: string;
  label: string;
}

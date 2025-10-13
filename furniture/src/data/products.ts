import p1 from "../data/images/p1.png";
import p2 from "../data/images/p2.png";
import p3 from "../data/images/p3.jpg";
import p4 from "../data/images/p4.jpg";
import p5 from "../data/images/p5.png";
import p6 from "../data/images/p6.jpg";
import p7 from "../data/images/p7.jpg";
import p8 from "../data/images/p8.jpg";

export const products = [
  {
    id: "uuid1",
    name: "Nordic Chair",
    description:
      "Donec facilisis quam ut purus rutrum lobortis. Donec vitae odio quam ut purus rutrum lobortis",
    images: [p1, p4, p7],
    categoryId: "uuid1",
    price: 230,
    discount: 0,
    rating: 4,
    inventory: 180,
    status: "active",
  },
  {
    id: "uuid2",
    name: "Kruzo Aero Chair",
    description:
      "Donec facilisis quam ut purus rutrum lobortis. Donec vitae odio quam ut purus rutrum lobortis",
    images: [p2, p5, p8],
    categoryId: "uuid2",
    price: 180.85,
    discount: 200,
    rating: 3.5,
    inventory: 900,
    status: "active",
  },
  {
    id: "uuid3",
    name: "Ergonomic Chair",
    description:
      "Donec facilisis quam ut purus rutrum lobortis. Donec vitae odio quam ut purus rutrum lobortis",
    images: [p3, p1, p6],
    categoryId: "uuid1",
    price: 90,
    discount: 110,
    rating: 4,
    inventory: 90,
    status: "active",
  },
  {
    id: "uuid4",
    name: "Nordic Chair",
    description:
      "Donec facilisis quam ut purus rutrum lobortis. Donec vitae odio quam ut purus rutrum lobortis",
    images: [p4, p2, p7],
    categoryId: "uuid3",
    price: 1500,
    discount: 0,
    rating: 4,
    inventory: 100,
    status: "sold",
  },
  {
    id: "uuid5",
    name: "Kruzo Aero Chair",
    description:
      "Donec facilisis quam ut purus rutrum lobortis. Donec vitae odio quam ut purus rutrum lobortis",
    images: [p5, p3, p8],
    categoryId: "uuid1",
    price: 230,
    discount: 0,
    rating: 4,
    inventory: 180,
    status: "active",
  },
  {
    id: "uuid6",
    name: "Ergonomic Chair",
    description:
      "Donec facilisis quam ut purus rutrum lobortis. Donec vitae odio quam ut purus rutrum lobortis",
    images: [p6, p2, p4],
    categoryId: "uuid1",
    price: 140,
    discount: 150,
    rating: 3,
    inventory: 200,
    status: "sold",
  },
  {
    id: "uuid7",
    name: "Nordic Chair",
    description:
      "Donec facilisis quam ut purus rutrum lobortis. Donec vitae odio quam ut purus rutrum lobortis",
    images: [p7, p1, p3],
    categoryId: "uuid3",
    price: 210,
    discount: 0,
    rating: 4,
    inventory: 100,
    status: "active",
  },
  {
    id: "uuid8",
    name: "Ergonomic Chair",
    description:
      "Donec facilisis quam ut purus rutrum lobortis. Donec vitae odio quam ut purus rutrum lobortis",
    images: [p8, p4, p2],
    categoryId: "uuid2",
    price: 140,
    discount: 150,
    rating: 3,
    inventory: 200,
    status: "active",
  },
  {
    id: "uuid9",
    name: "Kruzo Aero Chair",
    description:
      "Donec facilisis quam ut purus rutrum lobortis. Donec vitae odio quam ut purus rutrum lobortis",
    images: [p5, p3, p8],
    categoryId: "uuid1",
    price: 250,
    discount: 260,
    rating: 4,
    inventory: 200,
    status: "active",
  },
];

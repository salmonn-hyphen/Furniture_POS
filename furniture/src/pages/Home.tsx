import { Link } from "react-router";
import { Button } from "../components/ui/button";
import Couch from "../data/images/Couch.png";
import CarouselComponent from "../components/Products/CarouselComponent";
import { products } from "../data/products";
import BlogCard from "../components/Blogs/BlogCard";
import { Posts } from "../data/posts";

function Home() {
  const simplePosts = Posts.slice(0, 3);

  const Title = ({
    title,
    href,
    sideText,
  }: {
    title: string;
    href: string;
    sideText: string;
  }) => (
    <div className="mt-28 mb-10 ml-4 flex flex-col md:ml-0 md:flex-row md:justify-between">
      <h2 className="mb-4 text-2xl font-bold md:mb-0">{title}</h2>
      <Link
        to={href}
        className="hover:text-foreground text-muted-foreground font-semibold underline"
      >
        <p className="">{sideText}</p>
      </Link>
    </div>
  );

  return (
    <div>
      <div className="container mx-auto">
        <div className="flex flex-col lg:flex-row lg:justify-between">
          <div className="my-8 text-center lg:mt-20 lg:mr-2 lg:mb-0 lg:w-2/5 lg:text-left">
            <h1 className="text-main mb-4 text-4xl font-extrabold lg:mb-8 lg:text-6xl">
              Modern Interior Design Studio
            </h1>
            <p className="mx-1 mb-4 lg:mb-8">
              Furniture is essential in human life. It provides comfort,
              supports daily activities, and adds beauty and organization to our
              living spaces.
            </p>
            <div className="">
              <Button
                asChild
                className="mr-4 rounded-full bg-orange-300 px-8 py-6 text-white hover:bg-orange-400"
              >
                <Link to="#">Shop Now</Link>
              </Button>
              <Button
                variant="outline"
                asChild
                className="text-main rounded-full px-10 py-6"
              >
                <Link to="#">Explore</Link>
              </Button>
            </div>
          </div>
          <img src={Couch} alt="" className="lg:w-3/5" />
        </div>

        <CarouselComponent products={products} />
        <Title title="Recent Blog" href="#" sideText="View All Posts" />
        <BlogCard posts={simplePosts} />
      </div>
    </div>
  );
}

export default Home;

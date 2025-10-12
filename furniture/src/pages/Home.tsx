import { Link } from "react-router";
import { Button } from "../components/ui/button";
import Couch from "../data/images/Couch.png";
function Home() {
  return (
    <div>
      <div className="container mx-auto">
        <div className="flex flex-col lg:flex-row lg:justify-between">
          <div className="my-8 text-center lg:mt-20 lg:mr-2 lg:mb-0 lg:w-2/5 lg:text-left">
            <h1 className="mb-4 text-4xl font-extrabold lg:mb-8 lg:text-6xl">
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
                className="rounded-full px-10 py-6"
              >
                <Link to="#">Explore</Link>
              </Button>
            </div>
          </div>
          <img src={Couch} alt="" className="lg:w-3/5" />
        </div>
      </div>
    </div>
  );
}

export default Home;

import { Icons } from "../../components/logo";
import { Link, useParams } from "react-router";
import { Posts } from "../../data/posts";
import { Button } from "../../components/ui/button";
import PurifyRenderer from "../../components/Blogs/PurifyRenderer";

function BlogDetail() {
  const { postId } = useParams();
  const post = Posts.find((post) => post.id === postId);

  return (
    <div className="container mx-auto px-4 lg:px-0">
      <section className="flex flex-col lg:flex-row">
        <section className="w-full lg:w-3/4 lg:pr-16">
          <Button className="mt-8 mb-6" variant="outline" asChild>
            <Link to="/blogs">
              <Icons.arrowLeft />
              All Posts
            </Link>
          </Button>
          {post ? (
            <>
              <h2 className="mb-3 text-3xl font-extrabold">{post.title}</h2>
              <div className="mb-4 text-sm">
                <span>
                  by <span className="font-[600]"> {post.author} </span>
                  on <span className="font-[600]"> {post.updated_at} </span>
                </span>
              </div>
              <h3 className="my-6 text-base font-[400]">{post.content}</h3>
              <img src={post.image} alt="" className="w-full rounded-xl" />
              <PurifyRenderer content={post.body} className="my-8" />
              <div className="mb-12 space-x-2">
                {post.tags.map((tag) => (
                  <Button variant="secondary">{tag}</Button>
                ))}
              </div>
            </>
          ) : (
            <p className="text-muted-foreground mt-8 mb-16 text-center text-xl font-bold lg:mt-24">
              Post not found
            </p>
          )}
        </section>
        <section className="w-full lg:mt-24 lg:w-1/4">
          <div className="font-base mb-8 flex items-center gap-2 font-semibold">
            <Icons.layer />
            <h3 className="">Other Blog Posts</h3>
          </div>
          <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1">
            {Posts.map((posts) => (
              <Link
                key={posts.id}
                to={`/blogs/${posts.id}`}
                className="mb-6 flex items-start gap-2"
              >
                <img
                  src={posts.image}
                  alt={posts.title}
                  className="w-1/4 rounded"
                />
                <div className="text-muted-foreground w-3/4 text-sm font-[500]">
                  <p className="line-clamp-2">{posts.content}</p>
                  <i className="">...see more</i>
                </div>
              </Link>
            ))}
          </section>
        </section>
      </section>
    </div>
  );
}
export default BlogDetail;

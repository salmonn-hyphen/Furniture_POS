import { Icons } from "../../components/logo";
import { Link, useLoaderData } from "react-router";
import { Button } from "../../components/ui/button";
import PurifyRenderer from "../../components/Blogs/PurifyRenderer";
import { useSuspenseQuery } from "@tanstack/react-query";
import { onePostQuery, postQuery } from "@/api/query";
import type { Post, Tag } from "@/types";

const imgUrl = import.meta.env.IMG_URL;
function BlogDetail() {
  const { postId } = useLoaderData();
  const { data: postData } = useSuspenseQuery(postQuery("?limit=6"));
  const { data: postDetail } = useSuspenseQuery(onePostQuery(postId));
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
          {postDetail ? (
            <>
              <h2 className="mb-3 text-3xl font-extrabold">
                {postDetail.post.title}
              </h2>
              <div className="mb-4 text-sm">
                <span>
                  by{" "}
                  <span className="font-[600]">
                    {" "}
                    {postDetail.post.author.fullName}{" "}
                  </span>
                  on{" "}
                  <span className="font-[600]">
                    {" "}
                    {postDetail.post.updatedAt}{" "}
                  </span>
                </span>
              </div>
              <h3 className="my-6 text-base font-[400]">
                {postDetail.post.content}
              </h3>
              <img
                src={imgUrl + postDetail.post.image}
                alt=""
                loading="lazy"
                decoding="async"
                className="w-full rounded-xl"
              />
              <PurifyRenderer content={postDetail.post.body} className="my-8" />
              <div className="mb-12 space-x-2">
                {postDetail.post.tags.map((tag: Tag) => (
                  <Button variant="secondary">{tag.name}</Button>
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
            {postData.map((post: Post) => (
              <Link
                key={post.id}
                to={`/blogs/${post.id}`}
                className="mb-6 flex items-start gap-2"
              >
                <img
                  src={imgUrl + post.image}
                  alt={post.title}
                  loading="lazy"
                  decoding="async"
                  className="w-1/4 rounded"
                />
                <div className="text-muted-foreground w-3/4 text-sm font-[500]">
                  <p className="line-clamp-2">{post.content}</p>
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

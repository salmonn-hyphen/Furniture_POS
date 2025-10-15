import { Link } from "react-router";
import type { Posts } from "../../types/index";

interface PostProps {
  posts: Posts[];
}

export default function BlogPostLists({ posts }: PostProps) {
  return (
    <div>
      <div className="my-8 grid grid-cols-1 gap-16 px-4 md:grid-cols-2 md:px-0 lg:grid-cols-3">
        {posts.map((post) => (
          <Link to={`/blogs/${post.id}`} key={post.id}>
            <img
              src={post.image}
              alt="Blog Image"
              className="mb-4 w-full rounded-xl"
            />
            <h2 className="line-clamp-1 text-xl font-extrabold">
              {post.title}
            </h2>
            <h3 className="my-2 line-clamp-3 text-base font-[400]">
              {post.content}
            </h3>
            <div className="text-sm">
              <span>
                by <span className="font-[600]"> {post.author} </span>
                on <span className="font-[600]"> {post.updated_at} </span>
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

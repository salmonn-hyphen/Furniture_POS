import BlogPostLists from "../../components/Blogs/BlogPostLists";
import { Posts } from "../../data/posts";
function Blog() {
  return (
    <div className="container mx-auto">
      <h1 className="mt-8 text-center text-2xl font-bold md:text-left">
        Latest Blog Posts
      </h1>
      <BlogPostLists posts={Posts} />
    </div>
  );
}

export default Blog;

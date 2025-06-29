import { useEffect, useState } from "react";
import usePostService from "@/services/usePostService";
import { PostTypes } from "@/types/post.types";
import { useNavigate } from "react-router-dom";

export default function HomePage() {
  const navigate = useNavigate();
  const { getAllPost } = usePostService();
  const [posts, setPosts] = useState<PostTypes[]>([]);

  useEffect(() => {
    const fetchPosts = async () => {
      const posts = await getAllPost();
      console.log(posts);
      setPosts(posts);
    };
    fetchPosts();
  }, [getAllPost]);

  const featuredPost = posts[0];
  const otherPosts = posts.slice(1, 5);

  return (
    <div className="mx-auto max-w-6xl px-4 py-4 sm:px-6 sm:py-6 lg:px-8 lg:py-8">
      <h1 className="mb-6 text-2xl font-bold text-gray-900 sm:mb-8 sm:text-3xl lg:text-4xl">Latest News</h1>

      {/* Featured Post */}
      {featuredPost && (
        <div className="mb-6 sm:mb-8">
          <div
            className="rounded-lg shadow-sm transition-shadow duration-300 hover:shadow-lg"
            onClick={() => navigate(`/posts/${featuredPost.slug}`)}
          >
            <div className="relative">
              <img src={featuredPost.thumbnail} alt={featuredPost.title} className="h-48 w-full rounded-lg object-cover sm:h-64 md:h-80 lg:h-96" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
            </div>
            <div className="flex h-full flex-col p-4 sm:p-6">
              <div className="flex-1">
                <h2 className="mb-3 text-xl leading-tight font-bold text-gray-900 sm:mb-4 sm:text-2xl lg:text-3xl">{featuredPost.title}</h2>
                <p className="mb-3 text-base leading-relaxed text-gray-600 sm:mb-4 sm:text-lg">{featuredPost.description}</p>
              </div>
              <div className="mt-auto text-xs text-gray-500 sm:text-sm">
                {new Date(featuredPost.createdAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Other Posts Grid */}
      {otherPosts.length > 0 && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
          {otherPosts.map((post) => (
            <div
              key={post.postId}
              className="flex flex-col overflow-hidden rounded-lg shadow-sm transition-shadow duration-300 hover:shadow-lg"
              onClick={() => navigate(`/posts/${post.slug}`)}
            >
              <div className="relative">
                <img src={post.thumbnail} alt={post.title} className="h-40 w-full object-cover sm:h-48" />
              </div>
              <div className="flex flex-1 flex-col p-3 sm:p-4">
                <div className="flex-1">
                  <h3 className="mb-2 line-clamp-2 text-lg font-semibold text-gray-900 sm:text-xl" title={post.title}>
                    {post.title}
                  </h3>
                  <p className="mb-3 line-clamp-3 text-sm leading-relaxed text-gray-600">{post.description}</p>
                </div>
                <div className="mt-auto text-xs text-gray-500">
                  {new Date(post.createdAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Show message if no posts */}
      {posts.length === 0 && (
        <div className="py-8 text-center sm:py-12">
          <p className="text-base text-gray-500 sm:text-lg">No posts available at the moment.</p>
        </div>
      )}
    </div>
  );
}

import { useEffect, useState } from "react";
import usePostService from "@/services/usePostService";
import { PostTypes } from "@/types/post.types";
import { useNavigate } from "react-router-dom";
import CustomLoader from "@/components/custom-ui/CustomLoader";

export default function HomePage() {
  const navigate = useNavigate();
  const { getAllPost } = usePostService();
  const [posts, setPosts] = useState<PostTypes[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      const posts = await getAllPost();
      console.log(posts);
      setPosts(posts);
      setIsLoading(false);
    };
    fetchPosts();
  }, [getAllPost]);

  const featuredPost = posts[0];
  const otherPosts = posts.slice(1, 5);

  return (
    <div className="mx-auto max-w-6xl px-4 py-4 sm:px-6 lg:px-8">
      <h1 className="text-foreground mb-6 text-2xl font-bold sm:mb-8 sm:text-3xl lg:text-4xl">Latest News</h1>

      {isLoading && (
        <div className="flex h-full items-center justify-center">
          <CustomLoader />
        </div>
      )}

      {/* Featured Post */}
      {featuredPost && (
        <div className="mb-6 sm:mb-8">
          <div
            className="cursor-pointer rounded-lg shadow-sm transition-all duration-300 hover:shadow-lg hover:scale-101"
            onClick={() => navigate(`/posts/${featuredPost.slug}`)}
          >
            <div className="relative">
              <img src={featuredPost.thumbnail} alt={featuredPost.title} className="h-48 w-full rounded-t-lg object-cover sm:h-64 md:h-80 lg:h-96" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
            </div>
            <div className="flex h-full flex-col p-4 sm:p-6 bg-white/20 !rounded-b-lg !rounded-t-none">
              <div className="flex-1">
                <h2 className="text-foreground mb-3 text-xl leading-tight font-bold sm:mb-4 sm:text-2xl lg:text-3xl">{featuredPost.title}</h2>
                <p className="text-muted-foreground mb-3 text-base leading-relaxed sm:mb-4 sm:text-lg">{featuredPost.description}</p>
              </div>
              <div className="text-muted-foreground mt-auto text-xs sm:text-sm">
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
              className="flex cursor-pointer flex-col overflow-hidden rounded-lg shadow-sm transition-all duration-300 hover:shadow-lg hover:scale-101"
              onClick={() => navigate(`/posts/${post.slug}`)}
            >
              <div className="relative">
                <img src={post.thumbnail} alt={post.title} className="h-40 w-full object-cover sm:h-48" />
              </div>
              <div className="flex flex-1 flex-col p-3 sm:p-4 bg-white/20 !rounded-b-lg !rounded-t-none">
                <div className="flex-1">
                  <h3 className="text-foreground mb-2 line-clamp-2 text-lg font-semibold sm:text-xl" title={post.title}>
                    {post.title}
                  </h3>
                  <p className="text-muted-foreground mb-3 line-clamp-3 text-sm leading-relaxed">{post.description}</p>
                </div>
                <div className="text-muted-foreground mt-auto text-xs">
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
          <p className="text-muted-foreground text-base sm:text-lg">No posts available at the moment.</p>
        </div>
      )}
    </div>
  );
}

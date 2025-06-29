import usePostService from "@/services/usePostService";
import { PostTypes } from "@/types/post.types";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export default function PostDetailPage() {
  const { slug } = useParams();
  const { getPostDetailBySlug } = usePostService();
  const [post, setPost] = useState<PostTypes | null>(null);

  useEffect(() => {
    const fetchPost = async () => {
      const post = await getPostDetailBySlug(slug || "");
      setPost(post);
    };
    fetchPost();
  }, [getPostDetailBySlug, slug]);

  return (
    <div className="mx-auto max-w-8xl px-4 sm:px-6">
      <h1 className="text-4xl font-bold mb-4">{post?.title}</h1>
      <div className="flex justify-center"><img src={post?.thumbnail} alt={post?.title} className="w-3xl h-auto mb-4 rounded-lg border-2 border-gray-200" /></div>
      <div className="prose" dangerouslySetInnerHTML={{ __html: post?.content || "" }} />
    </div>
  );
}

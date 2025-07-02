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
    <div className="max-w-8xl mx-auto px-4 sm:px-6">
      <h1 className="mb-4 text-4xl font-bold">{post?.title}</h1>
      <div className="flex justify-center">
        <img src={post?.thumbnail} alt={post?.title} className="mb-4 h-auto w-3xl rounded-lg border-2 border-gray-200" />
      </div>
      <div className="text-foreground [&_*]:!text-foreground [&_a]:!text-blue-600 [&_a]:!underline [&_a]:!underline-offset-2" dangerouslySetInnerHTML={{ __html: post?.content || "" }} />
    </div>
  );
}

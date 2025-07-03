import { useCallback } from "react";
import api from "@/services/api";
import { PostTypes } from "@/types/post.types";

function mapApiToPost(apiData: any): PostTypes {
  return {
    postId: apiData._id,
    title: apiData.title,
    description: apiData.description,
    content: apiData.content,
    thumbnail: apiData.thumbnail,
    deleted: apiData.deleted,
    status: apiData.status,
    createdAt: apiData.createdAt,
    updatedAt: apiData.updatedAt,
    slug: apiData.slug,
  };
}

export default function usePostService() {
  const getAllPost = useCallback(async () => {
    const response = await api.get("/posts");
    return response.data.data.posts.map(mapApiToPost);
  }, []);

  const getPostDetailBySlug = useCallback(async (slug: string) => {
    const response = await api.get(`/posts/${slug}`);
    return mapApiToPost(response.data.data);
  }, []);

  return { getAllPost, getPostDetailBySlug };
}

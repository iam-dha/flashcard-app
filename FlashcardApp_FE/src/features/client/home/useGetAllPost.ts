import { useCallback } from "react";
import api from "@/services/api";

export default function useGetAllPost() {
  const getAllPost = useCallback(async () => {
    const response = await api.get("/posts");
    console.log(response.data);
    return response.data;
  }, []);

  return { getAllPost };
}
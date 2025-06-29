import React, { useState, useEffect } from 'react';
import { useAdminAuth } from '@/layout/admin/AdminAuthProvider';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Card,
  CardContent,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

interface Post {
  _id: string;
  title: string;
  description: string;
  content: string;
  thumbnail?: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  deleted: boolean;
  slug: string;
}

interface ViewPostModalProps {
  isOpen: boolean;
  onClose: () => void;
  slug: string | null;
}

export default function ViewPostModal({ isOpen, onClose, slug }: ViewPostModalProps) {
  const { api } = useAdminAuth();
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen || !slug) {
      setPost(null);
      setError(null);
      return;
    }

    setLoading(true);
    api.get(`/api/v1/admin/posts/${slug}`)
      .then(res => {
        setPost(res.data.data);
      })
      .catch(err => {
        console.error('Fetch post error:', err);
        setError(err.message);
      })
      .finally(() => setLoading(false));
  }, [api, slug, isOpen]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent 
        className="max-w-7xl max-h-[90vh] overflow-y-auto"
        style={{ maxWidth: '90vw', width: '90vw' }}
      >
        <DialogHeader>
          <DialogTitle>Chi tiết bài viết</DialogTitle>
        </DialogHeader>
        
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin" />
            <span className="ml-2">Đang tải thông tin...</span>
          </div>
        ) : error ? (
          <div className="text-red-500 py-4 text-center">
            Lỗi: {error}
          </div>
        ) : post ? (
          <div className="space-y-4">
            <Card>
              <CardContent className="pt-6 space-y-3">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="font-medium">ID:</span>
                    <span className="ml-2 text-sm text-gray-600">{post._id}</span>
                  </div>
                  <div>
                    <span className="font-medium">Slug:</span>
                    <span className="ml-2 text-sm text-gray-600">{post.slug}</span>
                  </div>
                  <div>
                    <span className="font-medium">Title:</span>
                    <span className="ml-2">{post.title}</span>
                  </div>
                  <div>
                    <span className="font-medium">Status:</span>
                    <span className="ml-2">{post.status}</span>
                  </div>
                  <div>
                    <span className="font-medium">Deleted:</span>
                    <span className="ml-2">{post.deleted ? 'Yes' : 'No'}</span>
                  </div>
                  <div>
                    <span className="font-medium">Created At:</span>
                    <span className="ml-2 text-sm text-gray-600">{post.createdAt}</span>
                  </div>
                  <div>
                    <span className="font-medium">Updated At:</span>
                    <span className="ml-2 text-sm text-gray-600">{post.updatedAt}</span>
                  </div>
                </div>
                
                <div>
                  <span className="font-medium">Description:</span>
                  <p className="mt-1 text-gray-700">{post.description}</p>
                </div>
                <br/>
              </CardContent>
            </Card>
            
            {/* Thumbnail Section */}
            {post.thumbnail && (
              <Card>
                <CardContent className="pt-6">
                  <h3 className="font-medium mb-3">Thumbnail:</h3>
                  <div className="flex justify-center">
                    <img 
                      src={post.thumbnail} 
                      alt="Post thumbnail"
                      className="max-w-full max-h-64 object-contain rounded-lg border shadow-sm"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                        target.nextElementSibling?.classList.remove('hidden');
                      }}
                    />
                    <div className="hidden text-center text-gray-500 py-8">
                      <p>Không thể hiển thị ảnh</p>
                      <p className="text-sm">URL: {post.thumbnail}</p>
                    </div>
                  </div>
                </CardContent>
                <br/>
              </Card>
            )}
            
            <div>
              <h3 className="font-medium mb-2">Content:</h3>
              <div
                className="prose max-w-none border rounded-md p-4 bg-gray-50"
                dangerouslySetInnerHTML={{ __html: post.content }}
              />
            </div>
          </div>
        ) : (
          <div className="text-center py-4">
            Không tìm thấy thông tin bài viết.
          </div>
        )}
        
        <div className="flex justify-end pt-4">
          <Button variant="secondary" onClick={onClose}>
            Đóng
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
} 
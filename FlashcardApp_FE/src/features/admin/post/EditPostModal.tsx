import React, { useState, useEffect } from 'react';
import { useAdminAuth } from '@/layout/admin/AdminAuthProvider';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { Editor } from '@tinymce/tinymce-react';

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

interface EditPostModalProps {
  isOpen: boolean;
  onClose: () => void;
  postId: string | null;
  slug: string | null;
  onSuccess?: () => void;
}

export default function EditPostModal({ isOpen, onClose, postId, slug, onSuccess }: EditPostModalProps) {
  const { api } = useAdminAuth();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [content, setContent] = useState('');
  const [currentThumbnail, setCurrentThumbnail] = useState<string>('');
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [thumbnailPreview, setThumbnailPreview] = useState<string>('');
  const [thumbnailDataUrl, setThumbnailDataUrl] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen || !slug) {
      setTitle('');
      setDescription('');
      setContent('');
      setCurrentThumbnail('');
      setThumbnailFile(null);
      setThumbnailPreview('');
      setThumbnailDataUrl('');
      setError(null);
      return;
    }

    setLoading(true);
    api.get(`/api/v1/admin/posts/${slug}`)
      .then(res => {
        const post = res.data.data;
        setTitle(post.title);
        setDescription(post.description);
        setContent(post.content);
        setCurrentThumbnail(post.thumbnail || '');
      })
      .catch(err => {
        console.error(err);
        setError(err.message);
      })
      .finally(() => setLoading(false));
  }, [api, slug, isOpen]);

  // Khi chọn file thumbnail mới
  const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    setThumbnailFile(file);
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const dataUrl = reader.result as string;
        setThumbnailPreview(dataUrl);    // hiển thị preview
        setThumbnailDataUrl(dataUrl);    // gửi lên API
      };
      reader.readAsDataURL(file);
    } else {
      setThumbnailPreview('');
      setThumbnailDataUrl('');
    }
  };

  // Xóa thumbnail hiện tại
  const handleRemoveThumbnail = () => {
    setCurrentThumbnail('');
    setThumbnailFile(null);
    setThumbnailPreview('');
    setThumbnailDataUrl('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!postId) return;
    
    setSubmitting(true);
    try {
      const now = new Date().toISOString();
      const thumbnailToSend = thumbnailDataUrl || currentThumbnail;
      
      await api.patch(`/api/v1/admin/posts/${postId}`, { 
        title, 
        description, 
        content, 
        thumbnail: thumbnailToSend,
        updatedAt: now 
      });
      toast.success('Cập nhật bài viết thành công!');
      onSuccess?.();
      onClose();
    } catch (error: any) {
      setError(error.message);
      toast.error('Cập nhật bài viết thất bại: ' + error.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent 
        className="max-w-7xl max-h-[90vh] overflow-y-auto"
        style={{ maxWidth: '90vw', width: '90vw' }}
      >
        <DialogHeader>
          <DialogTitle>Chỉnh sửa bài viết</DialogTitle>
        </DialogHeader>
        
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin" />
            <span className="ml-2">Đang tải dữ liệu...</span>
          </div>
        ) : error ? (
          <div className="text-red-500 py-4 text-center">
            Lỗi: {error}
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="title" style={{ marginBottom: '10px' }}>Tiêu đề</Label>
              <Input
                id="title"
                value={title}
                onChange={e => setTitle(e.target.value)}
                required
              />
            </div>
            
            <div>
              <Label htmlFor="description" style={{ marginBottom: '10px' }}>Mô tả</Label>
              <Input
                id="description"
                value={description}
                onChange={e => setDescription(e.target.value)}
                required
              />
            </div>
            
            <div>
              <Label htmlFor="content" style={{ marginBottom: '10px' }}>Nội dung</Label>
              <Editor
                apiKey="pzrh7ziqqifd6v29e0xxfyp85ep56lkd3abyo6i0exqhawxc"
                init={{
                  height: 700,
                  plugins: [
                    'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
                    'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
                    'insertdatetime', 'media', 'table', 'help', 'wordcount'
                  ],
                  toolbar: 'undo redo | blocks | ' +
                  'bold italic backcolor | alignleft aligncenter ' +
                  'alignright alignjustify | bullist numlist outdent indent | ' +
                  'removeformat | help',
                  content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:16px }'        
                }}
                value={content}
                onEditorChange={newContent => setContent(newContent)}
              />
            </div>
            
            <div>
              <Label htmlFor="thumbnail" style={{ marginBottom: '10px' }}>Thumbnail</Label>
              <div className="space-y-2">
                {/* Hiển thị thumbnail hiện tại */}
                {currentThumbnail && !thumbnailPreview && (
                  <div className="relative inline-block">
                    <img 
                      src={currentThumbnail} 
                      className="h-32 object-cover rounded border" 
                      alt="Current thumbnail"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      className="absolute top-1 right-1"
                      onClick={handleRemoveThumbnail}
                    >
                      ×
                    </Button>
                  </div>
                )}
                
                {/* Hiển thị preview thumbnail mới */}
                {thumbnailPreview && (
                  <div className="relative inline-block">
                    <img 
                      src={thumbnailPreview} 
                      className="h-32 object-cover rounded border" 
                      alt="New thumbnail preview"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      className="absolute top-1 right-1"
                      onClick={() => {
                        setThumbnailFile(null);
                        setThumbnailPreview('');
                        setThumbnailDataUrl('');
                      }}
                    >
                      ×
                    </Button>
                  </div>
                )}
                
                <Input
                  id="thumbnail"
                  type="file"
                  accept="image/*"
                  onChange={handleThumbnailChange}
                />
                <p className="text-sm text-gray-500">
                  Chọn file ảnh mới để thay thế thumbnail hiện tại
                </p>
              </div>
            </div>
            
            <div>
              <Label htmlFor="updatedAt" style={{ marginBottom: '10px' }}>Cập nhật lúc</Label>
              <Input 
                type="datetime-local" 
                value={new Date().toISOString().slice(0,16)} 
                disabled 
              />
            </div>
            
            <div className="flex justify-end space-x-2 pt-4">
              <Button 
                type="button" 
                variant="secondary" 
                onClick={onClose}
                disabled={submitting}
              >
                Hủy
              </Button>
              <Button type="submit" disabled={submitting}>
                {submitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    Đang lưu...
                  </>
                ) : (
                  'Lưu thay đổi'
                )}
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
} 
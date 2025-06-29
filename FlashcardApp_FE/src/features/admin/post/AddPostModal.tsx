import React, { useState } from 'react';
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

interface AddPostModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export default function AddPostModal({ isOpen, onClose, onSuccess }: AddPostModalProps) {
  const { api } = useAdminAuth();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [content, setContent] = useState('');
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [thumbnailPreview, setThumbnailPreview] = useState<string>('');
  const [thumbnailDataUrl, setThumbnailDataUrl] = useState<string>('');
  const [submitting, setSubmitting] = useState(false);

  // Khi chọn file, tạo preview + data URL
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.post('/api/v1/admin/posts', { 
        title, 
        description, 
        content,
        thumbnail: thumbnailDataUrl,
      });
      toast.success('Tạo bài viết thành công!');
      onSuccess?.();
      onClose();
      // Reset form
      setTitle('');
      setDescription('');
      setContent('');
      setThumbnailFile(null);
      setThumbnailPreview('');
      setThumbnailDataUrl('');
    } catch (err: any) {
      toast.error('Tạo bài viết thất bại: ' + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!submitting) {
      onClose();
      // Reset form when closing
      setTitle('');
      setDescription('');
      setContent('');
      setThumbnailFile(null);
      setThumbnailPreview('');
      setThumbnailDataUrl('');
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent 
        className="max-w-7xl max-h-[90vh] overflow-y-auto"
        style={{ maxWidth: '90vw', width: '90vw' }}
      >
        <DialogHeader>
          <DialogTitle>Tạo bài viết mới</DialogTitle>
        </DialogHeader>
        
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
              onEditorChange={(newContent) => setContent(newContent)}
            />
          </div>

          <div>
            <Label htmlFor="thumbnail" style={{ marginBottom: '10px' }}>Thumbnail</Label>
            <Input
              id="thumbnail"
              type="file"
              accept="image/*"
              onChange={handleThumbnailChange}
            />
            {thumbnailPreview && (
              <img src={thumbnailPreview} className="h-32 mt-2 object-cover rounded" />
            )}
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button 
              type="button" 
              variant="secondary" 
              onClick={handleClose}
              disabled={submitting}
            >
              Hủy
            </Button>
            <Button type="submit" disabled={submitting}>
              {submitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Đang tạo...
                </>
              ) : (
                'Tạo bài viết'
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
} 
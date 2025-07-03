import React, { useState, useEffect, type ChangeEvent, type FormEvent } from 'react';
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

interface User {
  userId: string;
  fullName: string;
  email: string;
  status: string;
}

interface EditUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  userId: string | null;
  onSuccess?: () => void;
}

export default function EditUserModal({ isOpen, onClose, userId, onSuccess }: EditUserModalProps) {
  const { api } = useAdminAuth();
  const [formData, setFormData] = useState({ fullName: '', email: '', status: '' });
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen || !userId) {
      setFormData({ fullName: '', email: '', status: '' });
      setError(null);
      return;
    }

    setLoading(true);
    api.get(`/api/v1/admin/users/${userId}`)
      .then(res => {
        const payload = res.data.data;
        setFormData({ 
          fullName: payload.fullName, 
          email: payload.email, 
          status: payload.status 
        });
      })
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, [api, userId, isOpen]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!userId) return;
    
    setSubmitting(true);
    api.patch(`/api/v1/admin/users/${userId}`, {
      fullName: formData.fullName,
      email: formData.email,
      status: formData.status,
    })
      .then(() => {
        toast.success('Cập nhật người dùng thành công!');
        onSuccess?.();
        onClose();
      })
      .catch(err => {
        setError(err.message);
        toast.error('Cập nhật thất bại: ' + err.message);
      })
      .finally(() => setSubmitting(false));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent 
        className="max-w-4xl"
        style={{ maxWidth: '600px', width: '600px' }}
      >
        <DialogHeader>
          <DialogTitle>Chỉnh sửa Người dùng</DialogTitle>
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
              <Label htmlFor="fullName">Họ và tên</Label>
              <Input
                id="fullName"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <Label htmlFor="status">Trạng thái</Label>
              <Input
                id="status"
                name="status"
                value={formData.status}
                onChange={handleChange}
                required
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
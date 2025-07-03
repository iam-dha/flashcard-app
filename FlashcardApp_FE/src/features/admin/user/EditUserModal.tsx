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
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select';

interface User {
  userId: string;
  fullName: string;
  email: string;
  status: string;
  address: string;
  phone: string;
  role: string;
  deleted: boolean;
}

interface Role {
  _id: string;
  title: string;
}

interface EditUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  userId: string | null;
  onSuccess?: () => void;
}

export default function EditUserModal({ isOpen, onClose, userId, onSuccess }: EditUserModalProps) {
  const { api } = useAdminAuth();
  const [formData, setFormData] = useState({
    fullName: '',
    status: '',
    address: '',
    phone: '',
    role: '',
    deleted: false,
  });
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen || !userId) {
      setFormData({ fullName: '', status: '', address: '', phone: '', role: '', deleted: false });
      setError(null);
      return;
    }
    setLoading(true);
    api.get(`/api/v1/admin/users/${userId}`)
      .then(res => {
        const payload = res.data.data;
        setFormData({
          fullName: payload.fullName || '',
          status: payload.status || '',
          address: payload.address || '',
          phone: payload.phone || '',
          role: payload.role || '',
          deleted: !!payload.deleted,
        });
      })
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, [api, userId, isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    api.get('/api/v1/admin/roles')
      .then(res => {
        setRoles(Array.isArray(res.data.data) ? res.data.data : []);
      })
      .catch(() => setRoles([]));
  }, [api, isOpen]);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    let newValue: string | boolean = value;
    if (type === 'checkbox' && e.target instanceof HTMLInputElement) {
      newValue = e.target.checked;
    }
    setFormData(prev => ({
      ...prev,
      [name]: newValue,
    }));
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!userId) return;
    setSubmitting(true);
    api.patch(`/api/v1/admin/users/${userId}`,
      {
        fullName: formData.fullName,
        status: formData.status,
        address: formData.address,
        phone: formData.phone,
        role: formData.role,
        deleted: formData.deleted,
      }
    )
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
              <Label htmlFor="status">Trạng thái</Label>
              <Select
                value={formData.status}
                onValueChange={v => handleChange({
                  target: { name: 'status', value: v, type: 'select-one' }
                } as any)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Chọn trạng thái" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="address">Địa chỉ</Label>
              <Input
                id="address"
                name="address"
                value={formData.address}
                onChange={handleChange}
              />
            </div>
            <div>
              <Label htmlFor="phone">Số điện thoại</Label>
              <Input
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
              />
            </div>
            <div>
              <Label htmlFor="role">Vai trò</Label>
              <Select
                value={formData.role}
                onValueChange={v => handleChange({
                  target: { name: 'role', value: v, type: 'select-one' }
                } as any)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Chọn vai trò" />
                </SelectTrigger>
                <SelectContent>
                  {roles.map(role => (
                    <SelectItem key={role._id} value={role.title}>{role.title}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="deleted"
                name="deleted"
                checked={formData.deleted}
                onChange={handleChange}
              />
              <Label htmlFor="deleted">Xoá người dùng</Label>
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
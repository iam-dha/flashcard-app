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

interface User {
  userId: string;
  fullName: string;
  address: string;
  email: string;
  status: string;
}

interface ViewUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  userId: string | null;
}

export default function ViewUserModal({ isOpen, onClose, userId }: ViewUserModalProps) {
  const { api } = useAdminAuth();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen || !userId) {
      setUser(null);
      setError(null);
      return;
    }

    setLoading(true);
    api
      .get(`/api/v1/admin/users/${userId}`)
      .then(res => {
        const payload = res.data.data;
        setUser({
          userId: payload.userId,
          fullName: payload.fullName,
          address: payload.address,
          email: payload.email,
          status: payload.status,
        });
      })
      .catch(err => {
        console.error('Fetch user error:', err);
        setError(err.message);
      })
      .finally(() => setLoading(false));
  }, [api, userId, isOpen]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent 
        className="max-w-4xl"
        style={{ maxWidth: '600px', width: '600px' }}
      >
        <DialogHeader>
          <DialogTitle>Thông tin Người dùng</DialogTitle>
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
        ) : user ? (
          <Card>
            <CardContent className="pt-6 space-y-3">
              <div className="flex justify-between">
                <span className="font-medium">User ID:</span>
                <span>{user.userId}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Họ và tên:</span>
                <span>{user.fullName}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Địa chỉ:</span>
                <span>{user.address}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Email:</span>
                <span>{user.email}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Trạng thái:</span>
                <span>{user.status}</span>
              </div>
              <br/>
            </CardContent>
          </Card>
        ) : (
          <div className="text-center py-4">
            Không tìm thấy thông tin người dùng.
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
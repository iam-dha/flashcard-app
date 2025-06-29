// frontend/src/components/UserManagementTable.tsx
import React, { useState, useEffect } from 'react';
import { useAdminAuth } from '@/layout/admin/AdminAuthProvider';
import { useSearchParams } from 'react-router-dom';

import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from '@/components/ui/table';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select';
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Eye,
  Edit,
  Trash2,
  ChevronUp,
  ChevronDown,
  ChevronRight as ChevronRightIcon,
} from 'lucide-react';

import ViewUserModal from './ViewUserModal';
import EditUserModal from './EditUserModal';

interface User {
  userId: string;
  fullName: string;
  email: string;
  status: string;
  deleted: boolean;
}

type SortDirection = 'asc' | 'desc' | null;
type SortField = 'fullName' | 'status' | 'deleted' | null;

interface SortState {
  field: SortField;
  direction: SortDirection;
}

export default function UserManagementTable() {
  const { api } = useAdminAuth();

  // Đọc page & limit từ URL, mặc định 1 & 10
  const [searchParams, setSearchParams] = useSearchParams();
  const page        = parseInt(searchParams.get('page')  || '1', 10);
  const rowsPerPage = parseInt(searchParams.get('limit') || '10', 10);

  const [users, setUsers]           = useState<User[]>([]);
  const [total, setTotal]           = useState(0);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [loading, setLoading]       = useState(false);

  // Sort state
  const [sortState, setSortState] = useState<SortState>({ field: null, direction: null });

  // Modal states
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);

  const totalPages = Math.ceil(total / rowsPerPage);
  const allSelected = users.length > 0 && selectedIds.length === users.length;

  // Fetch users với sort parameters
  const fetchUsers = async (currentPage: number, currentLimit: number, currentSortField?: SortField, currentSortDirection?: SortDirection) => {
    setLoading(true);
    try {
      const params: any = { 
        page: currentPage, 
        limit: currentLimit 
      };

      // Thêm sort parameters nếu có
      if (currentSortField && currentSortDirection) {
        params.filter = currentSortField;
        params.order = currentSortDirection;
      }

      const res = await api.get('/api/v1/admin/users', { params });
      const payload = res.data.data;
      const list = Array.isArray(payload.users) ? payload.users : [];

      setUsers(list);
      setTotal(typeof payload.totalCount === 'number' ? payload.totalCount : list.length);
      setSelectedIds([]);
    } catch (err) {
      console.error('Fetch users error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch users mỗi khi page/limit/sort thay đổi
  useEffect(() => {
    fetchUsers(page, rowsPerPage, sortState.field, sortState.direction);
  }, [api, page, rowsPerPage, sortState]);

  // Cập nhật URL cho pagination
  const updateParams = (newPage?: number, newLimit?: number) => {
    setSearchParams({
      page:  (newPage   ?? page).toString(),
      limit: (newLimit  ?? rowsPerPage).toString(),
    });
  };

  // Handle sort
  const handleSort = (field: SortField) => {
    if (sortState.field !== field) {
      // New field, start with ascending
      setSortState({ field, direction: 'asc' });
    } else {
      // Same field, cycle through directions
      if (sortState.direction === 'asc') {
        setSortState({ field, direction: 'desc' });
      } else if (sortState.direction === 'desc') {
        setSortState({ field: null, direction: null });
      }
    }
  };

  // Get sort direction for a specific field
  const getSortDirection = (field: SortField): SortDirection => {
    return sortState.field === field ? sortState.direction : null;
  };

  // Handlers
  const handleDetail = (userId: string) => {
    setSelectedUserId(userId);
    setViewModalOpen(true);
  };

  const handleEdit = (userId: string) => {
    setSelectedUserId(userId);
    setEditModalOpen(true);
  };

  const handleDelete = (userId: string) => {
    if (!confirm('Bạn có chắc chắn muốn xoá người dùng này?')) return;
    api.delete(`/api/v1/admin/users/${userId}`)
      .then(() => updateParams(1))
      .catch(err => alert('Xoá thất bại: ' + err.message));
  };

  const handleDeleteSelected = () => {
    if (!confirm(`Bạn có chắc chắn muốn xoá ${selectedIds.length} người dùng đã chọn?`)) return;
    Promise.all(selectedIds.map(id =>
      api.delete(`/api/v1/admin/users/${id}`)
    ))
    .then(() => updateParams(1))
    .catch(err => alert('Xoá đồng loạt thất bại: ' + err.message));
  };

  const handleSelectAll = (checked: boolean) =>
    setSelectedIds(checked ? users.map(u => u.userId) : []);

  const handleSelectOne = (userId: string, checked: boolean) =>
    setSelectedIds(prev =>
      checked ? [...prev, userId] : prev.filter(x => x !== userId)
    );

  const handleEditSuccess = () => {
    // Refresh the user list after successful edit
    fetchUsers(page, rowsPerPage, sortState.field, sortState.direction);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">User Management</h2>
        <div className="flex space-x-2">
          <Button
            variant="destructive"
            onClick={handleDeleteSelected}
            disabled={selectedIds.length === 0}
          >
            Delete Selected
          </Button>
          {/* Nếu có nút Thêm mới, để ở đây */}
        </div>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-8 p-0">
              <Checkbox
                style={{
                  border: '1px solid #e0e0e0',
                  borderRadius: '4px',
                }}
                checked={allSelected}
                onCheckedChange={v => handleSelectAll(!!v)}
                className="m-2"
              />
            </TableHead>
            <TableHead>No.</TableHead>
            <TableHead>
              <div className="flex items-center space-x-2 cursor-pointer hover:bg-gray-50 px-2 py-1 rounded transition-colors" onClick={() => handleSort('fullName')}>
                <span className="font-medium">Full Name</span>
                <div className="flex items-center">
                  {getSortDirection('fullName') === 'asc' ? (
                    <ChevronUp size={16} className="text-blue-600 font-bold" />
                  ) : getSortDirection('fullName') === 'desc' ? (
                    <ChevronDown size={16} className="text-blue-600 font-bold" />
                  ) : (
                    <ChevronRightIcon size={16} className="text-gray-400" />
                  )}
                </div>
              </div>
            </TableHead>
            <TableHead>Email</TableHead>
            <TableHead>
              <div className="flex items-center space-x-2 cursor-pointer hover:bg-gray-50 px-2 py-1 rounded transition-colors" onClick={() => handleSort('status')}>
                <span className="font-medium">Status</span>
                <div className="flex items-center">
                  {getSortDirection('status') === 'asc' ? (
                    <ChevronUp size={16} className="text-blue-600 font-bold" />
                  ) : getSortDirection('status') === 'desc' ? (
                    <ChevronDown size={16} className="text-blue-600 font-bold" />
                  ) : (
                    <ChevronRightIcon size={16} className="text-gray-400" />
                  )}
                </div>
              </div>
            </TableHead>
            <TableHead>
              <div className="flex items-center space-x-2 cursor-pointer hover:bg-gray-50 px-2 py-1 rounded transition-colors" onClick={() => handleSort('deleted')}>
                <span className="font-medium">Deletion</span>
                <div className="flex items-center">
                  {getSortDirection('deleted') === 'asc' ? (
                    <ChevronUp size={16} className="text-blue-600 font-bold" />
                  ) : getSortDirection('deleted') === 'desc' ? (
                    <ChevronDown size={16} className="text-blue-600 font-bold" />
                  ) : (
                    <ChevronRightIcon size={16} className="text-gray-400" />
                  )}
                </div>
              </div>
            </TableHead>
            <TableHead className="text-center">Actions</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {loading ? (
            <TableRow>
              <TableCell colSpan={6}>Đang tải...</TableCell>
            </TableRow>
          ) : users.length > 0 ? (
            users.map((u, index) => (
              <TableRow key={++index}>
                <TableCell className="p-0">
                  <Checkbox
                    style={{
                      border: '1px solid #e0e0e0',
                      borderRadius: '4px',
                    }}
                    checked={selectedIds.includes(u.userId)}
                    onCheckedChange={v => handleSelectOne(u.userId, !!v)}
                    className="m-2"
                  />
                </TableCell>
                <TableCell>{++index + (page ? (page - 1) * rowsPerPage : 0 )}</TableCell>
                <TableCell>{u.fullName}</TableCell>
                <TableCell>{u.email}</TableCell>
                <TableCell>{u.status}</TableCell>
                <TableCell>
                  {u.deleted ? 'Deleted' : 'None'}
                </TableCell>
                <TableCell className="text-center space-x-2">
                  <Button size="icon" onClick={() => handleDetail(u.userId)}>
                    <Eye size={16} />
                  </Button>
                  <Button
                    size="icon"
                    variant="secondary"
                    onClick={() => handleEdit(u.userId)}
                  >
                    <Edit size={16} />
                  </Button>
                  <Button
                    variant="destructive"
                    size="icon"
                    onClick={() => handleDelete(u.userId)}
                  >
                    <Trash2 size={16} />
                  </Button>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={6}>Không có dữ liệu</TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      {/* Footer Pagination */}
      <div className="flex items-center justify-between">
        <span className="text-sm">
          {selectedIds.length} of {total} row(s) selected.
        </span>

        <div className="flex items-center space-x-2">
          <span className="text-sm">Rows per page:</span>
          <Select
            value={rowsPerPage.toString()}
            onValueChange={v => updateParams(1, Number(v))}
          >
            <SelectTrigger className="w-[70px]">
              <SelectValue placeholder={rowsPerPage.toString()} />
            </SelectTrigger>
            <SelectContent>
              {[10, 20, 50].map(n => (
                <SelectItem key={n} value={n.toString()}>
                  {n}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <span className="text-sm">
            Page {page} of {totalPages || 1}
          </span>

          <Button
            variant="ghost"
            size="icon"
            onClick={() => updateParams(1)}
            disabled={page === 1}
          >
            <ChevronsLeft size={16} />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => updateParams(page - 1)}
            disabled={page === 1}
          >
            <ChevronLeft size={16} />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => updateParams(page + 1)}
            disabled={page === totalPages || totalPages === 0}
          >
            <ChevronRight size={16} />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => updateParams(totalPages)}
            disabled={page === totalPages || totalPages === 0}
          >
            <ChevronsRight size={16} />
          </Button>
        </div>
      </div>

      {/* Modals */}
      <ViewUserModal
        isOpen={viewModalOpen}
        onClose={() => setViewModalOpen(false)}
        userId={selectedUserId}
      />
      
      <EditUserModal
        isOpen={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        userId={selectedUserId}
        onSuccess={handleEditSuccess}
      />
    </div>
  );
}

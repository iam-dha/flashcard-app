// frontend/src/components/PostManagementPage.tsx
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
} from 'lucide-react';

import ViewPostModal from './ViewPostModal';
import EditPostModal from './EditPostModal';
import AddPostModal from './AddPostModal';

interface Post{
  _id: string;
  title: string;
  description: string;
  content: string;
  thumbnail: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  deleted: boolean; 
  slug: string;
}

export default function PostManagementTable() {
  const { api } = useAdminAuth();

  // Đọc page & limit từ URL, mặc định 1 & 10
  const [searchParams, setSearchParams] = useSearchParams();
  const page        = parseInt(searchParams.get('page')  || '1', 10);
  const rowsPerPage = parseInt(searchParams.get('limit') || '10', 10);

  const [posts, setPosts]           = useState<Post[]>([]);
  const [total, setTotal]           = useState(0);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [loading, setLoading]       = useState(false);

  // Modal states
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [selectedPostSlug, setSelectedPostSlug] = useState<string | null>(null);
  const [selectedPostId, setSelectedPostId] = useState<string | null>(null);

  const totalPages = Math.ceil(total / rowsPerPage);
  const allSelected = posts.length > 0 && selectedIds.length === posts.length;

  // Fetch posts mỗi khi page/limit thay đổi
  // Lần đầu vào component, fetch dữ liệu posts từ API
  useEffect(() => {
    setLoading(true);
    api.get('/api/v1/admin/posts', { params: { page, limit: rowsPerPage } })
      .then(res => {
        const payload = res.data.data;
        // Lọc luôn deleted === false
        // const list = Array.isArray(payload.users)
        //   ? payload.users.filter((u: User) => !u.deleted)
        //   : [];
        const list = Array.isArray(payload.posts) ? payload.posts : [];

        setPosts(list);
        setTotal(typeof payload.totalCount === 'number' ? payload.totalCount : list.length);
        setSelectedIds([]);
      })
      .catch(err => console.error('Fetch posts error:', err))
      .finally(() => setLoading(false));
  }, [api, page, rowsPerPage]);

  // Cập nhật URL cho pagination
  const updateParams = (newPage?: number, newLimit?: number) => {
    setSearchParams({
      page:  (newPage   ?? page).toString(),
      limit: (newLimit  ?? rowsPerPage).toString(),
    });
  };

  // Handlers
  const handleCreate = () => {
    setAddModalOpen(true);
  };

  const handleDetail = (slug: string) => {
    setSelectedPostSlug(slug);
    setViewModalOpen(true);
  };

  const handleEdit = (_id: string, slug: string) => {
    setSelectedPostId(_id);
    setSelectedPostSlug(slug);
    setEditModalOpen(true);
  };

  const handleDelete = (_id: string) => {
    if (!confirm('Bạn có chắc chắn muốn xoá bài viết này?')) return;
    api.delete(`/api/v1/admin/posts/${_id}`)
      .then(() => updateParams(1))
      .catch(err => alert('Xoá thất bại: ' + err.message));
  };

  const handleDeleteSelected = () => {
    if (!confirm(`Bạn có chắc chắn muốn xoá ${selectedIds.length} bài viết đã chọn?`)) return;
    Promise.all(selectedIds.map(id =>
      api.delete(`/api/v1/admin/posts/${id}`)
    ))
    .then(() => updateParams(1))
    .catch(err => alert('Xoá đồng loạt thất bại: ' + err.message));
  };

  const handleSelectAll = (checked: boolean) =>
    setSelectedIds(checked ? posts.map(p => p._id) : []);

  const handleSelectOne = (_id: string, checked: boolean) =>
    setSelectedIds(prev =>
      checked ? [...prev, _id] : prev.filter(x => x !== _id)
    );

  const handleEditSuccess = () => {
    // Refresh the post list after successful edit
    setLoading(true);
    api.get('/api/v1/admin/posts', { params: { page, limit: rowsPerPage } })
      .then(res => {
        const payload = res.data.data;
        const list = Array.isArray(payload.posts) ? payload.posts : [];
        setPosts(list);
        setTotal(typeof payload.totalCount === 'number' ? payload.totalCount : list.length);
      })
      .catch(err => console.error('Refresh posts error:', err))
      .finally(() => setLoading(false));
  };

  const handleAddSuccess = () => {
    // Refresh the post list after successful add
    setLoading(true);
    api.get('/api/v1/admin/posts', { params: { page, limit: rowsPerPage } })
      .then(res => {
        const payload = res.data.data;
        const list = Array.isArray(payload.posts) ? payload.posts : [];
        setPosts(list);
        setTotal(typeof payload.totalCount === 'number' ? payload.totalCount : list.length);
      })
      .catch(err => console.error('Refresh posts error:', err))
      .finally(() => setLoading(false));
  };

  return (
    <div className="max-w-5xl mx-auto space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Post Management</h2>
        <div className="flex space-x-2">
          <Button onClick={handleCreate}>New Post</Button>

          <Button
            variant="destructive"
            onClick={handleDeleteSelected}
            disabled={selectedIds.length === 0}
          >
            Delete Selected
          </Button>
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
            <TableHead>Title</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Created At</TableHead>
            <TableHead>Updated At</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Deleted</TableHead>
            <TableHead className="text-center">Actions</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {loading ? (
            <TableRow>
              <TableCell colSpan={8}>Đang tải...</TableCell>
            </TableRow>
          ) : posts.length > 0 ? (
            posts.map((p, index) => (
              <TableRow key={++index}>
                <TableCell className="p-0">
                  <Checkbox
                    style={{
                      border: '1px solid #e0e0e0',
                      borderRadius: '4px',
                    }}
                    checked={selectedIds.includes(p._id)}
                    onCheckedChange={v => handleSelectOne(p._id, !!v)}
                    className="m-2"
                  />
                </TableCell>
                <TableCell>{++index + (page ? (page - 1) * rowsPerPage : 0 )}</TableCell>
                <TableCell className="max-w-[150px]">
                  <div className="truncate" title={p.title}>
                    {p.title}
                  </div>
                </TableCell>
                <TableCell className="max-w-[200px]">
                  <div className="truncate text-xs" title={p.description}>
                    {p.description}
                  </div>
                </TableCell>
                <TableCell style={{ fontSize: '10px' }}>{p.createdAt}</TableCell>
                <TableCell style={{ fontSize: '10px' }}>{p.updatedAt}</TableCell>
                <TableCell>{p.status}</TableCell>
                <TableCell>
                  {p.deleted ? 'Deleted' : 'None'}
                </TableCell>
                <TableCell className="text-center space-x-2">
                  <Button size="icon" onClick={() => handleDetail(p.slug)}>
                    <Eye size={16} />
                  </Button>
                  <Button
                    size="icon"
                    variant="secondary"
                    onClick={() => handleEdit(p._id, p.slug)}
                  >
                    <Edit size={16} />
                  </Button>
                  <Button
                    variant="destructive"
                    size="icon"
                    onClick={() => handleDelete(p._id)}
                  >
                    <Trash2 size={16} />
                  </Button>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={8}>Không có dữ liệu</TableCell>
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
      <ViewPostModal
        isOpen={viewModalOpen}
        onClose={() => setViewModalOpen(false)}
        slug={selectedPostSlug}
      />
      
      <EditPostModal
        isOpen={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        postId={selectedPostId}
        slug={selectedPostSlug}
        onSuccess={handleEditSuccess}
      />

      <AddPostModal
        isOpen={addModalOpen}
        onClose={() => setAddModalOpen(false)}
        onSuccess={handleAddSuccess}
      />
    </div>
  );
}

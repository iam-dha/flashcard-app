import React, { useEffect, useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { useAdminAuth } from '@/layout/admin/AdminAuthProvider';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Checkbox } from '@/components/ui/checkbox';
import AddRole from './AddRole';

interface Role {
  _id: string;
  title: string;
  description: string;
  permissions: string[];
  deleted: boolean;
  createdAt: string;
  updatedAt: string;
}

interface Permission {
  _id: string;
  title: string;
  description: string;
  deleted: boolean;
  createdAt: string;
  updatedAt: string;
}

const RoleManagement: React.FC = () => {
  const { api } = useAdminAuth();
  const [roles, setRoles] = useState<Role[]>([]);
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedRoles, setSelectedRoles] = useState<string[]>([]); // Track selected roles
  // State để track thay đổi permissions của từng role
  const [rolePermissions, setRolePermissions] = useState<{[roleId: string]: string[]}>({});

  const fetchData = async () => {
    try {
      const permissionsResponse = await api.get('/api/v1/admin/roles/permissions');
      console.log('permissions:', permissionsResponse.data.data);
      setPermissions(Array.isArray(permissionsResponse.data.data) ? permissionsResponse.data.data : []);

      const rolesResponse = await api.get('/api/v1/admin/roles');
      console.log('roles:', rolesResponse.data);
      const rolesData = Array.isArray(rolesResponse.data.data) ? rolesResponse.data.data : [];
      setRoles(rolesData);
      
      // Khởi tạo rolePermissions state với dữ liệu hiện tại
      const initialRolePermissions: {[roleId: string]: string[]} = {};
      rolesData.forEach((role: Role) => {
        initialRolePermissions[role._id] = [...role.permissions];
      });
      setRolePermissions(initialRolePermissions);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [api]);

  // Hàm refresh data sau khi thêm role mới
  const handleAddRoleSuccess = () => {
    fetchData(); // Refresh danh sách roles
  };

  // Hàm xử lý chọn/bỏ chọn role
  const handleRoleSelect = (roleId: string, checked: boolean) => {
    setSelectedRoles(prev => {
      if (checked) {
        return [...prev, roleId];
      } else {
        return prev.filter(id => id !== roleId);
      }
    });
  };

  // Hàm chọn/bỏ chọn tất cả roles
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedRoles(roles.map(role => role._id));
    } else {
      setSelectedRoles([]);
    }
  };

  // Hàm xóa các roles được chọn
  const handleDeleteSelected = async () => {
    if (selectedRoles.length === 0) {
      toast.warning('Vui lòng chọn ít nhất một role để xóa!');
      return;
    }

    setDeleting(true);
    try {
      // Xóa từng role một cách tuần tự
      for (const roleId of selectedRoles) {
        await api.delete(`/api/v1/admin/roles/${roleId}`);
      }
      
      toast.success(`Đã xóa ${selectedRoles.length} role(s) thành công!`);
      
      setSelectedRoles([]); // Clear selection
      fetchData(); // Refresh data
    } catch (error) {
      console.error('Error deleting roles:', error);
      toast.error('Có lỗi xảy ra khi xóa roles!');
    } finally {
      setDeleting(false);
    }
  };

  // Hàm xử lý thay đổi checkbox permission
  const handlePermissionChange = (roleId: string, permissionTitle: string, checked: boolean) => {
    setRolePermissions(prev => {
      const currentPermissions = prev[roleId] || [];
      if (checked) {
        // Thêm permission nếu chưa có
        if (!currentPermissions.includes(permissionTitle)) {
          return {
            ...prev,
            [roleId]: [...currentPermissions, permissionTitle]
          };
        }
      } else {
        // Xóa permission
        return {
          ...prev,
          [roleId]: currentPermissions.filter(p => p !== permissionTitle)
        };
      }
      return prev;
    });
  };

  // Hàm lưu thay đổi permissions
  const handleSave = async () => {
    setSaving(true);
    try {
      const requestBody = {
        rolePermissions: roles.map(role => ({
          _id: role._id,
          title: role.title,
          permissions: rolePermissions[role._id] || []
        }))
      };

      await api.patch('/api/v1/admin/roles/permissions', requestBody);
      toast.success('Permissions đã được cập nhật thành công!');
      
      // Cập nhật lại state roles với permissions mới
      setRoles(prev => prev.map(role => ({
        ...role,
        permissions: rolePermissions[role._id] || []
      })));
    } catch (error) {
      console.error('Error saving permissions:', error);
      toast.error('Có lỗi xảy ra khi cập nhật permissions!');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Role Management</h2>
        <div className="flex gap-2">
          <Button 
            variant="outline"
            onClick={() => setShowAddModal(true)}
          >
            <Plus className="h-4 w-4 mr-2" />
            Add New Role
          </Button>
          
          {selectedRoles.length > 0 && (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button 
                  variant="destructive"
                  disabled={deleting}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete Selected ({selectedRoles.length})
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Xóa {selectedRoles.length} role(s)?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Bạn có chắc chắn muốn xóa các role đã chọn? Hành động này không thể hoàn tác.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleDeleteSelected}
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  >
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
          
          <Button 
            onClick={handleSave}
            disabled={saving || loading}
          >
            {saving ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </div>

      {/* Select All Checkbox */}
      {roles.length > 0 && (
        <div className="mb-4 flex items-center gap-2">
          <Checkbox
            style={{
              border: '1px solid #e0e0e0',
              borderRadius: '4px',  
            }}
            checked={selectedRoles.length === roles.length}
            onCheckedChange={handleSelectAll}
          />
          <span className="text-sm text-muted-foreground">
            Select All Roles ({selectedRoles.length}/{roles.length} selected)
          </span>
        </div>
      )}

      {/* Permissions Table */}
      <div >
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[200px]">Permission</TableHead>
              {roles.map(role => (
                <TableHead key={role._id} className="text-center">
                  <div className="flex flex-col items-center gap-2">
                    <div className="flex items-center gap-2">
                      <Checkbox
                        style={{
                          border: '1px solid #e0e0e0',
                          borderRadius: '4px',
                        }}
                        checked={selectedRoles.includes(role._id)}
                        onCheckedChange={(checked) => 
                          handleRoleSelect(role._id, checked as boolean)
                        }
                      />
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <span className="cursor-help font-medium">
                              {role.title}
                            </span>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>{role.description}</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                  </div>
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {permissions.map(permission => (
              <TableRow key={permission._id}>
                <TableCell className="font-medium">
                  {permission.title}
                </TableCell>
                {roles.map(role => {
                  const checked = (rolePermissions[role._id] || []).includes(permission.title);
                  return (
                    <TableCell key={role._id} className="text-center">
                      <Checkbox
                        checked={checked}
                        style={{
                          border: '1px solid #e0e0e0',
                          borderRadius: '4px',
                        }}
                        onCheckedChange={(checked) => 
                          handlePermissionChange(role._id, permission.title, checked as boolean)
                        }
                      />
                    </TableCell>
                  );
                })}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      
      {/* Add Role Modal */}
      <AddRole
        open={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSuccess={handleAddRoleSuccess}
      />
    </div>
  );
};

export default RoleManagement;
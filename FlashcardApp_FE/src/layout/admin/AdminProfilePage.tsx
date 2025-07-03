// frontend/src/components/EditProfile.tsx
import { useState, useEffect } from "react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface ProfileData {
  thumbnail: string;
  fullName: string;
  email: string;
  address: string;
  phone: string;
}

export default function AdminProfilePage() {
  // state profile
  const [profile, setProfile] = useState<ProfileData>({
    thumbnail: "",
    fullName: "",
    email: "",
    address: "",
    phone: "",
  });
  // Thông tin chỉ hiển thị
  const [info, setInfo] = useState({
    status: "",
    totalScore: 0,
    accountAge: 0,
    folderCount: 0,
  });
  // ảnh mới (File) và preview URL
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string>("");

  // mật khẩu
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  // loading / feedback
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Lần đầu mount: fetch profile hiện tại
  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/v1/user/settings");
        const result = await res.json();
        const data = result.data.data;
        setProfile({
          thumbnail: data.thumbnail || "",
          fullName: data.fullName || "",
          email: data.email || "",
          address: data.address || "",
          phone: data.phone || "",
        });
        setAvatarPreview(data.thumbnail || "");
        setInfo({
          status: data.status || "",
          totalScore: data.totalScore || 0,
          accountAge: data.accountAge || 0,
          folderCount: data.folderCount || 0,
        });
      } catch (err) {
        console.error(err);
      }
    }
    load();
  }, []);

  // Khi user chọn file mới, tạo URL preview
  useEffect(() => {
    if (!avatarFile) return;
    const url = URL.createObjectURL(avatarFile);
    setAvatarPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [avatarFile]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setAvatarFile(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);

    try {
      const formData = new FormData();
      if (avatarFile) formData.append("avatar", avatarFile);
      formData.append("fullName", profile.fullName);
      formData.append("email", profile.email);
      formData.append("address", profile.address);
      formData.append("phone", profile.phone);
      formData.append("currentPassword", currentPassword);
      formData.append("newPassword", newPassword);

      const res = await fetch("/api/user/profile", {
        method: "PUT",
        body: formData,
      });
      if (!res.ok) throw new Error("Cập nhật thất bại");
      setSuccess("Cập nhật thành công!");
      // nếu API trả về URL avatar mới, update lại
      const result = await res.json();
      if (result.thumbnail) setAvatarPreview(result.thumbnail);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-lg mx-auto space-y-6 p-6 bg-white rounded-lg shadow"
    >
      <h2 className="text-2xl font-bold">Chỉnh sửa Profile</h2>

      {/* Thông tin chỉ hiển thị */}
      <div className="grid grid-cols-2 gap-4 bg-gray-50 p-4 rounded mb-4">
        <div>
          <span className="font-semibold">Trạng thái:</span> {info.status}
        </div>
        <div>
          <span className="font-semibold">Tổng điểm:</span> {info.totalScore}
        </div>
        <div>
          <span className="font-semibold">Ngày tuổi tài khoản:</span> {info.accountAge}
        </div>
        <div>
          <span className="font-semibold">Số lượng folder:</span> {info.folderCount}
        </div>
      </div>

      {error && <p className="text-red-500">{error}</p>}
      {success && <p className="text-green-600">{success}</p>}

      {/* Avatar */}
      <div className="flex flex-col items-center">
        <Avatar className="w-24 h-24 mb-2">
          {avatarPreview ? (
            <AvatarImage src={avatarPreview} />
          ) : (
            <AvatarFallback>
              {profile.fullName.charAt(0).toUpperCase()}
            </AvatarFallback>
          )}
        </Avatar>
        <label className="cursor-pointer text-sm text-blue-600 hover:underline">
          Thay ảnh đại diện
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />
        </label>
      </div>

      {/* Full Name */}
      <div className="space-y-1">
        <Label htmlFor="fullName">Họ và tên</Label>
        <Input
          id="fullName"
          value={profile.fullName}
          onChange={(e) =>
            setProfile({ ...profile, fullName: e.currentTarget.value })
          }
          required
        />
      </div>

      {/* Email */}
      <div className="space-y-1">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          value={profile.email}
          onChange={(e) =>
            setProfile({ ...profile, email: e.currentTarget.value })
          }
          required
        />
      </div>

      {/* Address */}
      <div className="space-y-1">
        <Label htmlFor="address">Địa chỉ</Label>
        <Input
          id="address"
          value={profile.address}
          onChange={(e) =>
            setProfile({ ...profile, address: e.currentTarget.value })
          }
        />
      </div>

      {/* Phone */}
      <div className="space-y-1">
        <Label htmlFor="phone">Số điện thoại</Label>
        <Input
          id="phone"
          value={profile.phone}
          onChange={(e) =>
            setProfile({ ...profile, phone: e.currentTarget.value })
          }
        />
      </div>

      {/* Password */}
      <div className="space-y-1">
        <Label htmlFor="currentPassword">Mật khẩu hiện tại</Label>
        <Input
          id="currentPassword"
          type="password"
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.currentTarget.value)}
        />
      </div>
      <div className="space-y-1">
        <Label htmlFor="newPassword">Mật khẩu mới</Label>
        <Input
          id="newPassword"
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.currentTarget.value)}
        />
      </div>

      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? "Đang lưu..." : "Lưu thay đổi"}
      </Button>
    </form>
  );
}

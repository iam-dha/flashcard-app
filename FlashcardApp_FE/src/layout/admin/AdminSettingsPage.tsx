// frontend/src/components/ProfileSettings.tsx
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface Profile {
  fullName: string;
  email: string;
  address: string;
  phone: string;
  thumbnail: string;
}

export default function AdminProfileSettingsPage() {
  const [profile, setProfile] = useState<Profile>({
    fullName: "",
    email: "",
    address: "",
    phone: "",
    thumbnail: "",
  });
  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Lần đầu vào component, fetch dữ liệu profile từ API
  useEffect(() => {
    async function loadProfile() {
      try {
        const res = await fetch("/api/v1/user/settings");
        if (!res.ok) throw new Error("Không tải được profile");
        const result = await res.json();
        const data = result.data.data;
        setProfile({
          fullName: data.fullName,
          email: data.email,
          address: data.address || "",
          phone: data.phone || "",
          thumbnail: data.thumbnail || "",
        });
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    loadProfile();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSuccess(null);

    try {
      const res = await fetch("/api/user/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(profile),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || "Cập nhật thất bại");
      }
      toast.success("Cập nhật thành công!");
      setSuccess("Cập nhật thành công!");
    } catch (err: any) {
      setError(err.message);
      toast.error("Cập nhật thất bại: " + err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <p>Đang tải thông tin...</p>;
  }

  return (
    <div className="max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Cài đặt Profile</h1>

      {/* Thông tin chỉ hiển thị */}
      <div className="bg-gray-50 rounded p-4 mb-6">
        <div className="flex items-center gap-4 mb-4">
          {profile.thumbnail && (
            <img
              src={profile.thumbnail}
              alt="Avatar"
              className="w-16 h-16 rounded-full object-cover border"
            />
          )}
          <div>
            <div className="font-semibold text-lg">{profile.fullName}</div>
            <div className="text-gray-600">{profile.email}</div>
          </div>
        </div>
        <div className="grid grid-cols-1 gap-2 text-sm">
          <div><span className="font-medium">Địa chỉ:</span> {profile.address}</div>
          <div><span className="font-medium">Số điện thoại:</span> {profile.phone}</div>
        </div>
      </div>

      {error && <p className="text-red-500 mb-2">{error}</p>}
      {success && <p className="text-green-600 mb-2">{success}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1 font-medium">Họ và tên</label>
          <Input
            value={profile.fullName}
            onChange={(e) =>
              setProfile({ ...profile, fullName: e.currentTarget.value })
            }
            placeholder="Nhập họ và tên"
            required
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">Email</label>
          <Input
            type="email"
            value={profile.email}
            onChange={(e) =>
              setProfile({ ...profile, email: e.currentTarget.value })
            }
            placeholder="Nhập email"
            required
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">Địa chỉ</label>
          <Input
            value={profile.address}
            onChange={(e) =>
              setProfile({ ...profile, address: e.currentTarget.value })
            }
            placeholder="Nhập địa chỉ"
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">Số điện thoại</label>
          <Input
            value={profile.phone}
            onChange={(e) =>
              setProfile({ ...profile, phone: e.currentTarget.value })
            }
            placeholder="Nhập số điện thoại"
          />
        </div>

        <Button type="submit" disabled={saving} className="w-full">
          {saving ? "Đang lưu..." : "Lưu thay đổi"}
        </Button>
      </form>
    </div>
  );
}

import { useEffect, useState } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { format, parseISO } from "date-fns";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

export function AllBannerList() {
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editBanner, setEditBanner] = useState(null);
  const [saving, setSaving] = useState(false);

  console.log(banners);

  const fetchBanners = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        "http://localhost:3000/api/v1/banner/getall-banner"
      );
      setBanners(response.data.data);
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBanners();
  }, []);

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this banner?")) return;
    try {
      await axios.delete(
        `http://localhost:3000/api/v1/banner/delete-banner/${id}`
      );

      // Update banners array locally without fetching
      setBanners((prev) => prev.filter((banner) => banner._id !== id));
    } catch (err) {
      alert(err.response?.data?.message || err.message);
    }
  };

  const handleEditClick = (banner) => {
    setEditBanner({ ...banner }); // Copy banner data
    setEditModalOpen(true);
  };

  const handleEditChange = (field, value) => {
    setEditBanner((prev) => ({ ...prev, [field]: value }));
  };

  const handleEditSave = async () => {
    if (!editBanner) return;
    setSaving(true);
    try {
      const formData = new FormData();

      // Add image file if selected
      if (editBanner.imageFile) {
        formData.append("image", editBanner.imageFile);
      }

      // Add other fields
      const fields = [
        "title",
        "description",
        "priority",
        "targetType",
        "targetUrl",
        "isActive",
        "startDate",
        "endDate",
      ];
      fields.forEach((field) => {
        if (editBanner[field] !== undefined && editBanner[field] !== null) {
          formData.append(field, editBanner[field]);
        }
      });

      // Send PUT request with multipart/form-data
      const response = await axios.put(
        `http://localhost:3000/api/v1/banner/update-banner/${editBanner._id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      // Update banners array locally without fetching
      setBanners((prev) =>
        prev.map((banner) =>
          banner._id === editBanner._id ? response.data.data : banner
        )
      );

      setEditModalOpen(false);
      setEditBanner(null);
    } catch (err) {
      alert(err.response?.data?.message || err.message);
    } finally {
      setSaving(false);
    }
  };


  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="hidden md:flex font-bold bg-gray-100 p-2 rounded border border-gray-300 items-center text-center justify-around">
        <div className="w-24">Image</div>
        <div className="w-32">Title</div>
        <div className="w-64">Description</div>
        <div className="w-20">Priority</div>
        <div className="w-32">Target Type</div>
        <div className="w-50">Target Url</div>
        <div className="w-16">Active</div>
        <div className="w-28">Start Date</div>
        <div className="w-28">End Date</div>
        <div className="w-32">Actions</div>
      </div>
      {/* Banners */}
      {loading ? (
        <div className="text-center p-4 border rounded">
          {[...Array(10)].map((_, i) => (
            <div
              key={i}
              className="flex flex-col md:flex-row items-center justify-around border p-2 rounded gap-2 md:gap-0 animate-pulse"
            >
              <div className="w-24 h-16 bg-gray-300 rounded"></div>{" "}
              {/* Image */}
              <div className="w-32 h-6 bg-gray-300 rounded"></div> {/* Title */}
              <div className="w-64 h-6 bg-gray-300 rounded"></div>{" "}
              {/* Description */}
              <div className="w-20 h-6 bg-gray-300 rounded"></div>{" "}
              {/* Priority */}
              <div className="w-32 h-6 bg-gray-300 rounded"></div>{" "}
              {/* Target Type */}
              <div className="w-50 h-6 bg-gray-300 rounded"></div>{" "}
              {/* Target URL */}
              <div className="w-16 h-6 bg-gray-300 rounded"></div>{" "}
              {/* Active */}
              <div className="w-28 h-6 bg-gray-300 rounded"></div>{" "}
              {/* Start Date */}
              <div className="w-28 h-6 bg-gray-300 rounded"></div>{" "}
              {/* End Date */}
              <div className="w-32 h-6 bg-gray-300 rounded"></div>{" "}
              {/* Actions */}
            </div>
          ))}
        </div>
      ) : banners.length === 0 ? (
        <div className="text-center p-4 border rounded">No banners found</div>
      ) : (
        banners.map((banner) => (
          <div
            key={banner._id}
            className="flex flex-col md:flex-row items-center justify-around border p-2 rounded hover:bg-gray-50 gap-2 md:gap-0 text-center"
          >
            <div className="w-24 flex justify-center">
              {banner.image?.secure_url ? (
                <img
                  src={banner.image.secure_url}
                  alt={banner.title}
                  className="w-24 h-16 object-cover rounded"
                />
              ) : (
                "No Image"
              )}
            </div>
            <div className="w-32 flex justify-center">{banner.title}</div>
            <div className="w-64 flex justify-center">{banner.description}</div>
            <div className="w-20 flex justify-center">{banner.priority}</div>
            <div className="w-32 flex justify-center">{banner.targetType}</div>
            <div className="w-50 flex justify-center">
              {banner.targetUrl ? (
                <a
                  href={banner.targetUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {banner.targetUrl}
                </a>
              ) : (
                "None"
              )}
            </div>
            <div className="w-16 flex justify-center">
              {banner.isActive ? "Yes" : "No"}
            </div>
            <div className="w-28 flex justify-center">
              {banner.startDate
                ? format(parseISO(banner.startDate), "dd-MM-yyyy")
                : "-"}
            </div>
            <div className="w-28 flex justify-center">
              {banner.endDate
                ? format(parseISO(banner.endDate), "dd-MM-yyyy")
                : "-"}
            </div>
            <div className="w-32 flex justify-center gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleEditClick(banner)}
              >
                Edit
              </Button>
              <Button
                size="sm"
                variant="destructive"
                onClick={() => handleDelete(banner._id)}
              >
                Delete
              </Button>
            </div>
          </div>
        ))
      )}
      {/* Edit Modal */}
      <Dialog open={editModalOpen} onOpenChange={setEditModalOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Edit Banner</DialogTitle>
          </DialogHeader>
          {editBanner && (
            <div className="space-y-4 mt-2">
              {/* Title */}
              <div>
                <label className="block font-medium mb-1">Title</label>
                <Input
                  value={editBanner.title || ""}
                  onChange={(e) => handleEditChange("title", e.target.value)}
                />
              </div>

              {/* Description */}
              <div>
                <label className="block font-medium mb-1">Description</label>
                <Input
                  value={editBanner.description || ""}
                  onChange={(e) =>
                    handleEditChange("description", e.target.value)
                  }
                />
              </div>

              {/* Target Type */}
              <div>
                <label className="block font-medium mb-1">Target Type</label>
                <Select
                  value={editBanner.targetType || "none"}
                  onValueChange={(value) =>
                    handleEditChange("targetType", value)
                  }
                >
                  <SelectTrigger className="w-full">
                    {editBanner.targetType || "none"}
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">None</SelectItem>
                    <SelectItem value="product">Product</SelectItem>
                    <SelectItem value="category">Category</SelectItem>
                    <SelectItem value="brand">Brand</SelectItem>
                    <SelectItem value="external">External</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Target URL */}
              <div>
                <label className="block font-medium mb-1">Target URL</label>
                <Input
                  value={editBanner.targetUrl || ""}
                  onChange={(e) =>
                    handleEditChange("targetUrl", e.target.value)
                  }
                />
              </div>

              {/* Priority */}
              <div>
                <label className="block font-medium mb-1">Priority</label>
                <Input
                  type="number"
                  value={editBanner.priority || ""}
                  onChange={(e) => handleEditChange("priority", e.target.value)}
                />
              </div>

              {/* Active */}
              <div>
                <label className="block font-medium mb-1">Active</label>
                <Select
                  value={editBanner.isActive ? "true" : "false"}
                  onValueChange={(value) =>
                    handleEditChange("isActive", value === "true")
                  }
                >
                  <SelectTrigger className="w-full">
                    {editBanner.isActive ? "Yes" : "No"}
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="true">Yes</SelectItem>
                    <SelectItem value="false">No</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Start Date */}

              <div>
                <label className="block font-medium mb-1">End Date</label>
                <Input
                  type="date"
                  value={editBanner.endDate?.slice(0, 10) || ""}
                  onChange={(e) =>
                    handleEditChange("startDate", e.target.value)
                  }
                />
              </div>

              {/* End Date */}
              <div>
                <label className="block font-medium mb-1">End Date</label>
                <Input
                  type="date"
                  value={editBanner.endDate?.slice(0, 10) || ""}
                  onChange={(e) => handleEditChange("endDate", e.target.value)}
                />
              </div>

              {/* Image */}
              {/* Image Upload */}
              <div>
                <label className="block font-medium mb-1">Image</label>
                <Input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files[0];
                    if (file) {
                      handleEditChange("imageFile", file);
                      const reader = new FileReader();
                      reader.onload = (ev) => {
                        handleEditChange("imagePreview", ev.target.result);
                      };
                      reader.readAsDataURL(file);
                    }
                  }}
                />
                {editBanner.imagePreview && (
                  <img
                    src={editBanner.imagePreview}
                    alt="Preview"
                    className="mt-2 w-24 h-16 object-cover rounded"
                  />
                )}
              </div>
            </div>
          )}
          <DialogFooter className="flex justify-end gap-2 mt-4">
            <Button variant="outline" onClick={() => setEditModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleEditSave} disabled={saving}>
              {saving ? "Saving..." : "Save"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

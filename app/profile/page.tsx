"use client";

import React, { useState, useEffect } from "react";
import { useProfileStore } from "@/store/auth/profile";
import { Camera, Edit2, LogOut, ArrowLeft, Save, X } from "lucide-react";
import { useRouter } from "next/navigation";

interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  location: string;
  address: string;
  image_url: string;
  role: string;
}

export default function ProfilePage() {
  const router = useRouter();
  const { user, fetchProfile, updateProfile, logout } = useProfileStore();
  const [editMode, setEditMode] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [form, setForm] = useState({
    phone: "",
    location: "",
    address: "",
    image_url: "",
    avatar: null as File | null,
  });

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  useEffect(() => {
    if (user) {
      setForm({
        phone: user.phone || "",
        location: user.location || "",
        address: user.address || "",
        image_url: user.image_url || "",
        avatar: null,
      });
    }
  }, [user]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      const file = e.target.files[0];
      setForm((prev) => ({
        ...prev,
        avatar: file,
        image_url: URL.createObjectURL(file),
      }));
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const updateData = new FormData();
      updateData.append("phone", form.phone);
      updateData.append("location", form.location);
      updateData.append("address", form.address);
      if (form.avatar) updateData.append("avatar", form.avatar);

      await updateProfile(updateData);
      setEditMode(false);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    if (user) {
      setForm({
        phone: user.phone || "",
        location: user.location || "",
        address: user.address || "",
        image_url: user.image_url || "",
        avatar: null,
      });
    }
    setEditMode(false);
  };

  const handleLogout = async () => {
    await logout();
    router.push("/login");
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        {/* Back Button */}
        <button
          onClick={() => router.push("/")}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-8 text-sm font-medium"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </button>

        {/* Main Card */}
        <div className="bg-white rounded-2xl  border border-gray-200 overflow-hidden">
          {/* Header */}
          <div className="p-6 sm:p-8 border-b border-gray-100">
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
              {/* Avatar */}
              <div className="relative">
                <div className="w-28 h-28 rounded-full overflow-hidden border-4 border-white shadow-md bg-gray-100">
                  {form.image_url ? (
                    <img
                      src={form.image_url}
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-200">
                      <span className="text-3xl font-medium text-gray-500">
                        {user.name?.charAt(0).toUpperCase() || "U"}
                      </span>
                    </div>
                  )}
                </div>

                {editMode && (
                  <label
                    htmlFor="avatar-upload"
                    className="absolute bottom-0 right-0 bg-blue-600 text-white p-2.5 rounded-full cursor-pointer shadow-lg hover:bg-blue-700 transition"
                  >
                    <Camera className="w-4 h-4" />
                    <input
                      id="avatar-upload"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleFileChange}
                    />
                  </label>
                )}
              </div>

              {/* User Info & Actions */}
              <div className="flex-1 text-center sm:text-left">
                <div className="mb-4">
                  <h1 className="text-2xl sm:text-3xl font-semibold text-gray-700">
                    {user.name}
                  </h1>
                  <p className="text-gray-500 mt-1">{user.email}</p>
                  <span className="inline-block mt-3 px-3 py-1 bg-gray-100 text-gray-600 text-sm rounded-full">
                    {user.role}
                  </span>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-wrap gap-3 justify-center sm:justify-start">
                  {!editMode ? (
                    <button
                      onClick={() => setEditMode(true)}
                      className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
                    >
                      <Edit2 className="w-4 h-4" />
                      Edit Profile
                    </button>
                  ) : (
                    <>
                      <button
                        onClick={handleSave}
                        disabled={isSaving}
                        className="flex items-center gap-2 px-5 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-70 transition font-medium"
                      >
                        <Save className="w-4 h-4" />
                        {isSaving ? "Saving..." : "Save"}
                      </button>
                      <button
                        onClick={handleCancel}
                        className="flex items-center gap-2 px-5 py-2.5 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition font-medium"
                      >
                        <X className="w-4 h-4" />
                        Cancel
                      </button>
                    </>
                  )}

                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 px-5 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition font-medium"
                  >
                    <LogOut className="w-4 h-4" />
                    Logout
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Form Fields */}
          <div className="p-6 sm:p-8">
            <h2 className="text-xl font-semibold text-gray-700 mb-6">
              Contact Information
            </h2>

            <div className="space-y-6">
              {/* Phone & Location Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-gray-600 mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    disabled={!editMode}
                    className={`w-full px-0 py-2 bg-transparent text-gray-700 placeholder-gray-400 
                      rounded-md transition-all
                      ${editMode ? "ring-2 ring-blue-500 ring-offset-2" : ""}
                      focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
                      disabled:text-gray-600 disabled:cursor-not-allowed`}
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-600 mb-2">
                    Location / City
                  </label>
                  <input
                    type="text"
                    name="location"
                    value={form.location}
                    onChange={handleChange}
                    disabled={!editMode}
                    className={`w-full px-0 py-2 bg-transparent text-gray-700 placeholder-gray-400 
                      rounded-md transition-all
                      ${editMode ? "ring-2 ring-blue-500 ring-offset-2" : ""}
                      focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
                      disabled:text-gray-600 disabled:cursor-not-allowed`}
                  />
                </div>
              </div>

              {/* Address Full Row */}
              <div>
                <label className="block text-sm font-bold text-gray-600 mb-2">
                  Address
                </label>
                <textarea
                  name="address"
                  value={form.address}
                  onChange={handleChange}
                  disabled={!editMode}
                  rows={3}
                  className={`w-full px-0 py-2 bg-transparent text-gray-700 placeholder-gray-400 resize-none
                    rounded-md transition-all
                    ${editMode ? "ring-2 ring-blue-500 ring-offset-2" : ""}
                    focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
                    disabled:text-gray-600 disabled:cursor-not-allowed`}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 text-center text-sm text-gray-500">
          Your information is kept private and secure.
        </div>
      </div>
    </div>
  );
}

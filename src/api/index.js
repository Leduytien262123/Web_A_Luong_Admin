import { request } from "@/utils";

// S3 Upload Class
class UploadToS3 {
  constructor() {
    this.currentRequest = null;
  }

  async getUrlUpload(
    filename,
    contentEncoding = "blob",
    contentType = "image/jpeg",
  ) {
    const data = {
      key: filename,
      content_encoding: contentEncoding,
      content_type: contentType,
    };
    return request.post("/api/admin/manage/upload/s3", data);
  }

  async upload(
    filename,
    data,
    { contentEncoding = "blob", contentType = "image/jpeg" } = {},
    onProgressCallback = null,
  ) {
    try {
      const response = await this.getUrlUpload(
        filename,
        contentEncoding,
        contentType,
      );

      const url = response.data?.data?.upload_url;
      const directUrl = response.data?.data?.direct_url;

      if (!directUrl) {
        throw new Error("Failed to get upload URL");
      }

      let buf;
      switch (contentEncoding) {
        case "base64":
          const binaryString = atob(
            data.replace(/^data:image\/\w+;base64,/, ""),
          );
          const len = binaryString.length;
          const bytes = new Uint8Array(len);
          for (let i = 0; i < len; i++) {
            bytes[i] = binaryString.charCodeAt(i);
          }
          buf = bytes.buffer;
          break;
        case "blob":
          buf = data;
          break;
        default:
          throw new Error("Invalid content encoding!");
      }

      return new Promise((resolve, reject) => {
        this.currentRequest = new XMLHttpRequest();
        const xhr = this.currentRequest;

        xhr.open("PUT", url, true);
        xhr.setRequestHeader("Content-Type", contentType);

        xhr.upload.onprogress = (event) => {
          if (event.lengthComputable) {
            const progress = Math.round((event.loaded * 100) / event.total);
            if (onProgressCallback) {
              onProgressCallback(progress);
            }
          }
        };

        xhr.onload = () => {
          this.currentRequest = null;
          if (xhr.status === 200 || xhr.status === 204) {
            resolve({
              status: "success",
              data: {
                direct_url: directUrl,
                fileUrl: directUrl,
              },
            });
          } else {
            reject(new Error(`Upload failed with status: ${xhr.status}`));
          }
        };

        xhr.onerror = () => {
          this.currentRequest = null;
          reject(new Error("Upload failed"));
        };

        xhr.send(buf);
      });
    } catch (error) {
      console.error("Upload error:", error);
      throw error;
    }
  }

  abortUpload() {
    if (this.currentRequest) {
      this.currentRequest.abort();
      this.currentRequest = null;
    }
  }
}

// Create instance
const s3Uploader = new UploadToS3();

export default {
  // S3 Upload APIs
  uploadS3: (data) => request.post("/api/admin/manage/upload/s3", data),
  uploadToS3: (filename, data, options, onProgress) =>
    s3Uploader.upload(filename, data, options, onProgress),

  // Authentication APIs
  login: (data) => request.post("/api/auth/login", data, { needToken: false }),
  logout: () => request.post("/api/auth/logout", {}, { needTip: false }),
  refreshToken: () => request.post("/api/auth/refresh", {}),
  getCaptcha: () =>
    request.get("/api/auth/captcha", {
      needToken: false,
      responseType: "blob",
    }),

  // Dashboard
  getDashboardOverview: () =>
    request.get("/api/admin/manage/dashboard/overview"),
  getDashboardAnalytics: () =>
    request.get("/api/admin/manage/dashboard/analytics"),
  getDashboardAlerts: () => request.get("/api/admin/manage/dashboard/alerts"),

  // User APIs
  getUser: () => request.get("/api/user/profile"),
  updateProfile: (data) => request.put("/api/user/profile", data),
  changePassword: (data) => request.post("/api/user/change-password", data),

  // Role & Permission APIs
  getRolePermissions: () => request.get("/api/admin/roles/permissions"),
  switchCurrentRole: (role) => request.post("/api/user/switch-role", { role }),
  validateMenuPath: (path) =>
    request.get("/api/permissions/validate-menu", { params: { path } }),

  // Categories APIs
  getCategories: (params = {}) =>
    request.get("/api/admin/manage/categories", { params }),
  getCategoryById: (id) => request.get(`/api/admin/manage/category/${id}`),
  createCategory: (data) => request.post("/api/admin/manage/category", data),
  updateCategory: (id, data) =>
    request.put(`/api/admin/manage/category/${id}`, data),
  deleteCategory: (id) => request.delete(`/api/admin/manage/category/${id}`),

  // Bài viết APIs
  getArticles: (params = {}) =>
    request.get("/api/admin/manage/articles", { params }),
  getArticleById: (id) => request.get(`/api/admin/manage/article/${id}`),
  createArticle: (data) => request.post("/api/admin/manage/article", data),
  updateArticle: (id, data) =>
    request.put(`/api/admin/manage/article/${id}`, data),
  deleteArticle: (id) => request.delete(`/api/admin/manage/article/${id}`),

  // Tags APIs
  getTags: (params = {}) => request.get("/api/admin/manage/tags", { params }),
  getTagById: (id) => request.get(`/api/admin/manage/tag/${id}`),
  createTag: (data) => request.post("/api/admin/manage/tag", data),
  updateTag: (id, data) => request.put(`/api/admin/manage/tag/${id}`, data),
  deleteTag: (id) => request.delete(`/api/admin/manage/tag/${id}`),

  // User Superment APIs (Admin)
  getUsers: (params = {}) => request.get("/api/admin/super/users", { params }),
  createUser: (data) => request.post("/api/admin/super/user", data),
  getUserById: (id, data) => request.get(`/api/admin/super/user/${id}`, data),
  updateUser: (id, data) => request.put(`/api/admin/super/user/${id}`, data),
  deleteUser: (id) => request.delete(`/api/admin/super/user/${id}`),
  resetUserPassword: (id, data) =>
    request.post(`/api/admin/super/user/${id}/reset-password`, data),

  // Role Management APIs (Admin/manage)
  getAllRoles: (params = {}) =>
    request.get("/api/admin/manage/roles", { params }),
  createRole: (data) => request.post("/api/admin/manage/roles", data),
  updateRole: (id, data) => request.put(`/api/admin/manage/roles/${id}`, data),
  deleteRole: (id) => request.delete(`/api/admin/manage/roles/${id}`),
  addRoleUsers: (roleId, data) =>
    request.post(`/api/admin/manage/roles/${roleId}/users`, data),
  removeRoleUsers: (roleId, data) =>
    request.delete(`/api/admin/manage/roles/${roleId}/users`, { data }),

  getDataPageHome: () => request.get("/api/admin/manage/homepage-sections"),
  getDataPageHomeById: (id) =>
    request.get(`/api/admin/manage/homepage-section/${id}`),
  getDataPageHomeByKey: (type_key) =>
    request.get(`/api/admin/manage/homepage-section/type/${type_key}`),
  updateDataPageHome: (id, data) =>
    request.put(`/api/admin/manage/homepage-section/${id}`, data),
  createDataPageHome: (data) =>
    request.post("/api/admin/manage/homepage-section", data),
  deleteDataPageHome: (id) =>
    request.delete(`/api/admin/manage/homepage-section/${id}`),
};

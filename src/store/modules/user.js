import { defineStore } from "pinia";

export const useUserStore = defineStore("user", {
  state: () => ({
    userInfo: (function () {
      try {
        const raw = localStorage.getItem("userInfo");
        return raw ? JSON.parse(raw) : null;
      } catch (e) {
        return null;
      }
    })(),
  }),
  getters: {
    userId() {
      return this.userInfo?.id;
    },
    username() {
      return this.userInfo?.username;
    },
    nickName() {
      return this.userInfo?.full_name || this.userInfo?.nickName;
    },
    email() {
      return this.userInfo?.email;
    },
    role() {
      return this.userInfo?.role;
    },
    isActive() {
      return this.userInfo?.is_active;
    },
    currentRole() {
      return this.userInfo?.currentRole || { name: this.userInfo?.role };
    },
    roles() {
      return this.userInfo?.roles || [];
    },
    avatar() {
      return this.userInfo?.avatar || null;
    },
  },
  actions: {
    setUser(user) {
      // Xử lý format user mới từ API và lưu vào localStorage
      this.userInfo = {
        id: user.id,
        username: user.username,
        email: user.email,
        full_name: user.full_name,
        nickName: user.full_name, // Sử dụng full_name làm nickName
        role: user.role,
        is_active: user.is_active,
        created_at: user.created_at,
        updated_at: user.updated_at,
        avatar: user.avatar || null,
        // Tương thích với format cũ
        currentRole: { name: user.role },
        roles: [{ name: user.role }],
      };

      try {
        localStorage.setItem("userInfo", JSON.stringify(this.userInfo));
      } catch (e) {
        // ignore storage errors
      }
    },
    resetUser() {
      this.$reset();
      try {
        localStorage.removeItem("userInfo");
      } catch (e) {
        // ignore
      }
    },
  },
});

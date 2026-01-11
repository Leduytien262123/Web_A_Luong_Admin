import axios from 'axios'
import { request } from '@/utils'

export default {
  getMenuTree: () => request.get('/api/admin/permissions/menu-tree'),
  getButtons: ({ parentId }) => request.get(`/api/admin/permissions/buttons/${parentId}`),
  getComponents: () => axios.get(`${import.meta.env.VITE_PUBLIC_PATH}components.json`),
  addPermission: data => request.post('/api/admin/permissions', data),
  savePermission: (id, data) => request.put(`/api/admin/permissions/${id}`, data),
  deletePermission: id => request.delete(`/api/admin/permissions/${id}`),
}

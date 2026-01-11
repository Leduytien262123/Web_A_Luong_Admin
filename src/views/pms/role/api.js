import { request } from '@/utils'

export default {
  create: data => request.post('/api/admin/roles', data),
  read: (params = {}) => request.get('/api/admin/roles', { params }),
  update: data => request.put(`/api/admin/roles/${data.id}`, data),
  delete: id => request.delete(`/api/admin/roles/${id}`),

  getAllPermissionTree: () => request.get('/api/admin/permissions/tree'),
  getAllUsers: (params = {}) => request.get('/api/admin/users', { params }),
  addRoleUsers: (roleId, data) => request.post(`/api/admin/roles/${roleId}/users`, data),
  removeRoleUsers: (roleId, data) => request.delete(`/api/admin/roles/${roleId}/users`, { data }),
}

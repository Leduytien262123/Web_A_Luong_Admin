import { request } from '@/utils'

export default {
  create: data => request.post('/api/admin/users', data),
  read: (params = {}) => request.get('/api/admin/users', { params }),
  update: data => request.put(`/api/admin/users/${data.id}`, data),
  delete: id => request.delete(`/api/admin/users/${id}`),
  resetPwd: (id, data) => request.post(`/api/admin/users/${id}/reset-password`, data),

  getAllRoles: () => request.get('/api/admin/roles?enable=1'),
}

import { request } from '@/utils'

export default {
  changePassword: data => request.post('/api/user/change-password', data),
  updateProfile: data => request.put('/api/user/profile', data),
}

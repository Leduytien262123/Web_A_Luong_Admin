import { request } from '@/utils'

export default {
  toggleRole: data => request.post('/auth/role/toggle', data),
  // API đăng nhập mới
  login: data => request.post('/api/auth/login', data, { needToken: false }),
  // API lấy captcha từ server của bạn
  getCaptcha: () => request.get('/api/auth/captcha', { needToken: false, responseType: 'blob' }),
  // API lấy thông tin user sau khi đăng nhập
  getUser: () => request.get('/api/user/profile'),
}

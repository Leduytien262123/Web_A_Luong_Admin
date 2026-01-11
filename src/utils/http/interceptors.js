import { useAuthStore } from '@/store'
import { resolveResError } from './helpers'

export function setupInterceptors(axiosInstance) {
  axiosInstance.interceptors.request.use(reqResolve, reqReject)
  axiosInstance.interceptors.response.use((response) => response, resReject)
}

function reqResolve(config) {
  if (config.needToken === false) {
    return config
  }

  const authStore = useAuthStore()
  
  // Kiểm tra token validity trước khi gửi request
  if (!authStore.checkTokenValidity()) {
    // Token hết hạn hoặc không hợp lệ, chuyển đến trang login
    return Promise.reject({ 
      code: 401, 
      message: 'Token đã hết hạn, vui lòng đăng nhập lại',
      isTokenExpired: true 
    })
  }

  const { accessToken } = authStore
  if (accessToken) {
    // token: Bearer + xxx
    config.headers.Authorization = `Bearer ${accessToken}`
  }

  return config
}

function reqReject(error) {
  return Promise.reject(error)
}

async function resReject(error) {
  if (!error || !error.response) {
    // Không hiện thông báo khi lỗi mạng hoặc không có response
    return Promise.reject(error)
  }

  const { data, status, config } = error.response
  const code = data?.code ?? status

  // Xử lý token hết hạn (401 Unauthorized)
  if (status === 401) {
    const authStore = useAuthStore()
    
    // Chỉ reset và redirect nếu không phải từ logout thủ công
    const isFromLogout = sessionStorage.getItem('isFromLogout')
    if (!isFromLogout) {
      authStore.resetLoginState()
      authStore.toLogin()
    } else {
      // Xóa flag sau khi sử dụng
      sessionStorage.removeItem('isFromLogout')
    }
    
    return Promise.reject({ 
      code: 401, 
      message: 'Token đã hết hạn, vui lòng đăng nhập lại', 
      error: data 
    })
  }

  const needTip = config?.needTip !== false
  const message = resolveResError(code, data?.message ?? error.message, needTip)
  return Promise.reject({ code, message, error: error.response?.data || error.response })
}

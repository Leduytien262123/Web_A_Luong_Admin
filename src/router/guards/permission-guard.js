import api from '@/api'
import { useAuthStore, usePermissionStore, useUserStore } from '@/store'
import { getPermissions, getUserInfo } from '@/store/helper'

const WHITE_LIST = ['/login', '/404', '/403']

// Function để kiểm tra token hết hạn
function isTokenExpired(token) {
  if (!token) return true
  
  try {
    const payload = JSON.parse(atob(token.split('.')[1]))
    const currentTime = Date.now() / 1000
    return payload.exp < currentTime
  } catch (error) {
    console.error('Token validation error:', error)
    return true
  }
}

export function createPermissionGuard(router) {
  router.beforeEach(async (to) => {
    const authStore = useAuthStore()
    const token = authStore.accessToken

    /** Kiểm tra token không tồn tại hoặc hết hạn */
    if (!token || isTokenExpired(token)) {
      // Kiểm tra xem có phải từ logout không
      const isFromLogout = sessionStorage.getItem('isFromLogout') === 'true'
      
      if (isFromLogout) {
        // Xóa flag logout và không hiển thị thông báo
        sessionStorage.removeItem('isFromLogout')
      } else {
        // Hiển thị thông báo phiên hết hạn chỉ khi KHÔNG phải logout
        const isFromUrl = !token // Nếu không có token nghĩa là vào bằng URL
        const isExpired = token && isTokenExpired(token) // Token có nhưng đã hết hạn
        
        if (isFromUrl || isExpired) {
          // Xóa token hết hạn
          if (isExpired) {
            authStore.resetLoginState()
          }
          
          // Hiển thị thông báo
          setTimeout(() => {
            $message.warning('Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại', { duration: 3000 })
          }, 100)
        }
      }
      
      // Cho phép truy cập các trang trong white list
      if (WHITE_LIST.includes(to.path))
        return true
      
      // Redirect về login với query redirect
      return { 
        path: '/login', 
        query: { 
          ...to.query, 
          redirect: to.fullPath 
        } 
      }
    }

    // Trường hợp có token hợp lệ
    if (to.path === '/login') {
      // Nếu đã đăng nhập thì redirect về trang chủ
      return { path: '/' }
    }
    
    if (WHITE_LIST.includes(to.path))
      return true

    const userStore = useUserStore()
    const permissionStore = usePermissionStore()
    
    // Nếu chưa có thông tin user, load thông tin user và permissions
    if (!userStore.userInfo) {
      try {
        const [user, permissions] = await Promise.all([getUserInfo(), getPermissions()])
        userStore.setUser(user)
        permissionStore.setPermissions(permissions)
        
        const routeComponents = import.meta.glob('@/views/**/*.vue')
        permissionStore.accessRoutes.forEach((route) => {
          route.component = routeComponents[route.component] || undefined
          !router.hasRoute(route.name) && router.addRoute(route)
        })
        
        return { ...to, replace: true }
      } catch (error) {
        console.error('Failed to load user info:', error)
        // Nếu API fail, có thể token không hợp lệ
        authStore.resetLoginState()
        return { 
          path: '/login', 
          query: { 
            redirect: to.fullPath,
            error: 'session_expired'
          } 
        }
      }
    }

    const routes = router.getRoutes()
    if (routes.find(route => route.name === to.name))
      return true

    // Kiểm tra quyền truy cập menu
    try {
      const { data: hasMenu } = await api.validateMenuPath(to.path)
      return hasMenu
        ? { name: '403', query: { path: to.fullPath }, state: { from: 'permission-guard' } }
        : { name: '404', query: { path: to.fullPath } }
    } catch (error) {
      console.error('Menu validation error:', error)
      return { name: '404', query: { path: to.fullPath } }
    }
  })
}

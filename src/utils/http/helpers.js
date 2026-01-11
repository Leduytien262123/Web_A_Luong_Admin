import { useAuthStore } from '@/store'

let isConfirming = false
export function resolveResError(code, message, needTip = true) {
  switch (code) {
    case 401:
      if (isConfirming || !needTip)
        return
      isConfirming = true
      $dialog.confirm({
        title: 'Thông báo',
        type: 'info',
        content: 'Phiên đăng nhập đã hết hạn, có muốn đăng nhập lại không?',
        confirm() {
          useAuthStore().logout()
          window.$message?.success('Đã đăng xuất')
          isConfirming = false
        },
        cancel() {
          isConfirming = false
        },
      })
      return false
    case 11007:
    case 11008:
      if (isConfirming || !needTip)
        return
      isConfirming = true
      $dialog.confirm({
        title: 'Thông báo',
        type: 'info',
        content: `${message}，có muốn đăng nhập lại không?`,
        confirm() {
          useAuthStore().logout()
          window.$message?.success('Đã đăng xuất')
          isConfirming = false
        },
        cancel() {
          isConfirming = false
        },
      })
      return false
    case 403:
      message = 'Yêu cầu bị từ chối'
      break
    case 404:
      message = 'Tài nguyên hoặc giao diện yêu cầu không tồn tại'
      break
    case 500:
      message = 'Máy chủ xảy ra ngoại lệ'
      break
    default:
      message = message ?? `【${code}】: Ngoại lệ không xác định!`
      break
  }
  needTip && window.$message?.error(message)
  return message
}

export function handleUnauthorized() {
  $dialog.confirm({
    type: 'info',
    title: 'Thông báo',
    positiveText: 'Đăng nhập lại',
    content: 'Phiên đăng nhập đã hết hạn, có muốn đăng nhập lại không?',
    confirm() {
      useAuthStore().logout()
      window.$message?.success('Đã đăng xuất')
    },
  })
}

export function handleRefreshToken(error) {
  const { data, config: requestConfig } = error.response
  const { message, code } = data
  if (code === 11002 || code === 11003) {
    $dialog.confirm({
      type: 'error',
      title: 'Thông báo',
      positiveText: 'Đăng nhập lại',
      content: `${message}，có muốn đăng nhập lại không?`,
      confirm() {
        useAuthStore().logout()
        window.$message?.success('Đã đăng xuất')
      },
    })
  }
  return Promise.reject(error)
}

export function handleResponseError(error) {
  let message = ''
  if (error.code === 'ECONNABORTED' || error.message.includes('timeout')) {
    message = 'Yêu cầu bị từ chối'
  }
  else if (error.response?.status === 404) {
    message = 'Tài nguyên hoặc giao diện yêu cầu không tồn tại'
  }
  else if (error.response?.status === 500) {
    message = 'Máy chủ xảy ra ngoại lệ'
  }
  else {
    message = message ?? `【${code}】: Ngoại lệ không xác định!`
  }
  return Promise.reject(error)
}

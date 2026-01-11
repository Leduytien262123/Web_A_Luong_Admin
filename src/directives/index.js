import { withDirectives } from 'vue'
import { router } from '@/router'

const permission = {
  mounted(el, binding) {
    const currentRoute = unref(router.currentRoute)
    const btns = currentRoute.meta?.btns?.map(item => item.code) || []
    if (!btns.includes(binding.value)) {
      el.remove()
    }
  },
}

export function setupDirectives(app) {
  app.directive('permission', permission)
}

/**
 * Dùng cho h function sử dụng directive quyền tùy chỉnh
 *
 * @param {*} vnode nút ảo
 * @param {*} code mã quyền
 * @returns trả về một vnode chứa directive quyền
 *
 * Ví dụ sử dụng：withPermission(h('button', {class: 'text-red-500'}, 'Xóa'), 'user:delete')
 *
 */
export function withPermission(vnode, code) {
  return withDirectives(vnode, [[permission, code]])
}

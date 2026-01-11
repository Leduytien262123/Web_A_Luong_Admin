import path from 'node:path'
import { globSync } from 'glob'
import dynamicIcons from '../src/assets/icons/dynamic-icons.js'

/**
 * @usage Tạo icons, dùng cho unocss safelist, để hỗ trợ render động custom icon trên trang
 */
export function getIcons() {
  const icons = globSync('./src/assets/icons/isme/*.svg').map((item) => {
    const name = path.basename(item, '.svg')
    return `i-me:${name}`
  })
  icons.push(...dynamicIcons)
  return icons
}

/**
 * @usage Tạo danh sách đường dẫn file .vue, dùng để dropdown chọn đường dẫn file .vue tương ứng khi thêm menu, tránh nhập tay bị lỗi
 */
export function getPagePathes() {
  return globSync('./src/views/**/*.vue').map((item) => {
    return item.replace('./src', '/src')
  })
}

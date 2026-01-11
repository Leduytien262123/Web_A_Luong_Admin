/**********************************
 * @Author: Ronnie Zhang
 * @LastEditor: Ronnie Zhang
 * @LastEditTime: 2024/01/13 17:41:26
 * @Email: zclzone@outlook.com
 * Copyright © 2023 Ronnie Zhang | https://isme.top
 **********************************/

// Lấy CSS style của element
function getCss(element, key) {
  return element.currentStyle
    ? element.currentStyle[key]
    : window.getComputedStyle(element, null)[key]
}

// Khởi tạo kéo thả
export function initDrag(bar, box) {
  if (!bar || !box)
    return
  const params = {
    left: 0,
    top: 0,
    currentX: 0,
    currentY: 0,
    flag: false,
  }

  if (getCss(box, 'left') !== 'auto') {
    params.left = getCss(box, 'left')
  }
  if (getCss(box, 'top') !== 'auto') {
    params.top = getCss(box, 'top')
  }

  // Thiết lập con trỏ chuột của phần tử kích hoạt kéo thành biểu tượng di chuyển
  bar.style.cursor = 'move'
  // Hàm xử lý sự kiện nhấn chuột
  bar.onmousedown = function (e) {
    params.flag = true // Đặt cờ kéo thả thành true
    e.preventDefault() // Ngăn chặn sự kiện mặc định
    params.currentX = e.clientX // Tọa độ X hiện tại của chuột
    params.currentY = e.clientY // Tọa độ Y hiện tại của chuột
  }
  document.onmouseup = function () {
    params.flag = false // Đặt cờ kéo thả thành false
    if (getCss(box, 'left') !== 'auto') {
      params.left = getCss(box, 'left')
    }
    if (getCss(box, 'top') !== 'auto') {
      params.top = getCss(box, 'top')
    }
  }
  document.onmousemove = function (e) {
    if (e.target !== bar && !params.flag)
      return

    e.preventDefault() // Ngăn chặn sự kiện mặc định
    // Nếu cờ kéo thả là true
    if (params.flag) {
      const nowX = e.clientX // Tọa độ X hiện tại của chuột
      const nowY = e.clientY // Tọa độ Y hiện tại của chuột
      const disX = nowX - params.currentX // Khoảng cách di chuyển X của chuột
      const disY = nowY - params.currentY // Khoảng cách di chuyển Y của chuột

      const left = Number.parseInt(params.left) + disX // Giá trị left mới của phần tử box
      const top = Number.parseInt(params.top) + disY // Giá trị top mới của phần tử box

      box.style.left = `${left}px`
      box.style.top = `${top}px`
    }
  }
}

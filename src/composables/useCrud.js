import { cloneDeep } from 'lodash-es'
import { useForm, useModal } from '.'

const ACTION_TEXT = {
  view: 'Xem',
  edit: 'Chỉnh sửa',
  add: 'Thêm mới',
}

export function useCrud(options = {}) {
  const { name = '', initForm = {}, doCreate, doUpdate, doDelete, refresh } = options

  const modalAction = ref('')
  const modalRef = ref(null)
  const modalFormRef = ref(null)
  const modalForm = reactive({ ...initForm })

  /** Thêm mới */
  function handleAdd(item = {}) {
    modalAction.value = 'add'
    Object.assign(modalForm, initForm, item)
    modalRef.value?.handleOpen({ title: `Thêm ${name}`, okText: 'Thêm mới' })
  }

  /** Chỉnh sửa */
  function handleEdit(item = {}) {
    modalAction.value = 'edit'
    Object.assign(modalForm, initForm, item)
    modalRef.value?.handleOpen({ title: `Chỉnh sửa ${name}`, okText: 'Lưu' })
  }

  /** Xem */
  function handleView(item = {}) {
    modalAction.value = 'view'
    Object.assign(modalForm, initForm, item)
    modalRef.value?.handleOpen({ title: `Xem ${name}` })
  }

  /** Mở modal */
  function handleOpen(options = {}) {
    const { action, title, row, onOk, ...others } = options
    modalAction.value = action
    Object.assign(modalForm, initForm, row)
    modalRef.value?.handleOpen({
      title: title || `${ACTION_TEXT[action]}${name}`,
      onOk: onOk || onSave,
      ...others,
    })
  }

  /** Lưu */
  async function onSave() {
    await modalFormRef.value?.validate()
    const { api, cb, ...others } = getApiAndCallback()
    return handleSave({ api, cb, ...others })
  }

  function getApiAndCallback() {
    if (modalAction.value === 'add') {
      return {
        api: () => doCreate?.(modalForm),
        cb: () => $message.success('Thêm mới thành công'),
      }
    }
    return {
      api: () => doUpdate?.(modalForm),
      cb: () => $message.success('Lưu thành công'),
    }
  }

  /** Xóa */
  function handleDelete(id, confirmOptions) {
    if (!id && id !== 0)
      return
    const d = $dialog.warning({
      content: 'Xác nhận xóa?',
      title: 'Thông báo',
      positiveText: 'Xác nhận',
      negativeText: 'Hủy',
      async onPositiveClick() {
        try {
          d.loading = true
          const data = await doDelete(id)
          $message.success('Xóa thành công')
          d.loading = false
          refresh(data, true)
        }
        catch (error) {
          console.error(error)
          d.loading = false
        }
      },
      ...confirmOptions,
    })
  }

  return {
    modalRef,
    modalFormRef,
    modalAction,
    modalForm,
    // okLoading,
    // validation,
    handleAdd,
    handleDelete,
    handleEdit,
    handleView,
    handleOpen,
    // handleSave,
  }
}

<template>
  <div class="h-full flex flex-col overflow-hidden">
    <AppCard v-if="$slots.default" bordered bg="#fafafc dark:black" class="mb-30 min-h-60 rounded-4">
      <form class="flex justify-between p-16" @submit.prevent="handleSearch()">
        <n-scrollbar x-scrollable>
          <n-space :wrap="!expand || isExpanded" :size="[32, 16]" class="p-10">
            <slot />
          </n-space>
        </n-scrollbar>
        <div class="flex-shrink-0 p-10">
          <n-button ghost type="primary" @click="handleReset">
            <i class="i-fe:rotate-ccw mr-4" />
            Đặt lại
          </n-button>
          <n-button attr-type="submit" class="ml-20" type="primary">
            <i class="i-fe:search mr-4" />
            Tìm kiếm
          </n-button>

          <template v-if="expand">
            <n-button v-if="!isExpanded" type="primary" text @click="toggleExpand">
              <i class="i-fe:chevrons-down ml-4" />
              Mở rộng
            </n-button>
            <n-button v-else text type="primary" @click="toggleExpand">
              <i class="i-fe:chevrons-up ml-4" />
              Thu gọn
            </n-button>
          </template>
        </div>
      </form>
    </AppCard>

    <NDataTable
      :remote="remote"
      :loading="loading"
      :scroll-x="scrollX"
      :columns="columns"
      :data="tableData"
      :row-key="(row) => row[rowKey]"
      :pagination="isPagination ? pagination : false"
      flex-height
      class="flex-1"
      @update:checked-row-keys="onChecked"
      @update:page="onPageChange"
    />
  </div>
</template>

<script setup>
import { NDataTable } from 'naive-ui'
import { utils, writeFile } from 'xlsx'

const props = defineProps({
  /**
   * @remote true: phân trang backend  false： phân trang frontend
   */
  remote: {
    type: Boolean,
    default: true,
  },
  /**
   * @isPagination có phân trang hay không
   */
  isPagination: {
    type: Boolean,
    default: true,
  },
  scrollX: {
    type: Number,
    default: 1200,
  },
  rowKey: {
    type: String,
    default: 'id',
  },
  columns: {
    type: Array,
    required: true,
  },
  /** tham số trong queryBar */
  queryItems: {
    type: Object,
    default() {
      return {}
    },
  },
  /**
   * ! Quy ước về tham số đầu vào và đầu ra của API
   * Chế độ phân trang cần quy ước tham số đầu vào của API phân trang
   *    @pageSize tham số phân trang：hiển thị bao nhiêu bản ghi trên một trang, mặc định 10
   *    @pageNo   tham số phân trang：số trang, mặc định 1
   * Cần quy ước tham số đầu ra của API
   *    @pageData bắt buộc cho chế độ phân trang, chế độ không phân trang nếu không có pageData thì lấy data ở tầng trên
   *    @total    bắt buộc cho chế độ phân trang, chế độ không phân trang nếu không có total thì lấy data.length ở tầng trên
   */
  getData: {
    type: Function,
    required: true,
  },
  /** có hỗ trợ mở rộng hay không */
  expand: Boolean,
})

const emit = defineEmits(['update:queryItems', 'onChecked', 'onDataChange'])
const loading = ref(false)
const initQuery = { ...props.queryItems }
const tableData = ref([])
const pagination = reactive({
  page: 1,
  pageSize: 10,
  showSizePicker: true,
  pageSizes: [10, 20, 50, 100],
  onChange: (page) => {
    pagination.page = page
    handleQuery()
  },
  onUpdatePageSize: (pageSize) => {
    pagination.page = 1
    pagination.pageSize = pageSize
    handleQuery()
  },
  prefix({ itemCount }) {
    return `Tổng ${itemCount} dữ liệu`
  },
})

// 是否展开
const isExpanded = ref(false)

function toggleExpand() {
  isExpanded.value = !isExpanded.value
}

async function handleQuery() {
  try {
    loading.value = true
    let paginationParams = {}
    // Nếu không phải chế độ phân trang hoặc sử dụng phân trang frontend, thì không cần truyền tham số phân trang
    if (props.isPagination && props.remote) {
      paginationParams = { pageNo: pagination.page, pageSize: pagination.pageSize }
    }
    const { data } = await props.getData({
      ...props.queryItems,
      ...paginationParams,
    })
    tableData.value = data?.pageData || data
    pagination.itemCount = data.total ?? data.length
    if (pagination.itemCount && !tableData.value.length && pagination.page > 1) {
      // Nếu dữ liệu trang hiện tại trống, và tổng số bản ghi không bằng 0, thì quay về trang trước
      onPageChange(pagination.page - 1)
    }
  }
  catch (error) {
    console.error(error)
    tableData.value = []
    pagination.itemCount = 0
  }
  finally {
    emit('onDataChange', tableData.value)
    loading.value = false
  }
}

function handleSearch(keepCurrentPage = false) {
  if (keepCurrentPage || !props.remote) {
    handleQuery()
  }
  else {
    onPageChange(1)
  }
}
async function handleReset() {
  const queryItems = { ...props.queryItems }
  for (const key in queryItems) {
    queryItems[key] = null
  }
  emit('update:queryItems', { ...queryItems, ...initQuery })
  await nextTick()
  pagination.page = 1
  handleQuery()
}
function onPageChange(currentPage) {
  pagination.page = currentPage
  if (props.remote) {
    handleQuery()
  }
}
function onChecked(rowKeys) {
  if (props.columns.some(item => item.type === 'selection')) {
    emit('onChecked', rowKeys)
  }
}
function handleExport(columns = props.columns, data = tableData.value) {
  if (!data?.length)
    return $message.warning('Không có dữ liệu')
  const columnsData = columns.filter(item => !!item.title && !item.hideInExcel)
  const thKeys = columnsData.map(item => item.key)
  const thData = columnsData.map(item => item.title)
  const trData = data.map(item => thKeys.map(key => item[key]))
  const sheet = utils.aoa_to_sheet([thData, ...trData])
  const workBook = utils.book_new()
  utils.book_append_sheet(workBook, sheet, 'Báo cáo dữ liệu')
  writeFile(workBook, 'Báo cáo dữ liệu.xlsx')
}

defineExpose({
  handleSearch,
  handleReset,
  handleExport,
})
</script>

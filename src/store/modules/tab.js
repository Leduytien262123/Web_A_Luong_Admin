import { defineStore } from 'pinia'
import { useRouterStore } from './router'

export const useTabStore = defineStore('tab', {
  state: () => ({
    tabs: [],
    activeTab: '',
    reloading: false,
  }),
  getters: {
    activeIndex() {
      return this.tabs.findIndex(item => item.path === this.activeTab)
    },
  },
  actions: {
    async setActiveTab(path) {
      await nextTick()
      this.activeTab = path
    },
    setTabs(tabs) {
      this.tabs = tabs
    },
    addTab(tab = {}) {
      const findIndex = this.tabs.findIndex(item => item.path === tab.path)
      if (findIndex !== -1) {
        this.tabs.splice(findIndex, 1, tab)
      }
      else {
        this.setTabs([...this.tabs, tab])
      }
      this.setActiveTab(tab.path)
    },
    async reloadTab(path, keepAlive) {
      const findItem = this.tabs.find(item => item.path === path)
      if (!findItem)
        return
      if (keepAlive)
        findItem.keepAlive = false
      $loadingBar.start()
      this.reloading = true
      await nextTick()
      this.reloading = false
      findItem.keepAlive = !!keepAlive
      setTimeout(() => {
        document.documentElement.scrollTo({ left: 0, top: 0 })
        $loadingBar.finish()
      }, 100)
    },
    async removeTab(path) {
      this.setTabs(this.tabs.filter(tab => tab.path !== path))
      if (path === this.activeTab) {
        useRouterStore().router?.push(this.tabs[this.tabs.length - 1].path)
      }
    },
    removeOther(curPath = this.activeTab) {
      this.setTabs(this.tabs.filter(tab => tab.path === curPath))
      if (curPath !== this.activeTab) {
        useRouterStore().router?.push(this.tabs[this.tabs.length - 1].path)
      }
    },
    removeLeft(curPath) {
      const curIndex = this.tabs.findIndex(item => item.path === curPath)
      const filterTabs = this.tabs.filter((item, index) => index >= curIndex)
      this.setTabs(filterTabs)
      if (!filterTabs.find(item => item.path === this.activeTab)) {
        useRouterStore().router?.push(filterTabs[filterTabs.length - 1].path)
      }
    },
    removeRight(curPath) {
      const curIndex = this.tabs.findIndex(item => item.path === curPath)
      const filterTabs = this.tabs.filter((item, index) => index <= curIndex)
      this.setTabs(filterTabs)
      if (!filterTabs.find(item => item.path === this.activeTab.value)) {
        useRouterStore().router?.push(filterTabs[filterTabs.length - 1].path)
      }
    },
    resetTabs() {
      this.$reset()
    },
    async addTab(item) {
      this.tabs.push(item)
      await nextTick() // Cập nhật DOM thanh tab trước khi thiết lập kích hoạt, để thanh tab định vị đến tab mới được thêm có hiệu lực
      this.setActiveTab(item.path)
    },
    resetTab(route) {
      this.tabs = [{ ...route }]
      // Cập nhật key có thể làm keepAlive mất hiệu lực
      this.reloadKey = +new Date()
      this.setActiveTab(route.path)
    },
  },
  persist: {
    pick: ['tabs'],
    storage: sessionStorage,
  },
})

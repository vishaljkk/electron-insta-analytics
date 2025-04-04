import { ipcRenderer } from 'electron'

export const tabsAPI = {
  new: () => ipcRenderer.invoke('tabs:new'),
  newScrapper: (defaultUrl) => ipcRenderer.invoke('tabs:newScrapper', defaultUrl),
  close: (id: number) => ipcRenderer.invoke('tabs:close', id),
  select: (id: number) => ipcRenderer.invoke('tabs:select', id),
  getAllTabIds: () => ipcRenderer.invoke('tabs:getAllTabIds'),
  getSelectedTabId: () => ipcRenderer.invoke('tabs:getSelectedTabId'),
  reorder: (tabIds: number[]) => ipcRenderer.invoke('tabs:reorder', tabIds),
}

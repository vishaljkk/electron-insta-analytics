import { useBoundStore } from '@renderer/store/useBoundStore'
import { AnimatePresence, Reorder } from 'framer-motion'
import { Tab } from './Tab'
import { useEffect } from 'react'

export default function TabBar() {
  const tabs = useBoundStore((state) => state.tabs.items)
  const setSelectedTab = useBoundStore((state) => state.tabs.setSelectedTab)
  const remove = useBoundStore((state) => state.tabs.remove)
  const setTabs = useBoundStore((state) => state.tabs.reorder)
  const selectedTab = useBoundStore((state) => state.tabs.selectedTabId)
  const selectedTabIndex = useBoundStore((state) => state.tabs.selectedTabIndex)
  const scrappedData = useBoundStore((state) => state.tabs.scrappedData)

  useEffect(() => {
    const socket = new WebSocket('ws://localhost:3333')
    socket.onopen = () => {
      if (!scrappedData) return;
      const payload = {
        type: 'test-connection',
        message: scrappedData
      }
      socket.send(JSON.stringify(payload))
    }
    socket.onerror = (err) => {
      console.error('[WebSocket] Error:', err)
    }
    socket.onclose = () => {
      console.log('[WebSocket] Closed')
    }
    return () => {
      socket.close()
    }
  }, [scrappedData])

  return (
    <div className="flex flex-row w-full flex-grow">
      <Reorder.Group
        as="ul"
        axis="x"
        onReorder={setTabs}
        className="flex-grow flex-nowrap flex justify-start items-center pr-[10px] w-[300px]"
        values={tabs}
      >
        <AnimatePresence initial={false}>

          {tabs.length > 0 ? <Tab
            key={tabs[0].id}
            item={tabs[0]}
            isSelected={selectedTab === tabs[0].id}
            onClick={() => setSelectedTab(tabs[0])}
            onRemove={() => remove(tabs[0])}
            showSeparator={0 !== selectedTabIndex - 1 && tabs.length > 2}
          /> : null}
          {tabs.map((item, index) => (
            item.name === "Insta Tab" ?
              <Tab
                key={item.id}
                item={item}
                isSelected={selectedTab === item.id}
                onClick={() => setSelectedTab(item)}
                onRemove={() => remove(item)}
                showSeparator={index !== selectedTabIndex - 1 && tabs.length > 2}
              /> : null
          ))}
        </AnimatePresence>
      </Reorder.Group>
    </div>
  )
}


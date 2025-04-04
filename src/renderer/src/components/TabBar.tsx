import { useBoundStore } from '@renderer/store/useBoundStore'
import { AnimatePresence, Reorder } from 'framer-motion'
//import { AnimatePresence, motion, Reorder } from 'framer-motion'
//import { MdAdd } from 'react-icons/md'
import { Tab } from './Tab'

export default function TabBar() {
  const tabs = useBoundStore((state) => state.tabs.items)
  const setSelectedTab = useBoundStore((state) => state.tabs.setSelectedTab)
  const remove = useBoundStore((state) => state.tabs.remove)
  const setTabs = useBoundStore((state) => state.tabs.reorder)
  const selectedTab = useBoundStore((state) => state.tabs.selectedTabId)
  const selectedTabIndex = useBoundStore((state) => state.tabs.selectedTabIndex)
  
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
            />: null       
          ))}
          {/* <motion.button
            className="titlebar-button flex items-center justify-center hover:bg-white/5
              rounded-full h-6 w-6  transition-all duration-300 ml-2"
            onClick={add}
            whileTap={{ scale: 0.9 }}
          >
            <MdAdd className="opacity-55 hover:opacity-100 transition-all text-white duration-300" />
          </motion.button> */}
        </AnimatePresence>
      </Reorder.Group>
    </div>
  )
}


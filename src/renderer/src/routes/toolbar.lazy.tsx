import { useBoundStore } from '@renderer/store/useBoundStore'
import TabBar from '@renderer/components/TabBar'
import { useToolbarInitialization } from '@renderer/hooks/useToolbarInitialization'
import { createLazyFileRoute } from '@tanstack/react-router'
// import { motion } from 'framer-motion'
// import { MdAdd } from 'react-icons/md'
import { useEffect, useRef } from 'react'

export const Route = createLazyFileRoute('/toolbar')({
  component: Toolbar
})

// warning: any child of this component cannot use anything outside of the tab-slice state.
function Toolbar() {
  const isInitialized = useToolbarInitialization()
  const addScrapper = useBoundStore((state) => state.tabs.addScrapper)
  const init = useRef<boolean>(false)

  useEffect(() => {
    if(init.current === false) {
      addScrapper()
      init.current = true
    }
  }, [])

  const PlatformToolbar = () => {
    return (
      <div className="flex flex-row items-start w-full overflow-hidden bg-stone-800">
        <div className="pl-[80px] w-full h-full">{isInitialized && <div className='flex'>
          {/* <motion.button
            className="titlebar-button flex items-center justify-center hover:bg-white/5
              rounded-full h-6 w-6  transition-all duration-300 ml-2"
            onClick={addScrapper}
            whileTap={{ scale: 0.9 }}
          >
            <MdAdd className="opacity-55 hover:opacity-100 transition-all text-white duration-300" />
          </motion.button> */}
          <TabBar />
          </div>}</div>
      </div>
    )
  }

  // Add 'titlebar-button' class to prevent window dragging on toolbar.
  return (
    <div className="h-svh w-full flex flex-row titlebar bg-border justify-end">
      <PlatformToolbar />
    </div>
  )
}

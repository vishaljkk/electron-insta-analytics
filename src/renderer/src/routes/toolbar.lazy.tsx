import { useBoundStore } from '@renderer/store/useBoundStore'
import TabBar from '@renderer/components/TabBar'
import { useToolbarInitialization } from '@renderer/hooks/useToolbarInitialization'
import { createLazyFileRoute } from '@tanstack/react-router'
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
    if (init.current === false) {
      console.log('adding scrapper ...')
      addScrapper()
      init.current = true
    }
  }, [])

  const PlatformToolbar = () => {
    return (
      <div className="flex flex-row items-start w-full overflow-hidden bg-stone-800">
        <div className="pl-[80px] w-full h-full">{isInitialized && <TabBar />}</div>
      </div>
    )
  }

  return (
    <div className="h-svh w-full flex flex-row titlebar bg-border justify-end">
      <PlatformToolbar />
    </div>
  )
}

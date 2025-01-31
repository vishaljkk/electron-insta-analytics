import { TabInfo } from '@renderer/types/tabs'
import { cn } from '@renderer/utils/cn'
import { motion, Reorder } from 'framer-motion'
import { VscClose } from 'react-icons/vsc'

interface Props {
  item: TabInfo
  isSelected: boolean
  showSeparator: boolean
  onClick: () => void
  onRemove: () => void
}

export const Tab = ({ item, onClick, onRemove, isSelected, showSeparator }: Props) => {
  return (
    <Reorder.Item
      value={item}
      id={item.id}
      initial={{
        opacity: 1,
        y: 30
      }}
      animate={{
        opacity: 1,
        style: {
          backgroundColor: isSelected ? 'hsl(var(--primary))' : 'hsl(var(--background))'
        },
        y: 0,
        transition: { duration: 0.1, ease: 'easeInOut' }
      }}
      exit={{ opacity: 0, y: 20, transition: { duration: 0.15 } }}
      whileDrag={{
        transition: { ease: 'easeInOut' }
      }}
      className={cn(
        isSelected ? 'selected bg-yellow-400' : '',
        'titlebar-button max-w-52',
        ` w-full pl-4 relative cursor-pointer h-svh flex justify-between items-center
        flex-1 overflow-hidden select-none `
      )}
      onPointerDown={onClick}
    >
      <motion.span
        // This is a hack to make the text fade out nicely when close to edge.
        style={{
          maskImage: 'linear-gradient(to left, transparent 30px, #fff 60px)',
          WebkitMaskImage: 'linear-gradient(to left, transparent 30px, #fff 60px)'
        }}
        className={cn(
          `text-xs text-center flex-shrink flex-grow leading-[18px] whitespace-nowrap block
          min-w-0 pr-[30px]`,
          isSelected ? 'text-primary-foreground ' : 'text-white'
        )}
        layout="position"
      >{`${item.name} ${item.id}`}</motion.span>
      <motion.div
        layout
        className="absolute top-0 bottom-0 right-[0px] flex align-center items-center justify-end
          flex-shrink-0 pr-2"
      >
        <motion.button
          onPointerDown={(event) => {
            event.stopPropagation()
            onRemove()
          }}
          initial={false}
          animate={{
            backgroundColor: 'hsl(var(--transparent))'
          }}
        >
          <VscClose
            color={isSelected ? 'black' : 'white'}
            className={cn(
              ' rounded-full transition-all duration-300',
              isSelected ? 'hover:bg-black/20' : 'hover:bg-white/20'
            )}
          />
        </motion.button>
        <div
          className={cn(
            isSelected || !showSeparator ? 'invisible' : 'visible',
            'bg-white/20 w-[1.5px] h-[15px] ml-2 '
          )}
        />
      </motion.div>
    </Reorder.Item>
  )
}

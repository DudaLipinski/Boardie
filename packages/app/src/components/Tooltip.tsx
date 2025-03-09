import * as RadixTooltip from '@radix-ui/react-tooltip'

type Props = {
  content: React.ReactNode
  children: React.ReactNode
}
export const Tooltip = ({ content, children }: Props) => {
  return (
    <RadixTooltip.Provider delayDuration={0}>
      <RadixTooltip.Root>
        <RadixTooltip.Trigger>{children}</RadixTooltip.Trigger>
        <RadixTooltip.Portal>
          <RadixTooltip.Content className="bg-slate-600 p-1 rounded-md">
            {content}
            <RadixTooltip.Arrow className="fill-slate-600 -mt-[1px]" />
          </RadixTooltip.Content>
        </RadixTooltip.Portal>
      </RadixTooltip.Root>
    </RadixTooltip.Provider>
  )
}

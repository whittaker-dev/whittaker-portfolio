"use client";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
  type Align,
  type Side,
} from "@/components/animate-ui/base/popover";

interface BasePopoverDemoProps {
  side?: Side;
  sideOffset?: number;
  align?: Align;
  alignOffset?: number;
  openOnHover?: boolean;
  delay?: number;
  closeDelay?: number;
  trigger?: React.ReactNode;
  content: React.ReactNode;
}

const UserPopover = ({
  side,
  sideOffset,
  align,
  alignOffset,
  openOnHover,
  delay,
  closeDelay,
  trigger,
  content,
}: BasePopoverDemoProps) => {
  return (
    <Popover openOnHover={openOnHover} delay={delay} closeDelay={closeDelay}>
      <PopoverTrigger render={<button>{trigger}</button>} />
      <PopoverContent
        className="w-80"
        side={side}
        sideOffset={sideOffset}
        align={align}
        alignOffset={alignOffset}
      >
        {content}
      </PopoverContent>
    </Popover>
  );
};

export default UserPopover;

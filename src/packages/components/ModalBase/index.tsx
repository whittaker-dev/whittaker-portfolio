import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/animate-ui/radix/dialog";
import React from "react";
import { twMerge } from "tailwind-merge";

type Props = {
  title?: React.ReactNode;
  description?: React.ReactNode;
  content: React.ReactNode;
  footer?: React.ReactNode;
  isOpen: boolean;
  onClose: () => void;
  contentClassName?: string;
  bodyClassName?: string;
  footerClassName?: string;
  headerClassName?: string;
  titleClassName?: string;
};

const ModalBase = ({
  title,
  description,
  content,
  footer,
  isOpen,
  onClose,
  contentClassName,
  bodyClassName,
  footerClassName,
  headerClassName,
  titleClassName,
}: Props) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className={twMerge("sm:max-w-[425px]", contentClassName)}
        transition={{ type: "spring", stiffness: 200, damping: 25 }}
        from="right"
      >
        <DialogHeader className={twMerge(headerClassName)}>
          {title && (
            <DialogTitle className={twMerge(titleClassName)}>
              {title}
            </DialogTitle>
          )}
          {description && <DialogDescription>{description}</DialogDescription>}
        </DialogHeader>

        <div
          className={twMerge(
            "grid gap-4 py-4 max-h-[80vh] overflow-auto",
            bodyClassName,
          )}
        >
          {content}
        </div>

        {footer && (
          <DialogFooter className={twMerge(footerClassName)}>
            {footer}
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ModalBase;

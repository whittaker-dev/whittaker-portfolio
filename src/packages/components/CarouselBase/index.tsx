import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import React from "react";
import { twMerge } from "tailwind-merge";

export interface ICarouselItem {
  id: string;
  content: React.ReactNode;
}
type Props = {
  items: ICarouselItem[];
  rootClassName?: string;
  contentClassName?: string;
  btnPrevClassName?: string;
  btnNextClassName?: string;
};

const CarouselBase = React.memo(
  ({
    items,
    btnNextClassName,
    btnPrevClassName,
    contentClassName,
    rootClassName,
  }: Props) => {
    return (
      <Carousel className={twMerge("w-full", rootClassName)}>
        <CarouselContent className={twMerge(contentClassName)}>
          {items.map((item, index) => (
            <CarouselItem key={index}>{item.content}</CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious
          className={twMerge("dark:text-white cursor-grab", btnPrevClassName)}
        />
        <CarouselNext
          className={twMerge("dark:text-white cursor-grab", btnNextClassName)}
        />
      </Carousel>
    );
  },
);
CarouselBase.displayName = "CarouselBase";
export default CarouselBase;

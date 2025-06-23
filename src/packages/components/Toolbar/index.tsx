"use client";
import React, { useEffect } from "react";
import { twMerge } from "tailwind-merge";
import { motion } from "motion/react";
import Image from "next/image";
import { Icon } from "@iconify/react";
const Toolbar = () => {
  const [isShow, setIsShow] = React.useState(false);

  useEffect(() => {
    window.addEventListener("scroll", () => {
      if (window.scrollY > 100) {
        setIsShow(true);
      } else {
        setIsShow(false);
      }
    });
  }, [isShow]);
  return (
    <motion.div
      // whileHover={{ width: "50%" }}
      className={twMerge(
        "fixed -bottom-20 left-1/2 -translate-x-1/2 flex items-center justify-between gap-4 py-2 px-4 bg-white border border-green-primary rounded-lg cursor-pointer group transition-all duration-500 ease-in-out w-[50%]",
        isShow && "bottom-4",
      )}
    >
      <motion.div className="relative size-8 rounded-full overflow-hidden cursor-pointer">
        <Image
          src={"/assets/images/avatar.jpeg"}
          alt=""
          fill
          className="object-cover"
        />
      </motion.div>
      <div className="flex items-center justify-center gap-4 group-hover:scale-0 hidden transition-all duration-300 ease-in-out">
        <div className="size-2 bg-green-primary rounded-full"></div>
        <div className="size-2 bg-green-primary rounded-full"></div>
        <div className="size-2 bg-green-primary rounded-full"></div>
      </div>
      <div className="scale-100 group-hover:flex flex items-center justify-center gap-4 group-hover:scale-100 transition-all duration-300 ease-in-out">
        <Icon
          icon="majesticons:article"
          className="size-4 md:size-6 text-green-primary"
        />
        <Icon
          icon="tabler:file-cv-filled"
          className="size-4 md:size-6 text-green-primary"
        />
      </div>
      <Icon
        icon="iconamoon:settings-fill"
        className="size-6 animate-spin text-green-primary"
      />
    </motion.div>
  );
};

export default Toolbar;

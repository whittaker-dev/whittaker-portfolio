"use client";
import { IUserSettings, userSettings } from "@/packages/database";
import { Icon } from "@iconify/react";
import { motion, useMotionValue, useSpring, useTransform } from "motion/react";
import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";
import { twMerge } from "tailwind-merge";
const Toolbar = () => {
  const [isShow, setIsShow] = useState(false);

  useEffect(() => {
    window.addEventListener("scroll", () => {
      if (window.scrollY > 100) {
        setIsShow(true);
      } else {
        setIsShow(false);
      }
    });
  }, [isShow]);

  const mouseX = useMotionValue(Number.POSITIVE_INFINITY);

  function DockIcon({ menu }: { menu: IUserSettings }) {
    const ref = useRef<HTMLDivElement>(null);

    const distance = useTransform(mouseX, (val) => {
      const bounds = ref.current?.getBoundingClientRect() ?? { x: 0, width: 0 };
      return val - bounds.x - bounds.width / 2;
    });

    const widthSync = useTransform(distance, [-80, 0, 80], [40, 70, 40]);
    const width = useSpring(widthSync, {
      mass: 0.1,
      stiffness: 150,
      damping: 12,
    });

    return (
      <motion.div
        ref={ref}
        style={{ width }}
        className="aspect-square rounded-lg flex items-center justify-center cursor-pointer relative group"
        whileHover={{ y: -10 }}
        whileTap={{ scale: 0.95 }}
      >
        <div
          className={`w-full h-full rounded-lg flex items-center justify-center text-white relative overflow-hidden`}
        >
          <Icon icon={menu.icon} className="size-4 md:size-6 text-white z-10" />
          <div className="absolute bg-green-primary w-full h-full rounded-lg" />
        </div>

        {/* Tooltip */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileHover={{ opacity: 1, y: -5 }}
          className="absolute -top-12 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded whitespace-nowrap pointer-events-none"
        >
          {menu.title}
        </motion.div>
      </motion.div>
    );
  }

  return (
    <motion.div
      className={twMerge(
        "hidden md:flex fixed -bottom-20 left-1/2 -translate-x-1/2 items-center justify-between gap-4 py-2 px-4 bg-white border border-green-primary rounded-lg cursor-pointer group transition-all duration-500 ease-in-out w-[50%] h-14",
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
      <motion.div
        onMouseMove={(e) => mouseX.set(e.pageX)}
        onMouseLeave={() => mouseX.set(Number.POSITIVE_INFINITY)}
        className="scale-100 flex items-center justify-center gap-2 group-hover:scale-100 transition-all duration-300 ease-in-out"
      >
        {userSettings.map((menu) => (
          <DockIcon key={menu.id} menu={menu} />
        ))}
      </motion.div>
      <div className="flex items-center justify-center">
        <Icon
          icon="iconamoon:settings-fill"
          className="size-6 animate-spin text-green-primary"
        />
      </div>
    </motion.div>
  );
};

export default Toolbar;

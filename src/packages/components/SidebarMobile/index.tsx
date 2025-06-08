import React from "react";
import { motion } from "motion/react";
import { Icon } from "@iconify/react";
import { twMerge } from "tailwind-merge";
import Background from "../Background";
import { useTheme } from "@/providers/Theme";
import Image from "next/image";
import { IMenu } from "../Header";

const SidebarMobile = React.memo(
  ({
    isOpen,
    handleClose,
    menus,
  }: {
    isOpen: boolean;
    handleClose: () => void;
    menus: IMenu[];
  }) => {
    const { theme } = useTheme();
    return (
      <motion.div
        className={twMerge(
          "fixed top-0 left-0 w-full h-full bg-white z-50 transition-transform duration-500 ease-in-out px-4 block md:hidden",
          isOpen ? "translate-x-0" : "translate-x-[1000px]",
        )}
      >
        <Background />
        <div className="flex items-center justify-between">
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            whileTap={{ scale: 0.9 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
            className="w-16 md:w-14 h-16 md:h-14 relative rounded-full overflow-hidden cursor-pointer"
          >
            {theme === "dark" ? (
              <Image src={"/assets/images/logo_white.png"} fill alt={"logo"} />
            ) : (
              <Image src={"/assets/images/logo.png"} fill alt={"logo"} />
            )}
          </motion.div>
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            whileTap={{ scale: 0.9 }}
            whileHover={{ scale: 1.1 }}
            transition={{ duration: 0.6, ease: "easeInOut" }}
            onClick={handleClose}
          >
            <Icon
              icon="lucide:x"
              className="size-6 cursor-pointer dark:text-white"
            />
          </motion.div>
        </div>
        <div className="flex items-center flex-col justify-start gap-10 mt-10 h-full font-boldonse">
          {menus.map((menu, index) => (
            <motion.a
              key={index}
              href={menu.href}
              className={twMerge(
                "text-xl font-medium text-blue-primary hover:underline dark:text-white block",
              )}
              whileTap={{ scale: 0.9 }}
              initial={{ x: -200, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              transition={{
                duration: 0.5,
                delay: index * 0.2,
                ease: "easeInOut",
              }}
              whileHover={{
                scale: 1.2,
                transition: { duration: 0.1, delay: 0.2, ease: "linear" },
              }}
              onClick={handleClose}
            >
              {menu.title}
            </motion.a>
          ))}
        </div>
      </motion.div>
    );
  },
);
SidebarMobile.displayName = "SidebarMobile";
export default SidebarMobile;

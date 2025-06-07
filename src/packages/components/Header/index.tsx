"use client";
import { useTheme } from "@/providers/Theme";
import { Icon } from "@iconify/react";
import { motion } from "framer-motion";
import Image from "next/image";
import { useEffect, useState } from "react";
import { twMerge } from "tailwind-merge";
import SidebarMobile from "../SidebarMobile";
import { useResponsiveDetect } from "@/packages/hooks";

export interface IMenu {
  title: string;
  href: string;
}
export const menus: IMenu[] = [
  {
    title: "Overview",
    href: "#overview",
  },
  {
    title: "Stack",
    href: "#stack",
  },
  {
    title: "Experience",
    href: "#experience",
  },
  {
    title: "Projects",
    href: "#projects",
  },
  {
    title: "Testimonials",
    href: "#testimonials",
  },
  {
    title: "Certificates",
    href: "#certificates",
  },
  {
    title: "Contact",
    href: "#contact",
  },
];
const Header = () => {
  const { theme } = useTheme();
  const { isMobile } = useResponsiveDetect();
  const [isShowSidebar, setIsShowSidebar] = useState(false);
  const toggleShowSidebar = () => {
    setIsShowSidebar(!isShowSidebar);
  };

  useEffect(() => {
    console.log("isMobile", isMobile);
    if (!isMobile) {
      setIsShowSidebar(false);
    }
  }, [isMobile]);

  return (
    <div className="w-full flex items-center justify-between md:justify-center5 md:py-5 gap-10">
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        whileInView={{ scale: 1, opacity: 1 }}
        whileTap={{ scale: 0.9 }}
        whileHover={{ scale: 2, animation: "ease-out" }}
        className="w-16 md:w-14 h-16 md:h-14 relative rounded-full overflow-hidden cursor-pointer"
      >
        {theme === "dark" ? (
          <Image src={"/images/logo_white.png"} fill alt={"logo"} />
        ) : (
          <Image src={"/images/logo.png"} fill alt={"logo"} />
        )}
      </motion.div>
      <div className="items-center justify-end gap-6 hidden md:flex">
        {menus.map((menu, index) => (
          <motion.a
            key={menu.title}
            href={menu.href}
            className={twMerge(
              "text-sm font-medium text-blue-primary hover:underline dark:text-white",
            )}
            whileTap={{ scale: 0.9 }}
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            {menu.title}
          </motion.a>
        ))}
      </div>

      <Icon
        icon="solar:hamburger-menu-broken"
        className="size-8 cursor-pointer text-blue-primary block md:hidden dark:text-white"
        onClick={toggleShowSidebar}
      />

      <SidebarMobile isOpen={isShowSidebar} handleClose={toggleShowSidebar} />
    </div>
  );
};

export default Header;

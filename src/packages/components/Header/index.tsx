"use client";
import { useTheme } from "@/providers/Theme";
import { Icon } from "@iconify/react";
import { motion } from "motion/react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { twMerge } from "tailwind-merge";
import SidebarMobile from "../SidebarMobile";
import { useResponsiveDetect } from "@/packages/hooks";
import { t } from "i18next";

export interface IMenu {
  title: string;
  href: string;
}

const Header = () => {
  const { theme } = useTheme();
  const { isMobile } = useResponsiveDetect();
  const [isShowSidebar, setIsShowSidebar] = useState(false);
  const menus: IMenu[] = [
    {
      title: t("overview"),
      href: "#overview",
    },
    {
      title: t("stack"),
      href: "#stack",
    },
    {
      title: t("experience"),
      href: "#experience",
    },
    {
      title: t("projects"),
      href: "#projects",
    },
    {
      title: t("testimonials"),
      href: "#testimonials",
    },
    {
      title: t("certificates"),
      href: "#certificates",
    },
    {
      title: t("contact"),
      href: "#contact",
    },
  ];
  const toggleShowSidebar = () => {
    setIsShowSidebar(!isShowSidebar);
  };

  useEffect(() => {
    if (!isMobile) {
      setIsShowSidebar(false);
    }
  }, [isMobile]);

  return (
    <div className="w-full flex items-center justify-between md:justify-center5 md:py-2 gap-10">
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
            key={index}
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

      <SidebarMobile
        isOpen={isShowSidebar}
        handleClose={toggleShowSidebar}
        menus={menus}
      />
    </div>
  );
};

export default Header;

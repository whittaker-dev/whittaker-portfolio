"use client";
import {
  Accordion,
  AccordionButton,
  AccordionItem,
  AccordionPanel,
} from "@/components/animate-ui/headless/accordion";
import { useResponsiveDetect } from "@/packages/hooks";
import { useTheme } from "@/providers/Theme";
import { Icon } from "@iconify/react";
import { t } from "i18next";
import { motion } from "motion/react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { twMerge } from "tailwind-merge";
import SidebarMobile from "../SidebarMobile";
import UserPopover from "../UserPopover";
import { userSettings } from "@/packages/database";

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
      href: "#about",
    },
    {
      title: t("stack"),
      href: "#technology-stack",
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
    <div className="fixed top-0 left-0 right-0 z-50 w-full bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-700 shadow-md">
      <div className="my-0 mx-auto flex items-center justify-between lg:justify-center md:py-2 pr-2.5 md:pr-0 gap-10 max-w-[100%] md:max-w-[80%] xl:max-w-[65%]">
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          whileTap={{ scale: 0.9 }}
          whileHover={{ scale: 2, animation: "ease-out" }}
          className="w-16 md:w-14 h-16 md:h-14 relative rounded-full overflow-hidden cursor-pointer"
        >
          {theme === "dark" ? (
            <Image src={"/assets/images/logo_white.png"} fill alt={"logo"} />
          ) : (
            <Image src={"/assets/images/logo.png"} fill alt={"logo"} />
          )}
        </motion.div>
        <div className="items-center justify-end gap-6 hidden lg:flex flex-1">
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

        <UserPopover
          align={isMobile ? "center" : "end"}
          trigger={
            <motion.div className="relative size-10 rounded-full overflow-hidden cursor-pointer">
              <Image
                src={"/assets/images/avatar.jpeg"}
                alt=""
                fill
                className="object-cover"
              />
            </motion.div>
          }
          content={
            <div className="">
              <div className="space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <h1 className="text-sm md:text-base font-black text-dark-primary">
                    Minh Tai
                  </h1>
                  <Icon
                    icon="iconamoon:settings-fill"
                    className="size-6 animate-spin text-green-primary"
                  />
                </div>
                <p className="text-xs md:text-sm font-medium text-gray-500">
                  minhtai250501@gmail.com
                </p>
              </div>
              <div className="w-full h-[1px] bg-gray-300 mt-2.5 md:mt-4"></div>
              <Accordion className="w-full">
                <AccordionItem className="border-0" defaultOpen>
                  <AccordionButton
                    className="cursor-pointer hover:no-underline border-0 pb-0 flex items-center justify-between"
                    chevronClassName="text-green-primary"
                  >
                    <h1 className="text-sm md:text-sm font-black text-green-primary">
                      {t("explore_more")}
                    </h1>
                  </AccordionButton>
                  <AccordionPanel className="space-y-4 mt-4 pb-0">
                    {userSettings.map((setting) => (
                      <a
                        key={setting.id}
                        href="#"
                        className="text-xs md:text-sm font-semibold text-dark-primary hover:underline flex items-center justify-start gap-2 hover:text-green-primary"
                      >
                        <Icon
                          icon={setting.icon}
                          className="size-4 md:size-6 text-green-primary"
                        />
                        {t(setting.title)}
                      </a>
                    ))}
                  </AccordionPanel>
                </AccordionItem>
              </Accordion>
            </div>
          }
        />

        <Icon
          icon="solar:hamburger-menu-broken"
          className="size-8 cursor-pointer text-blue-primary block lg:hidden dark:text-white"
          onClick={toggleShowSidebar}
        />

        <SidebarMobile
          isOpen={isShowSidebar}
          handleClose={toggleShowSidebar}
          menus={menus}
        />
      </div>
    </div>
  );
};

export default Header;

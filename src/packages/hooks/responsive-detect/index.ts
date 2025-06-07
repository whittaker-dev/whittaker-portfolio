import { useMediaQuery } from "react-responsive";

export const useResponsiveDetect = () => {
  const isDesktopOrLaptop = useMediaQuery({
    query: "(min-width: 1224px)",
  });
  const isBigScreen = useMediaQuery({ query: "(min-width: 1824px)" });
  const isTabletOrMobile = useMediaQuery({ query: "(max-width: 1224px)" });
  const isMobile = useMediaQuery({ query: "(max-width: 768px)" });

  return {
    isMobile,
    isTabletOrMobile,
    isDesktopOrLaptop,
    isBigScreen,
  };
};

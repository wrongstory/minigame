import { useEffect, useState } from "react";

export const useIsMobile = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => {
      const vendor =
        (navigator as Navigator & { vendor?: string }).vendor ?? "";
      const opera = (window as Window & { opera?: unknown }).opera ?? "";
      const userAgent = navigator.userAgent + vendor + opera;

      setIsMobile(/android|iphone|ipad|mobile/i.test(userAgent));
    };

    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  return isMobile;
};

import { useEffect, useState } from "react";
import type { Browsers } from "~types/config";

function useBrowserName() {
  const [browserName, setBrowserName] = useState<Browsers>("chrome");

  useEffect(() => {
    const userAgent = window.navigator.userAgent;
    switch (true) {
      case /Edg/i.test(userAgent) || /Edge/i.test(userAgent):
        setBrowserName("edge");
        break;
      case /Safari/i.test(userAgent) && !/Chrome/i.test(userAgent):
        setBrowserName("safari");
        break;
      case /Firefox/i.test(userAgent):
        setBrowserName("firefox");
        break;
      // case /Chrome/i.test(userAgent):
      //   setBrowserName("chrome");
      //   break;
      // default:
      //   setBrowserName("chrome");
      //   break;
    }
  }, []);

  return browserName;
}

export default useBrowserName;

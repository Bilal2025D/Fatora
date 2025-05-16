
import * as React from "react"

// Define breakpoints for different device types
const MOBILE_BREAKPOINT = 768
const TABLET_BREAKPOINT = 1024

export function useDeviceDetect() {
  const [deviceType, setDeviceType] = React.useState<"mobile" | "tablet" | "desktop" | undefined>(undefined)

  React.useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth
      if (width < MOBILE_BREAKPOINT) {
        setDeviceType("mobile")
      } else if (width >= MOBILE_BREAKPOINT && width < TABLET_BREAKPOINT) {
        setDeviceType("tablet")
      } else {
        setDeviceType("desktop")
      }
    }

    // Set initial value
    handleResize()
    
    // Add event listener
    window.addEventListener("resize", handleResize)
    
    // Clean up
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  return {
    isMobile: deviceType === "mobile",
    isTablet: deviceType === "tablet",
    isDesktop: deviceType === "desktop",
    deviceType
  }
}

export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(undefined)

  React.useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`)
    const onChange = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    }
    mql.addEventListener("change", onChange)
    setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    return () => mql.removeEventListener("change", onChange)
  }, [])

  return !!isMobile
}

export function useIsPrintMode() {
  const [isPrinting, setIsPrinting] = React.useState(false);
  
  React.useEffect(() => {
    const beforePrint = () => {
      setIsPrinting(true);
    };
    
    const afterPrint = () => {
      setIsPrinting(false);
    };
    
    window.addEventListener('beforeprint', beforePrint);
    window.addEventListener('afterprint', afterPrint);
    
    return () => {
      window.removeEventListener('beforeprint', beforePrint);
      window.removeEventListener('afterprint', afterPrint);
    };
  }, []);
  
  return isPrinting;
}

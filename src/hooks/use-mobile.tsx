import { useState, useEffect } from 'react';

interface UseMobileOptions {
  mobileBreakpoint?: number;
  tabletBreakpoint?: number;
}

interface DeviceInfo {
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
}

export function useMobile({
  mobileBreakpoint = 640,
  tabletBreakpoint = 1024
}: UseMobileOptions = {}): DeviceInfo {
  const [deviceInfo, setDeviceInfo] = useState<DeviceInfo>({
    isMobile: false,
    isTablet: false,
    isDesktop: true
  });

  useEffect(() => {
    const checkDevice = () => {
      const width = window.innerWidth;
      setDeviceInfo({
        isMobile: width < mobileBreakpoint,
        isTablet: width >= mobileBreakpoint && width < tabletBreakpoint,
        isDesktop: width >= tabletBreakpoint
      });
    };

    // Initial check
    checkDevice();

    // Add event listener for window resize
    window.addEventListener('resize', checkDevice);

    // Cleanup
    return () => window.removeEventListener('resize', checkDevice);
  }, [mobileBreakpoint, tabletBreakpoint]);

  return deviceInfo;
}

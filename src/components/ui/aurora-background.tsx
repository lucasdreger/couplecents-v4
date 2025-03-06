
"use client";

import { cn } from "@/lib/utils";

interface AuroraBackgroundProps {
  className?: string;
  children: React.ReactNode;
  showRadialGradient?: boolean;
}

export function AuroraBackground({
  className,
  children,
  showRadialGradient = true,
}: AuroraBackgroundProps) {
  return (
    <div
      className={cn(
        "relative min-h-screen w-full overflow-hidden bg-white dark:bg-zinc-900",
        className
      )}
    >
      <div
        className="absolute inset-0 overflow-hidden"
        style={{
          opacity: 0.8,
          background: "radial-gradient(circle at 50% 50%, rgba(167, 189, 255, 0.3) 0%, rgba(255, 255, 255, 0) 100%)",
        }}
      >
        <div
          className={cn(
            `animate-aurora will-change-transform
            bg-[linear-gradient(to_right,rgb(236,238,254),rgb(213,219,250),rgb(236,238,254))]
            bg-[length:200%_200%]
            opacity-70
            dark:opacity-0`,
            showRadialGradient &&
              "mask-[radial-gradient(ellipse_at_100%_0%,black_20%,transparent_60%)]"
          )}
          style={{
            position: "absolute",
            inset: "-100%",
            width: "300%",
            height: "300%",
            backgroundPosition: "50% 50%",
            animation: "aurora 20s linear infinite",
          }}
        />
        
        {/* Additional subtle gradient layers */}
        <div 
          className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent opacity-50"
        />
        
        <div 
          className="absolute inset-0 bg-gradient-to-tr from-transparent via-primary/5 to-transparent opacity-50"
        />
      </div>
      <div className="relative z-10">{children}</div>
    </div>
  );
}

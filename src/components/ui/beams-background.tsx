
"use client";

import { cn } from "@/lib/utils";

interface BeamsBackgroundProps {
  className?: string;
  children: React.ReactNode;
  intensity?: "subtle" | "medium" | "strong";
}

export function BeamsBackground({
  className,
  children,
  intensity = "medium",
}: BeamsBackgroundProps) {
  const opacityMap = {
    subtle: "opacity-[0.15]",
    medium: "opacity-[0.2]",
    strong: "opacity-[0.25]",
  };

  return (
    <div className={cn("relative w-full overflow-hidden bg-slate-950", className)}>
      {/* Base layer for better contrast */}
      <div 
        className="absolute inset-0 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950"
        style={{ opacity: 0.9 }}
      />

      {/* First beam layer with primary color tint */}
      <div className="pointer-events-none absolute inset-0 flex [perspective:1000px]">
        <div
          className={cn(
            "absolute inset-0 bg-gradient-to-b from-transparent via-primary/20 to-transparent transform-gpu rotate-12",
            opacityMap[intensity],
            "animate-beam-slide"
          )}
          style={{
            maskImage: "radial-gradient(ellipse at center, black 30%, transparent 70%)",
            WebkitMaskImage: "radial-gradient(ellipse at center, black 30%, transparent 70%)",
            transform: "translateY(-30%) rotate(-20deg) scale(2.5)",
          }}
        />
      </div>

      {/* Second beam layer - subtle indigo tint */}
      <div
        className={cn(
          "absolute -left-1/4 right-1/4 bottom-0 top-[-50%] bg-gradient-to-b from-transparent via-indigo-900/20 to-transparent transform-gpu -rotate-12",
          opacityMap[intensity],
          "animate-beam-pulse"
        )}
        style={{
          maskImage: "radial-gradient(ellipse at center, black 40%, transparent 70%)",
          WebkitMaskImage: "radial-gradient(ellipse at center, black 40%, transparent 70%)",
          transform: "translateY(-20%) rotate(20deg) scale(2.5)",
        }}
      />

      {/* Third beam layer - primary highlight */}
      <div
        className={cn(
          "absolute inset-0 bg-gradient-to-tr from-primary/10 via-transparent to-primary/10",
          "animate-beam-glow"
        )}
        style={{ 
          opacity: 0.3,
          mixBlendMode: 'color-dodge',
          transform: "scale(1.5) rotate(-15deg)",
        }}
      />

      <div className="relative z-10">{children}</div>
    </div>
  );
}

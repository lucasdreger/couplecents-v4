import type { MotionProps, Variants } from 'framer-motion';

// Fade animations
export const fadeVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
  exit: { opacity: 0 },
};

// Slide animations
type SlideDirection = 'up' | 'down' | 'left' | 'right';

export const createSlideVariants = (
  direction: SlideDirection,
  distance = 20
): Variants => {
  const axis = direction === 'up' || direction === 'down' ? 'y' : 'x';
  const sign = direction === 'down' || direction === 'right' ? 1 : -1;

  return {
    hidden: { [axis]: sign * distance, opacity: 0 },
    visible: {
      [axis]: 0,
      opacity: 1,
      transition: {
        type: 'spring',
        damping: 25,
        stiffness: 500,
      },
    },
    exit: {
      [axis]: sign * distance,
      opacity: 0,
      transition: {
        type: 'spring',
        damping: 25,
        stiffness: 500,
      },
    },
  };
};

// Scale animations
interface ScaleOptions {
  initialScale?: number;
  finalScale?: number;
  duration?: number;
}

export const createScaleVariants = ({
  initialScale = 0.95,
  finalScale = 1,
  duration = 0.2,
}: ScaleOptions = {}): Variants => ({
  hidden: { scale: initialScale, opacity: 0 },
  visible: {
    scale: finalScale,
    opacity: 1,
    transition: { duration },
  },
  exit: {
    scale: initialScale,
    opacity: 0,
    transition: { duration },
  },
});

// List item animations
export const listItemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.1,
      duration: 0.3,
    },
  }),
  exit: { opacity: 0, y: 20 },
};

// Card animations
export const cardVariants: Variants = {
  hidden: { opacity: 0, scale: 0.95, y: 10 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      type: 'spring',
      damping: 20,
      stiffness: 300,
    },
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    y: 10,
    transition: {
      duration: 0.2,
    },
  },
};

// Modal animations
export const modalVariants: Variants = {
  hidden: {
    opacity: 0,
    scale: 0.75,
    y: -20,
  },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      type: 'spring',
      damping: 25,
      stiffness: 500,
    },
  },
  exit: {
    opacity: 0,
    scale: 0.75,
    y: 20,
    transition: {
      duration: 0.2,
    },
  },
};

// Overlay animations
export const overlayVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.2,
    },
  },
  exit: {
    opacity: 0,
    transition: {
      duration: 0.2,
    },
  },
};

// Spring configuration presets
export const springPresets = {
  gentle: {
    type: 'spring',
    damping: 15,
    stiffness: 200,
  },
  bouncy: {
    type: 'spring',
    damping: 8,
    stiffness: 400,
  },
  stiff: {
    type: 'spring',
    damping: 30,
    stiffness: 800,
  },
} as const;

// Transition presets
export const transitionPresets = {
  fast: { duration: 0.2 },
  normal: { duration: 0.3 },
  slow: { duration: 0.5 },
} as const;

export const animations = {
  fadeIn: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 }
  },
  slideUp: {
    initial: { y: 20, opacity: 0 },
    animate: { y: 0, opacity: 1 },
    exit: { y: 20, opacity: 0 }
  },
  slideDown: {
    initial: { y: -20, opacity: 0 },
    animate: { y: 0, opacity: 1 },
    exit: { y: -20, opacity: 0 }
  },
  scale: {
    initial: { scale: 0.95, opacity: 0 },
    animate: { scale: 1, opacity: 1 },
    exit: { scale: 0.95, opacity: 0 }
  }
} as const;

export const transitions = {
  spring: {
    type: 'spring',
    stiffness: 500,
    damping: 30
  },
  easeInOut: {
    type: 'tween',
    ease: 'easeInOut',
    duration: 0.2
  },
  bounce: {
    type: 'spring',
    stiffness: 300,
    damping: 10
  }
} as const;

export type AnimationVariant = keyof typeof animations;
export type TransitionVariant = keyof typeof transitions;

export interface AnimationProps extends MotionProps {
  variant?: AnimationVariant;
  transition?: TransitionVariant;
  delay?: number;
}

export function getAnimation(
  variant: AnimationVariant = 'fadeIn',
  transition: TransitionVariant = 'easeInOut',
  delay = 0
): AnimationProps {
  return {
    ...animations[variant],
    transition: {
      ...transitions[transition],
      delay
    }
  };
}
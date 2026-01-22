import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * Page transition variants
 */
export type PageTransitionType = "fade" | "slide-left" | "slide-right" | "slide-up" | "slide-down";

interface PageTransitionProps {
  children: React.ReactNode;
  type?: PageTransitionType;
  className?: string;
}

/**
 * PageTransition - Wraps content with animation for smooth page transitions
 * 
 * @example
 * ```tsx
 * <PageTransition type="fade">
 *   <div>Page content</div>
 * </PageTransition>
 * ```
 */
export function PageTransition({ children, type = "fade", className }: PageTransitionProps) {
  const [isVisible, setIsVisible] = React.useState(false);

  React.useEffect(() => {
    setIsVisible(true);
  }, []);

  const transitionClasses = cn(
    "transition-all duration-300 ease-in-out",
    type === "fade" && "opacity-0 animate-in fade-in",
    type === "slide-left" && "translate-x-full animate-in slide-from-right",
    type === "slide-right" && "-translate-x-full animate-in slide-from-left",
    type === "slide-up" && "translate-y-full animate-in slide-from-bottom",
    type === "slide-down" && "-translate-y-full animate-in slide-from-top",
    isVisible && "opacity-100 translate-x-0 translate-y-0"
  );

  return (
    <div className={cn(transitionClasses, className)}>
      {children}
    </div>
  );
}

/**
 * Modal transition variants
 */
export type ModalTransitionType = "slide-up" | "fade-in" | "scale";

interface ModalTransitionProps {
  children: React.ReactNode;
  type?: ModalTransitionType;
  isOpen: boolean;
  className?: string;
}

/**
 * ModalTransition - Wraps modal content with animation for smooth open/close
 * 
 * @example
 * ```tsx
 * <Dialog>
 *   <ModalTransition type="slide-up" isOpen={isOpen}>
 *     <DialogBody>Modal content</DialogBody>
 *   </ModalTransition>
 * </Dialog>
 * ```
 */
export function ModalTransition({ children, type = "slide-up", isOpen, className }: ModalTransitionProps) {
  const transitionClasses = cn(
    "transition-all duration-250 ease-in-out",
    !isOpen && type === "slide-up" && "translate-y-4 opacity-0 scale-95",
    !isOpen && type === "fade-in" && "opacity-0 scale-95",
    !isOpen && type === "scale" && "opacity-0 scale-95",
    isOpen && "translate-y-0 opacity-100 scale-100"
  );

  return (
    <div className={cn(transitionClasses, className)}>
      {children}
    </div>
  );
}

/**
 * List item transition for animated list rendering
 */
interface ListItemTransitionProps {
  children: React.ReactNode;
  index: number;
  className?: string;
  delay?: number; // Stagger delay in ms
}

/**
 * ListItemTransition - Animated list item with stagger effect
 * 
 * @example
 * ```tsx
 * {items.map((item, index) => (
 *   <ListItemTransition key={item.id} index={index}>
 *     <div>{item.title}</div>
 *   </ListItemTransition>
 * ))}
 * ```
 */
export function ListItemTransition({ children, index, className, delay = 0 }: ListItemTransitionProps) {
  const [isVisible, setIsVisible] = React.useState(false);

  React.useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), delay);
    return () => clearTimeout(timer);
  }, [delay]);

  const transitionClasses = cn(
    "transition-all duration-200 ease-out",
    !isVisible && "opacity-0 translate-y-4",
    isVisible && "opacity-100 translate-y-0"
  );

  return (
    <div className={cn(transitionClasses, className)} style={{ transitionDelay: `${delay}ms` }}>
      {children}
    </div>
  );
}

/**
 * Scale transition for button press feedback
 */
interface ScaleTransitionProps {
  children: React.ReactNode;
  isPressed?: boolean;
  scaleAmount?: number; // Default 0.98 for pressed state
}

/**
 * ScaleTransition - Provides button press feedback with scale animation
 * 
 * @example
 * ```tsx
 * <ScaleTransition isPressed={isPressed}>
 *   <Button>Click me</Button>
 * </ScaleTransition>
 * ```
 */
export function ScaleTransition({ children, isPressed = false, scaleAmount = 0.98 }: ScaleTransitionProps) {
  const transitionClasses = cn(
    "transition-transform duration-100 ease-out",
    isPressed && `scale-[${scaleAmount}]`,
    !isPressed && "scale-100"
  );

  return (
    <div className={transitionClasses}>
      {children}
    </div>
  );
}

/**
 * Ripple effect for button clicks
 */
interface RippleProps {
  children: React.ReactNode;
  color?: string;
  size?: number; // Ripple size in px
}

/**
 * Ripple - Adds material-design ripple effect on click
 * 
 * @example
 * ```tsx
 * <Ripple color="rgba(19, 200, 236, 0.3)" size={100}>
 *   <button onClick={handleClick}>Click me</button>
 * </Ripple>
 * ```
 */
export function Ripple({ children, color = "rgba(19, 200, 236, 0.3)", size = 100 }: RippleProps) {
  const [ripples, setRipples] = React.useState<Array<{ id: number; x: number; y: number }>>([]);

  const handleClick = (e: React.MouseEvent) => {
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const x = e.clientX - rect.left - size / 2;
    const y = e.clientY - rect.top - size / 2;

    const newRipple = {
      id: Date.now(),
      x,
      y,
    };

    setRipples((prev) => [...prev, newRipple]);

    // Remove ripple after animation completes
    setTimeout(() => {
      setRipples((prev) => prev.filter((r) => r.id !== newRipple.id));
    }, 600);
  };

  return (
    <div
      className="relative overflow-hidden"
      onClick={handleClick}
    >
      {ripples.map((ripple) => (
        <div
          key={ripple.id}
          className="absolute rounded-full pointer-events-none animate-in ripple"
          style={{
            left: `${ripple.x}px`,
            top: `${ripple.y}px`,
            width: `${size}px`,
            height: `${size}px`,
            backgroundColor: color,
          }}
        />
      ))}
      {children}
    </div>
  );
}

/**
 * Fade in/out transition for conditional rendering
 */
interface FadeTransitionProps {
  show: boolean;
  children: React.ReactNode;
  duration?: number;
  className?: string;
}

/**
 * FadeTransition - Conditionally renders content with fade animation
 * 
 * @example
 * ```tsx
 * <FadeTransition show={isVisible}>
 *   <p>This content fades in/out</p>
 * </FadeTransition>
 * ```
 */
export function FadeTransition({ show, children, duration = 200, className }: FadeTransitionProps) {
  const [shouldRender, setShouldRender] = React.useState(show);

  React.useEffect(() => {
    if (show) {
      setShouldRender(true);
    } else {
      // Delay unmount to allow fade out animation
      const timer = setTimeout(() => setShouldRender(false), duration);
      return () => clearTimeout(timer);
    }
  }, [show, duration]);

  if (!shouldRender && !show) {
    return null;
  }

  return (
    <div
      className={cn(
        "transition-opacity duration-200 ease-in-out",
        show ? "opacity-100" : "opacity-0"
      , className)}
    >
      {children}
    </div>
  );
}

/**
 * Custom animation utilities for Tailwind
 */
export const animationStyles = `
  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }

  @keyframes slideFromLeft {
    from { transform: translateX(-100%); opacity: 0; }
    to { transform: translateX(0); opacity: 1; }
  }

  @keyframes slideFromRight {
    from { transform: translateX(100%); opacity: 0; }
    to { transform: translateX(0); opacity: 1; }
  }

  @keyframes slideFromTop {
    from { transform: translateY(-100%); opacity: 0; }
    to { transform: translateY(0); opacity: 1; }
  }

  @keyframes slideFromBottom {
    from { transform: translateY(100%); opacity: 0; }
    to { transform: translateY(0); opacity: 1; }
  }

  @keyframes scaleIn {
    from { transform: scale(0.95); opacity: 0; }
    to { transform: scale(1); opacity: 1; }
  }

  @keyframes ripple {
    from { transform: scale(0); opacity: 1; }
    to { transform: scale(4); opacity: 0; }
  }

  .animate-in {
    animation-timing-function: ease-out;
  }

  .fade-in {
    animation: fadeIn 300ms ease-out;
  }

  .slide-from-left {
    animation: slideFromLeft 300ms ease-out;
  }

  .slide-from-right {
    animation: slideFromRight 300ms ease-out;
  }

  .slide-from-top {
    animation: slideFromTop 300ms ease-out;
  }

  .slide-from-bottom {
    animation: slideFromBottom 300ms ease-out;
  }

  .scale-in {
    animation: scaleIn 250ms ease-out;
  }

  .ripple {
    animation: ripple 600ms ease-out;
  }

  /* Hover effects */
  .hover-lift {
    transition: transform 200ms ease-out, box-shadow 200ms ease-out;
  }

  .hover-lift:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }

  /* Button press effects */
  .button-press {
    transition: transform 100ms ease-out;
  }

  .button-press:active {
    transform: scale(0.98);
  }
`;

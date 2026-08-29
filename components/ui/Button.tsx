import { ButtonHTMLAttributes, forwardRef } from "react";
import Link from "next/link";
import clsx from "clsx";

type Variant = "primary" | "outline" | "ghost";

const variantClasses: Record<Variant, string> = {
  primary:
    "bg-gold text-ink hover:bg-gold-bright active:bg-gold-dim shadow-[0_0_0_1px_rgba(201,162,39,0.4)] hover:shadow-[0_0_28px_rgba(212,175,55,0.45)]",
  outline:
    "border border-gold/60 text-cream hover:border-gold hover:bg-gold/10 hover:shadow-[0_0_20px_rgba(212,175,55,0.15)]",
  ghost: "text-cream-dim hover:text-cream",
};

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
  href?: string;
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", href, children, ...props }, ref) => {
    const classes = clsx(
      "inline-flex items-center justify-center gap-2 rounded-sm px-6 py-3 font-utility text-sm font-medium tracking-wide uppercase",
      // A slightly longer, eased transition on transform+shadow+color reads
      // as more "premium/tactile" than an instant color swap — this is the
      // one micro-interaction repeated everywhere a button appears.
      "transition-[transform,box-shadow,background-color,border-color] duration-300 ease-out",
      "hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98]",
      "disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-none",
      variantClasses[variant],
      className
    );

    if (href) {
      return (
        <Link href={href} className={classes}>
          {children}
        </Link>
      );
    }

    return (
      <button ref={ref} className={classes} {...props}>
        {children}
      </button>
    );
  }
);
Button.displayName = "Button";

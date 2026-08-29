"use client";

import { InputHTMLAttributes, TextareaHTMLAttributes } from "react";

type BaseProps = { label: string };

type InputProps = BaseProps &
  InputHTMLAttributes<HTMLInputElement> & { as?: "input" };
type TextareaProps = BaseProps &
  TextareaHTMLAttributes<HTMLTextAreaElement> & { as: "textarea" };

/**
 * A floating-label field: the label sits where a placeholder would, then
 * lifts and shrinks above the field on focus or once there's content —
 * with a soft gold glow on the border. Pure CSS (Tailwind peer-*
 * variants), no JS state needed for the animation itself.
 */
export default function FloatingField(props: InputProps | TextareaProps) {
  const { label, className, id, ...rest } = props;
  const fieldId = id || label.toLowerCase().replace(/\s+/g, "-");

  const fieldClasses =
    "peer w-full rounded-sm border border-gold/30 bg-ink px-4 pb-2.5 pt-5 text-cream outline-none transition-[border-color,box-shadow] duration-300 focus:border-gold focus:shadow-[0_0_0_3px_rgba(212,175,55,0.12)]";

  const labelClasses =
    "pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-cream-dim/60 transition-all duration-200 " +
    "peer-focus:top-3 peer-focus:-translate-y-0 peer-focus:text-xs peer-focus:text-gold " +
    "peer-[:not(:placeholder-shown)]:top-3 peer-[:not(:placeholder-shown)]:-translate-y-0 peer-[:not(:placeholder-shown)]:text-xs peer-[:not(:placeholder-shown)]:text-cream-dim";

  if (props.as === "textarea") {
    const { as: _as, ...textareaRest } = rest as TextareaHTMLAttributes<HTMLTextAreaElement>;
    return (
      <div className="relative">
        <textarea id={fieldId} placeholder=" " className={`${fieldClasses} ${className ?? ""}`} {...textareaRest} />
        <label htmlFor={fieldId} className={labelClasses}>
          {label}
        </label>
      </div>
    );
  }

  return (
    <div className="relative">
      <input id={fieldId} placeholder=" " className={`${fieldClasses} ${className ?? ""}`} {...(rest as InputHTMLAttributes<HTMLInputElement>)} />
      <label htmlFor={fieldId} className={labelClasses}>
        {label}
      </label>
    </div>
  );
}

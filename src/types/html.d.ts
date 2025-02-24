declare namespace React {
  interface Attributes {
    key?: Key | null;
  }

  interface ClassAttributes<T> extends Attributes {
    ref?: Ref<T>;
  }

  interface HTMLAttributes<T> extends AriaAttributes, DOMAttributes<T> {
    className?: string;
    style?: CSSProperties;
    [key: string]: any;
  }

  interface DOMAttributes<T> {
    children?: ReactNode;
    onClick?: (event: MouseEvent<T>) => void;
    onChange?: (event: ChangeEvent<T>) => void;
    onKeyDown?: (event: KeyboardEvent<T>) => void;
    [key: string]: any;
  }

  interface DetailedHTMLProps<E extends HTMLAttributes<T>, T> extends E {
    ref?: LegacyRef<T>;
  }

  interface TableHTMLAttributes<T> extends HTMLAttributes<T> {
    align?: "left" | "center" | "right";
    bgcolor?: string;
    border?: number;
    cellPadding?: number | string;
    cellSpacing?: number | string;
    frame?: boolean;
    rules?: "none" | "groups" | "rows" | "cols" | "all";
    summary?: string;
    width?: number | string;
  }

  interface ThHTMLAttributes<T> extends HTMLAttributes<T> {
    align?: "left" | "center" | "right" | "justify" | "char";
    colSpan?: number;
    headers?: string;
    rowSpan?: number;
    scope?: string;
    abbr?: string;
  }

  interface TdHTMLAttributes<T> extends HTMLAttributes<T> {
    align?: "left" | "center" | "right" | "justify" | "char";
    colSpan?: number;
    headers?: string;
    rowSpan?: number;
    scope?: string;
    abbr?: string;
  }

  interface AriaAttributes {
    "aria-current"?: boolean | "page" | "step" | "location" | "date" | "time";
    "aria-describedby"?: string;
    "aria-details"?: string;
    "aria-disabled"?: boolean;
    "aria-hidden"?: boolean;
    "aria-label"?: string;
    "aria-labelledby"?: string;
    "aria-live"?: "off" | "assertive" | "polite";
    "aria-relevant"?: "additions" | "removals" | "text" | "all";
    role?: string;
    [key: `aria-${string}`]: any;
  }

  interface CSSProperties {
    [key: string]: string | number | null | undefined;
  }

  type MouseEvent<T = Element> = any;
  type KeyboardEvent<T = Element> = any;
  type ChangeEvent<T = Element> = any;
  type LegacyRef<T> = string | Ref<T>;
}

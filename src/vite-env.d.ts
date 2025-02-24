/// <reference types="vite/client" />

// React JSX Runtime
declare namespace React {
  interface ReactElement<
    P = any,
    T extends string | JSXElementConstructor<any> =
      | string
      | JSXElementConstructor<any>
  > {
    type: T;
    props: P;
    key: Key | null;
  }

  type JSXElementConstructor<P> =
    | ((props: P) => ReactElement<any, any> | null)
    | (new (props: P) => Component<any, any>);

  interface Element extends ReactElement<any, any> { }

  type Key = string | number;

  interface RefObject<T> {
    readonly current: T | null;
  }

  type Ref<T> = RefObject<T> | ((instance: T | null) => void) | null;

  type ComponentType<P = {}> =
    | ComponentClass<P>
    | FunctionComponent<P>;
}

// Vite Environment Variables
interface ImportMetaEnv {
  readonly VITE_SUPABASE_URL: string
  readonly VITE_SUPABASE_ANON_KEY: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

// Image imports
declare module "*.svg" {
  const content: React.FunctionComponent<React.SVGAttributes<SVGElement>>;
  export default content;
}

declare module "*.png" {
  const content: string;
  export default content;
}

declare module "*.jpg" {
  const content: string;
  export default content;
}

declare module "*.jpeg" {
  const content: string;
  export default content;
}

declare module "*.gif" {
  const content: string;
  export default content;
}

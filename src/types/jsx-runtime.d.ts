declare module 'react/jsx-runtime' {
  export namespace JSX {
    interface Element {
      type: any;
      props: any;
      key: string | null;
    }

    interface ElementClass {
      render(): JSX.Element | null;
    }

    interface ElementAttributesProperty {
      props: any;
    }

    interface ElementChildrenAttribute {
      children: any;
    }

    type LibraryManagedAttributes<C, P> = C extends { defaultProps: infer D }
      ? Partial<D> & P
      : P;

    interface IntrinsicAttributes {
      key?: string | number;
    }

    interface IntrinsicClassAttributes<T> {
      ref?: React.Ref<T>;
    }

    interface IntrinsicElements {
      [elemName: string]: any;
    }
  }

  export const jsx: any;
  export const jsxs: any;
  export const Fragment: any;
}

declare module 'react/jsx-dev-runtime' {
  export * from 'react/jsx-runtime';
}

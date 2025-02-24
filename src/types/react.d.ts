declare module 'react' {
  // Basic types
  export type Key = string | number;
  
  export type ReactNode = 
    | string
    | number
    | boolean
    | null
    | undefined
    | ReactElement
    | Array<ReactNode>
    | { [key: string]: any };

  export interface ReactElement<P = any, T extends string | JSXElementConstructor<any> = string | JSXElementConstructor<any>> {
    type: T;
    props: P;
    key: Key | null;
  }

  export type ComponentType<P = {}> = ComponentClass<P> | FunctionComponent<P>;

  export type ElementType<P = any> =
    | {
        [K in keyof JSX.IntrinsicElements]: P extends JSX.IntrinsicElements[K]
          ? K
          : never;
      }[keyof JSX.IntrinsicElements]
    | ComponentType<P>;

  export type JSXElementConstructor<P> =
    | ((props: P) => ReactElement<any, any> | null)
    | (new (props: P) => Component<any, any>);

  export interface ComponentClass<P = {}, S = ComponentState> {
    new(props: P, context?: any): Component<P, S>;
    defaultProps?: Partial<P>;
    displayName?: string;
  }

  export interface FunctionComponent<P = {}> {
    (props: P & { children?: ReactNode }, context?: any): ReactElement<any, any> | null;
    defaultProps?: Partial<P>;
    displayName?: string;
  }

  export interface ComponentState {}

  export class Component<P = {}, S = {}, SS = any> {
    constructor(props: P, context?: any);
    readonly props: Readonly<P>;
    state: Readonly<S>;
    refs: {
      [key: string]: any;
    };
    context: any;
    setState<K extends keyof S>(
      state: ((prevState: Readonly<S>, props: Readonly<P>) => (Pick<S, K> | S | null)) | (Pick<S, K> | S | null),
      callback?: () => void
    ): void;
    forceUpdate(callback?: () => void): void;
    render(): ReactNode;
  }

  export type FC<P = {}> = FunctionComponent<P>;

  export type PropsWithChildren<P = unknown> = P & { children?: ReactNode | undefined };

  export const Fragment: ComponentType;
  export const StrictMode: ComponentType;

  export function createElement(
    type: ElementType,
    props?: any,
    ...children: ReactNode[]
  ): ReactElement;

  export function cloneElement(
    element: ReactElement,
    props?: any,
    ...children: ReactNode[]
  ): ReactElement;

  export function createContext<T>(defaultValue: T): Context<T>;

  export interface Context<T> {
    Provider: Provider<T>;
    Consumer: Consumer<T>;
    displayName?: string;
  }

  interface Provider<T> {
    (props: { value: T; children?: ReactNode }): ReactElement | null;
  }

  interface Consumer<T> {
    (props: { children: (value: T) => ReactNode }): ReactElement | null;
  }

  export function useState<T>(initialState: T | (() => T)): [T, (newState: T | ((prevState: T) => T)) => void];
  export function useEffect(effect: () => void | (() => void | undefined), deps?: readonly any[]): void;
  export function useContext<T>(context: Context<T>): T;
  export function useReducer<R extends Reducer<any, any>, I>(
    reducer: R,
    initializerArg: I & ReducerState<R>,
    initializer: (arg: I & ReducerState<R>) => ReducerState<R>
  ): [ReducerState<R>, Dispatch<ReducerAction<R>>];
  export function useCallback<T extends (...args: any[]) => any>(callback: T, deps: readonly any[]): T;
  export function useMemo<T>(factory: () => T, deps: readonly any[] | undefined): T;
  export function useRef<T>(initialValue: T): MutableRefObject<T>;
  export function useLayoutEffect(effect: EffectCallback, deps?: readonly any[]): void;

  type Dispatch<A> = (value: A) => void;
  type ReducerState<R extends Reducer<any, any>> = R extends Reducer<infer S, any> ? S : never;
  type ReducerAction<R extends Reducer<any, any>> = R extends Reducer<any, infer A> ? A : never;
  type Reducer<S, A> = (prevState: S, action: A) => S;
  type EffectCallback = () => (void | (() => void | undefined));
  interface MutableRefObject<T> {
    current: T;
  }
}

// JSX namespace
declare global {
  namespace JSX {
    interface Element extends React.ReactElement<any, any> { }
    interface ElementClass extends React.Component<any> {
      render(): React.ReactNode;
    }
    interface ElementAttributesProperty { props: {}; }
    interface ElementChildrenAttribute { children: {}; }
    interface IntrinsicAttributes extends React.Attributes { }
    interface IntrinsicClassAttributes<T> extends React.ClassAttributes<T> { }
    
    interface IntrinsicElements {
      [elemName: string]: any;
    }
  }
}

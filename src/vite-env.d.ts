
/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SUPABASE_URL: string
  readonly VITE_SUPABASE_ANON_KEY: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

declare module '@tanstack/react-query' {
  export interface QueryKey extends Array<string | number | boolean | object | null | undefined> {}
  export const useQuery: any;
  export const useMutation: any;
  export const useQueryClient: any;
  export const QueryClient: any;
  export const QueryClientProvider: any;
}

declare module 'recharts' {
  export const PieChart: React.FC<any>;
  export const Pie: React.FC<any>;
  export const Cell: React.FC<any>;
  export const ResponsiveContainer: React.FC<any>;
  export const Tooltip: React.FC<any>;
  export const BarChart: React.FC<any>;
  export const Bar: React.FC<any>;
  export const XAxis: React.FC<any>;
  export const YAxis: React.FC<any>;
  export const CartesianGrid: React.FC<any>;
  export const Legend: React.FC<any>;
  export * from 'recharts/types';
}

declare module 'react' {
  export interface CSSProperties {
    [key: `--${string}`]: string | number
  }
  
  export type FC<P = {}> = React.FunctionComponent<P>;
  export const useState: typeof React.useState;
  export const useEffect: typeof React.useEffect;
  export const useCallback: typeof React.useCallback;
  export const useMemo: typeof React.useMemo;
  export const useRef: typeof React.useRef;
  export const createContext: typeof React.createContext;
  export const useContext: typeof React.useContext;
  export default React;
}

declare module 'react-router-dom' {
  export const useNavigate: any;
  export const useLocation: any;
  export const Link: any;
  export const NavLink: any;
  export const Navigate: any;
  export const Outlet: any;
  export const RouterProvider: any;
  export const createBrowserRouter: any;
}

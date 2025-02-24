/// <reference types="react" />
/// <reference types="react/jsx-runtime" />

import React from 'react';

declare global {
  namespace JSX {
    interface IntrinsicElements {
      [elemName: string]: any;
    }
    interface Element extends React.ReactElement<any, any> {}
  }
}

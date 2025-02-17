// components/ThemeProvider.js
'use client';

import { ThemeProvider as NextThemesProvider } from 'next-themes';
import React from 'react';

const ThemeProvider = ({ children }) => {
  return (
    <NextThemesProvider attribute="class">
      {children}
    </NextThemesProvider>
  );
};

export default ThemeProvider;

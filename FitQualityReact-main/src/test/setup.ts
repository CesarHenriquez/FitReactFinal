import { expect, afterEach } from 'vitest';
import { cleanup } from '@testing-library/react';
import * as matchers from '@testing-library/jest-dom/matchers'; // 👈 Ruta específica v6

// 1. Extendemos 'expect' manualmente con los matchers de jest-dom
expect.extend(matchers);

// 2. Limpiamos el DOM después de cada test
afterEach(() => {
  cleanup();
});
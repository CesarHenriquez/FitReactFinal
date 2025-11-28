import { CartProvider } from './context/CartContext';
import { AppRouter } from './routes/AppRouter';

import { Toaster } from 'react-hot-toast';

export default function App() {
  return (
    <CartProvider>
      <AppRouter />
      
      {/* 2. Agregamos el Toaster con el diseño oscuro */}
      <Toaster 
        position="top-center"
        toastOptions={{
          style: {
            background: '#1f2937', 
            color: '#fff',         
            border: '1px solid #374151',
          },
          success: {
            iconTheme: {
              primary: '#22c55e', 
              secondary: '#fff',
            },
          },
          error: {
            iconTheme: {
              primary: '#ef4444', 
              secondary: '#fff',
            },
          },
        }}
      />
    </CartProvider>
  );
}
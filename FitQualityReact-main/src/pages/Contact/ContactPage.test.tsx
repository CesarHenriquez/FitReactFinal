import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { ContactPage } from './ContactPage';
import { Toaster } from 'react-hot-toast';
import { describe, it, expect, vi } from 'vitest';


vi.mock('react-hot-toast', () => {
    return {
        
        default: {
            error: vi.fn(),
            success: vi.fn(),
            promise: vi.fn().mockResolvedValue(true), 
            dismiss: vi.fn(),
            loading: vi.fn(),
            custom: vi.fn()
        },
        
        Toaster: () => null 
    };
});

describe('Pruebas en <ContactPage />', () => {
    
    it('debe mostrar correctamente el título y los campos del formulario', () => {
        render(
            <>
                <Toaster />
                <ContactPage />
            </>
        );

        expect(screen.getByText('Contáctanos')).toBeInTheDocument();
        expect(screen.getByPlaceholderText(/Tu nombre completo/i)).toBeInTheDocument();
        expect(screen.getByPlaceholderText(/ejemplo@gmail.com/i)).toBeInTheDocument();
        expect(screen.getByPlaceholderText(/Escribe tu mensaje aquí.../i)).toBeInTheDocument();
        
        
        expect(screen.getByRole('button', { name: /Enviar Mensaje/i })).toBeInTheDocument();
    });

    it('debe permitir escribir y simular el envío', async () => {
        render(<ContactPage />);

        const inputNombre = screen.getByPlaceholderText(/Tu nombre completo/i);
        const btn = screen.getByRole('button', { name: /Enviar Mensaje/i });

       
        fireEvent.change(inputNombre, { target: { value: 'Usuario Test' } });
        expect(inputNombre).toHaveValue('Usuario Test');

       
        fireEvent.click(btn);
        
        
    });
});
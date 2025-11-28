import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { LoginPage } from './LoginPage';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { api } from '../../services/api'; 
import toast from 'react-hot-toast'; 


vi.mock('../../services/api', () => ({
  api: { 
    login: vi.fn(),
  },
}));

vi.mock('react-hot-toast', () => ({
  default: {
    loading: vi.fn(() => 'loading-toast-id'),
    dismiss: vi.fn(),
    success: vi.fn(),
    error: vi.fn(),
  },
  Toaster: () => <div data-testid="toaster" />,
}));


const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

describe('LoginPage Component: Integración de Roles y Redirección', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    
   
    Object.defineProperty(window, 'localStorage', {
      value: {
        getItem: vi.fn(),
        setItem: vi.fn(),
        removeItem: vi.fn(),
      },
      writable: true,
    });
  });

 
  const TestWrapper = ({ initialRoute = '/login' }: { initialRoute?: string }) => {
    return (
      <MemoryRouter initialEntries={[initialRoute]}>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/" element={<div data-testid="home-cliente">Home Cliente</div>} />
          <Route path="/admin" element={<div data-testid="admin-panel">Admin Panel</div>} />
          <Route path="/vendedor" element={<div data-testid="vendedor-panel">Vendedor Panel</div>} />
        </Routes>
      </MemoryRouter>
    );
  };

 
  const fillAndSubmitForm = async (email: string = "test@vendedor.com", password: string = "validpass") => {
   
    const emailInput = screen.getByPlaceholderText('ejemplo@gmail.com');
    const passwordInput = screen.getByPlaceholderText('********');
    
    fireEvent.change(emailInput, { target: { value: email } });
    fireEvent.change(passwordInput, { target: { value: password } });

  
    const submitButton = screen.getByRole('button', { name: /ingresar/i });
    fireEvent.click(submitButton);
  };

  it('debe redirigir a /vendedor si el rol es DELIVERY', async () => {
  
    const mockLoginResponse = {
      token: "fake_token",
      user: { 
        id: 1, 
        nickname: "TestUser",
        correo: "test@example.com", 
        rol: { nombre: "DELIVERY" } 
      } 
    };
    
    vi.mocked(api.login).mockResolvedValueOnce(mockLoginResponse as any);

    render(<TestWrapper initialRoute="/login" />);
    
    await fillAndSubmitForm();

   
    await waitFor(() => {
      expect(api.login).toHaveBeenCalledWith("test@vendedor.com", "validpass");
    });

   
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/vendedor');
    }, { timeout: 5000 });

 
    expect(window.localStorage.setItem).toHaveBeenCalledWith('token', 'fake_token');
   
    expect(window.localStorage.setItem).toHaveBeenCalledWith(
      'fq_session', 
      JSON.stringify({
        id: 1,
        email: "test@example.com",
        role: "vendedor",
        originalRole: "DELIVERY"
      })
    );
    expect(toast.success).toHaveBeenCalled();
  });

  it('debe redirigir a /admin si el rol es ADMINISTRADOR', async () => {
    const mockLoginResponse = {
      token: "fake_token",
      user: { 
        id: 1, 
        nickname: "TestUser",
        correo: "test@example.com", 
        rol: { nombre: "ADMINISTRADOR" } 
      } 
    };
    
    vi.mocked(api.login).mockResolvedValueOnce(mockLoginResponse as any);

    render(<TestWrapper initialRoute="/login" />);
    
    await fillAndSubmitForm();

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/admin');
    }, { timeout: 5000 });

    expect(window.localStorage.setItem).toHaveBeenCalledWith(
      'fq_session', 
      JSON.stringify({
        id: 1,
        email: "test@example.com",
        role: "admin",
        originalRole: "ADMINISTRADOR"
      })
    );
  });

  it('debe redirigir a HOME (/) si el rol es CLIENTE', async () => {
    const mockLoginResponse = {
      token: "fake_token",
      user: { 
        id: 10, 
        nickname: "TestUser",
        correo: "test@example.com", 
        rol: { nombre: "CLIENTE" } 
      } 
    };
    
    vi.mocked(api.login).mockResolvedValueOnce(mockLoginResponse as any);

    render(<TestWrapper initialRoute="/login" />);
    
    await fillAndSubmitForm();

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/');
    }, { timeout: 5000 });

  
    expect(window.localStorage.setItem).toHaveBeenCalledWith(
      'fq_session', 
      JSON.stringify({
        id: 10,
        email: "test@example.com",
        role: "cliente",
        originalRole: "CLIENTE"
      })
    );
  });

 
  it('debe redirigir a HOME (/) si el rol es VENDEDOR', async () => {
    const mockLoginResponse = {
      token: "fake_token",
      user: { 
        id: 1, 
        nickname: "TestUser",
        correo: "test@example.com", 
        rol: { nombre: "VENDEDOR" } 
      } 
    };
    
    vi.mocked(api.login).mockResolvedValueOnce(mockLoginResponse as any);

    render(<TestWrapper initialRoute="/login" />);
    
    await fillAndSubmitForm();

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/');
    }, { timeout: 5000 });

    expect(window.localStorage.setItem).toHaveBeenCalledWith(
      'fq_session', 
      JSON.stringify({
        id: 1,
        email: "test@example.com",
        role: "cliente",
        originalRole: "VENDEDOR"
      })
    );
  });

  it('debe redirigir a HOME (/) si el rol es REPARTIDOR', async () => {
    const mockLoginResponse = {
      token: "fake_token",
      user: { 
        id: 1, 
        nickname: "TestUser",
        correo: "test@example.com", 
        rol: { nombre: "REPARTIDOR" } 
      } 
    };
    
    vi.mocked(api.login).mockResolvedValueOnce(mockLoginResponse as any);

    render(<TestWrapper initialRoute="/login" />);
    
    await fillAndSubmitForm();

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/');
    }, { timeout: 5000 });

   
    expect(window.localStorage.setItem).toHaveBeenCalledWith(
      'fq_session', 
      JSON.stringify({
        id: 1,
        email: "test@example.com",
        role: "cliente",
        originalRole: "REPARTIDOR"
      })
    );
  });

  it('debe mostrar error toast si la API falla', async () => {
    
    vi.mocked(api.login).mockRejectedValueOnce(new Error('Unauthorized'));

    render(<TestWrapper initialRoute="/login" />);
    
    await fillAndSubmitForm();


    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith("Credenciales incorrectas o servidor no disponible.");
    }, { timeout: 5000 });

    
    expect(mockNavigate).not.toHaveBeenCalled();
  });

  it('debe manejar caso por defecto para rol desconocido', async () => {
    const mockLoginResponse = {
      token: "fake_token",
      user: { 
        id: 1, 
        nickname: "TestUser",
        correo: "test@example.com", 
        rol: { nombre: "ROL_DESCONOCIDO" } 
      } 
    };
    
    vi.mocked(api.login).mockResolvedValueOnce(mockLoginResponse as any);

    render(<TestWrapper initialRoute="/login" />);
    
    await fillAndSubmitForm();

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/');
    }, { timeout: 5000 });

   
    expect(window.localStorage.setItem).toHaveBeenCalledWith(
      'fq_session', 
      JSON.stringify({
        id: 1,
        email: "test@example.com",
        role: "cliente",
        originalRole: "ROL_DESCONOCIDO"
      })
    );
  });

  it('debe mostrar error si los campos están vacíos', async () => {
    render(<TestWrapper initialRoute="/login" />);
    

    const submitButton = screen.getByRole('button', { name: /ingresar/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(api.login).not.toHaveBeenCalled();
    });

 
    expect(mockNavigate).not.toHaveBeenCalled();
  });

  it('debe manejar error de red', async () => {
    
    vi.mocked(api.login).mockRejectedValueOnce({
      message: 'Network Error',
      code: 'NETWORK_ERROR'
    });

    render(<TestWrapper initialRoute="/login" />);
    
    await fillAndSubmitForm();

    
    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith("Credenciales incorrectas o servidor no disponible.");
    }, { timeout: 5000 });

 
    expect(mockNavigate).not.toHaveBeenCalled();
  });

 
  it('debe mostrar estado de loading durante el login', async () => {
   
    vi.mocked(api.login).mockImplementationOnce(
      () => new Promise(resolve => setTimeout(() => resolve({
        token: "fake_token",
        user: { 
          id: 1, 
          nickname: "TestUser",
          correo: "test@example.com", 
          rol: { nombre: "CLIENTE" } 
        } 
      } as any), 100))
    );

    render(<TestWrapper initialRoute="/login" />);
    
    await fillAndSubmitForm();

    
    await waitFor(() => {
      expect(screen.getByRole('button', { name: /accediendo/i })).toBeInTheDocument();
    });

   
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/');
    }, { timeout: 5000 });
  });

  
  it('debe mostrar toast de carga durante el login', async () => {
    const mockLoginResponse = {
      token: "fake_token",
      user: { 
        id: 1, 
        nickname: "TestUser",
        correo: "test@example.com", 
        rol: { nombre: "CLIENTE" } 
      } 
    };
    
    vi.mocked(api.login).mockResolvedValueOnce(mockLoginResponse as any);

    render(<TestWrapper initialRoute="/login" />);
    
    await fillAndSubmitForm();

   
    expect(toast.loading).toHaveBeenCalledWith("Verificando credenciales...");
    
   
    await waitFor(() => {
      expect(toast.dismiss).toHaveBeenCalled();
    }, { timeout: 5000 });
  });
});


export interface ApiProduct {
  id: number;
  nombre: string;
  descripcion: string;
  precio: number;
  stock: number;
  
  
  imagenUri: string | null; 
}

export interface ApiLoginResponse {
  token: string;
  user: {
    id: number;
    nickname: string;
    correo: string;
    rol: { nombre: string };
  };
}

export interface ApiUser {
  id: number;
  nickname: string;
  correo: string;
  rol: {
    id: number;
    nombre: string;
  };
}

export interface ApiDireccion {
  id: number;
  calle: string;
  codigoPostal: string; 
  comunaId: number;
  usuarioId: number;
}

const request = async <T>(url: string, method: string, body: any = null): Promise<T> => {
  const token = localStorage.getItem("token");
  const headers: HeadersInit = { "Content-Type": "application/json" };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const config: RequestInit = { method, headers };
  if (body) config.body = JSON.stringify(body);

  try {
    const response = await fetch(url, config);
    if (!response.ok) throw new Error(`Error ${response.status}`);
    const text = await response.text();
    return text ? JSON.parse(text) : ({} as T);
  } catch (error) {
    console.error("API Error:", error);
    throw error;
  }
};

export const api = {
  login: (correo: string, clave: string) => 
    request<ApiLoginResponse>("http://localhost:8021/auth/login", "POST", { correo, clave }),

  getProductos: () => 
    request<ApiProduct[]>("http://localhost:8022/api/productos", "GET"),
  
  crearVenta: (data: any) => 
    request("http://localhost:8023/api/ventas", "POST", data),
    
  registro: (data: any) => 
    request("http://localhost:8020/usuarios", "POST", data),
  
  getProductById: (id: string) => 
    request<ApiProduct>(`http://localhost:8022/api/productos/${id}`, "GET"),

  agregarProducto: (producto: any) => 
    request("http://localhost:8022/api/productos", "POST", producto),
 
  getUsuarios: () => request<ApiUser[]>("http://localhost:8020/usuarios", "GET"),
 
  crearDireccion: (data: any) => 
    request("http://localhost:8024/api/direcciones", "POST", data),
  
  getDirecciones: () => 
    request<ApiDireccion[]>("http://localhost:8024/api/direcciones", "GET"),

  
  getTodasLasVentas: () => 
    request<any[]>("http://localhost:8023/api/ventas", "GET"),
 
  eliminarProducto: (id: number) => 
    request(`http://localhost:8022/api/productos/${id}`, "DELETE"),
 
  editarProducto: (id: number, producto: any) => 
    request(`http://localhost:8022/api/productos/${id}`, "PUT", producto),
};


export const getImageUrl = (imageName: string | null) => {
  
  if (!imageName) return "/assets/fitquality.png";

  
  if (imageName.startsWith("http")) return imageName;

  return `/assets/${imageName}.png`;
};
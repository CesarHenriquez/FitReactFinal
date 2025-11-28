import { useEffect, useState } from "react";
import { api, type ApiUser, type ApiProduct, type ApiDireccion } from "../../services/api";
import { Link } from "react-router-dom";

export function SellerPage() {
  const [ventas, setVentas] = useState<any[]>([]);
  const [usuarios, setUsuarios] = useState<ApiUser[]>([]);
  const [productos, setProductos] = useState<ApiProduct[]>([]);
  const [direcciones, setDirecciones] = useState<ApiDireccion[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const cargarDatos = async () => {
      
      const ventasData = await api.getTodasLasVentas().catch(() => []);
      const usersData = await api.getUsuarios().catch(() => []);
      const productsData = await api.getProductos().catch(() => []);
      const addressData = await api.getDirecciones().catch(() => []);

      setVentas(ventasData);
      setUsuarios(usersData);
      setProductos(productsData);
      setDirecciones(addressData);
      setLoading(false);
    };
    cargarDatos();
  }, []);

 
  const getCorreo = (id: number) => usuarios.find(u => u.id === id)?.correo || `Usuario ID: ${id}`;
  const getProducto = (id: number) => productos.find(p => p.id === id)?.nombre || `Prod ID: ${id}`;
  
  const getDireccion = (id: number) => {
    const dir = direcciones.find(d => d.id === id);
    return dir ? `${dir.calle} #${dir.codigoPostal}` : "Dirección no encontrada";
  };

  const calcularTotal = (detalles: any[]) => {
      if (!detalles) return 0;
      return detalles.reduce((acc, item) => acc + (item.precioUnitario * item.cantidad), 0);
  };

  return (
    <main className="grid">
      <div className="container">
        <div className="d-flex justify-content-between align-items-center mb-4">
            <h1>Panel del Vendedor</h1>
            <Link to="/" className="btn btn--outline">Cerrar Panel</Link>
        </div>

        <div className="card p-4" style={{ backgroundColor: '#1f2937', border: '1px solid #374151' }}>
            <h3 className="mb-3" style={{ color: '#22c55e' }}>Pedidos Recientes</h3>
            {loading ? <p>Cargando...</p> : (
                <div className="table-responsive">
                    <table className="cart-table w-100">
                        <thead>
                            <tr>
                                <th>ID Venta</th>
                                <th>Cliente</th>
                                <th>Dirección</th>
                                <th>Fecha</th>
                                <th>Productos</th>
                                <th>Total</th>
                            </tr>
                        </thead>
                        <tbody>
                            {ventas.map((v) => (
                                <tr key={v.id}>
                                    <td>#{v.id}</td>
                                    <td>{getCorreo(v.usuarioId)}</td>
                                    <td style={{ color: '#3b82f6' }}>{getDireccion(v.direccionId)}</td>
                                    <td>{v.fecha}</td>
                                    <td>
                                        <ul style={{ listStyle: 'none', padding: 0, margin: 0, fontSize: '0.9em' }}>
                                            {v.detalles?.map((d: any, i: number) => (
                                                <li key={i}>
                                                    <strong style={{ color: '#22c55e' }}>{d.cantidad}x</strong> {getProducto(d.productoId)}
                                                </li>
                                            ))}
                                        </ul>
                                    </td>
                                    <td style={{ fontWeight: 'bold', color: '#22c55e', fontSize: '1.1em' }}>
                                        ${calcularTotal(v.detalles).toLocaleString('es-CL')}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
      </div>
    </main>
  );
}
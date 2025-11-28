import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api, getImageUrl, type ApiProduct, type ApiUser } from "../../services/api";
import toast from 'react-hot-toast';

export function AdminPage() {
  const [products, setProducts] = useState<ApiProduct[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [users, setUsers] = useState<ApiUser[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(true);

  //  ESTADO PARA SABER SI ESTOY EDITANDO 
  const [editingId, setEditingId] = useState<number | null>(null);

  const [form, setForm] = useState({
    nombre: "",
    descripcion: "",
    precio: 0,
    stock: 0,
    imagenUri: "",
    categoriaId: 1
  });

  const darkToastStyle = {
    background: '#1f2937', color: '#fff', border: '1px solid #374151',
  };

  useEffect(() => {
    loadProducts();
    loadUsers();
  }, []);

  const loadProducts = () => {
    setLoadingProducts(true);
    api.getProductos()
      .then(setProducts)
      .catch(err => console.error(err))
      .finally(() => setLoadingProducts(false));
  };

  const loadUsers = () => {
    setLoadingUsers(true);
    api.getUsuarios()
      .then(setUsers)
      .catch(err => console.error(err))
      .finally(() => setLoadingUsers(false));
  };

  //  LÓGICA DE ELIMINAR 
  const handleDeleteProduct = (id: number, nombre: string) => {
    toast((t) => (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <p style={{ margin: 0 }}>¿Eliminar <b>"{nombre}"</b>?</p>
        <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
          <button onClick={() => toast.dismiss(t.id)} style={{ background: 'transparent', border: '1px solid #777', color: '#fff', padding: '4px 8px', borderRadius: '4px', cursor:'pointer' }}>Cancelar</button>
          <button onClick={() => { toast.dismiss(t.id); confirmDelete(id); }} style={{ background: '#ef4444', border: 'none', color: 'white', padding: '4px 8px', borderRadius: '4px', cursor:'pointer' }}>Eliminar</button>
        </div>
      </div>
    ), { style: darkToastStyle, icon: '🗑️' });
  };

  const confirmDelete = async (id: number) => {
    await toast.promise(api.eliminarProducto(id), {
      loading: 'Eliminando...',
      success: 'Producto eliminado.',
      error: 'Error al eliminar.',
    }, { style: darkToastStyle });
    setProducts(prev => prev.filter(p => p.id !== id));
  };

  //  NUEVA LÓGICA: INICIAR EDICIÓN 
  const startEdit = (product: any) => {
    setEditingId(product.id); 
    
  
    setForm({
      nombre: product.nombre,
      descripcion: product.descripcion,
      precio: product.precio,
      stock: product.stock,
      imagenUri: product.imagenUri || "",
     
      categoriaId: product.categoria ? product.categoria.id : 1 
    });

    window.scrollTo({ top: 0, behavior: 'smooth' });
    toast(`Editando: ${product.nombre}`, { icon: '✏️', style: darkToastStyle });
  };

  //  CANCELAR EDICIÓN  
  const cancelEdit = () => {
    setEditingId(null);
    setForm({ nombre: "", descripcion: "", precio: 0, stock: 0, imagenUri: "", categoriaId: 1 });
    toast("Edición cancelada", { icon: '❌', style: darkToastStyle });
  };

  // GUARDAR O ACTUALIZAR 
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!form.nombre || form.precio <= 0) {
        toast.error("Datos incompletos.", { style: darkToastStyle });
        return;
    }

    try {
      if (editingId) {
        //  MODO EDICIÓN (PUT)
        const updatePromise = api.editarProducto(editingId, form);
        
        await toast.promise(updatePromise, {
            loading: 'Actualizando datos...',
            success: '¡Producto actualizado correctamente!',
            error: 'Error al actualizar.',
        }, { style: darkToastStyle });

        setEditingId(null); // Salir del modo edición

      } else {
        // MODO CREACIÓN (POST)
        const savePromise = api.agregarProducto(form);
        
        await toast.promise(savePromise, {
            loading: 'Guardando...',
            success: '¡Producto creado!',
            error: 'Error al guardar.',
        }, { style: darkToastStyle });
      }

      // Limpiar y recargar
      setForm({ nombre: "", descripcion: "", precio: 0, stock: 0, imagenUri: "", categoriaId: 1 });
      loadProducts();

    } catch (error) {
      console.error(error);
    }
  };

  const inputStyle = { backgroundColor: '#ffffff', color: '#000000', border: '1px solid #ced4da', fontWeight: '500' };

  return (
    <main className="grid admin-panel">
      <div className="container page-narrow">
        <div className="d-flex justify-content-between align-items-center mb-3">
            <Link to="/" className="btn btn--outline">← Volver al inicio</Link>
            <h1 className="m-0">Panel de Administración</h1>
        </div>

        {/* FORMULARIO DINÁMICO (CREAR O EDITAR) */}
        <div className="card p-4 mb-5" style={{ backgroundColor: '#1f2937', border: editingId ? '2px solid #3b82f6' : '1px solid #374151' }}>
          
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h2 className="text-center m-0" style={{ color: editingId ? '#3b82f6' : '#22c55e' }}>
                {editingId ? "✏️ Editando Producto" : "➕ Agregar Nuevo Producto"}
            </h2>
            {editingId && (
                <button type="button" onClick={cancelEdit} className="btn btn-sm btn-secondary">
                    Cancelar Edición
                </button>
            )}
          </div>
          
          <form onSubmit={handleSubmit} className="d-flex flex-column gap-3">
            <div>
                <label className="form-label">Nombre</label>
                <input className="form-control" value={form.nombre} onChange={e => setForm({...form, nombre: e.target.value})} required style={inputStyle} />
            </div>
            <div>
                <label className="form-label">Descripción</label>
                <input className="form-control" value={form.descripcion} onChange={e => setForm({...form, descripcion: e.target.value})} required style={inputStyle} />
            </div>
            <div className="row">
                <div className="col-6">
                    <label className="form-label">Precio</label>
                    <input type="number" className="form-control" value={form.precio} onChange={e => setForm({...form, precio: Number(e.target.value)})} style={inputStyle} />
                </div>
                <div className="col-6">
                    <label className="form-label">Stock</label>
                    <input type="number" className="form-control" value={form.stock} onChange={e => setForm({...form, stock: Number(e.target.value)})} style={inputStyle} />
                </div>
            </div>
            <div className="row">
                <div className="col-6">
                    <label className="form-label">Categoría</label>
                    <select className="form-control" value={form.categoriaId} onChange={e => setForm({...form, categoriaId: Number(e.target.value)})} style={inputStyle}>
                        <option value={1}>Accesorios</option>
                        <option value={2}>Pesas</option>
                    </select>
                </div>
                <div className="col-6">
                    <label className="form-label">Imagen (nombre sin .png)</label>
                    <input className="form-control" value={form.imagenUri} onChange={e => setForm({...form, imagenUri: e.target.value})} style={inputStyle} />
                </div>
            </div>

            <button className="btn mt-2" style={{ width: '100%', backgroundColor: editingId ? '#3b82f6' : '#22c55e', borderColor: 'transparent', color: '#fff' }}>
                {editingId ? "Actualizar Producto" : "Guardar Producto"}
            </button>
          </form>
        </div>

        {/* LISTADO */}
        <h3 className="mb-3">Inventario Actual</h3>
        <div className="table-responsive mb-5">
            {loadingProducts ? <p>Cargando...</p> : (
                <table className="cart-table w-100">
                    <thead>
                        <tr><th>ID</th><th>Img</th><th>Nombre</th><th>Stock</th><th>Precio</th><th>Acciones</th></tr>
                    </thead>
                    <tbody>
                        {products.map((p) => (
                            <tr key={p.id} style={editingId === p.id ? { backgroundColor: 'rgba(59, 130, 246, 0.1)' } : {}}>
                                <td>{p.id}</td>
                                <td><img src={getImageUrl(p.imagenUri)} alt={p.nombre} style={{ width: 40, borderRadius: 4 }} /></td>
                                <td>{p.nombre}</td>
                                <td>{p.stock}</td>
                                <td>${p.precio}</td>
                                <td className="d-flex gap-2">
                                    {/* BOTÓN EDITAR */}
                                    <button 
                                        className="btn btn-sm"
                                        style={{ backgroundColor: '#3b82f6', color: 'white', border: 'none' }}
                                        onClick={() => startEdit(p)}
                                    >
                                        Editar
                                    </button>
                                    {/* BOTÓN ELIMINAR */}
                                    <button 
                                        className="btn btn-sm" 
                                        style={{ backgroundColor: '#ef4444', color: 'white', border: 'none' }}
                                        onClick={() => handleDeleteProduct(p.id, p.nombre)}
                                    >
                                        X
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>

        <h2 className="mb-3" style={{ color: '#3b82f6', borderTop: '1px solid #374151', paddingTop: '20px' }}>Usuarios</h2>
        <div className="card p-3" style={{ backgroundColor: '#1f2937' }}>
            {loadingUsers ? <p>Cargando...</p> : (
                <div className="table-responsive">
                    <table className="cart-table w-100">
                        <thead><tr><th>ID</th><th>Nombre</th><th>Correo</th><th>Rol</th></tr></thead>
                        <tbody>
                            {users.map((u) => (
                                <tr key={u.id}>
                                    <td>{u.id}</td>
                                    <td style={{ fontWeight: 'bold', color: '#fff' }}>{u.nickname}</td>
                                    <td className="muted">{u.correo}</td>
                                    <td><span className="badge bg-secondary">{u.rol?.nombre || 'CLIENTE'}</span></td>
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
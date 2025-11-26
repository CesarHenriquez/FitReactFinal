import { useEffect, useMemo, useState } from "react";
import { type Product, PRODUCTOS } from "../../data/catalog"; //Importar productos base
import {
  getAdminProducts,
  saveAdminProducts,
  getFullCatalog, // Importar la función para obtener el listado completo
} from "../../services/admin-catalog.service";
import { Link } from "react-router-dom";


import { getUsers, deleteUserByEmail, type User } from "../../services/auth.service";

// Usa el catálogo completo para el listado
const CATALOGO_BASE_IDS = Object.keys(PRODUCTOS);

type FormState = { id: string; nombre: string; precio: number; img: string };

export function AdminPage() {
  
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [f, setF] = useState<FormState>({ id: "", nombre: "", precio: 0, img: "" });

  
  const [users, setUsers] = useState<User[]>([]);

  const load = () => {
    // Carga todos los productos (base + admin)
    setAllProducts(Object.values(getFullCatalog()));
    setUsers(getUsers());
  };

  useEffect(load, []);

  const canSave = useMemo(
    () => f.id.trim() !== "" && f.nombre.trim() !== "" && f.precio > 0,
    [f]
  );

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Usa alert temporalmente
    if (!canSave) return alert("Completa ID, nombre y precio.");

    const id = f.id.trim().toLowerCase().replace(/\s+/g, "-");
    // Verificar si el ID existe en la lista 
    if (allProducts.some(p => p.id === id)) return alert(`Error: El ID '${id}' ya existe.`);

    const nuevo: Product = {
      id,
      nombre: f.nombre.trim(),
      precio: Number(f.precio),
      img: f.img.trim() || "https://via.placeholder.com/600x400?text=Producto",
      bullets: ["Producto agregado por administrador."],
      material: "—",
      optionKey: "none",
    };

    // Guarda en la lista de productos de admin y refresca todo
    const updatedAdminProducts = [...getAdminProducts(), nuevo];
    saveAdminProducts(updatedAdminProducts);
    setAllProducts(Object.values(getFullCatalog()));
    setF({ id: "", nombre: "", precio: 0, img: "" });
    alert("Producto agregado.");
  };

  // Función para obtener la lista de productos que si puede modificar/eliminar
  const getModifiableProducts = () => {
    // Obtiene solo los productos que están en localStorage (productos admin y productos base modificados)
    // aquí trabaja solo con los productos extra/modificados en localStorage.
    // Si se quiere editar productos base, debemos cargar los datos base + la sobrescritura.
    return getAdminProducts();
  };

  const del = (id: string, isBaseProduct: boolean) => {
    // Usa alert temporalmente
    if (!confirm(`¿Estás seguro de ELIMINAR el producto ${id}?`)) return;

    if (isBaseProduct) {
      alert("No se puede eliminar un producto base del código fuente. Solo se puede 'desactivar' (funcionalidad no implementada) o modificar.");
      return;
    }

    // Eliminación de productos de Admin (los que están en localStorage)
    const updatedAdminProducts = getModifiableProducts().filter(x => x.id !== id);
    saveAdminProducts(updatedAdminProducts);
    setAllProducts(Object.values(getFullCatalog())); // Recargar la lista completa
    alert("Producto eliminado.");
  };

  const edit = (id: string) => {
    const current = allProducts.find(x => x.id === id);
    if (!current) return alert("Producto no encontrado para editar.");

    
    const nombre = prompt("Nuevo nombre:", current.nombre) ?? current.nombre;
    const precioStr = prompt("Nuevo precio:", String(current.precio)) ?? String(current.precio);
    const img = prompt("Nueva URL de imagen (opcional):", current.img || "") ?? current.img;

    const precio = Number(precioStr);

    const updatedProduct: Product = {
      ...current,
      nombre: String(nombre || current.nombre).trim(),
      precio: isNaN(precio) ? current.precio : precio,
      img: (img || "").trim() || current.img,
     
    };

    // Obtenemos la lista actual de productos modificados/agregados en localStorage
    const modifiableProducts = getModifiableProducts();

    const idx = modifiableProducts.findIndex(x => x.id === id);

    if (idx >= 0) {
      // El producto ya estaba en localStorage (era de admin o ya se había modificado)
      modifiableProducts[idx] = updatedProduct;
    } else {
      // Es un producto base (viene de PRODUCTOS) que se está modificando por primera vez.
      // Lo agrega a la lista de productos de admin (sobrescritura)
      modifiableProducts.push(updatedProduct);
    }
    
    // Guarda la lista modificada
    saveAdminProducts(modifiableProducts);

    // Refresca el estado para ver los cambios
    setAllProducts(Object.values(getFullCatalog()));
    alert("Producto actualizado.");
  };

  // eliminar usuario 
  const removeUser = (email: string, role: User["role"]) => {
    // Usamos confirm/alert temporalmente
    const msg =
      role === "admin"
        ? `Vas a eliminar un usuario ADMIN (${email}). ¿Continuar?`
        : `¿Eliminar el usuario ${email}?`;

    if (!confirm(msg)) return;
    deleteUserByEmail(email);
    setUsers(getUsers());
    alert("Usuario eliminado.");
  };

  return (
    <main className="grid admin-panel">
      <div className="container page-narrow">
        <div className="d-flex justify-content-end mb-2">
          <Link to="/" className="btn btn--outline">← Volver</Link>
        </div>

        <h1 className="page-title text-center">Panel de Administración (Demo)</h1>
        <p className="text-center mb-3">
          Los cambios en productos (agregados/editados) se guardan en <strong>localStorage</strong>.
        </p>

        {/* -------- Agregar Productos -------- */}
        <div className="card p-3">
          <h2 className="mb-2">Agregar nuevo producto</h2>
          <form className="form" onSubmit={onSubmit}>
            <div className="form-group">
              <label>ID del producto (único)</label>
              <input
                value={f.id}
                onChange={e => setF(s => ({ ...s, id: e.target.value }))}
                maxLength={40}
                required
              />
            </div>

            <div className="form-group">
              <label>Nombre</label>
              <input
                value={f.nombre}
                onChange={e => setF(s => ({ ...s, nombre: e.target.value }))}
                maxLength={60}
                required
              />
            </div>

            <div className="form-group">
              <label>Precio</label>
              <input
                type="number"
                min={0}
                step={1}
                value={f.precio}
                onChange={e => setF(s => ({ ...s, precio: Number(e.target.value) }))}
                required
              />
            </div>

            <div className="form-group">
              <label>URL de imagen (opcional)</label>
              <input
                value={f.img}
                onChange={e => setF(s => ({ ...s, img: e.target.value }))}
              />
            </div>

            <div className="d-flex justify-content-end">
              <button className="btn" disabled={!canSave}>Agregar producto</button>
            </div>
          </form>
        </div>

        {/* -------- Editar/Eliminar Productos (Catálogo Completo) -------- */}
        <div className="card p-3 mt-3">
          <h2 className="mb-2">Catálogo Completo ({allProducts.length} productos)</h2>
          {allProducts.length === 0 ? (
            <p>No hay productos en el catálogo.</p>
          ) : (
            <table className="cart-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Nombre</th>
                  <th>Precio</th>
                  <th>Origen</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {allProducts.map(p => {
                  // Determina si es un producto base 
                  const isBaseProduct = CATALOGO_BASE_IDS.includes(p.id);

                  return (
                    <tr key={p.id}>
                      <td><code>{p.id}</code></td>
                      <td>{p.nombre}</td>
                      <td>${p.precio.toFixed(0)}</td>
                      <td>
                        {isBaseProduct ? "Base" : "Admin"}
                      </td>
                      <td className="d-flex gap-2">
                        <button className="btn btn--outline btn--sm" onClick={() => edit(p.id)}>
                          Editar
                        </button>
                        {/* Solo permite eliminar si no es un producto base (para no borrar catálogo principal) */}
                        {!isBaseProduct && (
                          <button className="btn btn--outline btn--sm" onClick={() => del(p.id, isBaseProduct)}>
                            Eliminar
                          </button>
                        )}
                        {isBaseProduct && (
                           <span className="muted" style={{ fontSize: '12px', lineHeight: '2.2'}}>No Eliminable</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>

        {/* -------- Usuarios -------- */}
        <div className="card p-3 mt-4">
          <h2 className="mb-2">Usuarios registrados</h2>
          {users.length === 0 ? (
            <p>No hay usuarios registrados.</p>
          ) : (
            <table className="cart-table">
              <thead>
                <tr>
                  <th>RUN</th>
                  <th>Nombre</th>
                  <th>Correo</th>
                  <th>Rol</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {users.map(u => (
                  <tr key={u.correo}>
                    <td>{u.run}</td>
                    <td>{u.nombre} {u.apellidos}</td>
                    <td>{u.correo}</td>
                    <td>{u.role}</td>
                    <td className="d-flex gap-2">
                      <button
                        className="btn btn--outline btn--sm"
                        onClick={() => removeUser(u.correo, u.role)}
                      >
                        Eliminar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </main>
  );
}
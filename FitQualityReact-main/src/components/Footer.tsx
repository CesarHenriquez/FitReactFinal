export function Footer() {
  return (
    <footer className="footer border-top mt-4">
      <div className="container d-flex justify-content-between align-items-center py-3 flex-wrap">
        <small>© 2025 FitQuality — Todos los derechos reservados</small>
        <div className="footer__links d-flex gap-3">
          <a href="/registro">Crear cuenta</a>
          <a href="/login">Ingresar</a>
        </div>
      </div>
    </footer>
  );
}
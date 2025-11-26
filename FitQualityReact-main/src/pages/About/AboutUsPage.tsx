import { Link } from "react-router-dom";

export function AboutUsPage() {
  return (
    <main>
      <section className="container text-center py-5">
        <h1>Nosotros</h1>
        <p className="mb-5">
          FitQuality es una tienda online especializada en implementos deportivos.
        </p>

        <div className="card mb-4">
          <div className="card-header">
            <h3>Quiénes somos</h3>
          </div>
          <div className="card-body">
            <p>
              Soy Cesar Henriquez, el desarrollador dueño de FitQuality, una
              tienda online especializada en implementos deportivos. Con
              experiencia en desarrollo web y pasión por el deporte, busco
              ofrecer productos de calidad que optimicen la experiencia de
              entrenamiento y sobre todo, que transmitan confianza y
              profesionalismo. En FitQuality, les ofrecemos una experiencia de
              primer nivel.
            </p>
          </div>
        </div>

        <div className="card mb-4">
          <div className="card-header">
            <h3>Misión</h3>
          </div>
          <div className="card-body">
            <p>
              Ofrecer una experiencia de entrenamiento de calidad y con
              propósito profesional a través de implementos deportivos
              esenciales, con un enfoque en transparencia y cercanía con el
              cliente para poder orientarlo en su compra.
            </p>
          </div>
        </div>

        <div className="card mb-4">
          <div className="card-header">
            <h3>Visión</h3>
          </div>
          <div className="card-body">
            <p>
              Ser un ejemplo de seguridad, confianza y profesionalismo en la
              venta de implementos deportivos en línea, reconocida por la
              calidad de nuestros productos y la claridad de nuestra
              comunicación.
            </p>
          </div>
        </div>

        <div className="mt-4">
          <Link to="/" className="btn btn-primary">
            Volver al inicio
          </Link>
        </div>
      </section>
    </main>
  );
}
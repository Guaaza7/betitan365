import { Link } from "wouter";

export default function HeroBanner() {
  return (
    <section 
      id="inicio" 
      className="relative overflow-hidden" 
      style={{
        backgroundImage: "linear-gradient(rgba(0,0,0,0.7), rgba(0,0,0,0.7)), url('https://images.unsplash.com/photo-1508098682722-e99c643e7f0b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1920&q=80')",
        backgroundSize: "cover",
        backgroundPosition: "center"
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
        <div className="max-w-2xl">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Las mejores apuestas deportivas online
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground mb-8">
            Apuesta en los eventos deportivos más importantes del mundo con las mejores cuotas
          </p>
          <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
            <Link href="/auth">
              <a className="bg-primary hover:bg-red-700 text-white font-medium py-3 px-6 rounded-md text-center text-lg transition">
                Registrarse ahora
              </a>
            </Link>
            <Link href="/promotions">
              <a className="bg-card hover:bg-gray-700 text-white font-medium py-3 px-6 rounded-md text-center text-lg transition">
                Ver promociones
              </a>
            </Link>
          </div>
        </div>
      </div>
      <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-background to-transparent"></div>
    </section>
  );
}

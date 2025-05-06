import { Link } from "wouter";

export default function Footer() {
  return (
    <footer className="bg-card border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">BetTitan365</h3>
            <p className="text-muted-foreground mb-4">Las mejores apuestas deportivas en línea con las cuotas más competitivas del mercado.</p>
            <div className="flex space-x-4">
              <a href="#" className="text-muted-foreground hover:text-primary transition">
                <i className="ri-facebook-fill text-xl"></i>
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition">
                <i className="ri-twitter-fill text-xl"></i>
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition">
                <i className="ri-instagram-fill text-xl"></i>
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition">
                <i className="ri-youtube-fill text-xl"></i>
              </a>
            </div>
          </div>
          
          <div>
            <h4 className="font-medium mb-4">Enlaces rápidos</h4>
            <ul className="space-y-2">
              <li><Link href="/sports"><a className="text-muted-foreground hover:text-primary transition">Deportes</a></Link></li>
              <li><a href="#" className="text-muted-foreground hover:text-primary transition">Casino en vivo</a></li>
              <li><Link href="/promotions"><a className="text-muted-foreground hover:text-primary transition">Promociones</a></Link></li>
              <li><a href="#" className="text-muted-foreground hover:text-primary transition">Aplicación móvil</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-primary transition">Resultados</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-medium mb-4">Ayuda</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-muted-foreground hover:text-primary transition">Centro de ayuda</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-primary transition">Reglas de apuestas</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-primary transition">Métodos de pago</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-primary transition">FAQ</a></li>
              <li><Link href="/contact"><a className="text-muted-foreground hover:text-primary transition">Contacto</a></Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-medium mb-4">Legal</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-muted-foreground hover:text-primary transition">Términos y condiciones</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-primary transition">Política de privacidad</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-primary transition">Juego responsable</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-primary transition">Licencias</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-primary transition">Cookies</a></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-8 pt-8">
          <div className="flex flex-col lg:flex-row justify-between items-center">
            <p className="text-sm text-muted-foreground mb-4 lg:mb-0">
              © 2025 BetTitan365 - Todos los derechos reservados.
            </p>
            
            <div className="flex flex-wrap justify-center space-x-4">
              <svg className="h-8" viewBox="0 0 50 30" fill="currentColor">
                <path d="M0 0h50v30H0z" fill="#1a1f71"/>
                <path d="M21 20h8V10h-8z" fill="#fff"/>
                <path d="M22 15a5 5 0 016.999-4.599A5 5 0 0122 15z" fill="#f79410"/>
                <path d="M36 15a5 5 0 01-6.999 4.599A5 5 0 0136 15z" fill="#f79410"/>
              </svg>
              
              <svg className="h-8" viewBox="0 0 50 30" fill="currentColor">
                <path d="M0 0h50v30H0z" fill="#3d3d3d"/>
                <circle cx="25" cy="15" r="8" fill="#eb001b"/>
                <circle cx="33" cy="15" r="8" fill="#f79e1b"/>
                <path d="M25 15a8 8 0 010-10 8 8 0 000 20 8 8 0 000-10z" fill="#ff5f00"/>
              </svg>
              
              <svg className="h-8" viewBox="0 0 50 30" fill="currentColor">
                <path d="M0 0h50v30H0z" fill="#003087"/>
                <path d="M18 12h-5a1 1 0 00-1 1l-2 11a.5.5 0 00.5.5h3a1 1 0 00.999-.867l.5-3.133h3.5a5 5 0 100-10h-.5z" fill="#fff"/>
                <path d="M33 12h-3a1 1 0 00-.934.648l-4 9.352H29l.5-1.5h3L33 22h2.5l-2.5-10zm-3.5 6.5l1-3 .75 3h-1.75z" fill="#fff"/>
                <path d="M44 16.5c-1 2.833-2.9 4.167-5.7 4-1.9.167-3.3-.667-4.2-2.5h6c.167-2-.833-3-3-3h-4.5l1.5-3h3l-.24.5h2.74l-.5-1a1 1 0 00-1-.5h-5a1 1 0 00-.937.648L27.5 22h8c3.167 0 6.5-1.833 8.5-5.5z" fill="#fff"/>
              </svg>
              
              <svg className="h-8" viewBox="0 0 50 30" fill="currentColor">
                <path d="M0 0h50v30H0z" fill="#26273c"/>
                <path d="M30 15a6.5 6.5 0 11-13 0 6.5 6.5 0 0113 0z" fill="#717ff7"/>
                <path d="M23.5 8.5v13" stroke="#fff" strokeWidth="1.5"/>
                <path d="M20 10.5h7M20 19.5h7" stroke="#fff"/>
              </svg>
            </div>
            
            <div className="flex items-center mt-4 lg:mt-0">
              <svg className="h-8" viewBox="0 0 40 20" fill="currentColor">
                <path d="M5 0h30a5 5 0 015 5v10a5 5 0 01-5 5H5a5 5 0 01-5-5V5a5 5 0 015-5z" fill="#333"/>
                <path d="M12 6l-2 8h4l2-8h-4zM25 6l-2 8h-4l2-8h4zM18 6h4l-1 4-1 4h-4l2-8z" fill="#fff"/>
              </svg>
              <svg className="h-8 ml-3" viewBox="0 0 40 20" fill="currentColor">
                <path d="M5 0h30a5 5 0 015 5v10a5 5 0 01-5 5H5a5 5 0 01-5-5V5a5 5 0 015-5z" fill="#333"/>
                <circle cx="20" cy="10" r="7" fill="#f7a100"/>
                <path d="M16 10a4 4 0 118 0 4 4 0 01-8 0zM15 6l-1.5 8M26.5 6l-1.5 8" stroke="#fff"/>
              </svg>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

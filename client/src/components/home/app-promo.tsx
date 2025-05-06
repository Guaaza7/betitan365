export default function AppPromo() {
  return (
    <section className="py-12 bg-gradient-to-r from-primary/20 to-primary/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between">
          <div className="md:w-1/2 mb-8 md:mb-0">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">Descarga nuestra app</h2>
            <p className="text-muted-foreground text-lg mb-6">Lleva las apuestas contigo donde vayas con nuestra aplicación móvil.</p>
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
              <a href="#" className="flex items-center bg-background hover:bg-gray-800 transition rounded-lg px-4 py-2 border border-gray-700">
                <i className="ri-apple-fill text-3xl mr-3"></i>
                <div>
                  <div className="text-xs text-muted-foreground">Descargar en</div>
                  <div className="text-sm font-medium">App Store</div>
                </div>
              </a>
              <a href="#" className="flex items-center bg-background hover:bg-gray-800 transition rounded-lg px-4 py-2 border border-gray-700">
                <i className="ri-google-play-fill text-3xl mr-3"></i>
                <div>
                  <div className="text-xs text-muted-foreground">Descargar en</div>
                  <div className="text-sm font-medium">Google Play</div>
                </div>
              </a>
            </div>
          </div>
          <div className="md:w-1/2 flex justify-center">
            <img 
              src="https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=350&h=600&q=80" 
              alt="BetTitan365 Mobile App" 
              className="rounded-xl shadow-2xl h-80 object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

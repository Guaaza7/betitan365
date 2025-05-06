import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";

export default function PromotionsShowcase() {
  const { data: promotions = [], isLoading } = useQuery({
    queryKey: ["/api/promotions"],
  });

  const displayPromotions = isLoading ? [] : promotions.slice(0, 3);

  return (
    <section id="promociones" className="py-12 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-bold text-foreground mb-6">Promociones Especiales</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {isLoading ? (
            // Loading skeleton
            Array(3).fill(0).map((_, i) => (
              <div key={i} className="relative rounded-xl overflow-hidden h-48 animate-pulse bg-card"></div>
            ))
          ) : displayPromotions.length > 0 ? (
            displayPromotions.map((promo) => (
              <div key={promo.id} className="relative group overflow-hidden rounded-xl">
                <img 
                  src={promo.imageUrl} 
                  alt={promo.title} 
                  className="w-full h-48 object-cover rounded-xl transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent"></div>
                <div className="absolute bottom-0 left-0 p-4">
                  <div className="flex items-center bg-primary text-white px-2 py-1 rounded text-xs font-medium mb-2 w-fit">
                    {promo.category}
                  </div>
                  <h3 className="text-lg font-bold text-white">{promo.title}</h3>
                  <p className="text-sm text-gray-200">{promo.description}</p>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-3 text-center py-10 text-muted-foreground">
              No hay promociones disponibles en este momento
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

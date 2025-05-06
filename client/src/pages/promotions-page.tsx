import { useQuery } from "@tanstack/react-query";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import { Helmet } from "react-helmet";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";

type Promotion = {
  id: number;
  title: string;
  description: string;
  imageUrl: string;
  category: string;
  endDate: string;
  terms: string;
  code?: string;
};

export default function PromotionsPage() {
  const { data: promotions = [], isLoading } = useQuery<Promotion[]>({
    queryKey: ["/api/promotions"],
  });

  // Group promotions by category
  const allPromotions = promotions.filter(p => p.category !== "new_users");
  const newUserPromotions = promotions.filter(p => p.category === "new_users");
  
  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('es', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    }).format(date);
  };

  // Render a promotion card
  const renderPromotionCard = (promo: Promotion) => (
    <Card key={promo.id} className="overflow-hidden">
      <div className="relative">
        <img 
          src={promo.imageUrl} 
          alt={promo.title} 
          className="w-full h-48 object-cover"
        />
        <div className="absolute top-4 left-4">
          <span className="bg-primary text-white px-3 py-1 rounded-full text-xs font-medium">
            {promo.category === "new_users" ? "Nuevos usuarios" : 
             promo.category === "sports" ? "Deportes" :
             promo.category === "casino" ? "Casino" : promo.category}
          </span>
        </div>
      </div>
      <CardContent className="pt-4">
        <h3 className="text-lg font-bold mb-2">{promo.title}</h3>
        <p className="text-muted-foreground mb-4">{promo.description}</p>
        <div className="flex justify-between items-center mb-4">
          <span className="text-xs text-muted-foreground">
            Válido hasta: {formatDate(promo.endDate)}
          </span>
          {promo.code && (
            <span className="text-xs font-medium bg-secondary px-2 py-1 rounded">
              CÓDIGO: {promo.code}
            </span>
          )}
        </div>
        <Button className="w-full bg-primary hover:bg-red-700">Reclamar Oferta</Button>
      </CardContent>
    </Card>
  );

  return (
    <>
      <Helmet>
        <title>Promociones y Ofertas | BetTitan365</title>
        <meta
          name="description"
          content="Descubre nuestras promociones exclusivas y bonos especiales para apuestas deportivas y casino."
        />
      </Helmet>

      <Navbar />

      <main className="min-h-screen bg-background py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-3xl font-bold">Promociones Especiales</h1>
            <p className="text-muted-foreground mt-2">
              Aprovecha nuestras ofertas exclusivas y maximiza tus ganancias
            </p>
          </div>

          {/* Hero Promotion for New Users */}
          {newUserPromotions.length > 0 && (
            <div className="mb-12 relative overflow-hidden rounded-xl">
              <div 
                className="relative py-16 px-8"
                style={{
                  backgroundImage: `linear-gradient(rgba(0,0,0,0.7), rgba(0,0,0,0.7)), url(${newUserPromotions[0].imageUrl})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center"
                }}
              >
                <div className="max-w-2xl">
                  <div className="mb-4 inline-block bg-primary text-white px-3 py-1 rounded-md text-sm font-medium">
                    Bono de Bienvenida
                  </div>
                  <h2 className="text-3xl md:text-4xl font-bold mb-4">{newUserPromotions[0].title}</h2>
                  <p className="text-lg mb-6">{newUserPromotions[0].description}</p>
                  <Link href="/auth">
                    <a className="inline-block bg-primary hover:bg-red-700 text-white font-medium py-3 px-6 rounded-md text-lg transition">
                      Registrarse Ahora
                    </a>
                  </Link>
                </div>
              </div>
            </div>
          )}

          {/* All Promotions */}
          <Card>
            <CardHeader>
              <CardTitle>Todas las Promociones</CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="all" className="w-full">
                <TabsList className="w-full mb-6">
                  <TabsTrigger value="all" className="flex-1">Todas</TabsTrigger>
                  <TabsTrigger value="sports" className="flex-1">Deportes</TabsTrigger>
                  <TabsTrigger value="casino" className="flex-1">Casino</TabsTrigger>
                </TabsList>

                <TabsContent value="all">
                  {isLoading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {Array(6).fill(0).map((_, i) => (
                        <Card key={i} className="overflow-hidden animate-pulse">
                          <div className="h-48 bg-card"></div>
                          <CardContent className="h-48"></CardContent>
                        </Card>
                      ))}
                    </div>
                  ) : allPromotions.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {allPromotions.map(renderPromotionCard)}
                    </div>
                  ) : (
                    <div className="text-center py-10 text-muted-foreground">
                      No hay promociones disponibles en este momento
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="sports">
                  {isLoading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {Array(3).fill(0).map((_, i) => (
                        <Card key={i} className="overflow-hidden animate-pulse">
                          <div className="h-48 bg-card"></div>
                          <CardContent className="h-48"></CardContent>
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {allPromotions
                        .filter(p => p.category === "sports")
                        .map(renderPromotionCard)}
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="casino">
                  {isLoading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {Array(3).fill(0).map((_, i) => (
                        <Card key={i} className="overflow-hidden animate-pulse">
                          <div className="h-48 bg-card"></div>
                          <CardContent className="h-48"></CardContent>
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {allPromotions
                        .filter(p => p.category === "casino")
                        .map(renderPromotionCard)}
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          {/* Terms and Conditions */}
          <div className="mt-12 p-6 bg-card rounded-lg">
            <h3 className="text-lg font-bold mb-4">Términos y Condiciones Generales</h3>
            <div className="text-sm text-muted-foreground space-y-2">
              <p>Todas las promociones están sujetas a los siguientes términos y condiciones:</p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Las promociones son válidas para usuarios mayores de 18 años.</li>
                <li>Se requiere una cuenta verificada para reclamar cualquier promoción.</li>
                <li>Las promociones no son acumulables con otras ofertas.</li>
                <li>BetTitan365 se reserva el derecho de modificar o cancelar cualquier promoción sin previo aviso.</li>
                <li>Se aplican requisitos de apuesta según cada promoción específica.</li>
                <li>Consulta los términos específicos de cada promoción para más detalles.</li>
              </ul>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}

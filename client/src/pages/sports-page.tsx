import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import BetSlip from "@/components/betting/bet-slip";
import MatchCard from "@/components/betting/match-card";
import { Helmet } from "react-helmet";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Calendar, ChevronRight } from "lucide-react";

export default function SportsPage() {
  const [searchLocation] = useLocation();
  const urlParams = new URLSearchParams(searchLocation.split("?")[1]);
  const categoryParam = urlParams.get("category");

  const [sportCategory, setSportCategory] = useState(categoryParam || "all");
  const [timeFilter, setTimeFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  
  // Get all available sport categories
  const { data: categories = [] } = useQuery({
    queryKey: ["/api/sports/categories"],
  });
  
  // Get events filtered by the selected category and time filter
  const { data: events = [], isLoading } = useQuery({
    queryKey: ["/api/events", sportCategory, timeFilter, searchQuery],
  });

  // Sports category icons mapping
  const categoryIcons: Record<string, string> = {
    football: "ri-football-line",
    basketball: "ri-basketball-line",
    tennis: "ri-tennis-line",
    "american-football": "ri-football-fill",
    baseball: "ri-gamepad-line",
    esports: "ri-gamepad-line",
    default: "ri-basketball-line"
  };

  // Format categories for display
  const displayCategories = categories.map((cat: any) => ({
    ...cat,
    icon: categoryIcons[cat.slug] || categoryIcons.default
  }));

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // The query will be used in the useQuery hook
  };

  return (
    <>
      <Helmet>
        <title>Deportes | BetTitan365</title>
        <meta
          name="description"
          content="Explora todos los eventos deportivos disponibles y realiza tus apuestas con las mejores cuotas."
        />
      </Helmet>

      <Navbar />

      <main className="min-h-screen bg-background py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {/* Sidebar with categories */}
            <div className="md:col-span-1">
              <Card className="sticky top-20">
                <CardHeader className="pb-3">
                  <CardTitle>Deportes</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 p-0">
                  <ul>
                    <li>
                      <Button
                        variant="ghost"
                        onClick={() => setSportCategory("all")}
                        className={`w-full justify-start ${sportCategory === "all" ? "text-primary" : ""}`}
                      >
                        <i className="ri-apps-line mr-2 text-lg"></i>
                        Todos los deportes
                        <ChevronRight className="ml-auto h-4 w-4" />
                      </Button>
                    </li>
                    {!isLoading && displayCategories.map((category: any) => (
                      <li key={category.id}>
                        <Button
                          variant="ghost"
                          onClick={() => setSportCategory(category.slug)}
                          className={`w-full justify-start ${sportCategory === category.slug ? "text-primary" : ""}`}
                        >
                          <i className={`${category.icon} mr-2 text-lg`}></i>
                          {category.name}
                          <ChevronRight className="ml-auto h-4 w-4" />
                        </Button>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>

            {/* Main content with events */}
            <div className="md:col-span-3">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                <div>
                  <h1 className="text-2xl font-bold">
                    {sportCategory === "all" 
                      ? "Todos los deportes" 
                      : displayCategories.find((c: any) => c.slug === sportCategory)?.name || "Deportes"}
                  </h1>
                  <p className="text-muted-foreground">
                    Encuentra los mejores eventos y apuesta con las mejores cuotas
                  </p>
                </div>

                <form onSubmit={handleSearch} className="flex w-full md:w-auto">
                  <div className="relative flex-1 md:flex-initial">
                    <Search className="absolute left-2.5 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="search"
                      placeholder="Buscar eventos..."
                      className="pl-8 w-full md:w-[200px]"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                  <Button type="submit" className="ml-2 bg-primary hover:bg-red-700">Buscar</Button>
                </form>
              </div>

              <Card>
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <Calendar className="mr-2 h-5 w-5" />
                      <CardTitle>Eventos</CardTitle>
                    </div>
                    <Select value={timeFilter} onValueChange={setTimeFilter}>
                      <SelectTrigger className="w-[140px]">
                        <SelectValue placeholder="Filtrar por fecha" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Todos</SelectItem>
                        <SelectItem value="today">Hoy</SelectItem>
                        <SelectItem value="tomorrow">Mañana</SelectItem>
                        <SelectItem value="week">Esta semana</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardHeader>
                <CardContent>
                  <Tabs defaultValue="upcoming">
                    <TabsList className="w-full mb-6">
                      <TabsTrigger value="upcoming" className="flex-1">Próximos</TabsTrigger>
                      <TabsTrigger value="live" className="flex-1">En Vivo</TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="upcoming" className="space-y-4">
                      {isLoading ? (
                        // Loading skeleton
                        Array(5).fill(0).map((_, i) => (
                          <div key={i} className="bg-card rounded-lg overflow-hidden border border-gray-800 h-28 animate-pulse">
                            <div className="p-4 h-full"></div>
                          </div>
                        ))
                      ) : events.length > 0 ? (
                        events.map((match) => (
                          <MatchCard key={match.id} match={match} />
                        ))
                      ) : (
                        <div className="text-center py-10 text-muted-foreground">
                          No hay eventos disponibles con los filtros seleccionados
                        </div>
                      )}
                    </TabsContent>
                    
                    <TabsContent value="live" className="space-y-4">
                      {isLoading ? (
                        // Loading skeleton
                        Array(2).fill(0).map((_, i) => (
                          <div key={i} className="bg-card rounded-lg overflow-hidden border border-gray-800 h-28 animate-pulse">
                            <div className="p-4 h-full"></div>
                          </div>
                        ))
                      ) : (
                        <div className="text-center py-10 text-muted-foreground">
                          No hay eventos en vivo en este momento para esta categoría
                        </div>
                      )}
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>

      <BetSlip />
      <Footer />
    </>
  );
}

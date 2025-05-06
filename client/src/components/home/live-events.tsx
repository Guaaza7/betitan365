import { useQuery } from "@tanstack/react-query";
import LiveMatchCard from "../betting/live-match-card";
import { Link } from "wouter";

export default function LiveEvents() {
  const { data: liveEvents = [], isLoading } = useQuery({
    queryKey: ["/api/events/live"],
  });

  return (
    <section className="py-12 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-foreground">Eventos en Vivo</h2>
          <Link href="/sports">
            <a className="text-primary hover:text-red-400 font-medium flex items-center">
              Ver todos <i className="ri-arrow-right-line ml-1"></i>
            </a>
          </Link>
        </div>
        
        <div className="overflow-x-auto scroll-hidden pb-4">
          <div className="flex space-x-4 min-w-max">
            {isLoading ? (
              // Loading skeleton
              Array(3).fill(0).map((_, i) => (
                <div key={i} className="bg-card rounded-lg overflow-hidden w-80 border border-gray-800 h-64 animate-pulse">
                  <div className="p-4 h-full"></div>
                </div>
              ))
            ) : liveEvents.length > 0 ? (
              liveEvents.map((event) => (
                <LiveMatchCard key={event.id} match={event} />
              ))
            ) : (
              <div className="w-full text-center py-10 text-muted-foreground">
                No hay eventos en vivo en este momento
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

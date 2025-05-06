import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import MatchCard from "../betting/match-card";

export default function UpcomingMatches() {
  const [timeFilter, setTimeFilter] = useState("today");

  const { data: upcomingMatches = [], isLoading } = useQuery({
    queryKey: ["/api/events/upcoming", timeFilter],
  });

  return (
    <section className="py-12 bg-card">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-foreground">Próximos Partidos</h2>
          <div className="flex space-x-2">
            <Button 
              variant="secondary" 
              className={cn(timeFilter === "today" ? "bg-primary text-white" : "")}
              onClick={() => setTimeFilter("today")}
            >
              Hoy
            </Button>
            <Button 
              variant="secondary" 
              className={cn(timeFilter === "tomorrow" ? "bg-primary text-white" : "")}
              onClick={() => setTimeFilter("tomorrow")}
            >
              Mañana
            </Button>
            <Button 
              variant="secondary" 
              className={cn(timeFilter === "week" ? "bg-primary text-white" : "")}
              onClick={() => setTimeFilter("week")}
            >
              Esta semana
            </Button>
          </div>
        </div>
        
        <div className="space-y-3">
          {isLoading ? (
            // Loading skeleton
            Array(2).fill(0).map((_, i) => (
              <div key={i} className="bg-background rounded-lg overflow-hidden border border-gray-800 h-28 animate-pulse">
                <div className="p-4 h-full"></div>
              </div>
            ))
          ) : upcomingMatches.length > 0 ? (
            upcomingMatches.map((match) => (
              <MatchCard key={match.id} match={match} />
            ))
          ) : (
            <div className="w-full text-center py-10 text-muted-foreground">
              No hay partidos programados para este período
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

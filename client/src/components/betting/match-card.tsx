import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";

type MatchCardProps = {
  match: {
    id: number;
    league: string;
    homeTeam: {
      id: number;
      name: string;
      logo: string;
    };
    awayTeam: {
      id: number;
      name: string;
      logo: string;
    };
    startTime: string;
    odds: {
      home: number;
      draw: number;
      away: number;
    };
  };
};

export default function MatchCard({ match }: MatchCardProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [_, navigate] = useLocation();
  const [selectedBet, setSelectedBet] = useState<string | null>(null);

  const addToBetSlipMutation = useMutation({
    mutationFn: async (data: { eventId: number; betType: string; odds: number }) => {
      const res = await apiRequest("POST", "/api/bets/slip/add", data);
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/bets/slip"] });
      toast({
        title: "Apuesta agregada",
        description: "La selección se ha añadido a tu boleto de apuestas",
      });
      setSelectedBet(null);
    },
    onError: (error) => {
      if (!user) {
        toast({
          title: "Inicio de sesión requerido",
          description: "Debes iniciar sesión para agregar apuestas al boleto",
          variant: "destructive",
        });
        navigate("/auth");
      } else {
        toast({
          title: "Error al agregar apuesta",
          description: error.message,
          variant: "destructive",
        });
      }
    },
  });

  const handleBetSelection = (betType: string, odds: number) => {
    if (addToBetSlipMutation.isPending) return;
    
    setSelectedBet(betType);
    addToBetSlipMutation.mutate({
      eventId: match.id,
      betType,
      odds,
    });
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('es', {
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  return (
    <div className="bg-background rounded-lg overflow-hidden border border-gray-800 hover:border-gray-700 transition">
      <div className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center">
            <i className="ri-football-line text-primary mr-2"></i>
            <span className="text-sm text-muted-foreground">{match.league}</span>
          </div>
          <div className="text-sm text-muted-foreground">
            {formatDate(match.startTime)}
          </div>
        </div>
        
        <div className="grid grid-cols-7 gap-2 items-center">
          <div className="col-span-3 text-right">
            <div className="flex items-center justify-end">
              <span className="font-medium mr-2">{match.homeTeam.name}</span>
              <img src={match.homeTeam.logo} className="w-6 h-6 object-contain" alt={`${match.homeTeam.name} logo`} />
            </div>
          </div>
          
          <div className="col-span-1 flex justify-center">
            <span className="text-sm font-bold">vs</span>
          </div>
          
          <div className="col-span-3 text-left">
            <div className="flex items-center">
              <img src={match.awayTeam.logo} className="w-6 h-6 object-contain mr-2" alt={`${match.awayTeam.name} logo`} />
              <span className="font-medium">{match.awayTeam.name}</span>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-3 gap-2 mt-4">
          <Button 
            variant="outline" 
            className="flex flex-col items-center h-auto py-2 bg-secondary hover:bg-gray-700"
            onClick={() => handleBetSelection("home", match.odds.home)}
            disabled={addToBetSlipMutation.isPending && selectedBet === "home"}
          >
            <span className="text-xs text-muted-foreground">1</span>
            <span className="text-sm font-medium">{match.odds.home.toFixed(2)}</span>
          </Button>
          
          <Button 
            variant="outline" 
            className="flex flex-col items-center h-auto py-2 bg-secondary hover:bg-gray-700"
            onClick={() => handleBetSelection("draw", match.odds.draw)}
            disabled={addToBetSlipMutation.isPending && selectedBet === "draw"}
          >
            <span className="text-xs text-muted-foreground">X</span>
            <span className="text-sm font-medium">{match.odds.draw.toFixed(2)}</span>
          </Button>
          
          <Button 
            variant="outline" 
            className="flex flex-col items-center h-auto py-2 bg-secondary hover:bg-gray-700"
            onClick={() => handleBetSelection("away", match.odds.away)}
            disabled={addToBetSlipMutation.isPending && selectedBet === "away"}
          >
            <span className="text-xs text-muted-foreground">2</span>
            <span className="text-sm font-medium">{match.odds.away.toFixed(2)}</span>
          </Button>
        </div>
      </div>
    </div>
  );
}

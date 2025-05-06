import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";

type LiveMatchProps = {
  match: {
    id: number;
    league: string;
    homeTeam: {
      id: number;
      name: string;
      logo: string;
      score: number;
    };
    awayTeam: {
      id: number;
      name: string;
      logo: string;
      score: number;
    };
    minute: number;
    odds: {
      home: number;
      draw: number;
      away: number;
    };
  };
};

export default function LiveMatchCard({ match }: LiveMatchProps) {
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

  return (
    <div className="bg-card rounded-lg overflow-hidden w-80 border border-gray-800 hover:border-gray-700 transition">
      <div className="p-4 border-b border-gray-800">
        <div className="flex justify-between items-center">
          <span className="text-xs font-medium text-red-500 flex items-center">
            <span className="w-2 h-2 bg-red-500 rounded-full mr-1 animate-pulse"></span>
            EN VIVO
          </span>
          <span className="text-xs text-muted-foreground">{match.minute}'</span>
        </div>
        
        <div className="flex justify-between items-center mt-3">
          <div className="flex items-center">
            <img src={match.homeTeam.logo} className="w-8 h-8 object-contain mr-2" alt={`${match.homeTeam.name} logo`} />
            <span className="font-medium">{match.homeTeam.name}</span>
          </div>
          <span className="text-xl font-bold mx-4">{match.homeTeam.score}</span>
        </div>
        
        <div className="flex justify-between items-center mt-3">
          <div className="flex items-center">
            <img src={match.awayTeam.logo} className="w-8 h-8 object-contain mr-2" alt={`${match.awayTeam.name} logo`} />
            <span className="font-medium">{match.awayTeam.name}</span>
          </div>
          <span className="text-xl font-bold mx-4">{match.awayTeam.score}</span>
        </div>
      </div>
      
      <div className="p-4 grid grid-cols-3 gap-2">
        <Button 
          variant="outline" 
          className="flex flex-col items-center h-auto py-2 bg-background hover:bg-gray-800"
          onClick={() => handleBetSelection("home", match.odds.home)}
          disabled={addToBetSlipMutation.isPending && selectedBet === "home"}
        >
          <span className="text-xs text-muted-foreground">Local</span>
          <span className="text-sm font-medium">{match.odds.home.toFixed(2)}</span>
        </Button>
        
        <Button 
          variant="outline" 
          className="flex flex-col items-center h-auto py-2 bg-background hover:bg-gray-800"
          onClick={() => handleBetSelection("draw", match.odds.draw)}
          disabled={addToBetSlipMutation.isPending && selectedBet === "draw"}
        >
          <span className="text-xs text-muted-foreground">Empate</span>
          <span className="text-sm font-medium">{match.odds.draw.toFixed(2)}</span>
        </Button>
        
        <Button 
          variant="outline" 
          className="flex flex-col items-center h-auto py-2 bg-background hover:bg-gray-800"
          onClick={() => handleBetSelection("away", match.odds.away)}
          disabled={addToBetSlipMutation.isPending && selectedBet === "away"}
        >
          <span className="text-xs text-muted-foreground">Visitante</span>
          <span className="text-sm font-medium">{match.odds.away.toFixed(2)}</span>
        </Button>
      </div>
      
      <div className="px-4 pb-4">
        <Button variant="link" className="w-full text-xs text-muted-foreground hover:text-white">
          +25 mercados <i className="ri-arrow-down-s-line ml-1"></i>
        </Button>
      </div>
    </div>
  );
}

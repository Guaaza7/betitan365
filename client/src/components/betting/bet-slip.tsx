import { useState, useEffect } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { X } from "lucide-react";

type BetItem = {
  id: number;
  eventId: number;
  teamName: string;
  odds: number;
  betType: string;
  match: string;
};

export default function BetSlip() {
  const [isOpen, setIsOpen] = useState(false);
  const [amounts, setAmounts] = useState<Record<number, string>>({});
  const { user } = useAuth();
  const { toast } = useToast();
  
  const { data: betSlip = { items: [], totalOdds: 1 }, isLoading } = useQuery({
    queryKey: ["/api/bets/slip"],
    enabled: !!user,
  });

  const placeBetMutation = useMutation({
    mutationFn: async (data: { items: Array<{id: number, amount: number}> }) => {
      const res = await apiRequest("POST", "/api/bets/place", data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/bets/slip"] });
      queryClient.invalidateQueries({ queryKey: ["/api/user"] });
      toast({
        title: "Apuesta realizada",
        description: "Tu apuesta ha sido registrada correctamente"
      });
      setIsOpen(false);
    },
    onError: (error: Error) => {
      toast({
        title: "Error al realizar la apuesta",
        description: error.message,
        variant: "destructive"
      });
    }
  });

  const removeBetMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/bets/slip/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/bets/slip"] });
      toast({
        title: "Apuesta eliminada",
        description: "La selección ha sido eliminada del boleto"
      });
    }
  });

  const totalBetAmount = Object.values(amounts)
    .reduce((sum, amount) => sum + (parseFloat(amount) || 0), 0);
    
  const potentialWin = totalBetAmount * betSlip.totalOdds;

  const handlePlaceBet = () => {
    if (!user) {
      toast({
        title: "Inicio de sesión requerido",
        description: "Debes iniciar sesión para realizar apuestas",
        variant: "destructive"
      });
      return;
    }

    const items = betSlip.items.map(item => ({
      id: item.id,
      amount: parseFloat(amounts[item.id] || "0")
    })).filter(item => item.amount > 0);

    if (items.length === 0) {
      toast({
        title: "Error en la apuesta",
        description: "Debes ingresar un monto de apuesta válido",
        variant: "destructive"
      });
      return;
    }

    placeBetMutation.mutate({ items });
  };

  // Initialize amounts for new items
  useEffect(() => {
    if (betSlip?.items && betSlip.items.length > 0) {
      const newAmounts = { ...amounts };
      let hasNewItems = false;
      
      // Check for new items that don't have amounts set
      betSlip.items.forEach(item => {
        if (!amounts[item.id]) {
          newAmounts[item.id] = "5"; // Default amount
          hasNewItems = true;
        }
      });
      
      // Only update state if there are new items
      if (hasNewItems) {
        setAmounts(newAmounts);
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [betSlip?.items]);

  const handleAmountChange = (id: number, value: string) => {
    setAmounts(prev => ({
      ...prev,
      [id]: value
    }));
  };

  const betSlipCount = betSlip?.items?.length || 0;

  return (
    <div className="fixed bottom-4 right-4 z-40 hidden md:block">
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <Button className="flex items-center bg-primary hover:bg-red-700 text-white px-4 py-3 rounded-lg shadow-lg transition">
            <i className="ri-bill-line mr-2"></i>
            <span className="font-medium">Boleto de apuestas ({betSlipCount})</span>
          </Button>
        </SheetTrigger>
        <SheetContent className="w-[400px] sm:w-[540px] bg-card">
          <SheetHeader>
            <SheetTitle>Boleto de Apuestas</SheetTitle>
          </SheetHeader>
          
          <div className="flex justify-between mt-4 mb-2 text-sm font-medium">
            <span>Selecciones</span>
            <span>Cuota Total: {betSlip.totalOdds.toFixed(2)}</span>
          </div>
          
          {isLoading ? (
            <div className="flex justify-center py-8">
              <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : betSlipCount > 0 ? (
            <>
              <ScrollArea className="h-[50vh] pr-4">
                <div className="space-y-4 mt-4">
                  {betSlip.items.map((bet: BetItem) => (
                    <div key={bet.id} className="bg-background p-3 rounded-md">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="text-sm text-muted-foreground">{bet.match}</p>
                          <p className="font-medium">{bet.teamName} - {bet.betType}</p>
                          <p className="text-sm text-primary font-semibold">Cuota: {bet.odds.toFixed(2)}</p>
                        </div>
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => removeBetMutation.mutate(bet.id)}
                          disabled={removeBetMutation.isPending}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="mt-2">
                        <Input
                          type="number"
                          min="1"
                          placeholder="Monto"
                          value={amounts[bet.id] || ""}
                          onChange={(e) => handleAmountChange(bet.id, e.target.value)}
                          className="text-right"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
              
              <div className="mt-4 space-y-2 border-t border-gray-800 pt-4">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Total apostado:</span>
                  <span className="font-medium">${totalBetAmount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Ganancia potencial:</span>
                  <span className="font-medium text-primary">${potentialWin.toFixed(2)}</span>
                </div>
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center py-10">
              <i className="ri-bill-line text-4xl text-muted-foreground mb-3"></i>
              <p className="text-muted-foreground">Tu boleto de apuestas está vacío</p>
              <p className="text-sm text-muted-foreground">Selecciona alguna cuota para comenzar a apostar</p>
            </div>
          )}
          
          <SheetFooter className="mt-6">
            <Button 
              className="w-full bg-primary hover:bg-red-700"
              onClick={handlePlaceBet}
              disabled={placeBetMutation.isPending || betSlipCount === 0}
            >
              {placeBetMutation.isPending ? "Procesando..." : "Realizar Apuesta"}
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </div>
  );
}

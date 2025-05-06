import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/use-auth";

export default function AccountSummary() {
  const { user } = useAuth();
  
  const { data: accountStats = { 
    balance: 0, 
    pendingBets: 0, 
    totalWon: 0, 
    totalLost: 0
  }} = useQuery({
    queryKey: ['/api/user/stats'],
    enabled: !!user
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">Resumen de Cuenta</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-card p-4 rounded-lg border border-border">
            <p className="text-sm text-muted-foreground">Balance</p>
            <p className="text-2xl font-semibold">${accountStats.balance.toFixed(2)}</p>
          </div>
          
          <div className="bg-card p-4 rounded-lg border border-border">
            <p className="text-sm text-muted-foreground">Apuestas Pendientes</p>
            <p className="text-2xl font-semibold">{accountStats.pendingBets}</p>
          </div>
          
          <div className="bg-card p-4 rounded-lg border border-border">
            <p className="text-sm text-muted-foreground">Total Ganado</p>
            <p className={cn("text-2xl font-semibold", accountStats.totalWon > 0 ? "text-green-500" : "")}>
              ${accountStats.totalWon.toFixed(2)}
            </p>
          </div>
          
          <div className="bg-card p-4 rounded-lg border border-border">
            <p className="text-sm text-muted-foreground">Total Perdido</p>
            <p className={cn("text-2xl font-semibold", accountStats.totalLost > 0 ? "text-red-500" : "")}>
              ${accountStats.totalLost.toFixed(2)}
            </p>
          </div>
        </div>
        
        <Tabs defaultValue="deposit">
          <TabsList className="w-full">
            <TabsTrigger value="deposit" className="flex-1">Depositar</TabsTrigger>
            <TabsTrigger value="withdraw" className="flex-1">Retirar</TabsTrigger>
          </TabsList>
          
          <TabsContent value="deposit" className="p-4 border border-border rounded-lg mt-4">
            <h3 className="font-medium mb-4">Selecciona un método de depósito</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
              <Button variant="outline" className="p-4 h-auto flex flex-col items-center justify-center">
                <svg viewBox="0 0 50 30" className="h-8 w-12 mb-2">
                  <path d="M0 0h50v30H0z" fill="#1a1f71"/>
                  <path d="M21 20h8V10h-8z" fill="#fff"/>
                  <path d="M22 15a5 5 0 016.999-4.599A5 5 0 0122 15z" fill="#f79410"/>
                  <path d="M36 15a5 5 0 01-6.999 4.599A5 5 0 0136 15z" fill="#f79410"/>
                </svg>
                <span className="text-sm">Visa</span>
              </Button>
              
              <Button variant="outline" className="p-4 h-auto flex flex-col items-center justify-center">
                <svg viewBox="0 0 50 30" className="h-8 w-12 mb-2">
                  <path d="M0 0h50v30H0z" fill="#3d3d3d"/>
                  <circle cx="25" cy="15" r="8" fill="#eb001b"/>
                  <circle cx="33" cy="15" r="8" fill="#f79e1b"/>
                  <path d="M25 15a8 8 0 010-10 8 8 0 000 20 8 8 0 000-10z" fill="#ff5f00"/>
                </svg>
                <span className="text-sm">Mastercard</span>
              </Button>
              
              <Button variant="outline" className="p-4 h-auto flex flex-col items-center justify-center">
                <svg viewBox="0 0 50 30" className="h-8 w-12 mb-2">
                  <path d="M0 0h50v30H0z" fill="#003087"/>
                  <path d="M18 12h-5a1 1 0 00-1 1l-2 11a.5.5 0 00.5.5h3a1 1 0 00.999-.867l.5-3.133h3.5a5 5 0 100-10h-.5z" fill="#fff"/>
                  <path d="M33 12h-3a1 1 0 00-.934.648l-4 9.352H29l.5-1.5h3L33 22h2.5l-2.5-10zm-3.5 6.5l1-3 .75 3h-1.75z" fill="#fff"/>
                  <path d="M44 16.5c-1 2.833-2.9 4.167-5.7 4-1.9.167-3.3-.667-4.2-2.5h6c.167-2-.833-3-3-3h-4.5l1.5-3h3l-.24.5h2.74l-.5-1a1 1 0 00-1-.5h-5a1 1 0 00-.937.648L27.5 22h8c3.167 0 6.5-1.833 8.5-5.5z" fill="#fff"/>
                </svg>
                <span className="text-sm">PayPal</span>
              </Button>
              
              <Button variant="outline" className="p-4 h-auto flex flex-col items-center justify-center">
                <svg viewBox="0 0 50 30" className="h-8 w-12 mb-2">
                  <path d="M0 0h50v30H0z" fill="#26273c"/>
                  <path d="M30 15a6.5 6.5 0 11-13 0 6.5 6.5 0 0113 0z" fill="#717ff7"/>
                  <path d="M23.5 8.5v13" stroke="#fff" strokeWidth="1.5"/>
                  <path d="M20 10.5h7M20 19.5h7" stroke="#fff"/>
                </svg>
                <span className="text-sm">Skrill</span>
              </Button>
            </div>
            
            <Button className="w-full bg-primary hover:bg-red-700">Continuar</Button>
          </TabsContent>
          
          <TabsContent value="withdraw" className="p-4 border border-border rounded-lg mt-4">
            <h3 className="font-medium mb-4">Selecciona un método de retiro</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
              <Button variant="outline" className="p-4 h-auto flex flex-col items-center justify-center">
                <svg viewBox="0 0 50 30" className="h-8 w-12 mb-2">
                  <path d="M0 0h50v30H0z" fill="#003087"/>
                  <path d="M18 12h-5a1 1 0 00-1 1l-2 11a.5.5 0 00.5.5h3a1 1 0 00.999-.867l.5-3.133h3.5a5 5 0 100-10h-.5z" fill="#fff"/>
                  <path d="M33 12h-3a1 1 0 00-.934.648l-4 9.352H29l.5-1.5h3L33 22h2.5l-2.5-10zm-3.5 6.5l1-3 .75 3h-1.75z" fill="#fff"/>
                  <path d="M44 16.5c-1 2.833-2.9 4.167-5.7 4-1.9.167-3.3-.667-4.2-2.5h6c.167-2-.833-3-3-3h-4.5l1.5-3h3l-.24.5h2.74l-.5-1a1 1 0 00-1-.5h-5a1 1 0 00-.937.648L27.5 22h8c3.167 0 6.5-1.833 8.5-5.5z" fill="#fff"/>
                </svg>
                <span className="text-sm">PayPal</span>
              </Button>
              
              <Button variant="outline" className="p-4 h-auto flex flex-col items-center justify-center">
                <svg viewBox="0 0 50 30" className="h-8 w-12 mb-2">
                  <path d="M0 0h50v30H0z" fill="#26273c"/>
                  <path d="M30 15a6.5 6.5 0 11-13 0 6.5 6.5 0 0113 0z" fill="#717ff7"/>
                  <path d="M23.5 8.5v13" stroke="#fff" strokeWidth="1.5"/>
                  <path d="M20 10.5h7M20 19.5h7" stroke="#fff"/>
                </svg>
                <span className="text-sm">Skrill</span>
              </Button>
              
              <Button variant="outline" className="p-4 h-auto flex flex-col items-center justify-center">
                <svg viewBox="0 0 50 30" className="h-8 w-12 mb-2">
                  <rect width="50" height="30" rx="3" fill="#1d2123"/>
                  <path d="M12 10h26a2 2 0 012 2v8a2 2 0 01-2 2H12a2 2 0 01-2-2v-8a2 2 0 012-2z" fill="#424b4e"/>
                  <path d="M16 15h18M24.5 13v4" stroke="#fff"/>
                </svg>
                <span className="text-sm">Transferencia</span>
              </Button>
            </div>
            
            <Button className="w-full bg-primary hover:bg-red-700">Continuar</Button>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}

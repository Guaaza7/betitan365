import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useEffect } from "react";
import { useLocation } from "wouter";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import { Helmet } from "react-helmet";
import { useToast } from "@/hooks/use-toast";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search, CheckCircle, XCircle, Clock, AlertTriangle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function ManageBets() {
  const { user } = useAuth();
  const [_, navigate] = useLocation();
  const { toast } = useToast();
  const [isSettleDialogOpen, setIsSettleDialogOpen] = useState(false);
  const [selectedBet, setSelectedBet] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentTab, setCurrentTab] = useState("active");
  
  // Redirect if not an admin
  useEffect(() => {
    if (user && !user.isAdmin) {
      navigate("/");
    }
  }, [user, navigate]);

  // Fetch bets data
  const { data: bets = [], isLoading } = useQuery({
    queryKey: ["/api/admin/bets", statusFilter, searchQuery, currentTab],
    enabled: !!(user?.isAdmin)
  });

  // Settle bet mutation
  const settleBetMutation = useMutation({
    mutationFn: async ({ id, status }: { id: number; status: string }) => {
      const res = await apiRequest("PUT", `/api/admin/bets/${id}/settle`, { status });
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/bets"] });
      toast({
        title: "Apuesta liquidada",
        description: "La apuesta ha sido liquidada correctamente",
      });
      setIsSettleDialogOpen(false);
    },
    onError: (error: Error) => {
      toast({
        title: "Error al liquidar apuesta",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Handle search form submission
  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    queryClient.invalidateQueries({ queryKey: ["/api/admin/bets", statusFilter, searchQuery, currentTab] });
  }

  // Handle settle bet confirmation
  function handleSettleBet(status: string) {
    if (selectedBet) {
      settleBetMutation.mutate({ id: selectedBet.id, status });
    }
  }

  // Handle settle button click
  function handleSettleClick(bet: any) {
    setSelectedBet(bet);
    setIsSettleDialogOpen(true);
  }

  // Format date for display
  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('es', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  // Status colors and text
  const getStatusColor = (status: string) => {
    switch (status) {
      case "won":
        return "bg-green-500/20 text-green-500 hover:bg-green-500/30";
      case "lost":
        return "bg-red-500/20 text-red-500 hover:bg-red-500/30";
      case "pending":
        return "bg-yellow-500/20 text-yellow-500 hover:bg-yellow-500/30";
      case "canceled":
        return "bg-gray-500/20 text-gray-500 hover:bg-gray-500/30";
      default:
        return "bg-blue-500/20 text-blue-500 hover:bg-blue-500/30";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "won":
        return "Ganada";
      case "lost":
        return "Perdida";
      case "pending":
        return "Pendiente";
      case "canceled":
        return "Cancelada";
      default:
        return status;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "won":
        return <CheckCircle className="h-4 w-4" />;
      case "lost":
        return <XCircle className="h-4 w-4" />;
      case "pending":
        return <Clock className="h-4 w-4" />;
      case "canceled":
        return <AlertTriangle className="h-4 w-4" />;
      default:
        return null;
    }
  };

  if (!user?.isAdmin) {
    return null;
  }

  return (
    <>
      <Helmet>
        <title>Gestionar Apuestas | Admin | BetTitan365</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <Navbar />

      <main className="min-h-screen bg-background py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-2xl font-bold">Gestionar Apuestas</h1>
              <p className="text-muted-foreground">Administra las apuestas de los usuarios</p>
            </div>

            <div className="flex items-center space-x-4">
              <form onSubmit={handleSearch} className="flex">
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Buscar apuestas..."
                    className="pl-8 w-[200px]"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <Button type="submit" className="ml-2">Buscar</Button>
              </form>

              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filtrar por estado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los estados</SelectItem>
                  <SelectItem value="pending">Pendientes</SelectItem>
                  <SelectItem value="won">Ganadas</SelectItem>
                  <SelectItem value="lost">Perdidas</SelectItem>
                  <SelectItem value="canceled">Canceladas</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <Tabs defaultValue="active" onValueChange={setCurrentTab}>
            <TabsList className="w-full">
              <TabsTrigger value="active" className="flex-1">Apuestas Activas</TabsTrigger>
              <TabsTrigger value="history" className="flex-1">Historial de Apuestas</TabsTrigger>
            </TabsList>
            
            <TabsContent value="active">
              <Card>
                <CardHeader>
                  <CardTitle>Apuestas Pendientes</CardTitle>
                </CardHeader>
                <CardContent>
                  {isLoading ? (
                    <div className="flex justify-center py-8">
                      <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                    </div>
                  ) : bets.length > 0 ? (
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>ID</TableHead>
                            <TableHead>Usuario</TableHead>
                            <TableHead>Evento</TableHead>
                            <TableHead>Selección</TableHead>
                            <TableHead>Monto</TableHead>
                            <TableHead>Cuota</TableHead>
                            <TableHead>Potencial</TableHead>
                            <TableHead>Fecha</TableHead>
                            <TableHead>Estado</TableHead>
                            <TableHead>Acciones</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {bets.map((bet: any) => (
                            <TableRow key={bet.id}>
                              <TableCell>{bet.id}</TableCell>
                              <TableCell>{bet.username}</TableCell>
                              <TableCell>{bet.eventName}</TableCell>
                              <TableCell>{bet.selection}</TableCell>
                              <TableCell>${bet.amount.toFixed(2)}</TableCell>
                              <TableCell>{bet.odds.toFixed(2)}</TableCell>
                              <TableCell>${(bet.amount * bet.odds).toFixed(2)}</TableCell>
                              <TableCell>{formatDate(bet.date)}</TableCell>
                              <TableCell>
                                <Badge className={getStatusColor(bet.status)}>
                                  <span className="flex items-center">
                                    {getStatusIcon(bet.status)}
                                    <span className="ml-1">{getStatusText(bet.status)}</span>
                                  </span>
                                </Badge>
                              </TableCell>
                              <TableCell>
                                {bet.status === "pending" && (
                                  <Button 
                                    variant="outline" 
                                    size="sm" 
                                    onClick={() => handleSettleClick(bet)}
                                  >
                                    Liquidar
                                  </Button>
                                )}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  ) : (
                    <div className="text-center py-10 text-muted-foreground">
                      No hay apuestas activas que mostrar
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="history">
              <Card>
                <CardHeader>
                  <CardTitle>Historial de Apuestas</CardTitle>
                </CardHeader>
                <CardContent>
                  {isLoading ? (
                    <div className="flex justify-center py-8">
                      <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                    </div>
                  ) : bets.length > 0 ? (
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>ID</TableHead>
                            <TableHead>Usuario</TableHead>
                            <TableHead>Evento</TableHead>
                            <TableHead>Selección</TableHead>
                            <TableHead>Monto</TableHead>
                            <TableHead>Cuota</TableHead>
                            <TableHead>Resultado</TableHead>
                            <TableHead>Fecha</TableHead>
                            <TableHead>Liquidado</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {bets.map((bet: any) => (
                            <TableRow key={bet.id}>
                              <TableCell>{bet.id}</TableCell>
                              <TableCell>{bet.username}</TableCell>
                              <TableCell>{bet.eventName}</TableCell>
                              <TableCell>{bet.selection}</TableCell>
                              <TableCell>${bet.amount.toFixed(2)}</TableCell>
                              <TableCell>{bet.odds.toFixed(2)}</TableCell>
                              <TableCell>
                                {bet.status === "won" ? (
                                  <span className="text-green-500">+${(bet.amount * bet.odds - bet.amount).toFixed(2)}</span>
                                ) : bet.status === "lost" ? (
                                  <span className="text-red-500">-${bet.amount.toFixed(2)}</span>
                                ) : (
                                  "-"
                                )}
                              </TableCell>
                              <TableCell>{formatDate(bet.date)}</TableCell>
                              <TableCell>
                                <Badge className={getStatusColor(bet.status)}>
                                  <span className="flex items-center">
                                    {getStatusIcon(bet.status)}
                                    <span className="ml-1">{getStatusText(bet.status)}</span>
                                  </span>
                                </Badge>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  ) : (
                    <div className="text-center py-10 text-muted-foreground">
                      No hay historial de apuestas que mostrar
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {/* Settle Bet Dialog */}
          <Dialog open={isSettleDialogOpen} onOpenChange={setIsSettleDialogOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Liquidar Apuesta</DialogTitle>
                <DialogDescription>
                  Selecciona el resultado de la apuesta:
                </DialogDescription>
              </DialogHeader>

              <div className="grid grid-cols-1 gap-4">
                <div className="p-4 rounded-lg border border-border">
                  <p className="font-medium mb-1">Detalles de la apuesta:</p>
                  <p><span className="text-muted-foreground">Usuario:</span> {selectedBet?.username}</p>
                  <p><span className="text-muted-foreground">Evento:</span> {selectedBet?.eventName}</p>
                  <p><span className="text-muted-foreground">Selección:</span> {selectedBet?.selection}</p>
                  <p><span className="text-muted-foreground">Monto:</span> ${selectedBet?.amount?.toFixed(2)}</p>
                  <p><span className="text-muted-foreground">Cuota:</span> {selectedBet?.odds?.toFixed(2)}</p>
                  <p><span className="text-muted-foreground">Ganancia potencial:</span> ${selectedBet?.amount * selectedBet?.odds?.toFixed(2)}</p>
                </div>
              </div>

              <DialogFooter className="flex flex-col sm:flex-row gap-2">
                <Button 
                  variant="outline" 
                  onClick={() => handleSettleBet("canceled")}
                  disabled={settleBetMutation.isPending}
                  className="flex-1"
                >
                  <AlertTriangle className="mr-2 h-4 w-4" />
                  Cancelar Apuesta
                </Button>
                <Button 
                  variant="destructive"
                  onClick={() => handleSettleBet("lost")}
                  disabled={settleBetMutation.isPending}
                  className="flex-1"
                >
                  <XCircle className="mr-2 h-4 w-4" />
                  Perdió
                </Button>
                <Button 
                  className="bg-green-600 hover:bg-green-700 flex-1"
                  onClick={() => handleSettleBet("won")}
                  disabled={settleBetMutation.isPending}
                >
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Ganó
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </main>

      <Footer />
    </>
  );
}

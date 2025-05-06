import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export default function BetHistory() {
  const [filter, setFilter] = useState("all");
  
  const { data: bets = [], isLoading } = useQuery({
    queryKey: ['/api/bets/history', filter],
  });

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('es', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  // Status colors
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

  // Status text in Spanish
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

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-xl">Historial de Apuestas</CardTitle>
        <Select value={filter} onValueChange={setFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filtrar por estado" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas las apuestas</SelectItem>
            <SelectItem value="won">Ganadas</SelectItem>
            <SelectItem value="lost">Perdidas</SelectItem>
            <SelectItem value="pending">Pendientes</SelectItem>
            <SelectItem value="canceled">Canceladas</SelectItem>
          </SelectContent>
        </Select>
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
                  <TableHead>Fecha</TableHead>
                  <TableHead>Evento</TableHead>
                  <TableHead>Selección</TableHead>
                  <TableHead>Cuota</TableHead>
                  <TableHead>Monto</TableHead>
                  <TableHead>Potencial</TableHead>
                  <TableHead>Estado</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {bets.map((bet: any) => (
                  <TableRow key={bet.id}>
                    <TableCell>{formatDate(bet.date)}</TableCell>
                    <TableCell className="font-medium">{bet.eventName}</TableCell>
                    <TableCell>{bet.selection}</TableCell>
                    <TableCell>{bet.odds.toFixed(2)}</TableCell>
                    <TableCell>${bet.amount.toFixed(2)}</TableCell>
                    <TableCell>${(bet.amount * bet.odds).toFixed(2)}</TableCell>
                    <TableCell>
                      <Badge className={cn("font-normal", getStatusColor(bet.status))}>
                        {getStatusText(bet.status)}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          <div className="text-center py-10 text-muted-foreground">
            No hay apuestas que mostrar
          </div>
        )}
      </CardContent>
    </Card>
  );
}

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
  DialogTrigger,
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
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Pencil, Trash2, Plus } from "lucide-react";

// Event form schema
const eventFormSchema = z.object({
  league: z.string().min(1, "La liga es requerida"),
  homeTeamId: z.coerce.number().min(1, "Equipo local es requerido"),
  awayTeamId: z.coerce.number().min(1, "Equipo visitante es requerido"),
  startTime: z.string().min(1, "Fecha de inicio es requerida"),
  sportCategoryId: z.coerce.number().min(1, "Categoría es requerida"),
  homeOdds: z.coerce.number().min(1, "Cuota local es requerida"),
  drawOdds: z.coerce.number().min(1, "Cuota empate es requerida"),
  awayOdds: z.coerce.number().min(1, "Cuota visitante es requerida"),
  isLive: z.boolean().optional(),
  homeScore: z.coerce.number().optional(),
  awayScore: z.coerce.number().optional(),
  minute: z.coerce.number().optional(),
});

type EventFormValues = z.infer<typeof eventFormSchema>;

export default function ManageEvents() {
  const { user } = useAuth();
  const [_, navigate] = useLocation();
  const { toast } = useToast();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<any>(null);
  const [filter, setFilter] = useState("all");
  
  // Redirect if not an admin
  useEffect(() => {
    if (user && !user.isAdmin) {
      navigate("/");
    }
  }, [user, navigate]);

  // Fetch events data
  const { data: events = [], isLoading } = useQuery({
    queryKey: ["/api/admin/events", filter],
    enabled: !!(user?.isAdmin)
  });

  // Fetch teams and categories for forms
  const { data: teams = [] } = useQuery({
    queryKey: ["/api/admin/teams"],
    enabled: !!(user?.isAdmin)
  });

  const { data: categories = [] } = useQuery({
    queryKey: ["/api/admin/categories"],
    enabled: !!(user?.isAdmin)
  });

  // Form for creating and editing events
  const form = useForm<EventFormValues>({
    resolver: zodResolver(eventFormSchema),
    defaultValues: {
      league: "",
      homeTeamId: 0,
      awayTeamId: 0,
      startTime: new Date().toISOString().slice(0, 16),
      sportCategoryId: 0,
      homeOdds: 1.5,
      drawOdds: 3.5,
      awayOdds: 5.0,
      isLive: false,
      homeScore: 0,
      awayScore: 0,
      minute: 0,
    },
  });

  // Create event mutation
  const createEventMutation = useMutation({
    mutationFn: async (data: EventFormValues) => {
      const res = await apiRequest("POST", "/api/admin/events", data);
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/events"] });
      toast({
        title: "Evento creado",
        description: "El evento ha sido creado correctamente",
      });
      setIsCreateDialogOpen(false);
      form.reset();
    },
    onError: (error: Error) => {
      toast({
        title: "Error al crear evento",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Update event mutation
  const updateEventMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: EventFormValues }) => {
      const res = await apiRequest("PUT", `/api/admin/events/${id}`, data);
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/events"] });
      toast({
        title: "Evento actualizado",
        description: "El evento ha sido actualizado correctamente",
      });
      setIsEditDialogOpen(false);
    },
    onError: (error: Error) => {
      toast({
        title: "Error al actualizar evento",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Delete event mutation
  const deleteEventMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/admin/events/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/events"] });
      toast({
        title: "Evento eliminado",
        description: "El evento ha sido eliminado correctamente",
      });
      setIsDeleteDialogOpen(false);
    },
    onError: (error: Error) => {
      toast({
        title: "Error al eliminar evento",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Handle form submission for creating new event
  function onCreateSubmit(data: EventFormValues) {
    createEventMutation.mutate(data);
  }

  // Handle form submission for editing event
  function onEditSubmit(data: EventFormValues) {
    if (selectedEvent) {
      updateEventMutation.mutate({ id: selectedEvent.id, data });
    }
  }

  // Handle delete confirmation
  function onDeleteConfirm() {
    if (selectedEvent) {
      deleteEventMutation.mutate(selectedEvent.id);
    }
  }

  // Handle edit button click
  function handleEditClick(event: any) {
    setSelectedEvent(event);
    form.reset({
      league: event.league,
      homeTeamId: event.homeTeam.id,
      awayTeamId: event.awayTeam.id,
      startTime: new Date(event.startTime).toISOString().slice(0, 16),
      sportCategoryId: event.sportCategory.id,
      homeOdds: event.odds.home,
      drawOdds: event.odds.draw,
      awayOdds: event.odds.away,
      isLive: event.isLive,
      homeScore: event.homeTeam.score || 0,
      awayScore: event.awayTeam.score || 0,
      minute: event.minute || 0,
    });
    setIsEditDialogOpen(true);
  }

  // Handle delete button click
  function handleDeleteClick(event: any) {
    setSelectedEvent(event);
    setIsDeleteDialogOpen(true);
  }

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

  if (!user?.isAdmin) {
    return null;
  }

  return (
    <>
      <Helmet>
        <title>Gestionar Eventos | Admin | BetTitan365</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <Navbar />

      <main className="min-h-screen bg-background py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-2xl font-bold">Gestionar Eventos</h1>
              <p className="text-muted-foreground">Administra los eventos deportivos de la plataforma</p>
            </div>

            <div className="flex items-center space-x-4">
              <Select value={filter} onValueChange={setFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filtrar eventos" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="live">En vivo</SelectItem>
                  <SelectItem value="upcoming">Próximos</SelectItem>
                  <SelectItem value="completed">Completados</SelectItem>
                </SelectContent>
              </Select>

              <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-primary hover:bg-red-700">
                    <Plus className="mr-2 h-4 w-4" /> Crear Evento
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md">
                  <DialogHeader>
                    <DialogTitle>Crear Nuevo Evento</DialogTitle>
                    <DialogDescription>
                      Completa el formulario para crear un nuevo evento deportivo
                    </DialogDescription>
                  </DialogHeader>

                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onCreateSubmit)} className="space-y-4">
                      <FormField
                        control={form.control}
                        name="sportCategoryId"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Categoría Deportiva</FormLabel>
                            <Select onValueChange={(value) => field.onChange(parseInt(value))} defaultValue={field.value.toString()}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Seleccionar categoría" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {categories.map((category: any) => (
                                  <SelectItem key={category.id} value={category.id.toString()}>
                                    {category.name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="league"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Liga / Torneo</FormLabel>
                            <FormControl>
                              <Input placeholder="Ej: La Liga, Premier League" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <div className="grid grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="homeTeamId"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Equipo Local</FormLabel>
                              <Select onValueChange={(value) => field.onChange(parseInt(value))} defaultValue={field.value.toString()}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Equipo local" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {teams.map((team: any) => (
                                    <SelectItem key={team.id} value={team.id.toString()}>
                                      {team.name}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="awayTeamId"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Equipo Visitante</FormLabel>
                              <Select onValueChange={(value) => field.onChange(parseInt(value))} defaultValue={field.value.toString()}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Equipo visitante" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {teams.map((team: any) => (
                                    <SelectItem key={team.id} value={team.id.toString()}>
                                      {team.name}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <FormField
                        control={form.control}
                        name="startTime"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Fecha y Hora de Inicio</FormLabel>
                            <FormControl>
                              <Input type="datetime-local" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <div className="grid grid-cols-3 gap-4">
                        <FormField
                          control={form.control}
                          name="homeOdds"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Cuota Local</FormLabel>
                              <FormControl>
                                <Input type="number" step="0.01" min="1" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="drawOdds"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Cuota Empate</FormLabel>
                              <FormControl>
                                <Input type="number" step="0.01" min="1" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="awayOdds"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Cuota Visitante</FormLabel>
                              <FormControl>
                                <Input type="number" step="0.01" min="1" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <FormField
                        control={form.control}
                        name="isLive"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-center space-x-3 space-y-0 rounded-md border p-4">
                            <FormControl>
                              <input
                                type="checkbox"
                                className="h-4 w-4"
                                checked={field.value}
                                onChange={field.onChange}
                              />
                            </FormControl>
                            <div className="space-y-1 leading-none">
                              <FormLabel>Evento en vivo</FormLabel>
                            </div>
                          </FormItem>
                        )}
                      />

                      <DialogFooter>
                        <Button 
                          type="submit" 
                          className="bg-primary hover:bg-red-700"
                          disabled={createEventMutation.isPending}
                        >
                          {createEventMutation.isPending ? "Creando..." : "Crear Evento"}
                        </Button>
                      </DialogFooter>
                    </form>
                  </Form>
                </DialogContent>
              </Dialog>
            </div>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Eventos</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex justify-center py-8">
                  <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                </div>
              ) : events.length > 0 ? (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>ID</TableHead>
                        <TableHead>Deporte</TableHead>
                        <TableHead>Liga</TableHead>
                        <TableHead>Equipos</TableHead>
                        <TableHead>Fecha</TableHead>
                        <TableHead>Estado</TableHead>
                        <TableHead>Cuotas (L/E/V)</TableHead>
                        <TableHead>Acciones</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {events.map((event: any) => (
                        <TableRow key={event.id}>
                          <TableCell>{event.id}</TableCell>
                          <TableCell>{event.sportCategory.name}</TableCell>
                          <TableCell>{event.league}</TableCell>
                          <TableCell>
                            {event.homeTeam.name} vs {event.awayTeam.name}
                            {event.isLive && (
                              <div className="text-sm">
                                <span className="text-primary">{event.homeTeam.score || 0}</span>
                                {" - "}
                                <span className="text-primary">{event.awayTeam.score || 0}</span>
                                {" "}
                                <span className="text-xs text-muted-foreground">{event.minute || 0}'</span>
                              </div>
                            )}
                          </TableCell>
                          <TableCell>{formatDate(event.startTime)}</TableCell>
                          <TableCell>
                            {event.isLive ? (
                              <span className="px-2 py-1 rounded-full text-xs font-medium bg-red-500/20 text-red-500">En vivo</span>
                            ) : new Date(event.startTime) > new Date() ? (
                              <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-500/20 text-blue-500">Próximo</span>
                            ) : (
                              <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-500/20 text-green-500">Completado</span>
                            )}
                          </TableCell>
                          <TableCell>
                            {event.odds.home.toFixed(2)} / {event.odds.draw.toFixed(2)} / {event.odds.away.toFixed(2)}
                          </TableCell>
                          <TableCell>
                            <div className="flex space-x-2">
                              <Button 
                                variant="outline" 
                                size="sm" 
                                onClick={() => handleEditClick(event)}
                              >
                                <Pencil className="h-4 w-4" />
                              </Button>
                              <Button 
                                variant="outline" 
                                size="sm" 
                                className="text-red-500" 
                                onClick={() => handleDeleteClick(event)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <div className="text-center py-10 text-muted-foreground">
                  No hay eventos que mostrar
                </div>
              )}
            </CardContent>
          </Card>

          {/* Edit Dialog */}
          <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Editar Evento</DialogTitle>
                <DialogDescription>
                  Modifica los detalles del evento
                </DialogDescription>
              </DialogHeader>

              <Form {...form}>
                <form onSubmit={form.handleSubmit(onEditSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="sportCategoryId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Categoría Deportiva</FormLabel>
                        <Select onValueChange={(value) => field.onChange(parseInt(value))} value={field.value.toString()}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Seleccionar categoría" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {categories.map((category: any) => (
                              <SelectItem key={category.id} value={category.id.toString()}>
                                {category.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="league"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Liga / Torneo</FormLabel>
                        <FormControl>
                          <Input placeholder="Ej: La Liga, Premier League" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="homeTeamId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Equipo Local</FormLabel>
                          <Select onValueChange={(value) => field.onChange(parseInt(value))} value={field.value.toString()}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Equipo local" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {teams.map((team: any) => (
                                <SelectItem key={team.id} value={team.id.toString()}>
                                  {team.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="awayTeamId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Equipo Visitante</FormLabel>
                          <Select onValueChange={(value) => field.onChange(parseInt(value))} value={field.value.toString()}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Equipo visitante" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {teams.map((team: any) => (
                                <SelectItem key={team.id} value={team.id.toString()}>
                                  {team.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="startTime"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Fecha y Hora de Inicio</FormLabel>
                        <FormControl>
                          <Input type="datetime-local" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-3 gap-4">
                    <FormField
                      control={form.control}
                      name="homeOdds"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Cuota Local</FormLabel>
                          <FormControl>
                            <Input type="number" step="0.01" min="1" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="drawOdds"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Cuota Empate</FormLabel>
                          <FormControl>
                            <Input type="number" step="0.01" min="1" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="awayOdds"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Cuota Visitante</FormLabel>
                          <FormControl>
                            <Input type="number" step="0.01" min="1" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="isLive"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center space-x-3 space-y-0 rounded-md border p-4">
                        <FormControl>
                          <input
                            type="checkbox"
                            className="h-4 w-4"
                            checked={field.value}
                            onChange={field.onChange}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>Evento en vivo</FormLabel>
                        </div>
                      </FormItem>
                    )}
                  />

                  {form.watch("isLive") && (
                    <div className="grid grid-cols-3 gap-4">
                      <FormField
                        control={form.control}
                        name="homeScore"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Goles Local</FormLabel>
                            <FormControl>
                              <Input type="number" min="0" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="awayScore"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Goles Visitante</FormLabel>
                            <FormControl>
                              <Input type="number" min="0" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="minute"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Minuto</FormLabel>
                            <FormControl>
                              <Input type="number" min="0" max="90" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  )}

                  <DialogFooter>
                    <Button 
                      type="submit" 
                      className="bg-primary hover:bg-red-700"
                      disabled={updateEventMutation.isPending}
                    >
                      {updateEventMutation.isPending ? "Guardando..." : "Guardar Cambios"}
                    </Button>
                  </DialogFooter>
                </form>
              </Form>
            </DialogContent>
          </Dialog>

          {/* Delete Confirmation Dialog */}
          <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Confirmar Eliminación</DialogTitle>
                <DialogDescription>
                  ¿Estás seguro de que deseas eliminar este evento? Esta acción no se puede deshacer.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button 
                  variant="destructive"
                  onClick={onDeleteConfirm}
                  disabled={deleteEventMutation.isPending}
                >
                  {deleteEventMutation.isPending ? "Eliminando..." : "Eliminar"}
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

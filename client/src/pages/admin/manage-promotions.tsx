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
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Pencil, Trash2, Plus, Calendar } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";

// Promotion form schema
const promotionFormSchema = z.object({
  title: z.string().min(3, "El título debe tener al menos 3 caracteres").max(100),
  description: z.string().min(10, "La descripción debe tener al menos 10 caracteres").max(500),
  imageUrl: z.string().url("Debe ser una URL válida"),
  category: z.string().min(1, "La categoría es requerida"),
  code: z.string().optional(),
  endDate: z.string().min(1, "La fecha de finalización es requerida"),
  terms: z.string().min(10, "Los términos deben tener al menos 10 caracteres"),
  isActive: z.boolean().default(true),
});

type PromotionFormValues = z.infer<typeof promotionFormSchema>;

export default function ManagePromotions() {
  const { user } = useAuth();
  const [_, navigate] = useLocation();
  const { toast } = useToast();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedPromotion, setSelectedPromotion] = useState<any>(null);
  const [categoryFilter, setCategoryFilter] = useState("all");
  
  // Redirect if not an admin
  useEffect(() => {
    if (user && !user.isAdmin) {
      navigate("/");
    }
  }, [user, navigate]);

  // Fetch promotions data
  const { data: promotions = [], isLoading } = useQuery({
    queryKey: ["/api/admin/promotions", categoryFilter],
    enabled: !!(user?.isAdmin)
  });

  // Form for creating promotions
  const createForm = useForm<PromotionFormValues>({
    resolver: zodResolver(promotionFormSchema),
    defaultValues: {
      title: "",
      description: "",
      imageUrl: "",
      category: "",
      code: "",
      endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10), // 30 days from now
      terms: "",
      isActive: true,
    },
  });

  // Form for editing promotions
  const editForm = useForm<PromotionFormValues>({
    resolver: zodResolver(promotionFormSchema),
    defaultValues: {
      title: "",
      description: "",
      imageUrl: "",
      category: "",
      code: "",
      endDate: "",
      terms: "",
      isActive: true,
    },
  });

  // Create promotion mutation
  const createPromotionMutation = useMutation({
    mutationFn: async (data: PromotionFormValues) => {
      const res = await apiRequest("POST", "/api/admin/promotions", data);
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/promotions"] });
      toast({
        title: "Promoción creada",
        description: "La promoción ha sido creada correctamente",
      });
      setIsCreateDialogOpen(false);
      createForm.reset();
    },
    onError: (error: Error) => {
      toast({
        title: "Error al crear promoción",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Update promotion mutation
  const updatePromotionMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: PromotionFormValues }) => {
      const res = await apiRequest("PUT", `/api/admin/promotions/${id}`, data);
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/promotions"] });
      toast({
        title: "Promoción actualizada",
        description: "La promoción ha sido actualizada correctamente",
      });
      setIsEditDialogOpen(false);
    },
    onError: (error: Error) => {
      toast({
        title: "Error al actualizar promoción",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Delete promotion mutation
  const deletePromotionMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/admin/promotions/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/promotions"] });
      toast({
        title: "Promoción eliminada",
        description: "La promoción ha sido eliminada correctamente",
      });
      setIsDeleteDialogOpen(false);
    },
    onError: (error: Error) => {
      toast({
        title: "Error al eliminar promoción",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Handle form submission for creating new promotion
  function onCreateSubmit(data: PromotionFormValues) {
    createPromotionMutation.mutate(data);
  }

  // Handle form submission for editing promotion
  function onEditSubmit(data: PromotionFormValues) {
    if (selectedPromotion) {
      updatePromotionMutation.mutate({ id: selectedPromotion.id, data });
    }
  }

  // Handle delete confirmation
  function onDeleteConfirm() {
    if (selectedPromotion) {
      deletePromotionMutation.mutate(selectedPromotion.id);
    }
  }

  // Handle edit button click
  function handleEditClick(promotion: any) {
    setSelectedPromotion(promotion);
    editForm.reset({
      title: promotion.title,
      description: promotion.description,
      imageUrl: promotion.imageUrl,
      category: promotion.category,
      code: promotion.code || "",
      endDate: new Date(promotion.endDate).toISOString().slice(0, 10),
      terms: promotion.terms,
      isActive: promotion.isActive,
    });
    setIsEditDialogOpen(true);
  }

  // Handle delete button click
  function handleDeleteClick(promotion: any) {
    setSelectedPromotion(promotion);
    setIsDeleteDialogOpen(true);
  }

  // Format date for display
  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('es', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    }).format(date);
  };

  // Get category badge color
  const getCategoryColor = (category: string) => {
    switch (category) {
      case "new_users":
        return "bg-primary/20 text-primary";
      case "sports":
        return "bg-blue-500/20 text-blue-500";
      case "casino":
        return "bg-yellow-500/20 text-yellow-500";
      default:
        return "bg-gray-500/20 text-gray-500";
    }
  };

  // Get formatted category name
  const getCategoryName = (category: string) => {
    switch (category) {
      case "new_users":
        return "Nuevos Usuarios";
      case "sports":
        return "Deportes";
      case "casino":
        return "Casino";
      default:
        return category;
    }
  };

  if (!user?.isAdmin) {
    return null;
  }

  return (
    <>
      <Helmet>
        <title>Gestionar Promociones | Admin | BetTitan365</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <Navbar />

      <main className="min-h-screen bg-background py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-2xl font-bold">Gestionar Promociones</h1>
              <p className="text-muted-foreground">Administra las promociones y ofertas especiales</p>
            </div>

            <div className="flex items-center space-x-4">
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filtrar por categoría" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas las categorías</SelectItem>
                  <SelectItem value="new_users">Nuevos Usuarios</SelectItem>
                  <SelectItem value="sports">Deportes</SelectItem>
                  <SelectItem value="casino">Casino</SelectItem>
                </SelectContent>
              </Select>

              <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-primary hover:bg-red-700">
                    <Plus className="mr-2 h-4 w-4" /> Crear Promoción
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Crear Nueva Promoción</DialogTitle>
                    <DialogDescription>
                      Completa el formulario para crear una nueva promoción
                    </DialogDescription>
                  </DialogHeader>

                  <Form {...createForm}>
                    <form onSubmit={createForm.handleSubmit(onCreateSubmit)} className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <FormField
                          control={createForm.control}
                          name="title"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Título</FormLabel>
                              <FormControl>
                                <Input placeholder="Título de la promoción" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={createForm.control}
                          name="category"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Categoría</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Seleccionar categoría" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="new_users">Nuevos Usuarios</SelectItem>
                                  <SelectItem value="sports">Deportes</SelectItem>
                                  <SelectItem value="casino">Casino</SelectItem>
                                  <SelectItem value="special">Especial</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <FormField
                        control={createForm.control}
                        name="description"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Descripción</FormLabel>
                            <FormControl>
                              <Textarea 
                                placeholder="Descripción breve de la promoción" 
                                className="min-h-[80px]" 
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={createForm.control}
                        name="imageUrl"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>URL de Imagen</FormLabel>
                            <FormControl>
                              <Input placeholder="https://..." {...field} />
                            </FormControl>
                            <FormDescription>
                              URL de una imagen de promoción (800x450 recomendado)
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <div className="grid grid-cols-2 gap-4">
                        <FormField
                          control={createForm.control}
                          name="code"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Código Promocional (Opcional)</FormLabel>
                              <FormControl>
                                <Input placeholder="PROMO123" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={createForm.control}
                          name="endDate"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Fecha de Finalización</FormLabel>
                              <FormControl>
                                <div className="flex">
                                  <Calendar className="h-4 w-4 mr-2 mt-3" />
                                  <Input type="date" {...field} />
                                </div>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <FormField
                        control={createForm.control}
                        name="terms"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Términos y Condiciones</FormLabel>
                            <FormControl>
                              <Textarea 
                                placeholder="Términos y condiciones de la promoción" 
                                className="min-h-[120px]" 
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={createForm.control}
                        name="isActive"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                            <div className="space-y-0.5">
                              <FormLabel className="text-base">
                                Promoción Activa
                              </FormLabel>
                              <FormDescription>
                                Determina si la promoción está activa y visible para los usuarios
                              </FormDescription>
                            </div>
                            <FormControl>
                              <Switch
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />

                      <DialogFooter>
                        <Button 
                          type="submit" 
                          className="bg-primary hover:bg-red-700"
                          disabled={createPromotionMutation.isPending}
                        >
                          {createPromotionMutation.isPending ? "Creando..." : "Crear Promoción"}
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
              <CardTitle>Promociones</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex justify-center py-8">
                  <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                </div>
              ) : promotions.length > 0 ? (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>ID</TableHead>
                        <TableHead>Título</TableHead>
                        <TableHead>Categoría</TableHead>
                        <TableHead>Código</TableHead>
                        <TableHead>Finaliza</TableHead>
                        <TableHead>Estado</TableHead>
                        <TableHead>Acciones</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {promotions.map((promotion: any) => (
                        <TableRow key={promotion.id}>
                          <TableCell>{promotion.id}</TableCell>
                          <TableCell className="font-medium">
                            <div className="flex items-center space-x-3">
                              <div 
                                className="w-10 h-10 rounded overflow-hidden bg-gray-800 flex-shrink-0"
                                style={{
                                  backgroundImage: `url(${promotion.imageUrl})`,
                                  backgroundSize: 'cover',
                                  backgroundPosition: 'center'
                                }}
                              />
                              <span>{promotion.title}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(promotion.category)}`}>
                              {getCategoryName(promotion.category)}
                            </span>
                          </TableCell>
                          <TableCell>{promotion.code || "-"}</TableCell>
                          <TableCell>{formatDate(promotion.endDate)}</TableCell>
                          <TableCell>
                            {promotion.isActive ? (
                              <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-500/20 text-green-500">
                                Activa
                              </span>
                            ) : (
                              <span className="px-2 py-1 rounded-full text-xs font-medium bg-gray-500/20 text-gray-500">
                                Inactiva
                              </span>
                            )}
                          </TableCell>
                          <TableCell>
                            <div className="flex space-x-2">
                              <Button 
                                variant="outline" 
                                size="sm" 
                                onClick={() => handleEditClick(promotion)}
                              >
                                <Pencil className="h-4 w-4" />
                              </Button>
                              <Button 
                                variant="outline" 
                                size="sm" 
                                className="text-red-500" 
                                onClick={() => handleDeleteClick(promotion)}
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
                  No hay promociones que mostrar
                </div>
              )}
            </CardContent>
          </Card>

          {/* Edit Dialog */}
          <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Editar Promoción</DialogTitle>
                <DialogDescription>
                  Modifica los detalles de la promoción
                </DialogDescription>
              </DialogHeader>

              <Form {...editForm}>
                <form onSubmit={editForm.handleSubmit(onEditSubmit)} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={editForm.control}
                      name="title"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Título</FormLabel>
                          <FormControl>
                            <Input placeholder="Título de la promoción" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={editForm.control}
                      name="category"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Categoría</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Seleccionar categoría" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="new_users">Nuevos Usuarios</SelectItem>
                              <SelectItem value="sports">Deportes</SelectItem>
                              <SelectItem value="casino">Casino</SelectItem>
                              <SelectItem value="special">Especial</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={editForm.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Descripción</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Descripción breve de la promoción" 
                            className="min-h-[80px]" 
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={editForm.control}
                    name="imageUrl"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>URL de Imagen</FormLabel>
                        <FormControl>
                          <Input placeholder="https://..." {...field} />
                        </FormControl>
                        <FormDescription>
                          URL de una imagen de promoción (800x450 recomendado)
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={editForm.control}
                      name="code"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Código Promocional (Opcional)</FormLabel>
                          <FormControl>
                            <Input placeholder="PROMO123" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={editForm.control}
                      name="endDate"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Fecha de Finalización</FormLabel>
                          <FormControl>
                            <div className="flex">
                              <Calendar className="h-4 w-4 mr-2 mt-3" />
                              <Input type="date" {...field} />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={editForm.control}
                    name="terms"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Términos y Condiciones</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Términos y condiciones de la promoción" 
                            className="min-h-[120px]" 
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={editForm.control}
                    name="isActive"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">
                            Promoción Activa
                          </FormLabel>
                          <FormDescription>
                            Determina si la promoción está activa y visible para los usuarios
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <DialogFooter>
                    <Button 
                      type="submit" 
                      className="bg-primary hover:bg-red-700"
                      disabled={updatePromotionMutation.isPending}
                    >
                      {updatePromotionMutation.isPending ? "Guardando..." : "Guardar Cambios"}
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
                  ¿Estás seguro de que deseas eliminar la promoción "{selectedPromotion?.title}"? Esta acción no se puede deshacer.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button 
                  variant="destructive"
                  onClick={onDeleteConfirm}
                  disabled={deletePromotionMutation.isPending}
                >
                  {deletePromotionMutation.isPending ? "Eliminando..." : "Eliminar"}
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

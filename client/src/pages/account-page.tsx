import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import AccountSummary from "@/components/account/account-summary";
import BetHistory from "@/components/account/bet-history";
import PaymentForm from "@/components/account/payment-form";
import { Helmet } from "react-helmet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";

const profileSchema = z.object({
  name: z.string().optional(),
  email: z.string().email().optional(),
  phone: z.string().optional(),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

const passwordSchema = z.object({
  currentPassword: z.string().min(6, "La contraseña debe tener al menos 6 caracteres"),
  newPassword: z.string().min(6, "La contraseña debe tener al menos 6 caracteres"),
  confirmPassword: z.string(),
}).refine(data => data.newPassword === data.confirmPassword, {
  message: "Las contraseñas no coinciden",
  path: ["confirmPassword"],
});

type PasswordFormValues = z.infer<typeof passwordSchema>;

export default function AccountPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("summary");

  const profileForm = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
    },
  });

  const passwordForm = useForm<PasswordFormValues>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  // Load user profile data when available
  useEffect(() => {
    if (user) {
      const { data: profileData } = useQuery({
        queryKey: ["/api/user/profile"],
      });
      
      if (profileData) {
        profileForm.reset({
          name: profileData.name || "",
          email: profileData.email || "",
          phone: profileData.phone || "",
        });
      }
    }
  }, [user]);

  const updateProfileMutation = useMutation({
    mutationFn: async (data: ProfileFormValues) => {
      const res = await apiRequest("PUT", "/api/user/profile", data);
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/user/profile"] });
      toast({
        title: "Perfil actualizado",
        description: "Tu información ha sido actualizada correctamente.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error al actualizar perfil",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const updatePasswordMutation = useMutation({
    mutationFn: async (data: PasswordFormValues) => {
      const res = await apiRequest("PUT", "/api/user/password", data);
      return await res.json();
    },
    onSuccess: () => {
      toast({
        title: "Contraseña actualizada",
        description: "Tu contraseña ha sido actualizada correctamente.",
      });
      passwordForm.reset();
    },
    onError: (error: Error) => {
      toast({
        title: "Error al actualizar contraseña",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  function onProfileSubmit(data: ProfileFormValues) {
    updateProfileMutation.mutate(data);
  }

  function onPasswordSubmit(data: PasswordFormValues) {
    updatePasswordMutation.mutate(data);
  }

  // Get first letter from username for avatar
  const avatarLetter = user ? user.username.charAt(0).toUpperCase() : "U";

  return (
    <>
      <Helmet>
        <title>Mi Cuenta | BetTitan365</title>
        <meta
          name="description"
          content="Administra tu cuenta, visualiza tus apuestas, realiza depósitos y retiros."
        />
      </Helmet>

      <Navbar />

      <main className="min-h-screen bg-background py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row gap-8">
            {/* Sidebar */}
            <div className="w-full md:w-1/4">
              <div className="bg-card rounded-lg p-6 mb-6">
                <div className="flex items-center space-x-4 mb-6">
                  <Avatar className="h-16 w-16">
                    <AvatarImage src="" alt={user?.username || "Usuario"} />
                    <AvatarFallback className="text-lg">{avatarLetter}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h2 className="text-xl font-bold">{user?.username}</h2>
                    <p className="text-sm text-muted-foreground">ID: {user?.id}</p>
                  </div>
                </div>
                
                <nav className="space-y-1">
                  <Button 
                    variant="ghost" 
                    className={`w-full justify-start ${activeTab === "summary" ? "bg-primary/10 text-primary" : ""}`}
                    onClick={() => setActiveTab("summary")}
                  >
                    <i className="ri-dashboard-line mr-2"></i>
                    Resumen
                  </Button>
                  <Button 
                    variant="ghost" 
                    className={`w-full justify-start ${activeTab === "bets" ? "bg-primary/10 text-primary" : ""}`}
                    onClick={() => setActiveTab("bets")}
                  >
                    <i className="ri-file-list-line mr-2"></i>
                    Historial de Apuestas
                  </Button>
                  <Button 
                    variant="ghost" 
                    className={`w-full justify-start ${activeTab === "payments" ? "bg-primary/10 text-primary" : ""}`}
                    onClick={() => setActiveTab("payments")}
                  >
                    <i className="ri-bank-card-line mr-2"></i>
                    Métodos de Pago
                  </Button>
                  <Button 
                    variant="ghost" 
                    className={`w-full justify-start ${activeTab === "profile" ? "bg-primary/10 text-primary" : ""}`}
                    onClick={() => setActiveTab("profile")}
                  >
                    <i className="ri-user-settings-line mr-2"></i>
                    Ajustes de Perfil
                  </Button>
                </nav>
              </div>
              
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm font-medium">Ayuda y Soporte</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                  <div className="flex items-center">
                    <i className="ri-chat-1-line mr-2 text-primary"></i>
                    <span>Chat en vivo</span>
                  </div>
                  <div className="flex items-center">
                    <i className="ri-mail-line mr-2 text-primary"></i>
                    <span>soporte@bettitan365.com</span>
                  </div>
                  <div className="flex items-center">
                    <i className="ri-phone-line mr-2 text-primary"></i>
                    <span>+34 900 123 456</span>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Main content */}
            <div className="w-full md:w-3/4">
              <div className={activeTab === "summary" ? "block" : "hidden"}>
                <AccountSummary />
              </div>
              
              <div className={activeTab === "bets" ? "block" : "hidden"}>
                <BetHistory />
              </div>
              
              <div className={activeTab === "payments" ? "block" : "hidden"}>
                <PaymentForm />
              </div>
              
              <div className={activeTab === "profile" ? "block" : "hidden"}>
                <Tabs defaultValue="profile" className="w-full">
                  <TabsList className="w-full">
                    <TabsTrigger value="profile" className="flex-1">Información Personal</TabsTrigger>
                    <TabsTrigger value="security" className="flex-1">Seguridad</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="profile">
                    <Card>
                      <CardHeader>
                        <CardTitle>Información Personal</CardTitle>
                        <CardDescription>
                          Actualiza tu perfil y preferencias personales
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <Form {...profileForm}>
                          <form onSubmit={profileForm.handleSubmit(onProfileSubmit)} className="space-y-4">
                            <FormField
                              control={profileForm.control}
                              name="name"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Nombre Completo</FormLabel>
                                  <FormControl>
                                    <Input placeholder="Tu nombre completo" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            
                            <FormField
                              control={profileForm.control}
                              name="email"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Email</FormLabel>
                                  <FormControl>
                                    <Input placeholder="Tu email" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            
                            <FormField
                              control={profileForm.control}
                              name="phone"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Teléfono</FormLabel>
                                  <FormControl>
                                    <Input placeholder="Tu teléfono" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            
                            <Button 
                              type="submit" 
                              className="bg-primary hover:bg-red-700"
                              disabled={updateProfileMutation.isPending}
                            >
                              {updateProfileMutation.isPending ? "Guardando..." : "Guardar Cambios"}
                            </Button>
                          </form>
                        </Form>
                      </CardContent>
                    </Card>
                  </TabsContent>
                  
                  <TabsContent value="security">
                    <Card>
                      <CardHeader>
                        <CardTitle>Seguridad</CardTitle>
                        <CardDescription>
                          Actualiza tu contraseña y configuración de seguridad
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <Form {...passwordForm}>
                          <form onSubmit={passwordForm.handleSubmit(onPasswordSubmit)} className="space-y-4">
                            <FormField
                              control={passwordForm.control}
                              name="currentPassword"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Contraseña Actual</FormLabel>
                                  <FormControl>
                                    <Input type="password" placeholder="Tu contraseña actual" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            
                            <FormField
                              control={passwordForm.control}
                              name="newPassword"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Nueva Contraseña</FormLabel>
                                  <FormControl>
                                    <Input type="password" placeholder="Tu nueva contraseña" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            
                            <FormField
                              control={passwordForm.control}
                              name="confirmPassword"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Confirmar Nueva Contraseña</FormLabel>
                                  <FormControl>
                                    <Input type="password" placeholder="Confirma tu nueva contraseña" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            
                            <Button 
                              type="submit" 
                              className="bg-primary hover:bg-red-700"
                              disabled={updatePasswordMutation.isPending}
                            >
                              {updatePasswordMutation.isPending ? "Actualizando..." : "Actualizar Contraseña"}
                            </Button>
                          </form>
                        </Form>
                      </CardContent>
                    </Card>
                  </TabsContent>
                </Tabs>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}

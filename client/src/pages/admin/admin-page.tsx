import { useAuth } from "@/hooks/use-auth";
import { useEffect } from "react";
import { useLocation } from "wouter";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import { Helmet } from "react-helmet";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Link } from "wouter";

export default function AdminPage() {
  const { user } = useAuth();
  const [_, navigate] = useLocation();
  
  // Redirect if not an admin
  useEffect(() => {
    if (user && !user.isAdmin) {
      navigate("/");
    }
  }, [user, navigate]);

  // Get admin dashboard stats
  const { data: dashboardStats = {
    totalUsers: 0,
    activeUsers: 0,
    totalEvents: 0,
    pendingBets: 0,
    dailyRevenue: [],
    recentBets: []
  }, isLoading } = useQuery({
    queryKey: ["/api/admin/dashboard"],
    enabled: !!(user?.isAdmin)
  });

  // Get recent activities
  const { data: recentActivities = [] } = useQuery({
    queryKey: ["/api/admin/activities"],
    enabled: !!(user?.isAdmin)
  });

  if (!user?.isAdmin) {
    return null;
  }

  return (
    <>
      <Helmet>
        <title>Panel de Administración | BetTitan365</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <Navbar />

      <main className="min-h-screen bg-background py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-6">
            <h1 className="text-2xl font-bold">Panel de Administración</h1>
            <p className="text-muted-foreground">Bienvenido al panel de administración de BetTitan365</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Total Usuarios</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {isLoading ? "..." : dashboardStats.totalUsers}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  <span className="text-green-500">{dashboardStats.activeUsers} activos</span> en las últimas 24h
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Eventos Activos</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {isLoading ? "..." : dashboardStats.totalEvents}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  En todas las categorías deportivas
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Apuestas Pendientes</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {isLoading ? "..." : dashboardStats.pendingBets}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Esperando resultados
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Ingresos Hoy</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  ${isLoading ? "..." : dashboardStats.dailyRevenue[dashboardStats.dailyRevenue.length - 1]?.revenue.toFixed(2) || "0.00"}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  +4.6% desde ayer
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 mb-8">
            <Card className="md:col-span-8">
              <CardHeader>
                <CardTitle>Ingresos Últimos 7 Días</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={dashboardStats.dailyRevenue}
                      margin={{
                        top: 20,
                        right: 30,
                        left: 20,
                        bottom: 5,
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="revenue" fill="hsl(var(--chart-1))" name="Ingresos" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            <Card className="md:col-span-4">
              <CardHeader>
                <CardTitle>Actividades Recientes</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-4">
                  {isLoading ? (
                    <p>Cargando actividades...</p>
                  ) : recentActivities.length > 0 ? (
                    recentActivities.map((activity: any, index: number) => (
                      <li key={index} className="flex items-start space-x-3">
                        <span className={`flex-shrink-0 w-2 h-2 mt-1 rounded-full ${
                          activity.type === "user" ? "bg-blue-500" :
                          activity.type === "bet" ? "bg-green-500" :
                          activity.type === "payment" ? "bg-yellow-500" : "bg-gray-500"
                        }`}></span>
                        <div>
                          <p className="text-sm">{activity.description}</p>
                          <time className="text-xs text-muted-foreground">{activity.time}</time>
                        </div>
                      </li>
                    ))
                  ) : (
                    <p className="text-muted-foreground">No hay actividades recientes</p>
                  )}
                </ul>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Navegación Rápida</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <Link href="/admin/events">
                    <a className="flex flex-col items-center justify-center p-4 bg-card hover:bg-gray-800 rounded-lg border border-border transition">
                      <i className="ri-calendar-event-line text-3xl text-primary mb-2"></i>
                      <span className="text-sm font-medium">Gestionar Eventos</span>
                    </a>
                  </Link>
                  
                  <Link href="/admin/users">
                    <a className="flex flex-col items-center justify-center p-4 bg-card hover:bg-gray-800 rounded-lg border border-border transition">
                      <i className="ri-user-line text-3xl text-primary mb-2"></i>
                      <span className="text-sm font-medium">Gestionar Usuarios</span>
                    </a>
                  </Link>
                  
                  <Link href="/admin/bets">
                    <a className="flex flex-col items-center justify-center p-4 bg-card hover:bg-gray-800 rounded-lg border border-border transition">
                      <i className="ri-money-dollar-circle-line text-3xl text-primary mb-2"></i>
                      <span className="text-sm font-medium">Gestionar Apuestas</span>
                    </a>
                  </Link>
                  
                  <Link href="/admin/promotions">
                    <a className="flex flex-col items-center justify-center p-4 bg-card hover:bg-gray-800 rounded-lg border border-border transition">
                      <i className="ri-gift-line text-3xl text-primary mb-2"></i>
                      <span className="text-sm font-medium">Gestionar Promociones</span>
                    </a>
                  </Link>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Apuestas Recientes</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {isLoading ? (
                    <p>Cargando apuestas...</p>
                  ) : dashboardStats.recentBets.length > 0 ? (
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b border-border">
                            <th className="text-left py-2 font-medium">Usuario</th>
                            <th className="text-left py-2 font-medium">Evento</th>
                            <th className="text-left py-2 font-medium">Monto</th>
                            <th className="text-left py-2 font-medium">Estado</th>
                          </tr>
                        </thead>
                        <tbody>
                          {dashboardStats.recentBets.map((bet: any, index: number) => (
                            <tr key={index} className="border-b border-border">
                              <td className="py-2">{bet.username}</td>
                              <td className="py-2">{bet.eventName}</td>
                              <td className="py-2">${bet.amount.toFixed(2)}</td>
                              <td className="py-2">
                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                  bet.status === "won" ? "bg-green-500/20 text-green-500" :
                                  bet.status === "lost" ? "bg-red-500/20 text-red-500" :
                                  bet.status === "pending" ? "bg-yellow-500/20 text-yellow-500" : 
                                  "bg-gray-500/20 text-gray-500"
                                }`}>
                                  {bet.status === "won" ? "Ganada" :
                                   bet.status === "lost" ? "Perdida" :
                                   bet.status === "pending" ? "Pendiente" : 
                                   "Cancelada"}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <p className="text-muted-foreground">No hay apuestas recientes</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}

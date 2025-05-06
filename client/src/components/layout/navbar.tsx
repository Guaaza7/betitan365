import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { cn } from "@/lib/utils";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [location] = useLocation();
  const { user, logoutMutation } = useAuth();
  
  const navigationItems = [
    { name: "Inicio", href: "/" },
    { name: "Deportes", href: "/sports" },
    { name: "Promociones", href: "/promotions" },
    { name: "Contacto", href: "/contact" },
  ];

  return (
    <header className="sticky top-0 z-50 bg-secondary/90 backdrop-blur-sm border-b border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex-shrink-0 flex items-center">
            <Link href="/">
              <span className="text-primary font-bold text-2xl cursor-pointer">BetTitan365</span>
            </Link>
          </div>
          
          <nav className="hidden md:flex space-x-6">
            {navigationItems.map((item) => (
              <Link key={item.name} href={item.href}>
                <a className={cn(
                  "text-foreground hover:text-primary transition px-2 py-1 font-medium",
                  location === item.href && "text-primary"
                )}>
                  {item.name}
                </a>
              </Link>
            ))}
          </nav>
          
          <div className="flex items-center space-x-3">
            {user ? (
              <>
                <Link href="/account">
                  <a className="text-foreground bg-card hover:bg-gray-700 transition rounded-md px-4 py-2">
                    Mi Cuenta
                  </a>
                </Link>
                <Button 
                  variant="destructive" 
                  onClick={() => logoutMutation.mutate()}
                  disabled={logoutMutation.isPending}
                >
                  Salir
                </Button>
                {user.isAdmin && (
                  <Link href="/admin">
                    <a className="text-foreground bg-accent text-accent-foreground hover:bg-yellow-600 transition rounded-md px-4 py-2">
                      Admin
                    </a>
                  </Link>
                )}
              </>
            ) : (
              <>
                <Link href="/auth">
                  <a className="text-foreground bg-card hover:bg-gray-700 transition rounded-md px-4 py-2">
                    Iniciar Sesión
                  </a>
                </Link>
                <Link href="/auth">
                  <a className="text-white bg-primary hover:bg-red-700 transition rounded-md px-4 py-2 font-medium">
                    Registrarse
                  </a>
                </Link>
              </>
            )}
            
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild className="md:hidden">
                <Button variant="ghost" size="icon">
                  <Menu className="h-6 w-6" />
                  <span className="sr-only">Toggle menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="bg-card">
                <nav className="flex flex-col gap-4 mt-8">
                  {navigationItems.map((item) => (
                    <Link key={item.name} href={item.href}>
                      <a 
                        className={cn(
                          "text-foreground hover:text-primary transition px-2 py-2 font-medium",
                          location === item.href && "text-primary"
                        )}
                        onClick={() => setIsOpen(false)}
                      >
                        {item.name}
                      </a>
                    </Link>
                  ))}
                  {user && (
                    <Link href="/account">
                      <a 
                        className="text-foreground hover:text-primary transition px-2 py-2 font-medium"
                        onClick={() => setIsOpen(false)}
                      >
                        Mi Cuenta
                      </a>
                    </Link>
                  )}
                  {user?.isAdmin && (
                    <Link href="/admin">
                      <a 
                        className="text-foreground hover:text-primary transition px-2 py-2 font-medium"
                        onClick={() => setIsOpen(false)}
                      >
                        Admin
                      </a>
                    </Link>
                  )}
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}

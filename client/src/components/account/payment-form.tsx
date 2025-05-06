import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const months = [
  "01", "02", "03", "04", "05", "06", 
  "07", "08", "09", "10", "11", "12"
];

const years = Array.from({ length: 10 }, (_, i) => 
  (new Date().getFullYear() + i).toString()
);

const depositFormSchema = z.object({
  amount: z.coerce.number().min(5, "El monto mínimo es 5").max(10000, "El monto máximo es 10000"),
  cardNumber: z.string().regex(/^\d{16}$/, "Número de tarjeta debe tener 16 dígitos"),
  cardName: z.string().min(3, "Ingrese el nombre como aparece en la tarjeta"),
  expiryMonth: z.string(),
  expiryYear: z.string(),
  cvv: z.string().regex(/^\d{3,4}$/, "CVV debe tener 3 o 4 dígitos"),
});

type DepositFormValues = z.infer<typeof depositFormSchema>;

export default function PaymentForm() {
  const { toast } = useToast();
  
  const form = useForm<DepositFormValues>({
    resolver: zodResolver(depositFormSchema),
    defaultValues: {
      amount: 100,
      cardNumber: "",
      cardName: "",
      expiryMonth: "",
      expiryYear: "",
      cvv: "",
    },
  });

  const depositMutation = useMutation({
    mutationFn: async (data: DepositFormValues) => {
      const res = await apiRequest("POST", "/api/payments/deposit", data);
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/user'] });
      queryClient.invalidateQueries({ queryKey: ['/api/user/stats'] });
      toast({
        title: "Depósito exitoso",
        description: "Tu cuenta ha sido recargada correctamente",
      });
      form.reset();
    },
    onError: (error: Error) => {
      toast({
        title: "Error al procesar el depósito",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  function onSubmit(data: DepositFormValues) {
    depositMutation.mutate(data);
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">Métodos de Pago</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="card">
          <TabsList className="w-full">
            <TabsTrigger value="card" className="flex-1">Tarjeta de Crédito/Débito</TabsTrigger>
            <TabsTrigger value="paypal" className="flex-1">PayPal</TabsTrigger>
            <TabsTrigger value="crypto" className="flex-1">Criptomonedas</TabsTrigger>
          </TabsList>
          
          <TabsContent value="card" className="mt-4 space-y-4">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="amount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Monto a depositar</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                          <Input type="number" className="pl-8" {...field} />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="grid gap-4">
                  <FormField
                    control={form.control}
                    name="cardNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Número de Tarjeta</FormLabel>
                        <FormControl>
                          <Input placeholder="1234 5678 9012 3456" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="cardName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nombre en la Tarjeta</FormLabel>
                        <FormControl>
                          <Input placeholder="Nombre completo" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="grid grid-cols-3 gap-4">
                    <FormField
                      control={form.control}
                      name="expiryMonth"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Mes</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Mes" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {months.map((month) => (
                                <SelectItem key={month} value={month}>
                                  {month}
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
                      name="expiryYear"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Año</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Año" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {years.map((year) => (
                                <SelectItem key={year} value={year}>
                                  {year}
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
                      name="cvv"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>CVV</FormLabel>
                          <FormControl>
                            <Input type="password" placeholder="123" maxLength={4} {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
                
                <Button 
                  type="submit" 
                  className="w-full bg-primary hover:bg-red-700"
                  disabled={depositMutation.isPending}
                >
                  {depositMutation.isPending ? "Procesando..." : "Depositar Fondos"}
                </Button>
              </form>
            </Form>
          </TabsContent>
          
          <TabsContent value="paypal" className="mt-4">
            <div className="p-6 text-center border border-border rounded-lg">
              <div className="mb-4">
                <svg viewBox="0 0 50 30" className="h-12 w-24 mx-auto mb-4">
                  <path d="M0 0h50v30H0z" fill="#003087"/>
                  <path d="M18 12h-5a1 1 0 00-1 1l-2 11a.5.5 0 00.5.5h3a1 1 0 00.999-.867l.5-3.133h3.5a5 5 0 100-10h-.5z" fill="#fff"/>
                  <path d="M33 12h-3a1 1 0 00-.934.648l-4 9.352H29l.5-1.5h3L33 22h2.5l-2.5-10zm-3.5 6.5l1-3 .75 3h-1.75z" fill="#fff"/>
                  <path d="M44 16.5c-1 2.833-2.9 4.167-5.7 4-1.9.167-3.3-.667-4.2-2.5h6c.167-2-.833-3-3-3h-4.5l1.5-3h3l-.24.5h2.74l-.5-1a1 1 0 00-1-.5h-5a1 1 0 00-.937.648L27.5 22h8c3.167 0 6.5-1.833 8.5-5.5z" fill="#fff"/>
                </svg>
                <p className="mb-4">Serás redirigido a PayPal para completar tu depósito.</p>
              </div>
              <div className="space-y-4">
                <div className="flex items-center justify-center space-x-4">
                  <Button className="w-24">$50</Button>
                  <Button className="w-24">$100</Button>
                  <Button className="w-24">$200</Button>
                </div>
                <Button className="w-full bg-primary hover:bg-red-700">Continuar con PayPal</Button>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="crypto" className="mt-4">
            <div className="p-6 text-center border border-border rounded-lg">
              <h3 className="font-medium mb-4">Realiza tu depósito en criptomonedas</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <Button variant="outline" className="p-4 h-auto flex flex-col items-center justify-center">
                  <svg viewBox="0 0 32 32" className="h-10 w-10 mb-2">
                    <circle cx="16" cy="16" r="16" fill="#F7931A"/>
                    <path d="M24 14.4c.2-1.3-.5-2-1.3-2.5l.3-1.1-2.2-.6-1 1c-.8-.4-1.6-.6-2.4-.6l1-1-2.1-.6-.9 1.1c-.7-.2-1.4-.4-2.1-.5l-2.8-.7-.6 2.1 1.7.4-.4 1.8-.1-.4-.2.7-1.6-.4-.9 2.2 2.8.7c.5.1 1 .3 1.5.4l-.3 1.2c-1.6-.4-2.7.2-3.2 1.5-.4 1-.1 2.1.8 2.6l-.3 1.2 2.2.6.3-.4v1.5l2.1.5.3-.4v1.5l2.1.5.3-.4c1.2.1 2.3.2 3.5.1l-.3 1.1 2.2.6.3-1.1c1 .2 1.8.5 2.7.7l3 .8.6-2.3-1.7-.5.4-1.8.1.4.2-.7 1.6.4.9-2.2-2.9-.7c-.5-.1-1-.3-1.5-.4l.3-1.2c.6.1 1.1.3 1.7.4l1.7.5c1 .3 1.8-.3 2.1-1.2.3-.9 0-1.8-.9-2.3z" fill="#FFFFFF"/>
                    <path d="M19.5 18.1c.7-1.3-.3-1.8-1.6-2.2L16.5 15l-1.1 4.2 1.3.3c1.3.5 2.2-.2 2.8-1.4z" fill="#F7931A"/>
                    <path d="M19.2 13.5c.9-.9.4-1.8-1-2.2l-1.3-.3-1 3.8 1.3.3c1.4.2 2-.6 2-1.6z" fill="#F7931A"/>
                  </svg>
                  <span className="text-sm">Bitcoin</span>
                </Button>
                
                <Button variant="outline" className="p-4 h-auto flex flex-col items-center justify-center">
                  <svg viewBox="0 0 32 32" className="h-10 w-10 mb-2">
                    <circle cx="16" cy="16" r="16" fill="#627EEA"/>
                    <path d="M16.498 4v8.87l7.497 3.35z" fill="#FFFFFF" fillOpacity="0.6"/>
                    <path d="M16.498 4L9 16.22l7.498-3.35z" fill="#FFFFFF"/>
                    <path d="M16.498 21.968v6.027L24 17.616z" fill="#FFFFFF" fillOpacity="0.6"/>
                    <path d="M16.498 27.995v-6.028L9 17.616z" fill="#FFFFFF"/>
                    <path d="M16.498 20.573l7.497-4.353-7.497-3.348z" fill="#FFFFFF" fillOpacity="0.2"/>
                    <path d="M9 16.22l7.498 4.353v-7.701z" fill="#FFFFFF" fillOpacity="0.6"/>
                  </svg>
                  <span className="text-sm">Ethereum</span>
                </Button>
                
                <Button variant="outline" className="p-4 h-auto flex flex-col items-center justify-center">
                  <svg viewBox="0 0 32 32" className="h-10 w-10 mb-2">
                    <circle cx="16" cy="16" r="16" fill="#345D9D"/>
                    <path d="M16.5 19.8v3.2l5.5-7.8z" fill="#FFFFFF"/>
                    <path d="M16.5 9v8.6l5.5 2.2z" fill="#FFFFFF" fillOpacity="0.6"/>
                    <path d="M16.5 9L11 19.8l5.5-2.2z" fill="#FFFFFF"/>
                    <path d="M16.5 23L11 19.8l5.5 3.2z" fill="#FFFFFF" fillOpacity="0.6"/>
                  </svg>
                  <span className="text-sm">Litecoin</span>
                </Button>
                
                <Button variant="outline" className="p-4 h-auto flex flex-col items-center justify-center">
                  <svg viewBox="0 0 32 32" className="h-10 w-10 mb-2">
                    <circle cx="16" cy="16" r="16" fill="#2775CA"/>
                    <path d="M21.8 15c0-3.2-3.2-4.5-5.9-4.8V7.8h-2.4v2.3c-.6 0-1.2 0-1.8.1V7.8H9.3v2.5c-.5.1-1 .1-1.4.1v3.2c.8 0 1.5-.1 1.5-.1s.7 0 .7.6v6.6c0 .5-.3.6-.6.6H8l-.8 3.5h2.3c.4 0 .8 0 1.3.1v2.5h2.4V25c.6 0 1.2.1 1.8.1v2.5h2.4V25c3.9-.2 6.5-1.6 6.5-5 .1-2.6-1.5-3.8-3.1-4.3 1.3-.6 2-1.6 2-3.7zm-3.7 6.4c0 2.3-3.9 2.5-5.2 2.5v-5c1.3 0 5.2.1 5.2 2.5zm-1-5.4c0 2.1-3.2 2.3-4.2 2.3v-4.6c1 0 4.2.1 4.2 2.3z" fill="#FFFFFF"/>
                  </svg>
                  <span className="text-sm">USDT</span>
                </Button>
              </div>
              
              <Button className="w-full bg-primary hover:bg-red-700">Continuar con Crypto</Button>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}

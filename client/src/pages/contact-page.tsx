import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import { Helmet } from "react-helmet";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Mail, Phone, MessageSquare } from "lucide-react";

const contactFormSchema = z.object({
  name: z.string().min(2, {
    message: "El nombre debe tener al menos 2 caracteres",
  }),
  email: z.string().email({
    message: "Ingresa una dirección de correo electrónico válida",
  }),
  subject: z.string().min(1, {
    message: "Selecciona un asunto",
  }),
  message: z.string().min(10, {
    message: "El mensaje debe tener al menos 10 caracteres",
  }),
});

type ContactFormValues = z.infer<typeof contactFormSchema>;

export default function ContactPage() {
  const { toast } = useToast();
  const [submitted, setSubmitted] = useState(false);

  // Define form
  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: "",
      email: "",
      subject: "",
      message: "",
    },
  });

  // Handle form submission
  const contactMutation = useMutation({
    mutationFn: async (data: ContactFormValues) => {
      const res = await apiRequest("POST", "/api/contact", data);
      return await res.json();
    },
    onSuccess: () => {
      toast({
        title: "Mensaje enviado",
        description: "Hemos recibido tu mensaje. Te contactaremos pronto.",
      });
      form.reset();
      setSubmitted(true);
    },
    onError: (error: Error) => {
      toast({
        title: "Error al enviar el mensaje",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  function onSubmit(data: ContactFormValues) {
    contactMutation.mutate(data);
  }

  return (
    <>
      <Helmet>
        <title>Contacto | BetTitan365</title>
        <meta
          name="description"
          content="Contacta con nuestro equipo de atención al cliente para resolver cualquier duda o problema."
        />
      </Helmet>

      <Navbar />

      <main className="min-h-screen bg-background py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold">Contacto</h1>
              <p className="mt-2 text-muted-foreground">
                Estamos aquí para ayudarte. Contáctanos en cualquier momento.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
              <Card>
                <CardContent className="p-6 flex flex-col items-center text-center">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                    <Mail className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-medium mb-2">Email</h3>
                  <p className="text-muted-foreground text-sm mb-4">
                    Escríbenos un correo, te responderemos en 24h
                  </p>
                  <a href="mailto:soporte@bettitan365.com" className="text-primary hover:underline">
                    soporte@bettitan365.com
                  </a>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6 flex flex-col items-center text-center">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                    <Phone className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-medium mb-2">Teléfono</h3>
                  <p className="text-muted-foreground text-sm mb-4">
                    Llámanos para atención inmediata
                  </p>
                  <a href="tel:+34900123456" className="text-primary hover:underline">
                    +34 900 123 456
                  </a>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6 flex flex-col items-center text-center">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                    <MessageSquare className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-medium mb-2">Chat en vivo</h3>
                  <p className="text-muted-foreground text-sm mb-4">
                    Chatea con nosotros en tiempo real
                  </p>
                  <Button variant="link" className="text-primary hover:underline p-0">
                    Iniciar chat
                  </Button>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Formulario de Contacto</CardTitle>
                <CardDescription>
                  Completa el formulario y nos pondremos en contacto contigo lo antes posible.
                </CardDescription>
              </CardHeader>
              <CardContent>
                {submitted ? (
                  <div className="text-center py-8">
                    <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
                      <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-medium mb-2">¡Gracias por contactarnos!</h3>
                    <p className="text-muted-foreground mb-4">
                      Hemos recibido tu mensaje y te responderemos lo antes posible.
                    </p>
                    <Button 
                      onClick={() => setSubmitted(false)}
                      className="bg-primary hover:bg-red-700"
                    >
                      Enviar otro mensaje
                    </Button>
                  </div>
                ) : (
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Nombre</FormLabel>
                            <FormControl>
                              <Input placeholder="Tu nombre" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                              <Input placeholder="tu@email.com" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="subject"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Asunto</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Selecciona un asunto" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="account">Cuenta</SelectItem>
                                <SelectItem value="deposit">Depósito/Retiro</SelectItem>
                                <SelectItem value="promotion">Promociones</SelectItem>
                                <SelectItem value="technical">Soporte técnico</SelectItem>
                                <SelectItem value="other">Otro</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="message"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Mensaje</FormLabel>
                            <FormControl>
                              <Textarea 
                                placeholder="Tu mensaje" 
                                className="resize-none min-h-[120px]" 
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <Button 
                        type="submit" 
                        className="w-full bg-primary hover:bg-red-700"
                        disabled={contactMutation.isPending}
                      >
                        {contactMutation.isPending ? "Enviando..." : "Enviar mensaje"}
                      </Button>
                    </form>
                  </Form>
                )}
              </CardContent>
            </Card>

            <div className="mt-10 p-6 bg-card rounded-lg">
              <h3 className="text-lg font-bold mb-4">Preguntas Frecuentes</h3>
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium mb-1">¿Cómo puedo crear una cuenta?</h4>
                  <p className="text-sm text-muted-foreground">
                    Puedes registrarte haciendo clic en el botón "Registrarse" en la parte superior de la página. Completa el formulario con tus datos personales y sigue las instrucciones.
                  </p>
                </div>
                <div>
                  <h4 className="font-medium mb-1">¿Cuáles son los métodos de pago aceptados?</h4>
                  <p className="text-sm text-muted-foreground">
                    Aceptamos tarjetas de crédito/débito (Visa, Mastercard), monederos electrónicos (PayPal, Skrill), transferencias bancarias y criptomonedas.
                  </p>
                </div>
                <div>
                  <h4 className="font-medium mb-1">¿Cuánto tiempo tardan los retiros?</h4>
                  <p className="text-sm text-muted-foreground">
                    El tiempo de procesamiento varía según el método de pago. Las tarjetas suelen tardar 2-5 días hábiles, mientras que los monederos electrónicos y criptomonedas pueden ser más rápidos (24-48 horas).
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}

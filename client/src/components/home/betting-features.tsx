export default function BettingFeatures() {
  const features = [
    {
      icon: "ri-shield-check-line",
      title: "Apuestas Seguras",
      description: "Plataforma certificada y regulada con los más altos estándares de seguridad."
    },
    {
      icon: "ri-money-dollar-circle-line",
      title: "Mejores Cuotas",
      description: "Ofrecemos las cuotas más competitivas del mercado para maximizar tus ganancias."
    },
    {
      icon: "ri-customer-service-2-line",
      title: "Soporte 24/7",
      description: "Nuestro equipo de atención al cliente está disponible las 24 horas para ayudarte."
    }
  ];

  return (
    <section className="py-12 bg-card">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-bold text-foreground text-center mb-8">¿Por qué elegir BetTitan365?</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="bg-background rounded-lg p-6 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 text-primary rounded-full mb-4">
                <i className={`${feature.icon} text-3xl`}></i>
              </div>
              <h3 className="text-lg font-bold mb-2">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

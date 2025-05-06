import { Link } from "wouter";

export default function SportsCategories() {
  const sportsCategories = [
    { id: 1, name: "Fútbol", icon: "ri-football-line", path: "/sports?category=football" },
    { id: 2, name: "Baloncesto", icon: "ri-basketball-line", path: "/sports?category=basketball" },
    { id: 3, name: "Tenis", icon: "ri-tennis-line", path: "/sports?category=tennis" },
    { id: 4, name: "F. Americano", icon: "ri-football-fill", path: "/sports?category=american-football" },
    { id: 5, name: "Béisbol", icon: "ri-gamepad-line", path: "/sports?category=baseball" },
    { id: 6, name: "eSports", icon: "ri-gamepad-line", path: "/sports?category=esports" },
  ];

  return (
    <section id="deportes" className="py-12 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-bold text-foreground mb-6">Deportes Populares</h2>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {sportsCategories.map((category) => (
            <Link key={category.id} href={category.path}>
              <a className="bg-card rounded-lg p-4 flex flex-col items-center justify-center hover:bg-gray-800 transition">
                <i className={`${category.icon} text-4xl text-primary mb-3`}></i>
                <span className="text-sm font-medium">{category.name}</span>
              </a>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

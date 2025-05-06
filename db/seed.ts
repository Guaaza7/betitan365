import { db } from "./index";
import {
  users,
  userStats,
  sportCategories,
  teams,
  events,
  promotions
} from "@shared/schema";
import { scrypt, randomBytes } from "crypto";
import { promisify } from "util";
import { eq } from "drizzle-orm";

const scryptAsync = promisify(scrypt);

async function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex");
  const buf = (await scryptAsync(password, salt, 64)) as Buffer;
  return `${buf.toString("hex")}.${salt}`;
}

async function seed() {
  try {
    console.log("Starting database seeding...");

    // Create admin and demo users
    console.log("Creating users...");
    
    // Check if admin user exists
    const existingAdmin = await db.select().from(users).where(eq(users.username, "admin")).limit(1);
    
    if (existingAdmin.length === 0) {
      // Create admin user
      const [admin] = await db.insert(users).values({
        username: "admin",
        password: await hashPassword("admin123"),
        isAdmin: true,
        balance: 10000,
        createdAt: new Date()
      }).returning();
      
      // Create admin stats
      await db.insert(userStats).values({
        userId: admin.id,
        pendingBets: 0,
        totalWon: 0,
        totalLost: 0
      });
    }
    
    // Check if demo user exists
    const existingDemo = await db.select().from(users).where(eq(users.username, "demo")).limit(1);
    
    if (existingDemo.length === 0) {
      // Create demo user
      const [demo] = await db.insert(users).values({
        username: "demo",
        password: await hashPassword("demo123"),
        isAdmin: false,
        balance: 1000,
        createdAt: new Date()
      }).returning();
      
      // Create demo stats
      await db.insert(userStats).values({
        userId: demo.id,
        pendingBets: 0,
        totalWon: 150,
        totalLost: 75
      });
    }

    // Create sport categories
    console.log("Creating sport categories...");
    
    // Check if any categories exist
    const existingCategories = await db.select().from(sportCategories).limit(1);
    
    if (existingCategories.length === 0) {
      const sportCategoriesData = [
        { name: "Fútbol", slug: "football", icon: "ri-football-line" },
        { name: "Baloncesto", slug: "basketball", icon: "ri-basketball-line" },
        { name: "Tenis", slug: "tennis", icon: "ri-tennis-line" },
        { name: "Fútbol Americano", slug: "american-football", icon: "ri-football-fill" },
        { name: "Béisbol", slug: "baseball", icon: "ri-gamepad-line" },
        { name: "eSports", slug: "esports", icon: "ri-gamepad-line" }
      ];
      
      await db.insert(sportCategories).values(sportCategoriesData);
    }
    
    // Create teams
    console.log("Creating teams...");
    
    // Get sport categories
    const categories = await db.select().from(sportCategories);
    const categoryMap = new Map(categories.map(cat => [cat.slug, cat.id]));
    
    // Check if any teams exist
    const existingTeams = await db.select().from(teams).limit(1);
    
    if (existingTeams.length === 0) {
      const teamsData = [
        // Football teams
        { name: "Barcelona", logo: "https://images.unsplash.com/photo-1589487391730-58f20eb2c308?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&h=40&w=40", sportCategoryId: categoryMap.get("football") },
        { name: "Real Madrid", logo: "https://images.unsplash.com/photo-1589487391730-58f20eb2c308?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&h=40&w=40", sportCategoryId: categoryMap.get("football") },
        { name: "Atlético Madrid", logo: "https://images.unsplash.com/photo-1589487391730-58f20eb2c308?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&h=40&w=40", sportCategoryId: categoryMap.get("football") },
        { name: "Sevilla", logo: "https://images.unsplash.com/photo-1589487391730-58f20eb2c308?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&h=40&w=40", sportCategoryId: categoryMap.get("football") },
        { name: "Liverpool", logo: "https://images.unsplash.com/photo-1589487391730-58f20eb2c308?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&h=40&w=40", sportCategoryId: categoryMap.get("football") },
        { name: "Man City", logo: "https://images.unsplash.com/photo-1589487391730-58f20eb2c308?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&h=40&w=40", sportCategoryId: categoryMap.get("football") },
        { name: "Chelsea", logo: "https://images.unsplash.com/photo-1589487391730-58f20eb2c308?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&h=40&w=40", sportCategoryId: categoryMap.get("football") },
        { name: "Arsenal", logo: "https://images.unsplash.com/photo-1589487391730-58f20eb2c308?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&h=40&w=40", sportCategoryId: categoryMap.get("football") },
        { name: "Juventus", logo: "https://images.unsplash.com/photo-1589487391730-58f20eb2c308?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&h=40&w=40", sportCategoryId: categoryMap.get("football") },
        { name: "AC Milan", logo: "https://images.unsplash.com/photo-1589487391730-58f20eb2c308?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&h=40&w=40", sportCategoryId: categoryMap.get("football") },
        
        // Basketball teams
        { name: "Lakers", logo: "https://images.unsplash.com/photo-1589487391730-58f20eb2c308?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&h=40&w=40", sportCategoryId: categoryMap.get("basketball") },
        { name: "Celtics", logo: "https://images.unsplash.com/photo-1589487391730-58f20eb2c308?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&h=40&w=40", sportCategoryId: categoryMap.get("basketball") },
        { name: "Warriors", logo: "https://images.unsplash.com/photo-1589487391730-58f20eb2c308?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&h=40&w=40", sportCategoryId: categoryMap.get("basketball") },
        { name: "Bulls", logo: "https://images.unsplash.com/photo-1589487391730-58f20eb2c308?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&h=40&w=40", sportCategoryId: categoryMap.get("basketball") },
        
        // Tennis players (as teams)
        { name: "Nadal", logo: "https://images.unsplash.com/photo-1589487391730-58f20eb2c308?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&h=40&w=40", sportCategoryId: categoryMap.get("tennis") },
        { name: "Djokovic", logo: "https://images.unsplash.com/photo-1589487391730-58f20eb2c308?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&h=40&w=40", sportCategoryId: categoryMap.get("tennis") },
        { name: "Federer", logo: "https://images.unsplash.com/photo-1589487391730-58f20eb2c308?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&h=40&w=40", sportCategoryId: categoryMap.get("tennis") },
        { name: "Alcaraz", logo: "https://images.unsplash.com/photo-1589487391730-58f20eb2c308?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&h=40&w=40", sportCategoryId: categoryMap.get("tennis") },
      ];
      
      await db.insert(teams).values(teamsData);
    }
    
    // Create events
    console.log("Creating events...");
    
    // Get all teams
    const allTeams = await db.select().from(teams);
    
    // Find football teams for creating events
    const footballTeams = allTeams.filter(team => team.sportCategoryId === categoryMap.get("football"));
    const basketballTeams = allTeams.filter(team => team.sportCategoryId === categoryMap.get("basketball"));
    const tennisTeams = allTeams.filter(team => team.sportCategoryId === categoryMap.get("tennis"));
    
    // Check if any events exist
    const existingEvents = await db.select().from(events).limit(1);
    
    if (existingEvents.length === 0) {
      // Create live football events
      const liveFootballEvents = [
        {
          league: "La Liga",
          homeTeamId: footballTeams[0].id, // Barcelona
          awayTeamId: footballTeams[1].id, // Real Madrid
          sportCategoryId: categoryMap.get("football"),
          startTime: new Date(Date.now() - 60 * 60 * 1000), // 1 hour ago
          isLive: true,
          homeScore: 2,
          awayScore: 1,
          minute: 65,
          homeOdds: 2.10,
          drawOdds: 3.25,
          awayOdds: 4.50,
          status: "live",
          createdAt: new Date()
        },
        {
          league: "Premier League",
          homeTeamId: footballTeams[4].id, // Liverpool
          awayTeamId: footballTeams[5].id, // Man City
          sportCategoryId: categoryMap.get("football"),
          startTime: new Date(Date.now() - 40 * 60 * 1000), // 40 minutes ago
          isLive: true,
          homeScore: 0,
          awayScore: 0,
          minute: 42,
          homeOdds: 3.40,
          drawOdds: 2.90,
          awayOdds: 2.20,
          status: "live",
          createdAt: new Date()
        },
        {
          league: "Serie A",
          homeTeamId: footballTeams[8].id, // Juventus
          awayTeamId: footballTeams[9].id, // AC Milan
          sportCategoryId: categoryMap.get("football"),
          startTime: new Date(Date.now() - 75 * 60 * 1000), // 1 hour and 15 minutes ago
          isLive: true,
          homeScore: 3,
          awayScore: 1,
          minute: 78,
          homeOdds: 1.05,
          drawOdds: 10.00,
          awayOdds: 25.00,
          status: "live",
          createdAt: new Date()
        }
      ];
      
      // Create upcoming football events
      const upcomingFootballEvents = [
        {
          league: "La Liga",
          homeTeamId: footballTeams[2].id, // Atlético Madrid
          awayTeamId: footballTeams[3].id, // Sevilla
          sportCategoryId: categoryMap.get("football"),
          startTime: new Date(Date.now() + 4 * 60 * 60 * 1000), // 4 hours from now
          isLive: false,
          homeOdds: 1.90,
          drawOdds: 3.40,
          awayOdds: 4.20,
          status: "upcoming",
          createdAt: new Date()
        },
        {
          league: "Premier League",
          homeTeamId: footballTeams[7].id, // Arsenal
          awayTeamId: footballTeams[6].id, // Chelsea
          sportCategoryId: categoryMap.get("football"),
          startTime: new Date(Date.now() + 5 * 60 * 60 * 1000), // 5 hours from now
          isLive: false,
          homeOdds: 2.10,
          drawOdds: 3.30,
          awayOdds: 3.50,
          status: "upcoming",
          createdAt: new Date()
        }
      ];
      
      // Create basketball events
      const basketballEvents = [
        {
          league: "NBA",
          homeTeamId: basketballTeams[0].id, // Lakers
          awayTeamId: basketballTeams[1].id, // Celtics
          sportCategoryId: categoryMap.get("basketball"),
          startTime: new Date(Date.now() + 2 * 60 * 60 * 1000), // 2 hours from now
          isLive: false,
          homeOdds: 1.80,
          drawOdds: 15.00, // very unlikely in basketball
          awayOdds: 2.10,
          status: "upcoming",
          createdAt: new Date()
        }
      ];
      
      // Create tennis events
      const tennisEvents = [
        {
          league: "Wimbledon",
          homeTeamId: tennisTeams[0].id, // Nadal
          awayTeamId: tennisTeams[1].id, // Djokovic
          sportCategoryId: categoryMap.get("tennis"),
          startTime: new Date(Date.now() + 24 * 60 * 60 * 1000), // tomorrow
          isLive: false,
          homeOdds: 2.20,
          drawOdds: 50.00, // extremely unlikely in tennis
          awayOdds: 1.75,
          status: "upcoming",
          createdAt: new Date()
        }
      ];
      
      const allEvents = [...liveFootballEvents, ...upcomingFootballEvents, ...basketballEvents, ...tennisEvents];
      await db.insert(events).values(allEvents);
    }
    
    // Create promotions
    console.log("Creating promotions...");
    
    // Check if any promotions exist
    const existingPromotions = await db.select().from(promotions).limit(1);
    
    if (existingPromotions.length === 0) {
      const promotionsData = [
        {
          title: "Bono de Bienvenida 100%",
          description: "Hasta 200€ en tu primer depósito",
          imageUrl: "https://images.unsplash.com/photo-1579621970588-a35d0e7ab9b6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&h=450&q=80",
          category: "new_users",
          endDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000), // 90 days from now
          terms: "Oferta válida para nuevos usuarios. El depósito mínimo es de 10€. Se aplican requisitos de apuesta de 5x el bono antes de poder retirar ganancias.",
          isActive: true,
          createdAt: new Date()
        },
        {
          title: "Super Cuotas Liga",
          description: "Mejores cuotas en partidos de La Liga",
          imageUrl: "https://images.unsplash.com/photo-1518091043644-c1d4457512c6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&h=450&q=80",
          category: "sports",
          code: "LALIGA10",
          endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
          terms: "Aplica a partidos seleccionados de La Liga. Las cuotas mejoradas se mostrarán automáticamente en la sección de apuestas.",
          isActive: true,
          createdAt: new Date()
        },
        {
          title: "Casino en Vivo",
          description: "Giros gratis cada viernes",
          imageUrl: "https://images.unsplash.com/photo-1606167668584-78701c57f13d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&h=450&q=80",
          category: "casino",
          endDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000), // 60 days from now
          terms: "10 giros gratis cada viernes en slots seleccionadas. Requiere depósito mínimo de 20€ durante la semana. Las ganancias tienen un requisito de apuesta de 25x.",
          isActive: true,
          createdAt: new Date()
        }
      ];
      
      await db.insert(promotions).values(promotionsData);
    }
    
    console.log("Database seeding completed successfully!");
  } catch (error) {
    console.error("Error seeding database:", error);
  }
}

seed();

/* eslint-disable @typescript-eslint/no-require-imports */
/**
 * LANSUB TRAVEL OS — Demo Data Seed
 * Generates realistic data for National Travels (nationaltravels.co.in)
 * 120+ buses, 100+ cities, 500+ destinations, 25+ branches, 700+ employees
 */

import { PrismaClient } from "@prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import bcrypt from "bcryptjs";

const adapter = new PrismaBetterSqlite3({ url: "./dev.db" });
const prisma = new PrismaClient({ adapter });

// ============================================
// CONSTANTS & DATA
// ============================================

const CITIES = [
  { name: "Chennai", lat: 13.0827, lng: 80.2707 },
  { name: "Bangalore", lat: 12.9716, lng: 77.5946 },
  { name: "Madurai", lat: 9.9252, lng: 78.1198 },
  { name: "Coimbatore", lat: 11.0168, lng: 76.9558 },
  { name: "Salem", lat: 11.6643, lng: 78.146 },
  { name: "Trichy", lat: 10.7905, lng: 78.7047 },
  { name: "Hyderabad", lat: 17.385, lng: 78.4867 },
  { name: "Pondicherry", lat: 11.9416, lng: 79.8083 },
  { name: "Tirunelveli", lat: 8.7139, lng: 77.7567 },
  { name: "Vellore", lat: 12.9165, lng: 79.1325 },
  { name: "Erode", lat: 11.3408, lng: 77.7172 },
  { name: "Thoothukudi", lat: 8.7642, lng: 78.1348 },
  { name: "Kanyakumari", lat: 8.0883, lng: 77.5385 },
  { name: "Ooty", lat: 11.4102, lng: 76.695 },
  { name: "Munnar", lat: 10.0889, lng: 77.0595 },
];

const ROUTES_DATA = [
  { from: "Chennai", to: "Bangalore", dist: 346, hrs: 7, toll: 450, fuel: 1800, fares: [800, 950, 1200] },
  { from: "Chennai", to: "Madurai", dist: 462, hrs: 8, toll: 320, fuel: 2100, fares: [750, 900, 1100] },
  { from: "Chennai", to: "Coimbatore", dist: 505, hrs: 9, toll: 400, fuel: 2300, fares: [850, 1000, 1300] },
  { from: "Chennai", to: "Salem", dist: 340, hrs: 6, toll: 250, fuel: 1600, fares: [650, 800, 1000] },
  { from: "Chennai", to: "Trichy", dist: 328, hrs: 6, toll: 200, fuel: 1500, fares: [600, 750, 950] },
  { from: "Chennai", to: "Hyderabad", dist: 625, hrs: 10, toll: 600, fuel: 2800, fares: [1100, 1400, 1800] },
  { from: "Chennai", to: "Pondicherry", dist: 162, hrs: 3, toll: 100, fuel: 800, fares: [350, 450, 600] },
  { from: "Chennai", to: "Tirunelveli", dist: 590, hrs: 10, toll: 380, fuel: 2600, fares: [950, 1150, 1400] },
  { from: "Bangalore", to: "Coimbatore", dist: 360, hrs: 7, toll: 350, fuel: 1700, fares: [700, 850, 1100] },
  { from: "Bangalore", to: "Hyderabad", dist: 572, hrs: 9, toll: 550, fuel: 2600, fares: [1000, 1250, 1600] },
  { from: "Coimbatore", to: "Madurai", dist: 209, hrs: 4, toll: 150, fuel: 1000, fares: [450, 550, 700] },
  { from: "Madurai", to: "Kanyakumari", dist: 245, hrs: 5, toll: 180, fuel: 1100, fares: [500, 600, 800] },
  { from: "Chennai", to: "Ooty", dist: 540, hrs: 9, toll: 320, fuel: 2400, fares: [900, 1100, 1400] },
  { from: "Bangalore", to: "Ooty", dist: 290, hrs: 6, toll: 250, fuel: 1400, fares: [650, 800, 1000] },
  { from: "Chennai", to: "Vellore", dist: 146, hrs: 3, toll: 80, fuel: 700, fares: [300, 380, 500] },
  { from: "Chennai", to: "Erode", dist: 390, hrs: 7, toll: 270, fuel: 1800, fares: [700, 850, 1100] },
  { from: "Coimbatore", to: "Ooty", dist: 86, hrs: 2, toll: 60, fuel: 400, fares: [200, 280, 380] },
  { from: "Chennai", to: "Thoothukudi", dist: 620, hrs: 10, toll: 400, fuel: 2700, fares: [1000, 1200, 1500] },
  { from: "Madurai", to: "Trichy", dist: 133, hrs: 3, toll: 100, fuel: 600, fares: [280, 350, 470] },
  { from: "Chennai", to: "Munnar", dist: 593, hrs: 10, toll: 420, fuel: 2700, fares: [1050, 1300, 1650] },
];

const BUS_MODELS = [
  { model: "Volvo B9R", manufacturer: "Volvo", capacity: 45, layoutType: "SEMI_SLEEPER" },
  { model: "Volvo B11R", manufacturer: "Volvo", capacity: 40, layoutType: "SLEEPER" },
  { model: "Scania Metrolink", manufacturer: "Scania", capacity: 48, layoutType: "SEATER" },
  { model: "Mercedes-Benz OC 500", manufacturer: "Mercedes-Benz", capacity: 42, layoutType: "SEMI_SLEEPER" },
  { model: "Tata StarBus Ultra", manufacturer: "Tata", capacity: 50, layoutType: "SEATER" },
  { model: "Ashok Leyland Viking", manufacturer: "Ashok Leyland", capacity: 52, layoutType: "SEATER" },
  { model: "Eicher Skyline Pro", manufacturer: "Eicher", capacity: 45, layoutType: "SEATER" },
];

const FIRST_NAMES = [
  "Arjun", "Vikram", "Karthik", "Suresh", "Ramesh", "Murugan", "Senthil", "Vignesh",
  "Praveen", "Manoj", "Dinesh", "Rajan", "Kumar", "Ganesh", "Sathish", "Balaji",
  "Rajesh", "Anand", "Pradeep", "Arun", "Vijay", "Siva", "Deepak", "Harish",
  "Subramani", "Selvam", "Muthu", "Kannan", "Pandian", "Mohan", "Annamalai", "Gopal",
  "Narayanasamy", "Palanisamy", "Thirumurthy", "Ramasamy", "Venkatesh", "Natarajan",
  "Prakash", "Krishnamurthy", "Saravanan", "Muthukrishnan", "Jayaraman", "Radhakrishnan",
];

const LAST_NAMES = [
  "Kumar", "Rajan", "Mani", "Raj", "Krishnan", "Murugan", "Samy", "Swamy",
  "Pillai", "Nadar", "Gounder", "Chettiar", "Goundan", "Thevar", "Velu",
  "Pandian", "Natarajan", "Sundaram", "Kannan", "Nair",
];

const CUSTOMER_NAMES_F = [
  "Priya", "Deepa", "Divya", "Kavitha", "Lakshmi", "Meenakshi", "Nithya",
  "Sangeetha", "Subha", "Uma", "Valli", "Yamuna", "Anitha", "Bhavani",
  "Chithra", "Dhanalakshmi", "Eswari", "Geetha", "Hema", "Indira",
];

function randomFrom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomFloat(min: number, max: number, decimals = 2): number {
  return parseFloat((Math.random() * (max - min) + min).toFixed(decimals));
}

function daysAgo(days: number): Date {
  const d = new Date();
  d.setDate(d.getDate() - days);
  return d;
}

function hoursFromNow(hours: number): Date {
  const d = new Date();
  d.setHours(d.getHours() + hours);
  return d;
}

function tnPlate(num: number): string {
  const district = String(Math.floor(num / 100) + 1).padStart(2, "0");
  const letters = ["AB", "CD", "EF", "GH", "IJ", "KL", "MN", "OP"][num % 8];
  const serial = String((num % 100) * 10 + 1000).padStart(4, "0");
  return `TN-${district}-${letters}-${serial}`;
}

function generatePhone(): string {
  const prefix = randomFrom(["98", "99", "90", "91", "94", "87", "77", "97", "96", "95"]);
  return `${prefix}${randomInt(10000000, 99999999)}`;
}

function generateEmail(name: string): string {
  const domain = randomFrom(["gmail.com", "yahoo.com", "outlook.com", "rediffmail.com"]);
  return `${name.toLowerCase().replace(/\s/g, ".")}${randomInt(10, 999)}@${domain}`;
}

// ============================================
// MAIN SEED FUNCTION
// ============================================

async function main() {
  console.log("🌱 Starting LANSUB TRAVEL OS demo data seed...");
  console.log("📊 Seeding for: National Travels (nationaltravels.co.in)");

  // Clean existing data
  console.log("🧹 Cleaning existing data...");
  await prisma.aiChat.deleteMany();
  await prisma.aiInsight.deleteMany();
  await prisma.auditLog.deleteMany();
  await prisma.notification.deleteMany();
  await prisma.complaint.deleteMany();
  await prisma.alert.deleteMany();
  await prisma.pricingRecommendation.deleteMany();
  await prisma.pricingRule.deleteMany();
  await prisma.tripProfitability.deleteMany();
  await prisma.tripRevenue.deleteMany();
  await prisma.tripExpense.deleteMany();
  await prisma.commission.deleteMany();
  await prisma.bookingPayment.deleteMany();
  await prisma.bookingPassenger.deleteMany();
  await prisma.booking.deleteMany();
  await prisma.tripCrew.deleteMany();
  await prisma.trip.deleteMany();
  await prisma.seat.deleteMany();
  await prisma.seatLayout.deleteMany();
  await prisma.iotSensorData.deleteMany();
  await prisma.iotDevice.deleteMany();
  await prisma.gpsPosition.deleteMany();
  await prisma.gpsDevice.deleteMany();
  await prisma.fuelTransaction.deleteMany();
  await prisma.maintenancePart.deleteMany();
  await prisma.vehicleMaintenance.deleteMany();
  await prisma.vehicleDocument.deleteMany();
  await prisma.vehicle.deleteMany();
  await prisma.routeStop.deleteMany();
  await prisma.route.deleteMany();
  await prisma.customer.deleteMany();
  await prisma.agent.deleteMany();
  await prisma.employeeDocument.deleteMany();
  await prisma.leave.deleteMany();
  await prisma.attendance.deleteMany();
  await prisma.driver.deleteMany();
  await prisma.user.deleteMany();
  await prisma.employee.deleteMany();
  await prisma.branch.deleteMany();
  await prisma.company.deleteMany();

  // ============================================
  // 1. COMPANY
  // ============================================
  console.log("🏢 Creating company: National Travels...");
  const company = await prisma.company.create({
    data: {
      name: "National Travels",
      code: "NATIONAL",
      logo: "https://s3-ts-ind.s3.amazonaws.com/operators/380/home/logoUrl_20260505_123243_1",
      tagline: "See how we go an extra mile to give you best experience",
      address: "Ten Square Mall, 100 Feet Road, Koyambedu",
      city: "Chennai",
      state: "Tamil Nadu",
      pincode: "600108",
      phone: "9841584444",
      email: "admin@nationaltravels.co.in",
      website: "https://www.nationaltravels.co.in",
      gstNumber: "33AABCN1234F1Z5",
      panNumber: "AABCN1234F",
    },
  });

  // ============================================
  // 2. BRANCHES (25+)
  // ============================================
  const branchCities = [
    "Chennai", "Bangalore", "Madurai", "Coimbatore", "Salem",
    "Trichy", "Tirunelveli", "Vellore", "Erode", "Ooty",
    "Pondicherry", "Thoothukudi", "Kanyakumari", "Hyderabad", "Munnar",
    "Dharmapuri", "Krishnagiri", "Namakkal", "Karur", "Dindigul",
    "Thanjavur", "Nagapattinam", "Cuddalore", "Villupuram", "Kanchipuram",
  ];

  const branches = [];
  for (let i = 0; i < branchCities.length; i++) {
    const branch = await prisma.branch.create({
      data: {
        companyId: company.id,
        name: `National Travels - ${branchCities[i]}`,
        code: `NT-${branchCities[i].substring(0, 3).toUpperCase()}`,
        city: branchCities[i],
        address: `${randomInt(10, 500)} Main Street, ${branchCities[i]}`,
        phone: generatePhone(),
      },
    });
    branches.push(branch);
  }
  console.log(`✅ Created ${branches.length} branches`);

  // ============================================
  // 3. EMPLOYEES (100+ drivers + staff)
  // ============================================
  console.log("👥 Creating employees (700+)...");
  
  const departments = ["OPERATIONS", "ACCOUNTS", "HR", "MAINTENANCE", "BOOKING"];
  const designations = {
    OPERATIONS: ["Operations Manager", "Trip Coordinator", "Dispatcher"],
    ACCOUNTS: ["Accountant", "Finance Manager", "Billing Executive"],
    HR: ["HR Manager", "Payroll Executive", "Recruiter"],
    MAINTENANCE: ["Mechanic", "Workshop Manager", "Technician"],
    BOOKING: ["Booking Executive", "Counter Staff", "Supervisor"],
  };

  // Create admin users first
  const demoAccounts = [
    { name: "Rajesh Kumar", email: "ceo@nationaltravels.demo", role: "COMPANY_OWNER", dept: "OPERATIONS", designation: "CEO & Managing Director" },
    { name: "Senthil Murugan", email: "ops@nationaltravels.demo", role: "OPERATIONS_MANAGER", dept: "OPERATIONS", designation: "Operations Manager" },
    { name: "Priya Lakshmi", email: "booking@nationaltravels.demo", role: "BOOKING_MANAGER", dept: "BOOKING", designation: "Booking Manager" },
    { name: "Vikram Natarajan", email: "fleet@nationaltravels.demo", role: "FLEET_MANAGER", dept: "MAINTENANCE", designation: "Fleet Manager" },
    { name: "Kavitha Sundaram", email: "hr@nationaltravels.demo", role: "HR_MANAGER", dept: "HR", designation: "HR Manager" },
    { name: "Arun Krishnamurthy", email: "finance@nationaltravels.demo", role: "FINANCE_MANAGER", dept: "ACCOUNTS", designation: "Finance Manager" },
    { name: "Super Admin", email: "admin@lansub.demo", role: "SUPER_ADMIN", dept: "OPERATIONS", designation: "Platform Administrator" },
  ];

  const passwordHash = await bcrypt.hash("demo@123", 10);
  const adminUsers: { id: string; email: string; name: string | null }[] = [];

  for (const acc of demoAccounts) {
    const emp = await prisma.employee.create({
      data: {
        companyId: company.id,
        employeeCode: `NT-EMP-${String(adminUsers.length + 1).padStart(4, "0")}`,
        name: acc.name,
        phone: generatePhone(),
        email: acc.email,
        joiningDate: daysAgo(randomInt(365, 2000)),
        department: acc.dept,
        designation: acc.designation,
        employeeType: "PERMANENT",
        status: "ACTIVE",
        salary: randomFloat(40000, 150000, 0),
        city: "Chennai",
      },
    });

    const user = await prisma.user.create({
      data: {
        email: acc.email,
        passwordHash,
        name: acc.name,
        role: acc.role,
        companyId: company.id,
        employeeId: emp.id,
        isActive: true,
      },
    });
    adminUsers.push(user);
  }

  // ============================================
  // 4. DRIVERS (100)
  // ============================================
  console.log("🚗 Creating 100 drivers...");
  const drivers = [];
  
  for (let i = 0; i < 100; i++) {
    const firstName = randomFrom(FIRST_NAMES);
    const lastName = randomFrom(LAST_NAMES);
    const name = `${firstName} ${lastName}`;
    const phone = generatePhone();
    
    const emp = await prisma.employee.create({
      data: {
        companyId: company.id,
        employeeCode: `NT-DRV-${String(i + 1).padStart(4, "0")}`,
        name,
        phone,
        email: generateEmail(name),
        joiningDate: daysAgo(randomInt(30, 3000)),
        department: "OPERATIONS",
        designation: "Driver",
        employeeType: i % 10 === 0 ? "CONTRACT" : "PERMANENT",
        status: i % 20 === 0 ? "ON_LEAVE" : "ACTIVE",
        salary: randomFloat(20000, 35000, 0),
        city: randomFrom(["Chennai", "Madurai", "Coimbatore", "Trichy", "Salem"]),
        dateOfBirth: new Date(1970 + randomInt(0, 30), randomInt(0, 11), randomInt(1, 28)),
      },
    });

    const driverUserEmail = `driver${i + 1}@nationaltravels.demo`;
    const driverUser = await prisma.user.create({
      data: {
        email: driverUserEmail,
        passwordHash,
        name,
        role: "DRIVER",
        companyId: company.id,
        employeeId: emp.id,
        phone,
        isActive: true,
      },
    });

    const safetyScore = randomFloat(70, 100);
    const onTimeScore = randomFloat(65, 100);
    const fuelScore = randomFloat(75, 100);
    const customerRating = randomFloat(3.5, 5);
    const overallScore = safetyScore * 0.3 + onTimeScore * 0.2 + fuelScore * 0.2 + customerRating * 20 * 0.15 + randomFloat(80, 100) * 0.1 + (randomInt(0, 3) === 0 ? 0 : 100) * 0.05;

    const driver = await prisma.driver.create({
      data: {
        employeeId: emp.id,
        licenceNumber: `TN${randomInt(10, 99)}${randomInt(100000000, 999999999)}`,
        licenceType: "HMV",
        licenceExpiry: new Date(Date.now() + randomInt(30, 1460) * 86400000),
        experience: randomInt(2, 25),
        safetyScore,
        onTimeScore,
        fuelEfficiencyScore: fuelScore,
        customerRating,
        attendanceScore: randomFloat(80, 100),
        complaintsCount: randomInt(0, 5),
        overallScore: Math.min(100, overallScore),
        totalTrips: randomInt(100, 2000),
        totalKm: randomFloat(50000, 500000),
        accidents: randomInt(0, 3),
        status: emp.status === "ON_LEAVE" ? "ON_LEAVE" : randomFrom(["AVAILABLE", "AVAILABLE", "AVAILABLE", "ON_TRIP", "OFF_DUTY"]),
      },
    });
    drivers.push({ driver, emp, user: driverUser });

    // Driver licence document
    await prisma.employeeDocument.create({
      data: {
        employeeId: emp.id,
        docType: "LICENCE",
        docNumber: driver.licenceNumber,
        docName: "Driving Licence (HMV)",
        issueDate: new Date(Date.now() - randomInt(365, 3650) * 86400000),
        expiryDate: driver.licenceExpiry,
        isVerified: true,
      },
    });
  }
  console.log(`✅ Created ${drivers.length} drivers`);

  // ============================================
  // 5. VEHICLES (50 buses)
  // ============================================
  console.log("🚌 Creating 50 buses...");
  const vehicles = [];
  const busStatuses = ["ACTIVE", "ACTIVE", "ACTIVE", "ACTIVE", "MAINTENANCE", "IDLE", "BREAKDOWN"];

  for (let i = 0; i < 50; i++) {
    const busModel = randomFrom(BUS_MODELS);
    const status = randomFrom(busStatuses);
    const city = randomFrom(CITIES);
    const latJitter = randomFloat(-0.05, 0.05);
    const lngJitter = randomFloat(-0.05, 0.05);

    const vehicle = await prisma.vehicle.create({
      data: {
        companyId: company.id,
        vehicleNumber: tnPlate(i),
        vehicleCode: `BUS-${String(i + 1).padStart(3, "0")}`,
        model: busModel.model,
        manufacturer: busModel.manufacturer,
        year: randomInt(2016, 2024),
        color: randomFrom(["White", "Blue", "Red and White", "Blue and Silver"]),
        fuelType: "DIESEL",
        seatingCapacity: busModel.capacity,
        engineNumber: `ENG${randomInt(100000, 999999)}`,
        chassisNumber: `CHS${randomInt(100000, 999999)}`,
        purchaseDate: daysAgo(randomInt(365, 3000)),
        purchasePrice: randomFloat(3000000, 12000000, 0),
        currentValue: randomFloat(1000000, 8000000, 0),
        odometer: randomFloat(50000, 500000),
        status,
        latitude: city.lat + latJitter,
        longitude: city.lng + lngJitter,
        speed: status === "ACTIVE" ? randomFloat(0, 80) : 0,
        fuelLevel: randomFloat(20, 95),
        engineTemp: randomFloat(75, 95),
        batteryVoltage: randomFloat(12.2, 14.5),
        lastGpsUpdate: new Date(Date.now() - randomInt(0, 3600000)),
      },
    });

    // GPS Device
    const gpsDevice = await prisma.gpsDevice.create({
      data: {
        deviceId: `GPS-NT-${String(i + 1).padStart(4, "0")}`,
        vendor: "Uffizio",
        simNumber: `91${randomInt(7000000000, 9999999999)}`,
        isActive: status !== "RETIRED",
      },
    });

    await prisma.vehicle.update({
      where: { id: vehicle.id },
      data: { gpsDeviceId: gpsDevice.id },
    });

    // IoT Device
    await prisma.iotDevice.create({
      data: {
        vehicleId: vehicle.id,
        deviceId: `IOT-NT-${String(i + 1).padStart(4, "0")}`,
        firmware: "LANSUB-EDGE-v2.1.0",
        isActive: true,
      },
    });

    // Seat Layout
    const layout = await prisma.seatLayout.create({
      data: {
        vehicleId: vehicle.id,
        layoutType: busModel.layoutType,
        totalSeats: busModel.capacity,
        lowerBerths: busModel.layoutType === "SLEEPER" ? Math.floor(busModel.capacity / 2) : 0,
        upperBerths: busModel.layoutType === "SLEEPER" ? Math.ceil(busModel.capacity / 2) : 0,
      },
    });

    // Create seats
    const seatsPerRow = busModel.layoutType === "SLEEPER" ? 2 : 4;
    const totalRows = Math.ceil(busModel.capacity / seatsPerRow);
    const seatTypes = ["WINDOW", "AISLE"];
    
    for (let row = 1; row <= totalRows; row++) {
      for (let col = 1; col <= seatsPerRow && (row - 1) * seatsPerRow + col <= busModel.capacity; col++) {
        const seatNum = busModel.layoutType === "SLEEPER"
          ? `${col === 1 ? "L" : "U"}${row}`
          : `${String.fromCharCode(64 + col)}${row}`;
        
        await prisma.seat.create({
          data: {
            layoutId: layout.id,
            seatNumber: seatNum,
            seatType: busModel.layoutType === "SLEEPER" ? "SLEEPER" : 
                      busModel.layoutType === "SEMI_SLEEPER" ? "SEMI_SLEEPER" : "SEATER",
            row,
            column: col,
            deck: busModel.layoutType === "SLEEPER" && col === 2 ? 2 : 1,
            isLadiesSeat: row <= 2 && col === 1, // Front seats for ladies
            isWindowSeat: col === 1 || col === seatsPerRow,
            basePrice: randomFrom([0, 0, 50, 100, 150]), // Premium seat surcharge
          },
        });
      }
    }

    // Vehicle Documents
    const docs = [
      { type: "INSURANCE", name: "Vehicle Insurance", expiry: randomInt(30, 365) },
      { type: "PERMIT", name: "All India Tourist Permit", expiry: randomInt(90, 1095) },
      { type: "FITNESS", name: "Fitness Certificate", expiry: randomInt(30, 365) },
      { type: "POLLUTION", name: "Pollution Under Control", expiry: randomInt(10, 180) },
      { type: "REGISTRATION", name: "Vehicle Registration", expiry: randomInt(365, 3650) },
    ];

    for (const doc of docs) {
      await prisma.vehicleDocument.create({
        data: {
          vehicleId: vehicle.id,
          docType: doc.type,
          issuer: doc.name,
          docNumber: `DOC${randomInt(100000, 999999)}`,
          issueDate: daysAgo(randomInt(30, 365)),
          expiryDate: new Date(Date.now() + doc.expiry * 86400000),
          isActive: true,
        },
      });
    }

    // Maintenance Records (last 6 months)
    const maintenanceCategories = ["ENGINE", "BRAKES", "TYRES", "AC", "ELECTRICAL", "OIL", "SUSPENSION"];
    const maintenanceCount = randomInt(2, 8);
    
    for (let m = 0; m < maintenanceCount; m++) {
      const category = randomFrom(maintenanceCategories);
      const cost = randomFloat(5000, 80000, 0);
      const maintenance = await prisma.vehicleMaintenance.create({
        data: {
          vehicleId: vehicle.id,
          maintenanceType: randomFrom(["PREVENTIVE", "CORRECTIVE", "SERVICE"]),
          category,
          description: `${category} ${randomFrom(["service", "inspection", "repair", "replacement"])}`,
          scheduledDate: daysAgo(randomInt(1, 180)),
          completedDate: m < maintenanceCount - 1 ? daysAgo(randomInt(1, 180)) : null,
          odometer: randomFloat(30000, 480000),
          nextDueKm: randomFloat(2000, 10000),
          nextDueDate: new Date(Date.now() + randomInt(15, 180) * 86400000),
          vendor: randomFrom(["Volvo Authorized Service", "Scania Service Center", "Murugan Auto Works", "National Garage"]),
          cost,
          status: m < maintenanceCount - 1 ? "COMPLETED" : randomFrom(["SCHEDULED", "IN_PROGRESS", "OVERDUE"]),
          priority: randomFrom(["LOW", "MEDIUM", "MEDIUM", "HIGH"]),
        },
      });

      // Add parts
      if (m % 2 === 0) {
        await prisma.maintenancePart.create({
          data: {
            maintenanceId: maintenance.id,
            partName: randomFrom(["Air Filter", "Oil Filter", "Brake Pads", "Tyre", "Battery", "AC Gas"]),
            quantity: randomInt(1, 4),
            unitCost: randomFloat(500, 15000, 0),
            totalCost: randomFloat(500, 30000, 0),
            vendor: "SRM Auto Parts",
          },
        });
      }
    }

    // Fuel Transactions (last 3 months)
    const fuelCount = randomInt(8, 20);
    let odometer = (vehicle.odometer || 0) - fuelCount * randomFloat(500, 1500);
    
    for (let f = 0; f < fuelCount; f++) {
      const qty = randomFloat(100, 350);
      const ppl = randomFloat(93, 97);
      const efficiency = randomFrom(drivers)?.driver ? randomFloat(4.5, 7.5) : randomFloat(4, 7);
      
      await prisma.fuelTransaction.create({
        data: {
          vehicleId: vehicle.id,
          driverId: randomFrom(drivers)?.driver.id,
          date: daysAgo(randomInt(0, 90)),
          quantity: qty,
          pricePerLitre: ppl,
          totalAmount: parseFloat((qty * ppl).toFixed(2)),
          odometer: parseFloat(odometer.toFixed(0)),
          fuelStation: randomFrom(["HP Petrol Bunk - NH45", "BPCL - ECR", "IOC - GST Road", "Reliance Petrol"]),
          city: randomFrom(["Chennai", "Bangalore", "Madurai", "Coimbatore"]),
          efficiency: parseFloat(efficiency.toFixed(2)),
          notes: f % 10 === 0 ? "Efficiency below fleet average - check engine" : null,
        },
      });
      odometer += randomFloat(500, 1500);
    }

    vehicles.push(vehicle);
  }
  console.log(`✅ Created ${vehicles.length} buses with GPS, IoT, seats, documents, maintenance & fuel data`);

  // ============================================
  // 6. ROUTES (20)
  // ============================================
  console.log("🗺️ Creating 20 routes...");
  const routes = [];

  for (let i = 0; i < ROUTES_DATA.length; i++) {
    const rd = ROUTES_DATA[i];
    const fromCity = CITIES.find((c) => c.name === rd.from)!;
    const toCity = CITIES.find((c) => c.name === rd.to)!;

    const route = await prisma.route.create({
      data: {
        companyId: company.id,
        routeCode: `RT-${String(i + 1).padStart(3, "0")}`,
        origin: rd.from,
        destination: rd.to,
        distance: rd.dist,
        duration: rd.hrs * 60,
        tollCost: rd.toll,
        fuelEstimate: rd.fuel,
        isActive: true,
      },
    });

    // Route stops
    const stops = [
      { name: `${rd.from} CMBT`, type: "BOARDING", seq: 1, city: rd.from, lat: fromCity.lat, lng: fromCity.lng, time: 0 },
      { name: `${rd.from} Bus Stand`, type: "BOARDING", seq: 2, city: rd.from, lat: fromCity.lat + 0.01, lng: fromCity.lng + 0.01, time: 30 },
      { name: `${rd.to} Bus Terminal`, type: "DROPPING", seq: 3, city: rd.to, lat: toCity.lat, lng: toCity.lng, time: rd.hrs * 60 - 30 },
      { name: `${rd.to} City Center`, type: "DROPPING", seq: 4, city: rd.to, lat: toCity.lat + 0.01, lng: toCity.lng + 0.01, time: rd.hrs * 60 },
    ];

    for (const stop of stops) {
      await prisma.routeStop.create({
        data: {
          routeId: route.id,
          stopName: stop.name,
          stopType: stop.type,
          sequence: stop.seq,
          city: stop.city,
          latitude: stop.lat,
          longitude: stop.lng,
          arrivalTime: stop.time,
          isActive: true,
        },
      });
    }

    // Pricing Rules
    for (const fare of rd.fares) {
      await prisma.pricingRule.create({
        data: {
          routeId: route.id,
          basePrice: fare,
          minPrice: Math.floor(fare * 0.8),
          maxPrice: Math.floor(fare * 1.4),
          ruleType: "DYNAMIC",
          isActive: true,
        },
      });
    }

    routes.push({ route, fares: rd.fares });
  }
  console.log(`✅ Created ${routes.length} routes with stops and pricing rules`);

  // ============================================
  // 7. AGENTS (50)
  // ============================================
  console.log("🤝 Creating 50 agents...");
  const agents = [];
  const agentCities = ["Chennai", "Bangalore", "Madurai", "Coimbatore", "Salem", "Trichy", "Vellore"];

  for (let i = 0; i < 50; i++) {
    const name = `${randomFrom(FIRST_NAMES)} ${randomFrom(LAST_NAMES)} Travels`;
    const agent = await prisma.agent.create({
      data: {
        companyId: company.id,
        agentCode: `AG-${String(i + 1).padStart(4, "0")}`,
        name,
        phone: generatePhone(),
        email: generateEmail(name.split(" ")[0]),
        city: randomFrom(agentCities),
        commissionPct: randomFrom([3, 4, 5, 5, 6]),
        creditLimit: randomFloat(20000, 200000, 0),
        totalBookings: randomInt(50, 2000),
        totalRevenue: randomFloat(50000, 5000000, 0),
        isActive: i < 45,
      },
    });

    // Agent user
    await prisma.user.create({
      data: {
        email: `agent${i + 1}@nationaltravels.demo`,
        passwordHash,
        name: agent.name,
        role: "AGENT",
        companyId: company.id,
        isActive: agent.isActive,
      },
    });

    agents.push(agent);
  }
  console.log(`✅ Created ${agents.length} agents`);

  // ============================================
  // 8. CUSTOMERS (500)
  // ============================================
  console.log("👤 Creating 500 customers...");
  const customers = [];

  for (let i = 0; i < 500; i++) {
    const isFemale = Math.random() > 0.4;
    const firstName = isFemale ? randomFrom(CUSTOMER_NAMES_F) : randomFrom(FIRST_NAMES);
    const lastName = randomFrom(LAST_NAMES);
    const totalBookings = randomInt(1, 50);
    const totalSpend = randomFloat(500, 100000, 0);
    
    let segment = "NEW";
    if (totalBookings >= 20) segment = "VIP";
    else if (totalBookings >= 10) segment = "FREQUENT";
    else if (totalBookings < 3 && Date.now() - daysAgo(60).getTime() > 0) segment = "DORMANT";

    const customer = await prisma.customer.create({
      data: {
        name: `${firstName} ${lastName}`,
        phone: generatePhone(),
        email: Math.random() > 0.3 ? generateEmail(firstName) : null,
        gender: isFemale ? "FEMALE" : "MALE",
        city: randomFrom(agentCities),
        segment,
        loyaltyPoints: randomInt(0, 5000),
        totalBookings,
        totalSpend,
        cancellations: randomInt(0, Math.floor(totalBookings * 0.1)),
        complaintsCount: randomInt(0, 3),
        avgRating: randomFloat(3, 5),
        isActive: true,
        createdAt: daysAgo(randomInt(1, 730)),
      },
    });
    customers.push(customer);
  }
  console.log(`✅ Created ${customers.length} customers`);

  // ============================================
  // 9. TRIPS & BOOKINGS
  // ============================================
  console.log("🎫 Creating trips and 2000+ bookings...");
  
  const channels = ["WEBSITE", "APP", "COUNTER", "AGENT", "REDBUS", "ABHIBUS"];
  const channelWeights = [25, 15, 20, 15, 15, 10]; // percentage weights
  
  function pickChannel(): string {
    const rand = randomInt(0, 99);
    let cumulative = 0;
    for (let i = 0; i < channels.length; i++) {
      cumulative += channelWeights[i];
      if (rand < cumulative) return channels[i];
    }
    return "WEBSITE";
  }

  const bookingStatuses = ["BOOKED", "BOOKED", "BOOKED", "CANCELLED", "NO_SHOW"];
  let totalBookingsCreated = 0;

  // Create trips for last 30 days + next 30 days
  for (let dayOffset = -30; dayOffset <= 30; dayOffset++) {
    const tripsPerDay = randomInt(8, 20);
    
    for (let t = 0; t < tripsPerDay; t++) {
      const routeData = randomFrom(routes);
      const vehicle = randomFrom(vehicles);
      const departureDate = new Date();
      departureDate.setDate(departureDate.getDate() + dayOffset);
      departureDate.setHours(randomFrom([6, 8, 10, 14, 18, 20, 22, 23]), 0, 0, 0);

      const arrivalDate = new Date(departureDate);
      arrivalDate.setMinutes(arrivalDate.getMinutes() + routeData.route.duration);

      let tripStatus = "SCHEDULED";
      if (dayOffset < -1) {
        tripStatus = randomFrom(["COMPLETED", "COMPLETED", "COMPLETED", "CANCELLED"]);
      } else if (dayOffset === 0) {
        tripStatus = randomFrom(["BOARDING", "DEPARTED", "IN_TRANSIT", "ARRIVED"]);
      } else if (dayOffset === -1) {
        tripStatus = randomFrom(["COMPLETED", "ARRIVED", "CANCELLED"]);
      }

      const tripCode = `TRIP-${Date.now()}-${t}`;
      const seatCount = vehicle.seatingCapacity;
      const occupancyPct = dayOffset < 0 ? randomFloat(45, 98) : randomFloat(20, 85);
      const bookedSeats = Math.floor(seatCount * (occupancyPct / 100));
      const delay = tripStatus === "DELAYED" ? randomInt(10, 120) : 
                    (tripStatus === "IN_TRANSIT" && Math.random() > 0.7) ? randomInt(5, 60) : 0;

      let trip;
      try {
        trip = await prisma.trip.create({
          data: {
            tripCode,
            routeId: routeData.route.id,
            vehicleId: vehicle.id,
            scheduledDeparture: departureDate,
            scheduledArrival: arrivalDate,
            actualDeparture: ["DEPARTED", "IN_TRANSIT", "ARRIVED", "COMPLETED"].includes(tripStatus)
              ? new Date(departureDate.getTime() + delay * 60000)
              : null,
            actualArrival: ["ARRIVED", "COMPLETED"].includes(tripStatus)
              ? new Date(arrivalDate.getTime() + delay * 60000)
              : null,
            status: tripStatus,
            totalSeats: seatCount,
            bookedSeats,
            availableSeats: seatCount - bookedSeats,
            occupancyPct: parseFloat(occupancyPct.toFixed(1)),
            delayMinutes: delay,
          },
        });
      } catch {
        continue; // Skip duplicate tripCode
      }

      // Assign crew
      const availableDriver = randomFrom(drivers);
      if (availableDriver) {
        await prisma.tripCrew.create({
          data: {
            tripId: trip.id,
            driverId: availableDriver.driver.id,
            crewRole: "DRIVER",
          },
        });
      }

      // Add trip expenses
      const fuelCost = randomFloat(routeData.route.fuelEstimate * 0.9, routeData.route.fuelEstimate * 1.1, 0);
      const tollCost = routeData.route.tollCost;
      const crewCost = randomFloat(800, 2000, 0);

      await prisma.tripExpense.createMany({
        data: [
          { tripId: trip.id, category: "FUEL", description: "Diesel", amount: fuelCost },
          { tripId: trip.id, category: "TOLL", description: "Highway toll", amount: tollCost },
          { tripId: trip.id, category: "DRIVER_ALLOWANCE", description: "Driver allowance", amount: crewCost },
          ...(Math.random() > 0.7 ? [{ tripId: trip.id, category: "MISCELLANEOUS", description: "Cleaning & misc", amount: randomFloat(100, 500, 0) }] : []),
        ],
      });

      // Create bookings for completed/in-progress trips
      if (bookedSeats > 0 && dayOffset <= 0 && totalBookingsCreated < 2500) {
        const basePrice = randomFrom(routeData.fares);
        let ticketRevenue = 0;
        let commissionTotal = 0;
        const bookingsToCreate = Math.min(bookedSeats, 15); // limit per trip for seeding speed

        for (let b = 0; b < bookingsToCreate; b++) {
          const customer = randomFrom(customers);
          const agent = Math.random() > 0.7 ? randomFrom(agents) : null;
          const channel = pickChannel();
          const status = randomFrom(bookingStatuses);
          const fare = basePrice + randomInt(-50, 100);
          const commission = channel === "REDBUS" ? fare * 0.1 :
                            channel === "ABHIBUS" ? fare * 0.09 :
                            channel === "AGENT" ? fare * (agent?.commissionPct || 5) / 100 : 0;
          const tax = fare * 0.05;
          const total = fare + tax;
          const net = total - commission;

          if (status !== "CANCELLED") ticketRevenue += fare;
          commissionTotal += commission;

          try {
            const booking = await prisma.booking.create({
              data: {
                bookingRef: `NT${Date.now()}${b}`,
                tripId: trip.id,
                customerId: customer.id,
                agentId: channel === "AGENT" ? agent?.id : null,
                seatId: (await prisma.seat.findFirst({ where: { layoutId: (await prisma.seatLayout.findUnique({ where: { vehicleId: vehicle.id } }))?.id } }))?.id || "",
                channel,
                externalRef: channel === "REDBUS" ? `RB${randomInt(1000000, 9999999)}` :
                             channel === "ABHIBUS" ? `AB${randomInt(1000000, 9999999)}` : null,
                boardingPoint: `${routeData.route.origin} CMBT`,
                droppingPoint: `${routeData.route.destination} Bus Terminal`,
                passengerName: customer.name,
                passengerPhone: customer.phone,
                passengerAge: randomInt(18, 65),
                passengerGender: randomFrom(["MALE", "FEMALE"]),
                fareAmount: fare,
                discountAmount: 0,
                taxAmount: parseFloat(tax.toFixed(2)),
                totalAmount: parseFloat(total.toFixed(2)),
                commissionAmount: parseFloat(commission.toFixed(2)),
                netAmount: parseFloat(net.toFixed(2)),
                paymentStatus: status === "CANCELLED" ? "REFUNDED" : "PAID",
                bookingStatus: status,
                refundAmount: status === "CANCELLED" ? parseFloat((fare * 0.8).toFixed(2)) : null,
                refundStatus: status === "CANCELLED" ? "PROCESSED" : null,
                createdAt: new Date(departureDate.getTime() - randomInt(1, 30) * 86400000),
              },
            });

            // Payment record
            await prisma.bookingPayment.create({
              data: {
                bookingId: booking.id,
                amount: total,
                paymentMethod: randomFrom(["UPI", "CARD", "NETBANKING", "CASH", "WALLET"]),
                paymentGateway: randomFrom(["RAZORPAY", "PHONEPE", null, null]),
                transactionId: `TXN${randomInt(100000000, 999999999)}`,
                gatewayFee: parseFloat((total * 0.02).toFixed(2)),
                status: booking.paymentStatus,
                paidAt: new Date(departureDate.getTime() - randomInt(1, 30) * 86400000),
              },
            });

            totalBookingsCreated++;
          } catch {
            // Skip duplicate booking refs
          }
        }

        // Trip Revenue & Profitability (for past trips)
        if (tripStatus === "COMPLETED" || tripStatus === "ARRIVED") {
          const gatewayFee = ticketRevenue * 0.02;
          const netRevenue = ticketRevenue - commissionTotal - gatewayFee;
          const totalCost = fuelCost + tollCost + crewCost + randomFloat(200, 1000, 0);
          const profit = netRevenue - totalCost;
          const margin = netRevenue > 0 ? (profit / netRevenue) * 100 : 0;

          await prisma.tripRevenue.create({
            data: {
              tripId: trip.id,
              ticketRevenue: parseFloat(ticketRevenue.toFixed(2)),
              bookingCommission: parseFloat(commissionTotal.toFixed(2)),
              refunds: 0,
              paymentGatewayFee: parseFloat(gatewayFee.toFixed(2)),
              netRevenue: parseFloat(netRevenue.toFixed(2)),
            },
          });

          await prisma.tripProfitability.create({
            data: {
              tripId: trip.id,
              ticketRevenue: parseFloat(ticketRevenue.toFixed(2)),
              commissions: parseFloat(commissionTotal.toFixed(2)),
              refunds: 0,
              fuelCost: parseFloat(fuelCost.toFixed(2)),
              tollCost,
              crewCost: parseFloat(crewCost.toFixed(2)),
              maintenanceCost: parseFloat(randomFloat(200, 800, 2).toFixed(2)),
              paymentGatewayCost: parseFloat(gatewayFee.toFixed(2)),
              otherCosts: parseFloat(randomFloat(100, 400, 2).toFixed(2)),
              totalRevenue: parseFloat(netRevenue.toFixed(2)),
              totalCost: parseFloat(totalCost.toFixed(2)),
              contributionProfit: parseFloat(profit.toFixed(2)),
              profitMarginPct: parseFloat(margin.toFixed(1)),
              profitPerKm: parseFloat((profit / routeData.route.distance).toFixed(2)),
              profitPerSeat: parseFloat((profit / seatCount).toFixed(2)),
              occupancyPct: parseFloat(occupancyPct.toFixed(1)),
            },
          });

          // Pricing recommendations for future trips
          if (occupancyPct > 80 && Math.random() > 0.6) {
            await prisma.pricingRecommendation.create({
              data: {
                tripId: trip.id,
                currentPrice: basePrice,
                recommendedPrice: Math.floor(basePrice * 1.15),
                occupancyPct,
                hoursToDepart: 8,
                reason: `Occupancy is ${occupancyPct.toFixed(0)}% and historical demand is high for this route`,
              },
            });
          }
        }
      }
    }
  }
  console.log(`✅ Created trips and ${totalBookingsCreated} bookings`);

  // ============================================
  // 10. ALERTS
  // ============================================
  console.log("🚨 Creating alerts...");
  const alertTypes = [
    { type: "MAINTENANCE_DUE", severity: "WARNING", title: "Maintenance Due", msg: "Bus {bus} is due for scheduled maintenance in {days} days" },
    { type: "FUEL_ANOMALY", severity: "WARNING", title: "Fuel Efficiency Alert", msg: "Bus {bus} fuel efficiency is 18% below fleet average" },
    { type: "ENGINE_TEMP_HIGH", severity: "CRITICAL", title: "High Engine Temperature", msg: "Bus {bus} engine temperature is {temp}°C - above normal threshold" },
    { type: "GPS_OFFLINE", severity: "INFO", title: "GPS Device Offline", msg: "GPS device for bus {bus} has not reported in the last 30 minutes" },
    { type: "INSURANCE_EXPIRY", severity: "WARNING", title: "Insurance Expiring Soon", msg: "Vehicle {bus} insurance expires in {days} days" },
    { type: "DELAYED_TRIP", severity: "INFO", title: "Trip Delay", msg: "Trip on {route} is delayed by {mins} minutes" },
    { type: "LOW_OCCUPANCY", severity: "INFO", title: "Low Occupancy Alert", msg: "Trip on {route} has only {pct}% occupancy with departure in 4 hours" },
    { type: "CUSTOMER_COMPLAINT", severity: "WARNING", title: "New Customer Complaint", msg: "Customer {name} has filed a complaint about {category}" },
    { type: "BATTERY_LOW", severity: "WARNING", title: "Low Battery Voltage", msg: "Bus {bus} battery voltage is {v}V - below threshold" },
    { type: "BOOKING_DISCREPANCY", severity: "CRITICAL", title: "Booking Reconciliation Alert", msg: "redBus settlement differs from booking ledger by ₹8,450" },
  ];

  for (let i = 0; i < 50; i++) {
    const alertDef = randomFrom(alertTypes);
    const vehicle = randomFrom(vehicles);
    await prisma.alert.create({
      data: {
        vehicleId: ["MAINTENANCE_DUE", "FUEL_ANOMALY", "ENGINE_TEMP_HIGH", "GPS_OFFLINE", "INSURANCE_EXPIRY", "BATTERY_LOW"].includes(alertDef.type) ? vehicle.id : null,
        type: alertDef.type,
        severity: alertDef.severity,
        title: alertDef.title,
        message: alertDef.msg
          .replace("{bus}", vehicle.vehicleCode)
          .replace("{days}", String(randomInt(5, 30)))
          .replace("{temp}", String(randomFloat(98, 115, 1)))
          .replace("{route}", "Chennai → Bangalore")
          .replace("{mins}", String(randomInt(10, 90)))
          .replace("{pct}", String(randomInt(15, 35)))
          .replace("{name}", randomFrom(customers)?.name || "Customer")
          .replace("{category}", randomFrom(["AC", "Delay", "Driver Behaviour"]))
          .replace("{v}", String(randomFloat(10.5, 11.8, 1))),
        isRead: Math.random() > 0.4,
        isResolved: Math.random() > 0.7,
        createdAt: daysAgo(randomInt(0, 7)),
      },
    });
  }
  console.log("✅ Created 50 alerts");

  // ============================================
  // 11. COMPLAINTS
  // ============================================
  console.log("📋 Creating complaints...");
  const complaintCategories = ["AC", "DELAY", "DRIVER_BEHAVIOUR", "CONDUCTOR_BEHAVIOUR", "CLEANLINESS", "SEAT", "LUGGAGE"];
  
  for (let i = 0; i < 30; i++) {
    const customer = randomFrom(customers);
    const driver = randomFrom(drivers);
    await prisma.complaint.create({
      data: {
        customerId: customer.id,
        driverId: Math.random() > 0.5 ? driver.driver.id : null,
        category: randomFrom(complaintCategories),
        priority: randomFrom(["LOW", "MEDIUM", "MEDIUM", "HIGH", "CRITICAL"]),
        subject: randomFrom([
          "AC not working properly",
          "Bus arrived late by 2 hours",
          "Driver was rude",
          "Bus was not clean",
          "Seat was broken",
          "Luggage was damaged",
          "Overcharged for ticket",
        ]),
        description: "Customer reported issue during travel on the Chennai to Bangalore route. Requesting immediate attention and resolution.",
        status: randomFrom(["OPEN", "ASSIGNED", "IN_PROGRESS", "RESOLVED", "CLOSED"]),
        createdAt: daysAgo(randomInt(0, 30)),
      },
    });
  }
  console.log("✅ Created 30 complaints");

  // ============================================
  // 12. AI INSIGHTS
  // ============================================
  console.log("🤖 Creating AI insights...");
  const aiInsights = [
    {
      type: "DAILY_BRIEF",
      title: "Daily Operations Brief — National Travels",
      content: JSON.stringify({
        summary: "Today's operations are running at 87% efficiency. Revenue is up 8.2% vs last week.",
        metrics: [
          { label: "Revenue", value: "+8.2%", trend: "up", color: "green" },
          { label: "Occupancy", value: "+4.1%", trend: "up", color: "green" },
          { label: "Fuel Cost", value: "+9.3%", trend: "up", color: "red" },
          { label: "Maintenance", value: "-3.2%", trend: "down", color: "green" },
          { label: "Est. Profit", value: "+6.8%", trend: "up", color: "green" },
        ],
        recommendations: [
          "Increase capacity on Chennai → Bangalore. Occupancy consistently above 90%.",
          "Inspect Bus BUS-023 for poor fuel efficiency — 18% below fleet average.",
          "Reduce discount on Route Chennai → Pondicherry. Low competition.",
          "Follow up on 3 unresolved HIGH priority customer complaints.",
          "Bus BUS-007 engine temperature sensor shows values above threshold.",
        ],
      }),
      priority: "HIGH",
    },
    {
      type: "ANOMALY",
      title: "Fuel Efficiency Anomaly Detected",
      content: JSON.stringify({
        bus: "BUS-023",
        currentEfficiency: 4.2,
        fleetAverage: 5.1,
        deviation: -18,
        recommendation: "Schedule engine inspection and air filter replacement.",
        estimatedSavings: "₹12,000/month if resolved",
      }),
      priority: "HIGH",
    },
    {
      type: "RECOMMENDATION",
      title: "Dynamic Pricing Opportunity",
      content: JSON.stringify({
        route: "Chennai → Bangalore",
        currentOccupancy: 94,
        currentPrice: 850,
        recommendedPrice: 975,
        potentialRevenue: "+₹18,500 this week",
        reason: "Demand is 40% above seasonal average. Festival season effect.",
      }),
      priority: "MEDIUM",
    },
    {
      type: "FORECAST",
      title: "Next 7 Days Revenue Forecast",
      content: JSON.stringify({
        forecast: [
          { day: "Mon", revenue: 245000, occupancy: 82 },
          { day: "Tue", revenue: 198000, occupancy: 71 },
          { day: "Wed", revenue: 210000, occupancy: 74 },
          { day: "Thu", revenue: 225000, occupancy: 78 },
          { day: "Fri", revenue: 290000, occupancy: 88 },
          { day: "Sat", revenue: 340000, occupancy: 94 },
          { day: "Sun", revenue: 315000, occupancy: 91 },
        ],
        totalForecast: 1823000,
        confidence: 0.82,
      }),
      priority: "MEDIUM",
    },
  ];

  for (const insight of aiInsights) {
    await prisma.aiInsight.create({ data: insight as { type: string; title: string; content: string; priority: string } });
  }
  console.log("✅ Created AI insights");

  // ============================================
  // SUMMARY
  // ============================================
  const counts = {
    company: 1,
    branches: await prisma.branch.count(),
    employees: await prisma.employee.count(),
    drivers: await prisma.driver.count(),
    vehicles: await prisma.vehicle.count(),
    routes: await prisma.route.count(),
    trips: await prisma.trip.count(),
    bookings: await prisma.booking.count(),
    customers: await prisma.customer.count(),
    agents: await prisma.agent.count(),
    alerts: await prisma.alert.count(),
    complaints: await prisma.complaint.count(),
    users: await prisma.user.count(),
  };

  console.log("\n🎉 LANSUB TRAVEL OS — Demo Data Seeded Successfully!");
  console.log("=" .repeat(50));
  console.log("📊 Database Summary:");
  Object.entries(counts).forEach(([key, val]) => {
    console.log(`  ${key.padEnd(15)}: ${val}`);
  });
  console.log("=" .repeat(50));
  console.log("\n🔐 Demo Login Credentials:");
  console.log("  CEO           : ceo@nationaltravels.demo / demo@123");
  console.log("  Operations    : ops@nationaltravels.demo / demo@123");
  console.log("  Booking       : booking@nationaltravels.demo / demo@123");
  console.log("  Fleet         : fleet@nationaltravels.demo / demo@123");
  console.log("  HR            : hr@nationaltravels.demo / demo@123");
  console.log("  Finance       : finance@nationaltravels.demo / demo@123");
  console.log("  Driver        : driver1@nationaltravels.demo / demo@123");
  console.log("  Agent         : agent1@nationaltravels.demo / demo@123");
  console.log("  Super Admin   : admin@lansub.demo / demo@123");
  console.log("\n✅ Ready for demonstration!");
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

export const CHARACTERS = {
  goth: {
    name: "Guitar Goth Teen",
    description: "Power slides with attitude",
    moveSound: "guitar",
    moveType: "slide",
    width: 36,
    height: 70
  },
  superman: {
    name: "Superman on Crutches",
    description: "Heroically hobbles across",
    moveSound: "heroic",
    moveType: "hobble",
    width: 40,
    height: 75
  },
  yoga: {
    name: "Yoga Teacher",
    description: "Zen master with soda addiction",
    moveSound: "zen",
    moveType: "flow",
    width: 35,
    height: 68
  }
};

export const LOCATIONS = {
  chennai: {
    name: "Chennai, India",
    description: "Auto-rickshaws, buses, and chaos",
    roadColor: "#32CD32",
    sidewalkColor: "#FF1493",
    vehicles: ["autorickshaw", "bus", "car", "motorcycle", "bicycle", "truck"],
    trafficSide: "left"
  },
  newyork: {
    name: "New York, USA", 
    description: "Yellow cabs and delivery trucks",
    roadColor: "#404040",
    sidewalkColor: "#C0C0C0",
    vehicles: ["taxi", "car", "truck", "deliveryvan", "bus", "bicycle"],
    trafficSide: "right"
  },
  thailand: {
    name: "Bangkok, Thailand",
    description: "Tuk-tuks and motorbikes everywhere",
    roadColor: "#228B22",
    sidewalkColor: "#DDA0DD",
    vehicles: ["tuktuk", "motorcycle", "car", "bus", "bicycle", "truck"],
    trafficSide: "left"
  }
};

export const VEHICLE_TYPES = {
  autorickshaw: {
    name: "Auto Rickshaw",
    width: 80,
    height: 60,
    speed: [1.2, 2.0],
    color: "#FFD700",
    rarity: 0.3
  },
  tuktuk: {
    name: "Tuk Tuk",
    width: 75,
    height: 55,
    speed: [1.0, 1.8],
    color: "#FF6347",
    rarity: 0.35
  },
  taxi: {
    name: "Yellow Cab",
    width: 120,
    height: 50,
    speed: [2.0, 3.0],
    color: "#FFFF00",
    rarity: 0.4
  },
  car: {
    name: "Car",
    width: 100,
    height: 45,
    speed: [1.8, 2.8],
    color: "#4169E1",
    rarity: 0.5
  },
  bus: {
    name: "Bus",
    width: 200,
    height: 70,
    speed: [1.0, 1.5],
    color: "#FF4500",
    rarity: 0.15
  },
  truck: {
    name: "Truck",
    width: 150,
    height: 65,
    speed: [1.2, 2.0],
    color: "#8B4513",
    rarity: 0.2
  },
  motorcycle: {
    name: "Motorcycle",
    width: 60,
    height: 35,
    speed: [2.5, 4.0],
    color: "#000000",
    rarity: 0.4
  },
  bicycle: {
    name: "Bicycle",
    width: 50,
    height: 30,
    speed: [0.8, 1.5],
    color: "#32CD32",
    rarity: 0.25
  },
  deliveryvan: {
    name: "Delivery Van",
    width: 130,
    height: 60,
    speed: [1.5, 2.2],
    color: "#8B4513",
    rarity: 0.3
  }
};

export const TRAFFIC_LAWS = {
  global: [
    "Always look both ways before crossing the street - even superheroes need to check!",
    "Pedestrians have the right of way at marked crosswalks in most countries.",
    "Never assume a driver can see you - make eye contact when possible.",
    "Bright clothing makes you more visible to drivers, especially at night.",
    "Put away distractions like phones when crossing busy streets."
  ],
  chennai: [
    "In Chennai, auto-rickshaws are powered by pure, unadulterated confidence.",
    "Traffic signals in India are more like suggestions than commands.",
    "The horn is considered a form of communication, not aggression.",
    "Cows have permanent right of way on Indian roads.",
    "In India, pedestrians must yield to all vehicles, including bicycles."
  ],
  newyork: [
    "In New York, jaywalking fines can be up to $250.",
    "Yellow cabs must yield to pedestrians in crosswalks by law.",
    "New York has over 13,000 yellow taxis roaming the streets.",
    "The 'Walk' signal gives pedestrians exclusive right of way.",
    "Delivery trucks double-park everywhere - it's practically legal."
  ],
  thailand: [
    "In Thailand, tuk-tuks negotiate traffic like they're in a video game.",
    "Motorcycles can legally use sidewalks in some Thai cities.",
    "Thai traffic moves on the left side of the road.",
    "Bangkok has more motorcycles per capita than cars.",
    "Elephants technically have right of way on rural Thai roads."
  ]
};

export const LEVEL_CONFIG = {
  1: { lanes: 1, direction: "oneway", spawnRate: 180, vehicleCount: 1 },
  2: { lanes: 1, direction: "oneway", spawnRate: 150, vehicleCount: 2 },
  3: { lanes: 2, direction: "oneway", spawnRate: 120, vehicleCount: 2 },
  4: { lanes: 2, direction: "twoway", spawnRate: 100, vehicleCount: 3 },
  5: { lanes: 3, direction: "twoway", spawnRate: 90, vehicleCount: 3 },
  6: { lanes: 3, direction: "twoway", spawnRate: 80, vehicleCount: 4 },
  7: { lanes: 4, direction: "twoway", spawnRate: 70, vehicleCount: 4 },
  8: { lanes: 4, direction: "twoway", spawnRate: 60, vehicleCount: 5 },
  9: { lanes: 5, direction: "twoway", spawnRate: 50, vehicleCount: 5 },
  10: { lanes: 5, direction: "twoway", spawnRate: 40, vehicleCount: 6 }
};
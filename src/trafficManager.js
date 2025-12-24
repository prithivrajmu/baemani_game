import { VehicleFactory } from './vehicles/vehicleFactory.js';
import { VEHICLE_TYPES } from './gameConfig.js';

export class TrafficManager {
  constructor(canvasWidth, canvasHeight, location, levelConfig) {
    this.canvasWidth = canvasWidth;
    this.canvasHeight = canvasHeight;
    this.location = location;
    this.levelConfig = levelConfig;
    this.vehicles = [];
    this.spawnTimer = 0;
    this.spawnDelay = levelConfig.spawnRate;
    
    // Calculate road layout
    this.updateRoadLayout();
  }
  
  updateRoadLayout() {
    this.roadCenterY = this.canvasHeight / 2;
    this.roadWidth = 80 * this.levelConfig.lanes;
    this.laneHeight = 80;
    
    // Create lanes based on level configuration
    this.lanes = [];
    const startY = this.roadCenterY - (this.roadWidth / 2) + (this.laneHeight / 2);
    
    for (let i = 0; i < this.levelConfig.lanes; i++) {
      const laneY = startY + (i * this.laneHeight);
      const direction = this.levelConfig.direction === 'twoway' ? 
        (i % 2 === 0 ? 1 : -1) : 1;
      
      this.lanes.push({
        y: laneY,
        direction: direction
      });
    }
  }
  
  update() {
    this.spawnTimer++;
    
    if (this.spawnTimer >= this.spawnDelay) {
      this.spawnVehicle();
      this.spawnTimer = 0;
      this.spawnDelay = this.levelConfig.spawnRate + Math.random() * 30;
    }
    
    // Update all vehicles
    this.vehicles.forEach(vehicle => {
      vehicle.update();
    });
    
    // Remove destroyed vehicles
    this.vehicles = this.vehicles.filter(vehicle => !vehicle.destroyed);
  }
  
  spawnVehicle() {
    if (this.lanes.length === 0) return;
    
    // Choose random lane
    const randomLane = this.lanes[Math.floor(Math.random() * this.lanes.length)];
    
    // Choose random vehicle type based on location
    const availableVehicles = this.location.vehicles;
    const vehicleType = this.getRandomVehicleType(availableVehicles);
    
    // Spawn position based on direction
    const spawnX = randomLane.direction === 1 ? 
      this.canvasWidth + 50 : -VEHICLE_TYPES[vehicleType].width - 50;
    const spawnY = randomLane.y - VEHICLE_TYPES[vehicleType].height / 2;
    
    const newVehicle = VehicleFactory.createVehicle(vehicleType, spawnX, spawnY);
    newVehicle.setDirection(randomLane.direction);
    newVehicle.setCanvasWidth(this.canvasWidth);
    
    this.vehicles.push(newVehicle);
  }
  
  getRandomVehicleType(availableTypes) {
    // Weighted random selection based on rarity
    const weights = availableTypes.map(type => VEHICLE_TYPES[type].rarity);
    const totalWeight = weights.reduce((sum, weight) => sum + weight, 0);
    
    let random = Math.random() * totalWeight;
    
    for (let i = 0; i < availableTypes.length; i++) {
      random -= weights[i];
      if (random <= 0) {
        return availableTypes[i];
      }
    }
    
    return availableTypes[0]; // Fallback
  }
  
  render(ctx) {
    this.vehicles.forEach(vehicle => {
      vehicle.render(ctx);
    });
  }
  
  hasActiveVehicles() {
    return this.vehicles.length > 0;
  }
  
  updateWorldSize(canvasWidth, canvasHeight) {
    this.canvasWidth = canvasWidth;
    this.canvasHeight = canvasHeight;
    this.updateRoadLayout();
    
    // Update canvas width for all existing vehicles
    this.vehicles.forEach(vehicle => {
      vehicle.setCanvasWidth(canvasWidth);
    });
  }
  
  updateLevel(levelConfig) {
    this.levelConfig = levelConfig;
    this.updateRoadLayout();
  }
  
  clearAllVehicles() {
    this.vehicles = [];
  }
}
import { AutoRickshaw } from './autoRickshaw.js';
import { Car } from './car.js';
import { VEHICLE_TYPES } from '../gameConfig.js';

export class VehicleFactory {
  static createVehicle(type, x, y) {
    const config = VEHICLE_TYPES[type];
    if (!config) {
      throw new Error(`Unknown vehicle type: ${type}`);
    }
    
    switch (type) {
      case 'autorickshaw':
        return new AutoRickshaw(x, y, type, config);
      case 'tuktuk':
        return new AutoRickshaw(x, y, type, { ...config, color: '#FF6347' });
      case 'taxi':
        return new Car(x, y, type, config);
      case 'car':
        return new Car(x, y, type, config);
      case 'bus':
        return new Car(x, y, type, { ...config, width: 200, height: 70 });
      case 'truck':
        return new Car(x, y, type, config);
      case 'motorcycle':
        return new Car(x, y, type, { ...config, width: 60, height: 35 });
      case 'bicycle':
        return new Car(x, y, type, { ...config, width: 50, height: 30 });
      case 'deliveryvan':
        return new Car(x, y, type, config);
      default:
        return new Car(x, y, type, config);
    }
  }
}
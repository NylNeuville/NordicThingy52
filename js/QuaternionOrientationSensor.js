 import FeatureOperations from "./FeatureOperations.js";

  class QuaternionOrientationSensor extends FeatureOperations {
    constructor(device) {
      super(device, "quaternionorientation");
  
      // gatt service and characteristic used to communicate with Thingy's quaternion sensor
      this.service = {
        uuid: this.device.TMS_UUID,
      };
  
      this.characteristic = {
        uuid: this.device.TMS_QUATERNION_UUID,
        decoder: this.decodeQuaternionData.bind(this),
      };
    }
  
    decodeQuaternionData(data) {
      try {
        const littleEndian = true;
        let w = data.getInt32(0, littleEndian) / (1 << 30);
        let x = data.getInt32(4, littleEndian) / (1 << 30);
        let y = data.getInt32(8, littleEndian) / (1 << 30);
        let z = data.getInt32(12, littleEndian) / (1 << 30);
        const magnitude = Math.sqrt(Math.pow(w, 2) + Math.pow(x, 2) + Math.pow(y, 2) + Math.pow(z, 2));
  
        if (magnitude !== 0) {
          w /= magnitude;
          x /= magnitude;
          y /= magnitude;
          z /= magnitude;
        }
  
        const formattedData = {
          w,
          x,
          y,
          z,
        };
  
        return formattedData;
      } catch (error) {
        throw error;
      }
    }
  }
  
  export default QuaternionOrientationSensor;


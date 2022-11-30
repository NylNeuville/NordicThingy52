import Utilities from "./Utilities.js";

  class ThingyController {
    constructor(device) {
  
      // thingy id)
      this.setDevice(device);
      this.utilities = new Utilities(device);
      this._initialize();
    }
  
    _initialize() {
      if (window.thingyController === undefined) {
          window.thingyController = {};
        }
  
        if (window.thingyController[this.tid] === undefined) {
          window.thingyController[this.tid] = {};
        }
  
        if (window.thingyController[this.tid].gattStatus === undefined) {
          window.thingyController[this.tid].gattStatus = true;
        }
  
        if (window.thingyController[this.tid].queuedOperations === undefined) {
          window.thingyController[this.tid].queuedOperations = [];
        }
  
        if (window.thingyController[this.tid].executingQueuedOperations === undefined) {
          window.thingyController[this.tid].executingQueuedOperations = false;
        }
  
        if (window.thingyController[this.tid].executedOperations === undefined) {
          window.thingyController[this.tid].executedOperations = [];
        }
    }
  
    addExecutedOperation(feature, method) {
      if (this.device.getConnected()) {
        window.thingyController[this.tid].executedOperations.push({feature, method});
      }
    }
  
    clearExecutedOperations() {
      window.thingyController[this.tid].executedOperations = [];
    }
  
    setGattStatus(bool) {
      if (this.device.getConnected()) {
        window.thingyController[this.tid].gattStatus = bool;
  
        if (bool) {
          this.utilities.processEvent("gattavailable");
        }
      }
    }
  
    getGattStatus() {
      if (this.device.getConnected()) {
        return window.thingyController[this.tid].gattStatus;
      }
    }
  
    getNumQueuedOperations() {
      if (this.device.getConnected()) {
        return window.thingyController[this.tid].queuedOperations.length;
      }
    }
  
    getQueuedOperation(index) {
      if (this.device.getConnected()) {
        if (window.thingyController[this.tid].queuedOperations.length >= index) {
          return window.thingyController[this.tid].queuedOperations[index];
        }
      }
    }
  
    // removes either by index or by operation specifics (feature and method)
    removeQueuedOperation(x) {
      if (this.device.getConnected()) {
        if (Number.isInteger(x)) {
          window.thingyController[this.tid].queuedOperations.splice(x, 1);
        } else {
          for (let i=0;i<this.getNumQueuedOperations();i++) {
            const op = this.getQueuedOperation(i);
        
            if (x.feature === op.feature && x.method === op.method) {
              this.removeQueuedOperation(i);
              i--;
            }
          }
        }
      }
    }
  
    enqueue(feature, method, f) {
      if (this.device.getConnected()) {
        window.thingyController[this.tid].queuedOperations.push({feature, method, f});
        this.utilities.processEvent("operationqueued");
      }
    }
  
    dequeue() {
      if (this.device.getConnected()) {
        return window.thingyController[this.tid].queuedOperations.shift();
      }
    }
  
    setExecutingQueuedOperations(bool) {
      if (this.device.getConnected()) {
        window.thingyController[this.tid].executingQueuedOperations = bool;
  
        if (bool) {
         this.clearExecutedOperations();
        }
      }
    }
  
    getExecutingQueuedOperations() {
      if (this.device.getConnected()) {
        return window.thingyController[this.tid].executingQueuedOperations;
      }
    }
  
    getDevice() {
      return this.device;
    }
  
    setDevice(device) {
      this.device = device;
      this.tid = device.device.id;
    }
  
    getExecutedOperation(index) {
      if (this.device.getConnected()) {
        return window.thingyController[this.tid].executedOperations[index];
      }
    }
  
    getNumExecutedOperations() {
      if (this.device.getConnected()) {
        return window.thingyController[this.tid].executedOperations.length;
      }
    }
  
    terminate() {
      window.thingyController[this.tid] = undefined;
    }
  }
  
  export default ThingyController;
  
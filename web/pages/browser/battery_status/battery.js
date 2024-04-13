navigator.getBattery().then((battery) => {

  
    function updateAllBatteryInfo() {
      updateChargeInfo();
      updateLevelInfo();
      updateChargingInfo();
      updateDischargingInfo();
    }
    
    battery.addEventListener("chargingchange", () => {
      updateChargeInfo();
    });
    function updateChargeInfo() {
      var status = `${battery.charging ? "Yes" : "No"}`;
      document.getElementById("batteryCharging").innerHTML = status;
      // console.log(`Battery charging? ${battery.charging ? "Yes" : "No"}`);
    }
  
    battery.addEventListener("levelchange", () => {
      updateLevelInfo();
    });
    function updateLevelInfo() {
      var status = `${battery.level * 100}%`;
      document.getElementById("BatteryLevel").innerHTML = status;
      // console.log(`Battery level: ${levelInfo}...`);
    }
  
    battery.addEventListener("chargingtimechange", () => {
      updateChargingInfo();
    });
    function updateChargingInfo() {
      var status = `${battery.chargingTime} seconds`;
      document.getElementById("ChargeInfo").innerHTML = status;
      // console.log(`Battery charging time: ${battery.chargingTime} seconds`);
    }
  
    battery.addEventListener("dischargingtimechange", () => {
      updateDischargingInfo();
    });
    function updateDischargingInfo() {
      var status = `${battery.dischargingTime} seconds`;
      document.getElementById("DischargingInfo").innerHTML = status;
      // console.log(`Battery discharging time: ${battery.dischargingTime} seconds`);
    }
    
    updateAllBatteryInfo();
    
  });
  

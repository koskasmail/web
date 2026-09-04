// Register Service Worker for offline availability
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('./sw.js').then((reg) => {
    console.log('Service Worker registered successfully.');
    
    // Add manual update button logic
    document.getElementById('updateBtn').addEventListener('click', () => {
      if (navigator.onLine) {
        reg.update().then(() => {
          alert('App updated successfully from the internet!');
          window.location.reload();
        });
      } else {
        alert('You are currently offline. Connect to the internet to check for updates.');
      }
    });
  }).catch((err) => console.error('Service Worker registration failed:', err));
}

// Battery API functionality
if ('getBattery' in navigator) {
  navigator.getBattery().then((battery) => {
    function updateAllBatteryInfo() {
      updateChargeInfo();
      updateLevelInfo();
      updateChargingInfo();
      updateDischargingInfo();
    }

    battery.addEventListener("chargingchange", updateChargeInfo);
    function updateChargeInfo() {
      document.getElementById("batteryCharging").innerText = battery.charging ? "Yes" : "No";
    }

    battery.addEventListener("levelchange", updateLevelInfo);
    function updateLevelInfo() {
      document.getElementById("BatteryLevel").innerText = `${Math.round(battery.level * 100)}%`;
    }

    battery.addEventListener("chargingtimechange", updateChargingInfo);
    function updateChargingInfo() {
      document.getElementById("ChargeInfo").innerText = `${battery.chargingTime} seconds`;
    }

    battery.addEventListener("dischargingtimechange", updateDischargingInfo);
    function updateDischargingInfo() {
      document.getElementById("DischargingInfo").innerText = `${battery.dischargingTime} seconds`;
    }

    updateAllBatteryInfo();
  });
} else {
  document.body.innerHTML += '<div style="color:red;">Battery Status API not supported in this browser.</div>';
}

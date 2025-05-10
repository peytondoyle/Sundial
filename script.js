function getSunGoodness() {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported.");
      return;
    }
  
    navigator.geolocation.getCurrentPosition(async (position) => {
      const lat = position.coords.latitude;
      const lon = position.coords.longitude;
  
      try {
        const response = await fetch(`/api/weather?lat=${lat}&lon=${lon}`);
        const data = await response.json();
  
        const clouds = data.clouds.all;
        const humidity = data.main.humidity;
        const visibility = data.visibility;
        const sunrise = data.sys.sunrise;
        const sunset = data.sys.sunset;
        const now = Math.floor(Date.now() / 1000);
  
        let score = 100;
        score -= clouds * 0.6;
        score -= humidity * 0.2;
        if (visibility < 5000) score -= 15;
        if (Math.abs(now - sunrise) < 3600 || Math.abs(now - sunset) < 3600) {
          score += 10;
        }
  
        score = Math.max(0, Math.min(100, Math.round(score)));
  
        document.getElementById('score').textContent = `${score}%`;
        document.getElementById('description').textContent = getVibe(score);
      } catch (err) {
        console.error(err);
        document.getElementById('score').textContent = "--%";
        document.getElementById('description').textContent = "Failed to load";
      }
    });
  }
  
  function getVibe(score) {
    if (score > 90) return "Stunning skies!";
    if (score > 75) return "Gorgeous and glowing";
    if (score > 60) return "Pretty clear";
    if (score > 40) return "Some clouds";
    if (score > 20) return "Gloomy";
    return "Moody gray";
  }
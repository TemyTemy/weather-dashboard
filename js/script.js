// Weather details object structure
var WEATHER_DETAILS = {
    city: '',
    date: '',
    temperature: '',
    humidity: '',
    windSpeed: '',
    uvIndex: '',
    flag: '',
    forecasts: [
      {
        date: '',
        temperature: '',
        humidity: '',
        flag: ''
      }
    ],
    previousSearches: []
  }
  
  // Empty weather details
var EMPTY_WEATHER_DETAILS = {

}

WEATHER_DETAILS_STORAGE_KEY = "weather";
OPEN_WEATHER_API_KEY = "cfaac070928fb11f97b715a91a712cce";
OPEN_WEATHER_URL =
  "http://api.openweathermap.org/data/2.5/weather?q={city}&units=imperial&appid=" + OPEN_WEATHER_API_KEY;

OPEN_WEATHER_FORECAST_URL =
  "http://api.openweathermap.org/data/2.5/onecall?lat={lat}&lon={lon}&units=imperial&appid=" + OPEN_WEATHER_API_KEY;

  //  Save weather summary to local storage
function saveWeatherSummary() {
    localStorage.setItem(WEATHER_DETAILS_STORAGE_KEY, JSON.stringify(WEATHER_DETAILS));
   }

   // Retrieves weather summary from local storage  
function loadWeatherSummary() {
    var summaryText = localStorage.getItem(WEATHER_DETAILS_STORAGE_KEY);
    if (summaryText) {
      WEATHER_DETAILS = JSON.parse(summaryText);
      var currentDate = moment(WEATHER_DETAILS.date, "MM/DD/YYYY").format("L");
      var momentDate = moment().format("L")
      if (!currentDate || currentDate !== momentDate) {
        WEATHER_DETAILS = EMPTY_WEATHER_DETAILS;
      }
    } else {
      WEATHER_DETAILS = EMPTY_WEATHER_DETAILS;
    }
  }

  // Search for a summary of weather details for a city
function searchWeatherForCity() {
    var cityName = $("input").val();
    if (!cityName) {
      alert("Please enter a city to search");
    } else {
      getCityWeather(cityName);
    }
  }

  $("button").click(function() {
    searchWeatherForCity();
  }
);

// Displays weather summary
function displayWeatherSummary() {
    constructCityList();
    constructSummarySection();
    constructWeatherForecasts();
    if (!WEATHER_DETAILS.city) {
      $(".weather-summary").css('display','none');
      $(".weather-forecast").css('display','none');
    } else {
      $(".weather-summary").css('display','block');
      $(".weather-forecast").css('display','flex');
    }
  }
  
  
  loadWeatherSummary();
  if (WEATHER_DETAILS.city) {
    displayWeatherSummary();
  } else {
    $(".weather-summary").css('display','none');
    $(".weather-forecast").css('display','none');
  }
  
  // Construct the weather summary section
function constructSummarySection() {
    var summaryText = "<div class='header'>"
                     + "<p>" + WEATHER_DETAILS.city + " (" + WEATHER_DETAILS.date + ")"
                     + "<span class='image'><img src='http://openweathermap.org/img/w/" +  WEATHER_DETAILS.flag + ".png' /></span></p>"
                     + "</div>"
                     + "<p>Temperature: " + WEATHER_DETAILS.temperature + "<sup>O</sup>F</p>"
                     + "<p>Humidity: " + WEATHER_DETAILS.humidity + "%</p>"
                     + "<p>Wind Speed: " + WEATHER_DETAILS.windSpeed + " MPH</p>"
                     + "<p>UV Index: <span class='uvi " + getUvIClass(WEATHER_DETAILS.uvIndex) + "'>" + WEATHER_DETAILS.uvIndex + "</span></p>";
    $(".weather-summary").html(summaryText);
  }
  
  // Translate the uvi index value to a class.  This will help in displaying the appropriate coloured box around the uvi index
  function getUvIClass(uvi) {
    var intVi = Math.round(uvi);
    if (intVi >= 0 && intVi <= 2) {
      return "low";
    }
    if (intVi >= 3 && intVi <= 5) {
      return "moderate";
    }
    if (intVi >= 6 && intVi <= 7) {
      return "high";
    }
    if (intVi >= 8 && intVi <= 10) {
      return "very-high";
    }
    if (intVi >= 11) {
      return "extreme";
    }
  }
  
  // Construct weather forecasts section
  function constructWeatherForecasts() {
    var forecastText = "";
    if (WEATHER_DETAILS.forecasts) {
      for (var i = 0; i < WEATHER_DETAILS.forecasts.length; i++) {
        var item = WEATHER_DETAILS.forecasts[i];
        var text = "<p>"
          + "<span class='date'>" + item.date + "</span>"
          + "<span class='image'><img src='http://openweathermap.org/img/w/" + item.flag + ".png' /></span>"
          + "<span class='temp'>Temp: " + item.temperature + "<sup>O</sup>F</span>"
          + "<span class='humidity'>Humidity: " + item.humidity + "%</span>"
          + "</p>"
        forecastText += text;
      }
    }
    $(".forecast").html(forecastText);
  }
  
  // Construct the city list section
  function constructCityList() {
    var cityText = "";
    if (WEATHER_DETAILS.previousSearches && WEATHER_DETAILS.previousSearches.length > 0) {
      for (var i = 0; i < WEATHER_DETAILS.previousSearches.length; i++) {
          var city = WEATHER_DETAILS.previousSearches[i];
          cityText += "<span data-city='" + city + "'>" + city + "</span>";
      }
    }
  
    $(".city-list").html(cityText);
    $(".city-list span").click(function(event) {
      var city = event.currentTarget.dataset.city;
      getCityWeather(city);
    })
  }
  
  // Calls the api to retrieve weather details for a city
  function getCityWeather(city) {
    fetch(OPEN_WEATHER_URL.replace("{city}", city))
      .then((resp) => resp.json())
      .then(function(data) {
        WEATHER_DETAILS.city = data.name;
        WEATHER_DETAILS.temperature = data.main.temp;
        WEATHER_DETAILS.humidity = data.main.humidity;
        WEATHER_DETAILS.windSpeed = data.wind.speed;
        WEATHER_DETAILS.flag = data.weather[0].icon;
        var dt =  moment.unix(data.dt).format("L");
        WEATHER_DETAILS.date = dt;
        getWeatherForecasts(data.coord.lon, data.coord.lat, city);
      })
      .catch(function(error) {
        alert('City details could not be retrieved');
        console.log(error);
      });
  }
  
  // Calls an api to retrieve weather forecasts for 6 days.  Longitude and latitude is retrieved by calling weather summary
  function getWeatherForecasts(longitude, latitude, city) {
    var url = OPEN_WEATHER_FORECAST_URL.replace("{lon}", longitude).replace("{lat}", latitude);
    fetch(url)
      .then((resp) => resp.json())
      .then(function(data) {
        WEATHER_DETAILS.forecasts = [];
        var forecastToDisplay = data.daily.slice(1, 6);
        for(var i = 0; i < forecastToDisplay.length; i++) {
          var item = forecastToDisplay[i];
          var forecast = {
            date: moment.unix(item.dt).format("L"),
            temperature: item.temp.max,
            humidity: item.humidity,
            flag: item.weather[0].icon,
            uvIndex: item.uvi
          }
          WEATHER_DETAILS.forecasts.push(forecast);
        }
        WEATHER_DETAILS.uvIndex = data.daily[0].uvi;
        updateSearchedCities(city);
        saveWeatherSummary();
        displayWeatherSummary();
      })
      .catch(function(error) {
        alert('City forecast details could not be retrieved');
        console.log(error);
      });
  }
  
  // Updates the list of searched cities in the weather details object for local storage
  function updateSearchedCities(city) {
    if (!WEATHER_DETAILS.previousSearches || WEATHER_DETAILS.previousSearches.length === 0) {
      WEATHER_DETAILS.previousSearches = [];
    }
  
    var existingPreviousSearchIndex = WEATHER_DETAILS.previousSearches.findIndex((x) => x.toLowerCase() === city.toLowerCase());
    if (existingPreviousSearchIndex < 0) {
      WEATHER_DETAILS.previousSearches.push(city);
    }
  
  }
  
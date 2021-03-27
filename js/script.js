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

   

//Daily Weather Forecast

//DOM for storing weather data
var todaysForecast = {};
var displayWeather = document.getElementById("todaysForecast");

//fetching Accuweather Daily Weather Data
async function fetchWeather()
{


    var resp = await fetch('/api/weather')
    if (!resp.ok)
    {
        throw Error("ERROR");
    }
    resp = await resp.json()

    var currentDate = moment().format('LLLL').slice(0, -8);
    var minTemp = "Min " + Math.trunc(resp.DailyForecasts[0].Temperature.Minimum.Value) + " °";
    var maxTemp = "Max " + Math.trunc(resp.DailyForecasts[0].Temperature.Maximum.Value) + " °";
    var weatherText = resp.DailyForecasts[0].Day.IconPhrase;
    var weatherIcon = document.createElement("img");
    weatherIcon.src = "assets/images/weatherImages/" + resp.DailyForecasts[0].Day.Icon + ".png";

    displayWeather.textContent = currentDate + "  " + minTemp + "  " + maxTemp + "  " + weatherText;
    displayWeather.appendChild(weatherIcon);

};

fetchWeather();











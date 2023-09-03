
let lat
let long
function startApp() {
    if(navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                lat = position.coords.latitude
                long = position.coords.longitude
                console.log("lat, long",lat, long)
                downloadData()
            }
        )
    }
}

function downloadData() {
    let url_city = `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${long}`
    let url_forecast = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${long}&daily=weathercode,temperature_2m_max,temperature_2m_min,sunrise,sunset,uv_index_max,rain_sum,snowfall_sum,windspeed_10m_max,winddirection_10m_dominant&timezone=auto`
    fetch(url_forecast)
        .then(function(response) {
            response.json().then(function(data_forecast) {
                updateDataForecast(data_forecast)
                console.log(data_forecast)
            })
        })

    fetch(url_city)
        .then(function(response) {
            response.json().then(function(data_city) {
                updateCity(data_city)
                console.log(data_city)
            })
        })
}

function updateDataForecast(data) {
    for (let i=0;i<2;i++) {
        const temp_max = (data.daily.temperature_2m_max[i])
        const temp_min = (data.daily.temperature_2m_min[i])
        const rain_sum = (data.daily.rain_sum[i])
        const snow_sum = (data.daily.snowfall_sum[i])
        const uv_index = (data.daily.uv_index_max[i])
        const wind_speed = (data.daily.windspeed_10m_max[i])
        const sunrise = Date.parse(data.daily.sunrise[i])
        const shortDateSunrise = new Date(sunrise)
        const sunset = Date.parse(data.daily.sunset[i])
        const shortDateSunset = new Date(sunset)
        const weather_code = getWeatherImage(data.daily.weathercode[i])
        document.getElementsByClassName('tempMax')[i].innerHTML = temp_max + " " + data.daily_units.temperature_2m_max
        document.getElementsByClassName('tempMin')[i].innerHTML = temp_min + " " + data.daily_units.temperature_2m_min
        document.getElementsByClassName('rainSnowFall')[i].innerHTML = rain_sum + snow_sum + " " + 'mm/cm'
        document.getElementsByClassName('uvIndex')[i].innerHTML = uv_index
        document.getElementsByClassName('windSpeed')[i].innerHTML = wind_speed + " " + data.daily_units.windspeed_10m_max
        document.getElementsByClassName('sunRise')[i].innerHTML = sunriseTimeCorrection(shortDateSunrise.getHours(),"hours") + ":" + sunriseTimeCorrection(shortDateSunrise.getMinutes(),"minutes")
        document.getElementsByClassName('sunSet')[i].innerHTML = shortDateSunset.getHours() + ":" + shortDateSunset.getMinutes()
        var img = document.createElement("img")
        img.src=`icons/icons8${weather_code}`
        var src =  document.getElementsByClassName('image')[i]
        src.appendChild(img)
    }
    
}

function sunriseTimeCorrection(timeC, desc) {
    if(desc == "hours" && timeC) {
        if(timeC < 10) {
            timeC = "0" + timeC
            console.log(typeof timeC)
        }
    }

    if(desc == "minutes" && timeC) {
        if(timeC < 10) {
            timeC = timeC + "0"
            console.log(typeof timeC)
        }
    }

    return timeC
}

function updateCity(data_city) {
    const date = new Date()
    let day = date.getDate();
    let month = date.getMonth() + 1;
    let year = date.getFullYear();

    let currentDate = `${day}-${month+1}-${year}`
    let tommorrowDate = `${day+1}-${month+1}-${year}` 
    
    const city = data_city.city
    document.getElementById("cityNow").innerHTML = city + ' ' + currentDate
    document.getElementById("cityTomorrow").innerHTML = city + ' ' + tommorrowDate
}

function getWeatherImage(data) {
    if(typeof data === "number") {
        switch(data) {
            case 0:
                return "-summer.gif"
            case 1:
            case 2:
            case 3:
            case 45:
            case 48:
                return "-clouds-48.png"
            case 51:
            case 53:
            case 55:
                return "-light-rain.gif"
            case 61:
            case 63:
            case 65:
            case 80:
            case 81:
            case 82:
                return "-heavy-rain.gif"
            case 95:
            case 96:
            case 99:
                return "-cloud-lightning.gif"
            default:
                return "-light-snow.gif"
        }
    }
    return data

}
/*WMO Weather interpretation codes (WW)
Code	Description
0	Clear sky
1, 2, 3	Mainly clear, partly cloudy, and overcast
45, 48	Fog and depositing rime fog
51, 53, 55	Drizzle: Light, moderate, and dense intensity
56, 57	Freezing Drizzle: Light and dense intensity
61, 63, 65	Rain: Slight, moderate and heavy intensity
66, 67	Freezing Rain: Light and heavy intensity
71, 73, 75	Snow fall: Slight, moderate, and heavy intensity
77	Snow grains
80, 81, 82	Rain showers: Slight, moderate, and violent
85, 86	Snow showers slight and heavy
95 *	Thunderstorm: Slight or moderate
96, 99 *	Thunderstorm with slight and heavy hail
(*) Thunderstorm forecast with hail is only available in Central Europe */

//dodać obsługę obrazków
//przerobić na model MVC

const reverseGeocode = (lon, lat) => {
    return $.get(`https://api.mapbox.com/geocoding/v5/mapbox.places/${lon},${lat}.json?access_token=${MAPBOX_API}`)
}

const geocode = event => {
    if (event.key === "Enter" && $GEOCODER.val()) {
        $.get(`https://api.mapbox.com/geocoding/v5/mapbox.places/${$GEOCODER.val()}.json?access_token=${MAPBOX_API}`)
            .done((results) => {
                const LON = results.features[0].center[0];
                const LAT = results.features[0].center[1];
                getWeatherData(LON, LAT)
            })
    }
}

const getWeatherData = (lon = -101.8313, lat = 35.2220) => {
    $.get("http://api.openweathermap.org/data/2.5/onecall", {
        APPID: OPEN_WEATHER_KEY, lat: lat, lon: lon, units: "imperial"
    }).done(function (weatherData) {
        console.log(weatherData);
        console.log(weatherData.daily[0])
        reverseGeocode(weatherData.lon, weatherData.lat).done(function (locationData) {
            if (locationData.features[3] !== undefined) {
                setCurrentWeatherData(weatherData.current, weatherData.daily[0].temp, locationData.features[3].text, locationData.features[5].text)
            } else {
                setCurrentWeatherData(weatherData.current, weatherData.daily[0].temp, locationData.features[2].text)
            }
            weatherData.daily.forEach((day, index) => {
                if (index > 0 && index < 7) {
                    setSixDayConditions(day)
                }
            })
        })
    })
}
getWeatherData()

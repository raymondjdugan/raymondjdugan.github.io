let city = "Amarillo"

function geocode(search, token) {
    var baseUrl = 'https://api.mapbox.com';
    var endPoint = '/geocoding/v5/mapbox.places/';
    return fetch(baseUrl + endPoint + encodeURIComponent(search) + '.json' + "?" + 'access_token=' + token)
        .then(function (res) {
            return res.json();
            // to get all the data from the request, comment out the following three lines...
        }).then(function (data) {
            let [lon, lat] = data.features[0].center;
            getWeatherData(lon, lat)
            createMarker(data.features[0].center, data.features[0].place_name)

        });
}
geocode(city, RAYMOND_DUGAN_KEY)

function getWeatherData(lon, lat) {
    $.get("http://api.openweathermap.org/data/2.5/onecall", {
        APPID: OPEN_WEATHER_KEY,
        lat: lat,
        lon: lon,
        units: "imperial"
    }).then(function (weatherData) {
        const currentUtcTime = weatherData.current.dt
        const currentTemp = weatherData.current.temp
        const currentHumidity = weatherData.current.humidity
        const currentWindDirection = findWindDirection(weatherData.current.wind_deg)
        const currentMaxTemp = Math.round(weatherData.daily[0].temp.max)
        const currentMinTemp = Math.round(weatherData.daily[0].temp.min)
        const currentIcon = weatherData.current.weather[0].icon
        const currBackground = setCardBackground(weatherData.current.weather[0].icon)

        $('#weather-cards').html(" ")
        $('body').addClass(setBodyBackground(currentUtcTime))

        $('#current-day-info').html(currentHTML(currentUtcTime, currentTemp, currentHumidity, currentWindDirection, currentMaxTemp, currentMinTemp, currentIcon, currBackground, city))

        $('#carousel-append').html(' ')
        weatherData.daily.forEach(function (day, i) {
            const dailyMaxTemp = day.temp.max
            const dailyMinTemp = day.temp.min
            const dailyIcon = day.weather[0].icon
            const dailyDescription = day.weather[0].description
            const dailyHumidity = day.humidity
            const dailyWindDirection = findWindDirection(day.wind_deg)
            const dailyBackground = setCardBackground(day.weather[0].icon)
            const dailyTime = day.dt

            if (i > 0 && i < 7) {
                $('#weather-cards').append(sixDayForcastHTML(dailyMaxTemp, dailyMinTemp,dailyIcon, dailyDescription, dailyHumidity, dailyWindDirection, dailyBackground, day.dt))

            if (i === 1) {
                    $('#carousel-append').append(createCarousel(dailyMaxTemp, dailyMinTemp, dailyIcon, dailyDescription, dailyHumidity, dailyWindDirection, 'carousel-item active', dailyBackground, dailyTime))
            } else if (i > 1 && i <= 7) {
                    $('#carousel-append').append(createCarousel(dailyMaxTemp, dailyMinTemp, dailyIcon, dailyDescription, dailyHumidity, dailyWindDirection, 'carousel-item', dailyBackground, dailyTime))
                }
            }
        })

        $('#hourly').html(' ')
        weatherData.hourly.forEach((hour, index) => {
            const hourlyTime = hour.dt;
            const hourlyTemp = Math.round(hour.temp);
            const hourlyIcon = hour.weather[0].icon;
            const rainCode = hour.weather[0].id;
            const background = setCardBackground(hour.weather[0].icon)
            if (index > 0 && index < 13 ) {
                // utc, temp, icon, percentage, backgroundCLass
                $('#hourly').append(hourlyHTML(hourlyTime, hourlyTemp, hourlyIcon, rainCode, background))
            }

        })

    })
}
function reverseGeocode(coordinates, token) {
    var baseUrl = 'https://api.mapbox.com';
    var endPoint = '/geocoding/v5/mapbox.places/';
    return fetch(baseUrl + endPoint + coordinates.lng + "," + coordinates.lat + '.json' + "?" + 'access_token=' + token)
        .then(function(res) {
            return res.json();
        })
        // to get all the data from the request, comment out the following three lines...
        .then(function(data) {
            console.log(data)
            const cityArray = data.features[0].place_name.split(', ')
            city =  cityArray[1]
            geocode(city, RAYMOND_DUGAN_KEY)
            createMarker(coordinates, data.features[0].place_name)
        });
}

console.log(city)

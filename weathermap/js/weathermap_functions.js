// Function that creates the html markup for the current days conditions
function currentHTML(utc, temp, humid, windDir, curr_high, curr_low, icon, backgroundClass, city) {
    //language=HTML
    return `
        <div class="card ${backgroundClass}" id="main-info">
            <div class="card-header d-flex justify-content-center">
                <div class="m-0" id="curr-cond">Current Conditions</div>
            </div>
            <div class="card-body">
                <div class="justify-content-between align-items-center text-center">
                    <div class="h3 m-0">${city}</div>
                    <div>Time: ${setTime(utc)}</div>
                </div>
                <div class="mt-3 text-center" id="curr-temp">Current Temperature: ${Math.round(temp)} °F</div>
                <div class="d-flex" id="curr_temps">
                    <div class="d-flex" id="temps">
                        <div>High: ${Math.round(curr_high)}°F</div>
                        <div>Low: ${Math.round(curr_low)}°F</div>
                    </div>
                    <div>
                        <img src="http://openweathermap.org/img/wn/${icon}@2x.png" alt="">
                    </div>
                </div>
                <div class="d-flex flex-column" id="other-data">
                    <div>Humidity: ${humid}%</div>
                    <div>Wind: ${windDir}</div>

                </div>
            </div>
        </div>`
}

// Function that creates the markup for the hourly conditions
function hourlyHTML(utc, temp, icon, code, backgroundCLass) {
    //language=HTML
    return `
        <div class="card ${backgroundCLass} d-flex flex-column ">
            <div class="card-header">${setTime(utc)}</div>
            <div class="card-body">
                <div>${temp}°F</div>
                <img src="http://openweathermap.org/img/wn/${icon}@2x.png" alt="">
                <div>${rainPercentage(code)}%</div>
            </div>
        </div>`
}

// Function that creates the markup for the next 6 days (excluding the current day)
// For screens lg and above
function sixDayForcastHTML(day_high, day_low, icon, desc, hum, windDir, backgroundClass, utc) {
    //language=HTML
    return `
        <div class="card d-none d-md-flex ${backgroundClass}">
            <div class="card-header m-0 p-0 text-center">${setDate(utc)}</div>
            <div class="card-body py-0 px-sm-2 px-lg-2">
                <div class="d-flex justify-content-between align-items-center">
                    <div class="d-flex flex-column">
                        <div>High: ${Math.round(day_high)}°F</div>
                        <div>Low: ${Math.round(day_low)}°F</div>
                    </div>
                    <div>
                        <img src="http://openweathermap.org/img/wn/${icon}@2x.png" alt="">
                    </div>
                </div>
                <div>${setCapitalization(desc)}</div>
                <div>Humidity: ${hum}%</div>
                <div>Wind: ${windDir}</div>
            </div>
        </div>`
}

// Function that creates the markup for the next 6 days (excluding the current day)
// This is for xs - md screens
function createCarousel(day_high, day_low, icon, desc, hum, windDir, classNam, backgroundClass, utc) {
    //language=HTML
    return `
        <div class="${classNam} " data-interval="3000">
            <div class="card ${backgroundClass}">
                <div class="card-header d-flex justify-content-between">
                    <div class="h5 m-0">6 Day Forecast</div>
                    <div>${setDate(utc)}</div>
                </div>
                <div class="card-body px-3 pt-0 pb-5">
                    <div class="d-flex justify-content-between align-items-center">
                        <div class="d-flex flex-column">
                            <div>High: ${Math.round(day_high)}°F</div>
                            <div>Low: ${Math.round(day_low)}°F</div>
                        </div>
                        <div>
                            <img src="http://openweathermap.org/img/wn/${icon}@2x.png" alt="">
                        </div>
                    </div>
                    <div>${setCapitalization(desc)}</div>
                    <div>Humidity: ${hum}%</div>
                    <div>Wind: ${windDir}</div>
                </div>
            </div>
        </div>`
}

// Function that formats the time from the UTC data
function setTime(utc) {
    return new Intl.DateTimeFormat(navigator.language, {
        hour: "numeric",
        minute: "numeric"
    }).format(new Date(utc * 1000))
}

// Function that capitalizes the first letter for the data description
function setCapitalization(str) {
    return str.charAt(0).toUpperCase() + str.slice(1)
}

// Function that converts the UTC to 24 hour time
// This is used to determine if it is day or night for the body background
function convertTime24Hour(utcTIme) {
    return new Date(utcTIme * 1000).toLocaleTimeString(navigator.language, {hour12: false})
}

// Sets the body background to either day or night
// Day is between 0700 and 1800
function setBodyBackground(dt) {
    let currentTime = convertTime24Hour(dt)
    if (parseInt(currentTime.slice(0, 2)) > 7 && parseInt(currentTime.slice(0, 2)) < 18) {
        return 'clear-day'
    } else {
        return 'nightTime'
    }
}

// Function to format the date from the UTC data
function setDate(utc) {
    return new Date(utc * 1000).toLocaleDateString(navigator.language)
}

// Function to set the card backgrounds
// This is done with the icons
function setCardBackground(icon) {
    if (icon === '13d') {
        return 'snow' //snow
    } else if (icon === '09D' || icon === '10d') {
        return 'rain' // rain
    } else if ( icon === '11d') {
        return 'storm'
    } else if (icon === '02d' || icon === '04d' || icon === '05d') {
        return 'cloudy' // cloud
    } else if (icon === '01n') {
        return 'stars'
    } else {
        return 'clear' // clear
    }
}

// Set rain percentages from the weather.id code
function rainPercentage(code) {
    let percentage = 0;
    const light = [200, 210, 230, 231, 232, 300, 301, 302, 310, 311, 312, 500, 520];
    const normal = [201, 211, 313, 321, 501, 521];
    const heavy = [202, 212, 221, 314, 502, 503, 504, 522, 531];

    light.forEach(weatherCode => {
        if (code === weatherCode){
            percentage = getRandomPercentage(1, 33);
        }
    })

    normal.forEach(weatherCode => {
        if (code === weatherCode){
            percentage = getRandomPercentage(34, 67);
        }
    })

    heavy.forEach(weatherCode => {
        if (code === weatherCode){
            percentage = getRandomPercentage(67, 100);
        }
    })

    return percentage;
}

// Set snow percentages from the weather.id code
function snowPercentage(code) {
    if (code === 200) {
        const lightSnow = [511, 600, 611, 612, 613];
        const normalSnow = [601, 615, 616, 620, 621];
        const heavySnow = [602, 622];
    }
}

// Returns a random number for percentages function
function getRandomPercentage(max, min){
    min = Math.ceil(min)
    max = Math.floor(max)
    return Math.floor(Math.random() * (max - min) + min)
}


//Function to create the marker and call the create popup function
function createMarker(location, popInfo) {
    $('.mapboxgl-marker').remove()
    map.setCenter(location)
    return new mapboxgl.Marker()
        .setLngLat(location)
        .addTo(map)
        .setPopup(createPopup(popInfo));
}

// Function to create the popup
function createPopup(info) {
    return new mapboxgl.Popup()
        .setHTML(info);
}

// Find the wind direction using the degrees from the data
function findWindDirection(deg) {
    if (deg > 11.25 && deg < 33.75) {
        return "NNE";
    } else if (deg > 33.75 && deg < 56.25) {
        return "ENE";
    } else if (deg > 56.25 && deg < 78.75) {
        return "E";
    } else if (deg > 78.75 && deg < 101.25) {
        return "ESE";
    } else if (deg > 101.25 && deg < 123.75) {
        return "ESE";
    } else if (deg > 123.75 && deg < 146.25) {
        return "SE";
    } else if (deg > 146.25 && deg < 168.75) {
        return "SSE";
    } else if (deg > 168.75 && deg < 191.25) {
        return "S";
    } else if (deg > 191.25 && deg < 213.75) {
        return "SSW";
    } else if (deg > 213.75 && deg < 236.25) {
        return "SW";
    } else if (deg > 236.25 && deg < 258.75) {
        return "WSW";
    } else if (deg > 258.75 && deg < 281.25) {
        return "W";
    } else if (deg > 281.25 && deg < 303.75) {
        return "WNW";
    } else if (deg > 303.75 && deg < 326.25) {
        return "NW";
    } else if (deg > 326.25 && deg < 348.75) {
        return "NNW";
    } else {
        return "N";
    }
}

// Scroll to the top of the page instead of jump
function scrollToTOp(){
    window.scrollTo({
        left: 0,
        top: 0,
        behavior: "smooth",
    })
}
// Scroll to the map div instead of jump
$('#map-scroll').on('click', function(e){
    e.preventDefault();
    const mapDiv =  document.getElementById('map-div')
    mapDiv.scrollIntoView({behavior: "smooth"})
})

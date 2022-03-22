const $GEOCODER = $("#geocode");
const $DATA_TAB_1 = $("[data-tab='1']");
const $DATA_TAB_2 = $("[data-tab='2']");
const $SIX_DAY_FORECAST_CONTAINER = $("#sixDayForecast");
const $HOURLY_FORECAST_CONTAINER = $("#hourlyForecast");

mapboxgl.accessToken = MAPBOX_API;
const map = new mapboxgl.Map({
    container: 'map', style: 'mapbox://styles/mapbox/streets-v11',
    zoom: 10,
    center: [-101.8313, 35.2220],
    pitch: 50, // pitch in degrees
});

const insertCurrentConditions = (cityOrCountry, state, time, temp, feelLike, humidity, windDir,
                                 windSpeed, sunrise, sunset, icon, weatherDesc, high, low) => {
    //language=HTML
    let location = state ? `${cityOrCountry}, ${state}` : `${cityOrCountry}`
    return `
    <div class="h-full">
        <div class="flex flex-wrap w-full ${setCardBackground(icon)} bg-no-repeat bg-cover h-full">
        <div class="w-full text-center font-bold bg-slate-500 flex items-center justify-center" id="current-header">
            Current Conditions for ${location}
        </div>
            <div class="w-full text-center mt-3 font-bold">${setCapitalization(weatherDesc)}</div>
            <div class="flex w-full h-[120px]">
                <div class="flex flex-col justify-center w-1/2 px-5">
                    <div class="mx-1 font-bold">Time: <span class="font-normal">${setTime(time)}</span> </div>
                    <div class="mx-1 font-bold">Temperature: <span class="font-normal">${temp}°F</span> </div>
                    <div class="mx-1 font-bold">Feels Like: <span class="font-normal"> ${feelLike}°F</span></div>
                </div>
                <div class="w-1/2">
                    <img src="/public/weathermap/weathermap_images/icons/${setIcon(icon)}.png"
                    alt="" class="">
                </div>
            </div>
            <div class="w-1/3 flex flex-col pl-5">
                <span class="font-bold">Humidity:</span>
                <span>${humidity}%</span>
                <span class="font-bold">Wind:</span>
                <span>${windSpeed} mph ${findWindDirection(windDir)}</span>
            </div>
            <div class="w-1/3 flex flex-col items-center">
                <div class="font-bold">High: <span class="font-normal">${high}°F</span> </div>
                <div class="font-bold">Low: <span class="font-normal">${low}°F</span> </div>
            </div>
            <div class="w-[calc(33%)] flex flex-col items-center pr-2">
                <span class="font-bold">Sunrise:</span>
                <span>${setTime(sunrise)}</span>
                <span class="font-bold">Sunset:</span>
                <span> ${setTime(sunset)}</span>
            </div>
        </div>
    </div>`
}

const setCurrentWeatherData = (currentWeatherData, dailyTemp, cityOrCountry, state) => {
    const CURRENT_CITY_OR_COUNTRY = cityOrCountry;
    const CURRENT_STATE = state;
    const CURRENT_TIME = currentWeatherData.dt;
    const CURRENT_TEMP = Math.round(currentWeatherData.temp);
    const CURRENT_FEELS_LIKE = Math.round(currentWeatherData.feels_like);
    const CURRENT_HUMIDITY = Math.round(currentWeatherData.humidity);
    const CURRENT_WIND_DIRECTION = currentWeatherData.wind_deg;
    const CURRENT_WIND_SPEED = Math.round(currentWeatherData.wind_speed);
    const CURRENT_SUNRISE = currentWeatherData.sunrise;
    const CURRENT_SUNSET = currentWeatherData.sunset;
    const CURRENT_ICON = currentWeatherData.weather[0].icon;
    const CURRENT_DESCRIPTION = currentWeatherData.weather[0].description;
    const CURRENT_HIGH = Math.round(dailyTemp.max);
    const CURRENT_LOW = Math.round(dailyTemp.min);
    $('#current-conditions').html('')
        .append(insertCurrentConditions(CURRENT_CITY_OR_COUNTRY, CURRENT_STATE, CURRENT_TIME, CURRENT_TEMP,
            CURRENT_FEELS_LIKE, CURRENT_HUMIDITY, CURRENT_WIND_DIRECTION, CURRENT_WIND_SPEED, CURRENT_SUNRISE,
            CURRENT_SUNSET, CURRENT_ICON, CURRENT_DESCRIPTION, CURRENT_HIGH, CURRENT_LOW))
}

const insertSixDayConditions = (date, temp, humidity, icon, desc, high, low, morn, night) => {
    return `
    <div class="h-full">
        <div class="flex flex-wrap w-full ${setCardBackground(icon)} bg-no-repeat bg-cover h-full">
        <div class="w-full text-center font-bold bg-slate-500 flex items-center justify-center" id="current-header">
            Weather Conditions for ${date}
        </div>
            <div class="w-full text-center mt-3 font-bold">${setCapitalization(desc)}</div>
            <div class="flex w-full h-[120px]">
                <div class="flex flex-col justify-center w-1/2 px-5">
                    <div class="mx-1 font-bold">High: <span class="font-normal">${high}°F</span> </div>
                    <div class="mx-1 font-bold">Low: <span class="font-normal"> ${low}°F</span></div>
                </div>
                <div class="w-1/2">
                    <img src="/public/weathermap/weathermap_images/icons/${setIcon(icon)}.png"
                    alt="" class="">
                </div>
            </div>
            <div class="w-1/3 flex flex-col pl-5">
                <span class="font-bold">Humidity:</span>
                <span>${humidity}%</span>
            </div>
            <div class="w-1/3 flex flex-col items-center">
                <div class="font-bold">Morning: <span class="font-normal">${morn}°F</span> </div>
                <div class="font-bold">Night: <span class="font-normal">${night}°F</span> </div>
            </div>
            <div class="w-[calc(33%)] flex flex-col items-center pr-2">
                <span class="font-bold">Sunrise:</span>
                <span></span>
                <span class="font-bold">Sunset:</span>
                <span></span>
            </div>
        </div>
    </div>`
}
const setSixDayConditions = (day) => {

    const DAILY_DATE = setDate(day.dt);
    const DAILY_TEMP = Math.round(day.temp);
    const DAILY_HUMIDITY = Math.round(day.humidity);
    const DAILY_ICON = day.weather[0].icon;
    const DAILY_DESC = day.weather[0].description;
    const DAILY_HIGH = Math.round(day.temp.max);
    const DAILY_LOW = Math.round(day.temp.min);
    const DAILY_MORN = Math.round(day.temp.morn);
    const DAILY_NIGHT = Math.round(day.temp.night);
    $("#sixDayForecast").html('').append(insertSixDayConditions(DAILY_DATE, DAILY_TEMP, DAILY_HUMIDITY, DAILY_ICON,
        DAILY_DESC, DAILY_HIGH, DAILY_LOW, DAILY_MORN, DAILY_NIGHT))
}

const switchTabs = event => {
    console.log($("[data-tab]"));
    if (event.target.getAttribute("data-tab") === "1") {
        $DATA_TAB_1.addClass('activeTab')
        $DATA_TAB_2.removeClass('activeTab')
        $SIX_DAY_FORECAST_CONTAINER.toggleClass("showTab")
        $SIX_DAY_FORECAST_CONTAINER.toggleClass("hiddenTab")
        $HOURLY_FORECAST_CONTAINER.toggleClass("hiddenTab")
        $HOURLY_FORECAST_CONTAINER.toggleClass("hiddenTab")
    } else if (event.target.getAttribute("data-tab") === "2") {
        $DATA_TAB_1.removeClass('activeTab')
        $DATA_TAB_2.addClass('activeTab')
        $SIX_DAY_FORECAST_CONTAINER.toggleClass("showTab")
        $SIX_DAY_FORECAST_CONTAINER.toggleClass("hiddenTab")
        $HOURLY_FORECAST_CONTAINER.toggleClass("hiddenTab")
        $HOURLY_FORECAST_CONTAINER.toggleClass("showTab")
    }
}

$("#tabs").on("click", switchTabs.bind())

$GEOCODER.on("keydown", geocode.bind());




const setTime = utc => {
    return new Intl.DateTimeFormat(navigator.language, {
        hour: "numeric",
        minute: "numeric"
    }).format(new Date(utc * 1000))
}
const convertTime24Hour = utcTIme => {
    return new Date(utcTIme * 1000).toLocaleTimeString(navigator.language, {hour12: false})
}
const setDate = utc => {
    return new Date(utc * 1000).toLocaleDateString(navigator.language)
}
const setBodyBackground = dt => {
    let currentTime = convertTime24Hour(dt)
    if (parseInt(currentTime.slice(0, 2)) > 7 && parseInt(currentTime.slice(0, 2)) < 18) {
        return 'clear-day'
    } else {
        return 'nightTime'
    }
}

const setIcon = icon => {
    if (icon === '01n') {
        return `clearNight`
    } else if (icon === '02n') {
        return 'partlyCloudyNight'
    } else if (icon === '02d') {
        return 'partlyCloudyDay'
    } else if (icon === '03n') {
        return 'scatteredCloudsNight'
    } else if (icon === '03d') {
        return 'scatteredCloudsDay'
    } else if (icon === '04n') {
        return 'brokenCloudsNight'
    } else if (icon === '04d') {
        return 'brokenCloudsDay'
    } else if (icon === '09n' || icon === '09d' || icon === '10n' || icon === '10d'){
        return 'rain'
    } else if (icon === '11n' || icon === '11d') {
        return 'stormy'
    } else if (icon === '13n' || icon === 13n) {
        return 'snow'
    } else {
        return 'clearDay'
    }
}

const setCardBackground = icon => {
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

const setCapitalization = str => {
    return str.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
}


const findWindDirection = deg => {
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

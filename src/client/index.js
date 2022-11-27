// Import Styles
import 'normalize.css';
import './styles/styles.scss';

// Import function from app.js
import { getTripInfo, tripData } from './js/app';

// Import Date Input Polyfill
import 'date-input-polyfill';

// Import luxon for date manipulation
import { DateTime as dt } from 'luxon';

const tripDepartDateElement = document.getElementById('tripDepartDate');
const tripReturnDateElement = document.getElementById('tripReturnDate');

document.addEventListener('DOMContentLoaded', () => {
    // Set the minimum date for tripDepartDateElement
    tripDepartDateElement.setAttribute('min', dt.now().toFormat('yyyy-MM-dd'));
});

tripDepartDateElement.addEventListener('change', (e) => {
    // Set the minimum date for tripReturnDateElement plus one day of the tripDepartDateElement
    tripReturnDateElement.setAttribute(
        'min',
        dt.fromISO(e.target.value).plus({ days: 1 }).toFormat('yyyy-MM-dd')
    );
});

// Get the tripForm element
const tripForm = document.getElementById('tripForm');

// Add Event Listener to tripForm to run getTripInfo function
tripForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Get Trip Destination Element & Value
    const tripDestinationElement = document.getElementById('tripDestination');
    const tripDestination = tripDestinationElement.value;
    let tripWeatherImage = await getTripInfo(tripDestination);

    // Get Depart Date Value
    const tripDepartDate = tripDepartDateElement.value;

    // Get Return Date Value
    const tripReturnDate = tripReturnDateElement.value;

    tripData.destination = tripDestination;
    tripData.departDate = tripDepartDate;
    tripData.returnDate = tripReturnDate;
    tripData.weatherData = tripWeatherImage.weatherData;
    tripData.destinationImage = tripWeatherImage.image.replace('_640', '_340');

    showResults(tripData);
});

// Show Results
function showResults(tripData) {
    // Hide Trip Form
    tripForm.dataset.show = 'false';

    // Get Trip Results Element
    const tripResults = document.getElementById('results');

    // Show Trip Results
    tripResults.dataset.show = 'true';

    // Display Trip Destination Image
    const resultsImg = document.querySelector('img.resultsImg');

    if (tripData.destinationImage) {
        resultsImg.setAttribute('src', tripData.destinationImage);
    } else {
        resultsImg.setAttribute('src', './img/question_mark.jpg');
    }

    // Set Trip Destination
    const resultsDestination = document.querySelector('.resultsDestination h2');
    resultsDestination.innerHTML = tripData.destination;

    // If no results, show Destination Not Found & hide travel details
    if (tripData.weatherData.length === 0) {
        resultsDestination.innerHTML = 'Destination Not Found';
        document.querySelector('.travelDetails').dataset.show = 'false';
    }

    // Display Trip Date Info
    const resultsDepartDate = document.querySelector(
        '#results .resultsDepartDate'
    );

    const resultsReturnDate = document.querySelector(
        '#results .resultsReturnDate'
    );

    const resultsDuration = document.querySelector('#results .resultsDuration');

    resultsDepartDate.innerHTML = dt
        .fromISO(tripData.departDate)
        .toFormat('DDD');

    resultsReturnDate.innerHTML = dt
        .fromISO(tripData.returnDate)
        .toFormat('DDD');

    resultsDuration.innerHTML = `${
        dt
            .fromISO(tripData.departDate)
            .diff(dt.fromISO(tripData.returnDate), 'days')
            .toObject().days * -1
    } days`;

    // Display Trip Weather Info
    let forecastHeading = '';
    const weatherDetailsUl = document.querySelector('.weatherDetails ul');

    // Check if trip is in 7 days, 16 days, or beyond
    if (
        dt.fromISO(tripData.departDate).diff(dt.now(), 'days').toObject()
            .days <= 7
    ) {
        forecastHeading = `Weather Forecast`;
    } else if (
        dt.fromISO(tripData.departDate).diff(dt.now(), 'days').toObject()
            .days <= 16
    ) {
        forecastHeading = `Predicted Forecast`;
    } else {
        forecastHeading = 'Weather is Unavailable';
        weatherDetailsUl.dataset.show = 'false';
    }

    // If weatherData is empty, hide weatherDetailsUl
    if (tripData.weatherData.length === 0) {
        forecastHeading = 'Weather is Unavailable';
        weatherDetailsUl.dataset.show = 'false';
    }

    const weatherDetailsHeading = document.querySelector('.weatherDetails h3');
    weatherDetailsHeading.innerHTML = forecastHeading;

    tripData.weatherData.find((day) => {
        if (day.valid_date == tripData.departDate) {
            let dayWeather = {
                date: dt.fromISO(day.valid_date).toLocaleString(dt.DATE_HUGE),
                tempHi: day.max_temp,
                tempLo: day.min_temp,
                rainChance: day.pop,
                conditions: day.weather.description,
            };

            const weatherDetailsDate =
                document.querySelector('.weatherDetails p');
            const weatherHi = document.querySelector('.resultsHi');
            const weatherLo = document.querySelector('.resultsLo');
            const weatherRainChance =
                document.querySelector('.resultsRainChance');
            const weatherConditions =
                document.querySelector('.resultsConditions');

            weatherDetailsDate.innerHTML = dayWeather.date;
            weatherHi.innerHTML = `${dayWeather.tempHi}°F`;
            weatherLo.innerHTML = `${dayWeather.tempLo}°F`;
            weatherRainChance.innerHTML = `${dayWeather.rainChance}%`;
            weatherConditions.innerHTML = dayWeather.conditions;
        }
    });
}

//

// Register Service Worker
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/service-worker.js');
    });
}

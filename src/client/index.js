// Import Styles
import 'normalize.css';
import './styles/styles.scss';

// Import function from app.js
import { getTripInfo, tripData } from './js/app';

// Get the tripForm element
const tripForm = document.getElementById('tripForm');

// Add Event Listener to tripForm to run getTripInfo function
tripForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    console.log(`Trip Data Before: ${JSON.stringify(tripData)}`);

    // Get Trip Destination Element & Value
    const tripDestinationElement = document.getElementById('tripDestination');
    const tripDestination = tripDestinationElement.value;
    let tripWeatherImage = await getTripInfo(tripDestination);

    // Get Depart Date Element & Value
    const tripDepartDateElement = document.getElementById('tripDepartDate');
    const tripDepartDate = tripDepartDateElement.value;

    // Get Return Date Element & Value
    const tripReturnDateElement = document.getElementById('tripReturnDate');
    const tripReturnDate = tripReturnDateElement.value;

    tripData.destination = tripDestination;
    tripData.departDate = tripDepartDate;
    tripData.returnDate = tripReturnDate;
    tripData.weatherData = tripWeatherImage.weatherData;
    tripData.destinationImage = tripWeatherImage.image;
    console.log(`Trip Data After: ${JSON.stringify(tripData)}`);
});

// Register Service Worker
// if ('serviceWorker' in navigator) {
//   window.addEventListener('load', () => {
//       navigator.serviceWorker.register('/service-worker.js');
//   });
// }

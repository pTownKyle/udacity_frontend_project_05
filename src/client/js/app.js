// Primary Object with placeholder values
let tripData = {
    destination: '',
    departDate: '',
    returnDate: '',
    weatherData: [],
    destinationImage: '',
};

// test function
function getTripInfo(tripDestination) {
    // Send Data to Server
    return (
        fetch('/trip', {
            method: 'POST',
            redirect: 'follow',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                tripDestination,
            }),
        })
            // Get Response from Server
            .then((res) => res.json())
            .then((data) => data)
            .catch((err) => {
                console.log(err);
            })
    );
}

// Update UI with Trip Data
function updateUI(tripData) {}

// Export Function
export { getTripInfo, tripData };

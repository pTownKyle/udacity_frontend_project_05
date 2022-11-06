const tripForm = document.getElementById('tripForm');

tripForm.addEventListener('submit', (e) => {
    e.preventDefault();

    // Get Location Element
    const travelLocationElement = document.getElementById('travelLocation');
    const travelLocation = travelLocationElement.value;
    fetch('/trip', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ travelLocation }),
    }).then((res) => {
        let data = res.json();
        console.log(data);
    });
});

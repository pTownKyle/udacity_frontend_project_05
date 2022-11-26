// Require
const { tripData } = require('../client/js/app');

// Test if TripData object exists
test('TripData object should exist', () => {
    expect(tripData).toBeDefined();
});

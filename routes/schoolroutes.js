const express = require('express');
const router = express.Router();
const School = require('../models/school');

function calculateDistance(lat1, lon1, lat2, lon2) {
    const toRad = (value) => (value * Math.PI) / 180;
    const R = 6371;
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
}

router.post('/addSchool', async (req, res) => {
    const { name, address, latitude, longitude } = req.body;

    const latitudeNum = parseFloat(latitude);
    const longitudeNum = parseFloat(longitude);
    if (!name || !address || isNaN(latitudeNum) || isNaN(longitudeNum)) {
        return res.status(400).json({ error: 'Invalid input' });
    }

    try {
        const school = new School({ name, address, latitude: latitudeNum, longitude: longitudeNum });
        await school.save();
        res.status(201).json({ message: 'School added successfully', school });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get('/listSchools', async (req, res) => {
    const { latitude, longitude } = req.query;

    const userLat = parseFloat(latitude);
    const userLon = parseFloat(longitude);

    if (isNaN(userLat) || isNaN(userLon)) {
        return res.status(400).json({ error: 'Latitude and Longitude must be valid numbers' });
    }

    try {
        const schools = await School.find();

        const sortedSchools = schools.map(school => ({
            id: school._id,
            name: school.name,
            address: school.address,
            latitude: school.latitude,
            longitude: school.longitude,
            distance: calculateDistance(userLat, userLon, school.latitude, school.longitude),
        })).sort((a, b) => a.distance - b.distance);

        res.json({ schools: sortedSchools });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;

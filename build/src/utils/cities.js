"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCities = void 0;
const arr = [
    'Karachi',
    'Lahore',
    'Faisalabad',
    'Rawalpindi',
    'Islamabad',
    'Multan',
    'Hyderabad',
    'Quetta',
    'Peshawar',
    'Gujranwala',
    'Sialkot',
    'Bahawalpur',
    'Sargodha',
    'Sukkur',
    'Larkana',
    'Sheikhupura',
    'Mirpur Khas',
    'Rahim Yar Khan',
    'Gujrat',
    'Jhang',
    'Mardan',
    'Kasur',
    'Dera Ghazi Khan',
    'Sahiwal',
    'Nawabshah',
    'Mingora',
    'Okara',
    'Mirpur',
    'Chiniot',
    'Kamoke',
    'Mandi Bahauddin',
    'Jacobabad',
    'Jhelum',
    'Khanewal',
    'Khairpur',
    'Khuzdar',
    'Pakpattan',
    'Hub',
    'Hafizabad',
    'Kohat',
    'Lodhran',
    'Malakand',
    'Mianwali',
    'Muzaffargarh',
    'Khanpur',
    'Gojra',
    'Mandi',
    'Daska',
    'Tando Allahyar',
];
const getCities = (req, res) => {
    // get the starting string from the query parameters
    const startsWith = req.query.startsWith;
    if (startsWith) {
        const cities = arr.filter((city) => city.startsWith(startsWith.toString()));
        if (cities.length === 0) {
            res.status(404).json({ error: 'no city found' });
        }
        res.status(200).json(cities);
    }
    else {
        res.status(400).json({ error: 'missing city text' });
    }
    // Check if the startsWith parameter is missing
};
exports.getCities = getCities;

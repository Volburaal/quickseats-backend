let long = -1;
let lat = -1;
let locationResetTimer = null;

export const getLocation = async (req, res) => {
    try {
        console.log(long,lat)
        return res.status(200).json({ long, lat });
    } catch (error) {
        console.error('Error Getting Location:', error);
        return res.status(500).json({ message: 'Server error' });
    }
};
    
export const setLocation = async (req, res) => {
    try {
        const { shuttleLocation } = req.body;
        console.log(shuttleLocation)
        if (locationResetTimer) {
            clearTimeout(locationResetTimer);
        }

        long = shuttleLocation.lng;
        lat = shuttleLocation.lat;
        console.log(long,lat)
        locationResetTimer = setTimeout(() => {
            long = -1;
            lat = -1;
        }, 180000);

        return res.status(200).json({ long, lat });
    } catch (error) {
        console.error('Error Setting Location:', error);
        return res.status(500).json({ message: 'Server error' });
    }
};

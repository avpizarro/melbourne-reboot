// Use dotenv to access the environmental variables
require('dotenv').config();

const express = require('express');

const router = express.Router();

// Get route to get the weather forecast for today from accuweather
router.get('/weather', async (req, res) =>
{
    try
    {
        const response = await fetch(
            `http://dataservice.accuweather.com/forecasts/v1/daily/1day/${process.env.WEATHER_LOCATION_KEY}?apikey=${process.env.WEATHER_API_KEY}&language=en-us&details=false&metric=true`);
        const data = await response.json();
        res.json(data);
    } catch (error)
    {
        console.error(error);
        res.status(500).json({ error: 'Something went wrong getting the weather info' });
    }
}
);

// Get route to get the places_ID of the places returned with the users params
router.get('/googleplace/:types/:location/:radius', async (req, res) =>
{
    try 
    {
        const response = await fetch(
            `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${req.params.types}%2Bin%2B${req.params.location}&radius=${req.params.radius}&key=${process.env.GOOGLE_API_KEY}`
        )
        const data = await response.json();
        res.json(data)
    } catch (error)
    {
        console.error(error);
        res.status(500).json({ error: 'Something went wrong with the google places api' });
    }
})

router.get('/placedetail/:id', async (req, res) =>
{
    try
    {
        const response = await fetch(`https://maps.googleapis.com/maps/api/place/details/json?place_id=${req.params.id}&fields=photos,name,opening_hours,formatted_address,rating,url&key=${process.env.GOOGLE_API_KEY}`,
        )
        const data = await response.json();
        res.json(data);
    } catch (error)
    {
        console.error(error);
        res.status(500).json({ error: 'Something went wrong getting the places details' })
    }
})

router.get('/placephotos/:reference', async (req, res) =>
{
    try
    {
        const response = await fetch(`https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&key=${process.env.GOOGLE_API_KEY}&photoreference=${req.params.reference}`,
        )
        const url = response.url
        // console.log("response: ", url)
        res.json({ url })
    }
    catch (error)
    {
        console.error(error);
        res.status(500).json({ error: 'Something went wrong getting the place photo' })
    }
})


module.exports = router;
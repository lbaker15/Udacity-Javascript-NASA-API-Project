require('dotenv').config()
const express = require('express')
const bodyParser = require('body-parser')
const fetch = require('node-fetch')
const path = require('path')

const app = express()
const port = 3000

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.use('/', express.static(path.join(__dirname, '../public')))

//Earth date is set to max date for each rover
app.get('/rover/:roverName', async (req, res) => {
    try {
        let name = req.params['roverName']
		if (name == "Curiosity") {
		//Returns yesterdays date				
		let today = new Date()
		let date = new Date(today);
		date.setDate(date.getDate() - 1)
		let earth_dat = date.toISOString().substring(0, 10)
		let earth_date = earth_dat;

        let data = await fetch(`https://api.nasa.gov/mars-photos/api/v1/rovers/${name}/photos?earth_date=${earth_date}&api_key=${process.env.API_KEY}`)
            .then(res => res.json());
        res.send({ data });
		}
		if (name == "Spirit") {
			let earth_date = "earth_date=2010-03-21";
		
        let data = await fetch(`https://api.nasa.gov/mars-photos/api/v1/rovers/${name}/photos?${earth_date}&api_key=${process.env.API_KEY}`)
            .then(res => res.json());
        res.send({ data });
		}
		if (name == "Opportunity") {
			let earth_date = "earth_date=2018-06-11";
		
        let data = await fetch(`https://api.nasa.gov/mars-photos/api/v1/rovers/${name}/photos?${earth_date}&api_key=${process.env.API_KEY}`)
            .then(res => res.json());
        res.send({ data });
		}
    } catch (err) {
        console.log('error:', err);
    }
})

app.get('/apod', async (req, res) => {
    try {
        let image = await fetch(`https://api.nasa.gov/planetary/apod?api_key=${process.env.API_KEY}`)
            .then(res => res.json())
        res.send({ image })
    } catch (err) {
        console.log('error:', err);
    }
})

app.listen(port, () => console.log(`Example app listening on port ${port}!`))
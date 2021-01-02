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
		let earth_date = date.toISOString().substring(0, 10)
		console.log(earth_date)

        let data = await fetch(`https://api.nasa.gov/mars-photos/api/v1/rovers/${name}/photos?earth_date=${earth_date}&api_key=${process.env.API_KEY}`)
            .then(res => res.json())
			.then(data => {
				if (data.photos.length === 0) {
					fetch(`https://api.nasa.gov/mars-photos/api/v1/rovers/${name}/photos?sol=2000&api_key=${process.env.API_KEY}`)
					.then(res => res.json())
					.then(data => res.send({ data }))
				} else {
					res.send({ data })
				}
			})
			
		}
		if (name == "Spirit") {
			let earth_date = "earth_date=2010-03-21";
		
        fetch(`https://api.nasa.gov/mars-photos/api/v1/rovers/${name}/photos?${earth_date}&api_key=${process.env.API_KEY}`)
            .then(res => res.json())
			.then(data => res.send({ data }));
		}
		if (name == "Opportunity") {
			let earth_date = "earth_date=2018-06-11";
		
        fetch(`https://api.nasa.gov/mars-photos/api/v1/rovers/${name}/photos?${earth_date}&api_key=${process.env.API_KEY}`)
            .then(res => res.json())
			.then(data => res.send({ data }));
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
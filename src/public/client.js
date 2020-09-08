let store = Immutable.Map({ 
    user: Immutable.Map({ name: "Lael" }),
	rover: '',
    apod: '',
	roverName: ['Curiosity', 'Opportunity', 'Spirit'],
	chosenRover: '',
	dataLink: ['a.jpg', 'b.jpg', 'c.jpg', 'd.jpg', 'e.jpg', 'f.jpg'],
	dataDate: []
})

// add our markup to the page
const root = document.getElementById('root')

const updateStore = (state, newState) => {
    store = state.merge(newState)
    render(root, store)
}

const render = async (root, state) => {
    root.innerHTML = App(state)
}

// listening for load event because page should load before any JS is called
window.addEventListener('load', () => {
    render(root, store)
})

// create content
const App = (state) => {
    let { rover, apod } = state

    return `
        <header></header>
        <main>
            ${Greeting(store.get("user").get("name"))}
            <section class="one">
                <h3>Put things on the page!</h3>
                <p>
                    One of the most popular websites at NASA is the Astronomy Picture of the Day. In fact, this website is one of
                    the most popular websites across all federal agencies. It has the popular appeal of a Justin Bieber video.
                    This endpoint structures the APOD imagery and associated metadata so that it can be repurposed for other
                    applications. In addition, if the concept_tags parameter is set to True, then keywords derived from the image
                    explanation are returned. These keywords could be used as auto-generated hashtags for twitter or instagram feeds;
                    but generally help with discoverability of relevant imagery.
                </p>
               
				
				${buttons(store.roverName)}
				
				${printDate(store.dataDate)}
				
				${printImages(store.get("dataLink"))}
				
				
            </section>
        </main>
        <footer></footer>
    `
}
//${printImages(store.get("dataLink"))}

// ------------------------------------------------------  COMPONENTS

// Pure function that renders conditional information -- THIS IS JUST AN EXAMPLE, you can delete it.

const buttons = (roverName) => {
	return `
	<ul class="listStyle">
	
	${store
	.get("roverName")
	.map(x => btnPass(x))
	.join(" ")}
	
	</ul>
	`
}

function btnPass(roverName) {
	return `
	
	<button class="btnStyle" onclick="updateBtn('${String(roverName)}')">
	${roverName}
	</button>
	
	`
}

const updateBtn = (roverName) => {
//console.log(roverName)
const newState = store.set("chosenRover", roverName)
updateStore(store, newState)
mars(roverName)
}

const mars = (roverName) => {
	marsTwo(roverName)
}

const marsTwo = (state) => {
	let { roverName } = state
	
	fetch(`http://localhost:3000/rover/${state}`)
        .then(res => res.json())
        .then(data => {
			let a = data.data.photos
			//console.log(a)
			let b = a.reduce(function(prev, current) {
				return (prev.earth_date > current.earth_date) ? prev.earth_date : current.earth_date
			})
			//console.log(b)
			let c = a.filter(x => {
				return x.earth_date.includes(b)
			})
			let dataLinkA = c.filter(function(x, i) {
				if (i < 6) {
					return x
				}
			})
			//console.log(dataLinkA)
			let dataLink = dataLinkA.map(x => x.img_src)
			let dataDate = b
			
			updateStore(store, { dataDate })
			updateStore(store, { dataLink })
			printImages(dataLink, dataDate)
		})
		

/*
			let dataLinkA = data.data.photos
			let dataLinkB = dataLinkA.map(function(x, i) {
			  if (i < 10) {
				return x.img_src
			  } else {
				 return ''
			  }
			})
			let dataLink = dataLinkB.filter(x => x !== '')
			updateStore(store, { dataLink })
			printImages(dataLink)
		
		})
*/
	
}

const printImages = (dataLink) => {
	let a = dataLink
	let b = Array.from(a)
	return `
	<section class="imgSection">
	
	<img class="imgStyle" src="${b[0]}">
	<img class="imgStyle" src="${b[1]}">
	<img class="imgStyle" src="${b[2]}">
	<img class="imgStyle" src="${b[3]}">
	<img class="imgStyle" src="${b[4]}">
	<img class="imgStyle" src="${b[5]}">
	
	</section>
	`
}

//Conditionals
const printDate = () => {
	let dataDate = store.get("dataDate")
	console.log(dataDate.length == 0)
	if (dataDate.length !== 0) {
	return `	
	<div class="dateStyle">Taken on the ${dataDate} </div>
	`
	} else {
		return ``
	}
}
const Greeting = (name) => {
    if (name) {
        return `
            <h1>Welcome, ${name}!</h1>
        `
    }
    return `
        <h1>Hello!</h1>
    `
}


/*
// Example API call
const getImageOfTheDay = (state) => {
    let { apod } = state

    fetch(`http://localhost:3000/apod`)
        .then(res => res.json())
        .then(apod => updateStore(store, { apod }))

    //return data
}
*/

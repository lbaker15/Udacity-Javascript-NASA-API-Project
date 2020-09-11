let store = Immutable.Map({ 
    user: Immutable.Map({ name: "Lael" }),
    apod: '',
	roverName: ['Curiosity', 'Opportunity', 'Spirit'],
	chosenRover: '',
	data: [],
	dataLink: [],
	dataDate: [],
	landing: '',
	status: '',
	launch: '',
	camera: '',
	sol: ''
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
	<div class="fullCover">
	 ${processImageOfTheDay(store.get("apod"))}
	 </div>		   
        <header>
				${Greeting(store.get("user").get("name"))}
				<h2>Select a rover</h2>
				<div class="center">
		   		${buttons(store.roverName)}
				</div>
				<div class="center">
				${addTwo(createFull)}
				</div>
		</header>
		
        <main>
			
		</div>		

            <section class="one">

				${printImages(store.get("dataLink"), store.get("camera"), store.get("sol"))}
							
            </section>
        </main>
		</div>
     `
}

// ------------------------------------------------------  COMPONENTS
const addTwo = (callback) => {
	return callback(store.get("launch"), store.get("landing"), store.get("status"))
}
const createFull = (launch, landing, status) => {
	return `
	<ul class="info">
	<li>Launch Date: ${launch}</li>
	<li>Landing Date: ${landing}</li>
	<li>Status: ${status}</li>
	</ul>
	`
}
const uiElement = (callback) => {
	return callback(store.get("dataLink"), store.get("camera"), store.get("sol"))
}
const ui = (dataDate, camera, sol) => {
	let cameraO = Array.from(camera)
	let solO = Array.from(sol)
	function myFunc(e, i){
		return `text ${e}`
		/*return `
		<span class="camera">Camera: ${e[i]} </span>
		<span class="sol">Sol: ${solO[i]} </span>
		`*/
	}
	return cameraO.forEach(myFunc)
	/*return `
	${printDate(store.dataDate)}
	<span class="camera">Camera: ${cameraO[0]} </span>
	<span class="sol">Sol: ${solO[0]} </span>
	`*/
}


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
	
	<span class="btnStyle" onclick="updateBtn('${String(roverName)}')">
	${roverName}
	</span>
	
	`
}

const updateBtn = (roverName) => {
	const newState = store.set("chosenRover", roverName)
	updateStore(store, newState)
	marsTwo(roverName)
}

const printImages = (dataLink) => {
	let a = dataLink
	let b = Array.from(a)
	if (dataLink.length !== 0) {
	return `
	<span class="head">Recent images</span>
	
	<section class="imgSection">
		
	<div class="imgGrid"><img class="imgStyle" src="${b[0]}"/></div>
	<span class="imgInfo">${uiElement(ui)}</span>
	
	<div class="imgGridTwo"><img class="imgStyle" src="${b[1]}"/></div>
	<span class="imgInfoTwo">${uiElement(ui)}</span>

	<div class="imgGridThree"><img class="imgStyle" src="${b[2]}"/></div>
	<span class="imgInfoThree">${uiElement(ui)}</span>
	
	<div class="imgGridFour"><img class="imgStyle" src="${b[3]}"></div>
	<span class="imgInfoFour">${uiElement(ui)}</span>
	
	<div class="imgGridFive"><img class="imgStyle" src="${b[4]}"></div>
	<span class="imgInfoFive">${uiElement(ui)}</span>
	
	<div class="imgGridSix"><img class="imgStyle" src="${b[5]}"></div>
	<span class="imgInfoSix">${uiElement(ui)}</span>
	
	</section>					
	`
	} else {
	return `  `
	}
}


//Conditionals
const printDate = () => {
	let dataDate = store.get("dataDate")
	if (dataDate.length !== 0) {
	return `	
	<span class="dateStyle">Taken on the ${dataDate} </span>
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
const processImageOfTheDay = (apod) => {
	if (apod == '') {
	getImageOfTheDay(apod)
	} else {
	let apodImg = Array.from(Array.from(apod)[0][1])
	let apodImgPrint = (apodImg.filter(function(x, i){
		return x[0] == 'url'
	})).flat()[1]
	return `
		<div class="bgImg" style="background-image: url(${apodImgPrint});">
	`
	}
}
const processData = (newState) => {
	let data = newState.get("data")
	
			//Getting most recent images with date
			let dataDate = data.reduce(function(prev, current) {
				return (prev.earth_date > current.earth_date) ? prev.earth_date : current.earth_date
			})
			let c = data.filter(x => {
				return x.earth_date.includes(dataDate)
			})
			let dataLinkA = c.filter(function(x, i) {
				if (i < 6) {
					return x
				}
			})
			let dataLink = dataLinkA.map(x => x.img_src)
						
			updateStore(store, { dataDate })
			updateStore(store, { dataLink })
			//printImages(dataLink, dataDate)
			
			//Pushing data of 6 items to store
			let roverInfo = dataLinkA
			updateStore(store, { roverInfo })
			//Camera data			
			let camera = roverInfo.map(x => x.camera).map(x => x.name)
			let sol = roverInfo.map(x => x.sol)
			//Info specific to rover
			let landing = roverInfo[0].rover.landing_date
			let status = roverInfo[0].rover.status
			let launch = roverInfo[0].rover.launch_date
			updateStore(store, { landing, status, launch, camera, sol })
			
		
}


// Example API call
const getImageOfTheDay = (state) => {
    let { apod } = state

    fetch(`http://localhost:3000/apod`)
        .then(res => res.json())
        .then(apod => updateStore(store, { apod }))
		
}

const marsTwo = (state) => {
	let { roverName } = state
	
	fetch(`http://localhost:3000/rover/${state}`)
        .then(res => res.json())
        .then(data => {
			let a = data.data.photos
			const newState = store.set("data", a)
			updateStore(store, newState)
			processData(newState)
		})
}



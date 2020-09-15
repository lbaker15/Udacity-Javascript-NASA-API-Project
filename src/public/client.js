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
	overlay: ''
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
    let { rover } = state

    return `
	
	<div class="fullCover">
	
	 ${processImageOfTheDay(store.get("apod"))}
	 
	 </div>		   
        <header>
				${Greeting(store.get("user").get("name"))}
				${apodBtn(store.get("apod"))}
				
				<h2>Select a rover</h2>
				<div class="mobileCenter">
		   		${buttons(store.roverName)}
				</div>
				${addTwo(createFull)}
				
		
		</div>		
		${oneSection()}
		</div>
		
		
     `
}

// ------------------------------------------------------  COMPONENTS
const addTwo = (callback) => {
	return callback(store.get("launch"), store.get("landing"), store.get("status"))
}
const createFull = (launch, landing, status) => {
	if (store.get("chosenRover") !== '') {
	return `
	<ul class="info">
	<li>Launch Date: ${launch}</li>
	<li>Landing Date: ${landing}</li>
	<li>Status: ${status}</li>
	</ul>
	`
	} else {
		return ` `
	}
}
const uiElement = (callback) => {
	return callback(store.get("dataLink"), store.get("camera"), store.get("dataDate"))
}
const ui = (dataLink, camera, dataDate) => {
	let b = Array.from(dataLink)
	let c = Array.from(dataDate)
	let cameraO = Array.from(camera)

	if (store.get("chosenRover") !== '' && camera.length !== 0 && store.get("overlay") == '') {
	return b.map(function(x, i) { 
	return `	
	<div class="imgGrid">
	<img class="imgStyle" src="${x}"/>
	<div class="color">
	<div class="infoG">
	Date: ${c[i]}<br>
	Camera: ${cameraO[i]}
	</div>
	</div>
	</div>
	`
	})
	
	} else {
	return `  `
	}
}
const oneSection = () => {
	if (store.get("chosenRover") !== '') {
	return `
		<section class="one">
			
			<span class="head">Recent Images</span>
							
			<section class="imgSection">
				
				${uiElement(ui)}
				
			</section>
							
        </section>
	`
	} else {
		return ``
	}
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



//Conditionals
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
	let apodMedia = (apodImg.filter(function(x, i){
		return x[0] == 'media_type'
	})).flat()[1]
	
	if (apodMedia == 'video') {
	let apodImgPrint = (apodImg.filter(function(x, i){
		return x[0] == 'url'
	})).flat()[1]
	return `
		<div class="bgImg" style="background-image: url(b.jpg);background-size: cover;">
	`
	
	} else if (apodMedia == 'image') {	
	
	let apodImgPrint = (apodImg.filter(function(x, i){
		return x[0] == 'url'
	})).flat()[1]
	return `
		<div class="bgImg" style="background-image: url(${apodImgPrint}); background-size: cover;">
	`
	} else {
		return ` `
	}
	}
}

const apodBtn = (apod) => {
	
	if(apod == '') {
	return ` 
		Loading...
		`
	} else {	
	let a = Array.from(apod)[0][1]
	let url = Array.from(a).filter(x => x[0] == 'hdurl')
	let media = Array.from(a).filter(x => x[0] == 'media_type')
	let info = Array.from(a).filter(x => x[0] == 'copyright' || x[0] == 'title')
		
	let overlay = store.get("overlay")
	if (overlay == 'open') {
	if (media[0][1] == 'image') {
		if (info.length == 1) {
			return `
				<div class="apodOverlay">
				
				<div class="close" onclick="closeApod()">X</div>
				<div class="apodInfo">
				<img class="apodImage" src="${url[0][1]}"/>
				</div>
				
				<div class="apodText">
				${(info[0][0]).toUpperCase()}: ${info[0][1]} 
				</div>
				
				</div>
			`
		} else {
			return `
				<div class="apodOverlay">
				
				<div class="close" onclick="closeApod()">X</div>
				<div class="apodInfo">
				<img class="apodImage" src="${url[0][1]}"/>
				</div>
				
				<div class="apodText">
				${(info[1][0]).toUpperCase()}: ${info[1][1]}
				${(info[0][0]).toUpperCase()}: ${info[0][1]} 
				</div>
				
				</div>
			`
		}
	} else if (media[0][1] == 'video') {
		return `
		<div class="apodOverlay">
		
		<div class="close" onclick="closeApod()">X</div>
		<div class="apodInfo">
		
		<iframe class="apodVideo" src="${url[0][1]}" 
		frameborder="0" allow="accelerometer; autoplay; encrypted-media; picture-in-picture" allowfullscreen>
		</iframe>
		
		</div>
		
		</div>
	`	
	} else {
		//console.log("apodBtn not image of video")
	}
	} else {	
	return `
		<div style="margin-left: 50px;" class="center">
		<div class="btnStyle" onclick="openApod()">Image of the day</div>
		</div>		
	`
	} 
}
}
const openApod = () => {
	const overlay = "open"
	const chosenRover = ""
	updateStore(store, { overlay, chosenRover })
}
const closeApod = () => {
	const newState = store.set("overlay", "")
	updateStore(store, newState)
}


const processData = (newState) => {
	let data = newState.get("data")
	
			let dataLinkA = data.filter(function(x, i) {
				if (i < 6) {
					return x
				}
			})
			let dataDate = dataLinkA.map(x => x.earth_date)
			let dataLink = dataLinkA.map(x => x.img_src)
						
			updateStore(store, { dataDate })
			updateStore(store, { dataLink })
			
			//Pushing data of 6 items to store
			let roverInfo = dataLinkA
			//console.log("rover info", roverInfo)
			updateStore(store, { roverInfo })
			//Camera data			
			let camera = roverInfo.map(x => x.camera).map(x => x.name)
			//Info specific to rover
			let landing = roverInfo[0].rover.landing_date
			let status = roverInfo[0].rover.status
			let launch = roverInfo[0].rover.launch_date
			updateStore(store, { landing, status, launch, camera })
			
		
}


// Example API call
const getImageOfTheDay = (state) => {
    let { apod } = state

    fetch(`http://localhost:3000/apod`)
        .then(res => res.json())
        .then(apod => {updateStore(store, { apod })
		//console.log("after apod been fetched")
		})
		
}

const marsTwo = (state) => {
	let { roverName } = state
	
	fetch(`http://localhost:3000/rover/${state}`)
        .then(res => res.json())
        .then(data => {
			//console.log(data)
			let a = data.data.photos
			const newState = store.set("data", a)
			updateStore(store, newState)
			processData(newState)
		})
}


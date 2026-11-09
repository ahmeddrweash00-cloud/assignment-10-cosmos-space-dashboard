let sidebar = document.getElementById("sidebar")
let sidebarToggle = document.getElementById("sidebar-toggle")
let toggleIcon = sidebarToggle.querySelector("i")

sidebarToggle.addEventListener("click", function () {
  sidebar.classList.toggle("sidebar-open")

  if (sidebar.classList.contains("sidebar-open")) {
    toggleIcon.classList.replace("fa-bars", "fa-times")
  } else {
    toggleIcon.classList.replace("fa-times", "fa-bars")
  }
})

document.addEventListener("click", function (e) {
  if (
    window.innerWidth < 1024 &&
    !sidebar.contains(e.target) && 
    !sidebarToggle.contains(e.target)
  ) {
    sidebar.classList.remove("sidebar-open")
    toggleIcon.classList.replace("fa-times", "fa-bars")
  }
})

let navLinks = document.querySelectorAll(".nav-link")
let appSections = document.querySelectorAll(".app-section")

for (let i = 0; i < navLinks.length; i++) {
  navLinks[i].addEventListener("click", function (e) {
    e.preventDefault()

    let sectionId = navLinks[i].getAttribute("data-section")

    for (let j = 0; j < appSections.length; j++) {
      appSections[j].classList.add("hidden")
    }

    let activeSection = document.getElementById(sectionId)

    if (activeSection) {
      activeSection.classList.remove("hidden")
    }

    for (let j = 0; j < navLinks.length; j++) {
      navLinks[j].classList.remove("bg-blue-500/10", "text-blue-400")
      navLinks[j].classList.add("text-slate-300")
    }

    navLinks[i].classList.remove("text-slate-300")
    navLinks[i].classList.add("bg-blue-500/10", "text-blue-400")

    if (window.innerWidth < 1024) {
      sidebar.classList.remove("sidebar-open")
      toggleIcon.classList.replace("fa-times", "fa-bars")
    }
  })
}

let planets = []

async function getPlanetsDetails() {
  let demo9 = document.getElementById("demo9")

  try {
    let response = await fetch("https://solar-system-opendata-proxy.vercel.app/api/planets")

    if (!response.ok) {
      throw new Error("API request failed")
    }

    let data = await response.json()
    planets = data.bodies

    if (!Array.isArray(planets) || planets.length === 0) {
      throw new Error("No planet data found")
    }

    let planetCards = document.querySelectorAll(".planet-card")

    for (let i = 0; i < planetCards.length; i++) {
      planetCards[i].addEventListener("click", function () {
        let planetId = planetCards[i].getAttribute("data-planet-id")

        let selectedPlanet = planets.find(function (planet) {
          return planet.englishName.toLowerCase() === planetId.toLowerCase()
        })

        if (selectedPlanet) {
          displayPlanet(selectedPlanet)
        }
      })
    }

    let earth = planets.find(function (planet) {
      return planet.englishName.toLowerCase() === "earth"
    })

    displayPlanet(earth || planets[0])

  } catch (error) {
    demo9.innerHTML = '<p class="text-red-400">Could not load planet data. Please try again later.</p>'
    console.log(error)
  }
}

function displayPlanet(planet) {
  let imageName = planet.englishName.toLowerCase()
  let moonCount = Array.isArray(planet.moons) ? planet.moons.length : 0
  let massValue = planet.mass ? planet.mass.massValue : "N/A"
  let massExponent = planet.mass ? planet.mass.massExponent : ""
  let volumeValue = planet.vol ? planet.vol.volValue : "N/A"
  let volumeExponent = planet.vol ? planet.vol.volExponent : ""
  let imagePath = "./assets/images/" + imageName + ".png"

  document.getElementById("demo9").innerHTML = `
    <div class="grid grid-cols-1 xl:grid-cols-3 gap-4 md:gap-6">
      <div class="xl:col-span-2 bg-slate-800/50 border border-slate-700 rounded-xl md:rounded-2xl p-4 md:p-6 lg:p-8">
        <div class="flex flex-col xl:flex-row xl:items-start gap-4">
          <div class="relative h-48 w-48 md:h-64 md:w-64 shrink-0 mx-auto">
            <img
              class="w-full h-full object-contain"
              src="${imagePath}"
              alt="${planet.englishName}"
              onerror="this.style.display='none'"
            />
          </div>

          <div class="flex-1">
            <h3 class="text-2xl md:text-3xl font-space font-bold mb-4">
              ${planet.englishName}
            </h3>

          
            <p class="text-sm text-slate-400">
               ${planet.description || "Known since antiquity"}
            </p>
          </div>
        </div>

        <div class="grid grid-cols-2 gap-2 md:gap-4 mt-6">
          <div class="bg-slate-900/50 rounded-lg p-3 md:p-4">
            <p class="text-xs text-slate-400 mb-1">Semimajor Axis</p>
            <p class="text-sm md:text-lg font-semibold">${planet.semimajorAxis ?? "N/A"} km</p>
          </div>

          <div class="bg-slate-900/50 rounded-lg p-3 md:p-4">
            <p class="text-xs text-slate-400 mb-1">Mean Radius</p>
            <p class="text-sm md:text-lg font-semibold">${planet.meanRadius ?? "N/A"} km</p>
          </div>

          <div class="bg-slate-900/50 rounded-lg p-3 md:p-4">
            <p class="text-xs text-slate-400 mb-1">Mass</p>
            <p class="text-sm md:text-lg font-semibold">${massValue} × 10^${massExponent} kg</p>
          </div>

          <div class="bg-slate-900/50 rounded-lg p-3 md:p-4">
            <p class="text-xs text-slate-400 mb-1">Density</p>
            <p class="text-sm md:text-lg font-semibold">${planet.density ?? "N/A"} g/cm³</p>
          </div>

          <div class="bg-slate-900/50 rounded-lg p-3 md:p-4">
            <p class="text-xs text-slate-400 mb-1">Orbital Period</p>
            <p class="text-sm md:text-lg font-semibold">${planet.sideralOrbit ?? "N/A"} days</p>
          </div>

          <div class="bg-slate-900/50 rounded-lg p-3 md:p-4">
            <p class="text-xs text-slate-400 mb-1">Rotation Period</p>
            <p class="text-sm md:text-lg font-semibold">${planet.sideralRotation ?? "N/A"} hours</p>
          </div>

          <div class="bg-slate-900/50 rounded-lg p-3 md:p-4">
            <p class="text-xs text-slate-400 mb-1">Moons</p>
            <p class="text-sm md:text-lg font-semibold">${moonCount}</p>
          </div>

          <div class="bg-slate-900/50 rounded-lg p-3 md:p-4">
            <p class="text-xs text-slate-400 mb-1">Gravity</p>
            <p class="text-sm md:text-lg font-semibold">${planet.gravity ?? "N/A"} m/s²</p>
          </div>
        </div>
      </div>

      <div class="space-y-4 md:space-y-6">
        <div class="bg-slate-800/50 border border-slate-700 rounded-2xl p-4 md:p-6">
          <h4 class="font-semibold mb-4 flex items-center">
            <i class="fas fa-user-astronaut text-purple-400 mr-2"></i>
            Discovery Info
          </h4>

          <div class="space-y-3 text-sm">
            <div class="flex justify-between gap-3 py-2 border-b border-slate-700">
              <span class="text-slate-400">Discovered By</span>
              <span class="font-semibold text-right">${planet.discoveredBy || "Known since antiquity"}</span>
            </div>

            <div class="flex justify-between gap-3 py-2 border-b border-slate-700">
              <span class="text-slate-400">Discovery Date</span>
              <span class="font-semibold">${planet.discoveryDate || "Ancient"}</span>
            </div>

            <div class="flex justify-between gap-3 py-2 border-b border-slate-700">
              <span class="text-slate-400">Body Type</span>
              <span class="font-semibold">${planet.bodyType || "Planet"}</span>
            </div>

            <div class="flex justify-between gap-3 py-2">
              <span class="text-slate-400">Volume</span>
              <span class="font-semibold text-right">${volumeValue} × 10^${volumeExponent} km³</span>
            </div>
          </div>
        </div>

        <div class="bg-slate-800/50 border border-slate-700 rounded-2xl p-4 md:p-6">
          <h4 class="font-semibold mb-4 flex items-center">
            <i class="fas fa-satellite text-blue-400 mr-2"></i>
            Orbital Characteristics
          </h4>

          <div class="space-y-3 text-sm">
            <div class="flex justify-between gap-3 py-2 border-b border-slate-700">
              <span class="text-slate-400">Perihelion</span>
              <span class="font-semibold">${planet.perihelion ?? "N/A"} km</span>
            </div>

            <div class="flex justify-between gap-3 py-2 border-b border-slate-700">
              <span class="text-slate-400">Aphelion</span>
              <span class="font-semibold">${planet.aphelion ?? "N/A"} km</span>
            </div>

            <div class="flex justify-between gap-3 py-2 border-b border-slate-700">
              <span class="text-slate-400">Eccentricity</span>
              <span class="font-semibold">${planet.eccentricity ?? "N/A"}</span>
            </div>

            <div class="flex justify-between gap-3 py-2 border-b border-slate-700">
              <span class="text-slate-400">Inclination</span>
              <span class="font-semibold">${planet.inclination ?? "N/A"}°</span>
            </div>

            <div class="flex justify-between gap-3 py-2 border-b border-slate-700">
              <span class="text-slate-400">Axial Tilt</span>
              <span class="font-semibold">${planet.axialTilt ?? "N/A"}°</span>
            </div>

            <div class="flex justify-between gap-3 py-2 border-b border-slate-700">
              <span class="text-slate-400">Average Temperature</span>
              <span class="font-semibold">${planet.avgTemp ?? "N/A"}°C</span>
            </div>

            <div class="flex justify-between gap-3 py-2">
              <span class="text-slate-400">Escape Velocity</span>
              <span class="font-semibold">${planet.escape ?? "N/A"} km/s</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
}

getPlanetsDetails()


let featuredLaunch = document.getElementById("featured-launch")
let launchesGrid = document.getElementById("launches-grid")

async function getLaunches() {
    try {
        let response = await fetch("https://ll.thespacedevs.com/2.3.0/launches/upcoming/?limit=10")

        if (!response) {
            throw new Error("Failed to fetch launches")
        }

        let data = await response.json()
        let launches = data.results
        console.log(launches)

        if (!launches || launches.length === 0) {
            featuredLaunch.innerHTML = "<p>No upcoming launches found</p>"
            launchesGrid.innerHTML = ""
            return
        }

        displayFeaturedLaunch(launches[0])
        displayLaunches(launches.slice(1))
    } catch (error) {
        featuredLaunch.innerHTML = "<p>Failed to load launch data</p>"
        launchesGrid.innerHTML = ""
        console.log(error.message)
    }
}

function displayFeaturedLaunch(launch) {
    let rocket = launch.name || "Unknown Rocket"
    let provider = launch.launch_service_provider?.name || "Unknown Provider"
    let mission = launch.mission?.description || "No mission description available"
    let location = launch.pad?.name || "Unknown Location"
    let country = launch.pad?.location?.country?.name || "Unknown Country"
    let date = launch.net ? new Date(launch.net) : null
    let image = launch.image || launch.infographic
    let status = launch.status?.name || "Unknown"
    let days = date ? Math.ceil((date - new Date()) / 86400000) : null

    featuredLaunch.innerHTML = `
        <div class="relative bg-slate-800/30 border border-slate-700 rounded-3xl overflow-hidden group hover:border-blue-500/50 transition-all">
            <div class="absolute inset-0 bg-linear-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>

            <div class="relative grid grid-cols-1 lg:grid-cols-2 gap-6 p-8">
                <div class="flex flex-col justify-between">
                    <div>
                        <div class="flex items-center gap-3 mb-4 flex-wrap">
                            <span class="px-4 py-1.5 bg-blue-500/20 text-blue-400 rounded-full text-sm font-semibold flex items-center gap-2">
                                <i class="fas fa-star"></i>
                                Featured Launch
                            </span>

                            <span class="px-4 py-1.5 bg-green-500/20 text-green-400 rounded-full text-sm font-semibold">
                                ${status}
                            </span>
                        </div>

                        <h3 class="text-3xl font-bold mb-3 leading-tight">
                            ${rocket}
                        </h3>

                        <div class="flex flex-col xl:flex-row xl:items-center gap-4 mb-6 text-slate-400">
                            <div class="flex items-center gap-2">
                                <i class="fas fa-building"></i>
                                <span>${provider}</span>
                            </div>

                            <div class="flex items-center gap-2">
                                <i class="fas fa-rocket"></i>
                                <span>${launch.rocket?.configuration?.name || "Unknown Rocket"}</span>
                            </div>
                        </div>

                        <div class="inline-flex items-center gap-3 px-6 py-3 bg-linear-to-r from-blue-500/20 to-purple-500/20 rounded-xl mb-6">
                            <i class="text-2xl text-blue-400 fas fa-clock"></i>
                            <div>
                                <p class="text-2xl font-bold text-blue-400">${days === null ? "N/A" : days}</p>
                                <p class="text-xs text-slate-400">Days Until Launch</p>
                            </div>
                        </div>

                        <div class="grid xl:grid-cols-2 gap-4 mb-6">
                            <div class="bg-slate-900/50 rounded-xl p-4">
                                <p class="text-xs text-slate-400 mb-1 flex items-center gap-2">
                                    <i class="fas fa-calendar"></i>
                                    Launch Date
                                </p>
                                <p class="font-semibold">${date ? date.toLocaleDateString("en-US", {
                                    year: "numeric",
                                    month: "long",
                                    day: "numeric",
                                    timeZone: "UTC"
                                }) : "Unknown"}</p>
                            </div>

                            <div class="bg-slate-900/50 rounded-xl p-4">
                                <p class="text-xs text-slate-400 mb-1 flex items-center gap-2">
                                    <i class="fas fa-clock"></i>
                                    Launch Time
                                </p>
                                <p class="font-semibold">${date ? date.toLocaleTimeString("en-GB", {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                    timeZone: "UTC"
                                }) + " UTC" : "Unknown"}</p>
                            </div>

                            <div class="bg-slate-900/50 rounded-xl p-4">
                                <p class="text-xs text-slate-400 mb-1 flex items-center gap-2">
                                    <i class="fas fa-map-marker-alt"></i>
                                    Location
                                </p>
                                <p class="font-semibold text-sm">${location}</p>
                            </div>

                            <div class="bg-slate-900/50 rounded-xl p-4">
                                <p class="text-xs text-slate-400 mb-1 flex items-center gap-2">
                                    <i class="fas fa-globe"></i>
                                    Country
                                </p>
                                <p class="font-semibold">${country}</p>
                            </div>
                        </div>

                        <p class="text-slate-300 leading-relaxed mb-6">
                            ${mission}
                        </p>
                    </div>

                    <div class="flex flex-col md:flex-row gap-3">
                        <button
                            class="flex-1 self-start md:self-center px-6 py-3 bg-blue-500 rounded-xl hover:bg-blue-600 transition-colors font-semibold flex items-center justify-center gap-2">
                            <i class="fas fa-info-circle"></i>
                            View Full Details
                        </لا>
                    </div>
                </div>

                <div class="relative">
                    <div class="relative h-full min-h-[400px] rounded-2xl overflow-hidden bg-slate-900/50">
                        <img
                            src="${image.image_url || ""}"
                            alt="${rocket}"
                            class="w-full h-full object-cover"
                            onerror="this.onerror=null; this.src='./assets/images/launch-placeholder.png';"
                        >
                        <div class="absolute inset-0 bg-linear-to-t from-slate-900 via-transparent to-transparent"></div>
                    </div>
                </div>
            </div>
        </div>
    `
}

function displayLaunches(launches) {
    launchesGrid.innerHTML = launches.map(launch => {
        let date = launch.net ? new Date(launch.net) : null
        let image = launch.image || launch.infographic
        let provider = launch.launch_service_provider?.name || "Unknown Provider"
        let rocket = launch.rocket?.configuration?.name || "Unknown Rocket"
        let location = launch.pad?.name || "Unknown Location"
        let status = launch.status?.name || "Unknown"

        return `
            <div class="bg-slate-800/50 border border-slate-700 rounded-2xl overflow-hidden hover:border-blue-500/30 transition-all group cursor-pointer">
                <div class="relative h-48 bg-slate-900/50 flex items-center justify-center overflow-hidden">
                    <img
                        src="${image.image_url || ""}"
                        alt="${launch.name || "Rocket launch"}"
                        class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        onerror="this.onerror=null; this.src='./assets/images/launch-placeholder.png';"
                    >

                    <div class="absolute top-3 right-3">
                        <span class="px-3 py-1 bg-green-500/90 text-white backdrop-blur-sm rounded-full text-xs font-semibold">
                            ${status}
                        </span>
                    </div>
                </div>

                <div class="p-5">
                    <div class="mb-3">
                        <h4 class="font-bold text-lg mb-2 line-clamp-2 group-hover:text-blue-400 transition-colors">
                            ${launch.name || "Unknown Launch"}
                        </h4>

                        <p class="text-sm text-slate-400 flex items-center gap-2">
                            <i class="fas fa-building text-xs"></i>
                            ${provider}
                        </p>
                    </div>

                    <div class="space-y-2 mb-4">
                        <div class="flex items-center gap-2 text-sm">
                            <i class="fas fa-calendar text-slate-500 w-4"></i>
                            <span class="text-slate-300">${date ? date.toLocaleDateString("en-US", {
                                month: "short",
                                day: "numeric",
                                year: "numeric",
                                timeZone: "UTC"
                            }) : "Unknown Date"}</span>
                        </div>

                        <div class="flex items-center gap-2 text-sm">
                            <i class="fas fa-clock text-slate-500 w-4"></i>
                            <span class="text-slate-300">${date ? date.toLocaleTimeString("en-GB", {
                                hour: "2-digit",
                                minute: "2-digit",
                                timeZone: "UTC"
                            }) + " UTC" : "Unknown Time"}</span>
                        </div>

                        <div class="flex items-center gap-2 text-sm">
                            <i class="fas fa-rocket text-slate-500 w-4"></i>
                            <span class="text-slate-300">${rocket}</span>
                        </div>

                        <div class="flex items-center gap-2 text-sm">
                            <i class="fas fa-map-marker-alt text-slate-500 w-4"></i>
                            <span class="text-slate-300 line-clamp-1">${location}</span>
                        </div>
                    </div>

                    <div class="flex items-center gap-2 pt-4 border-t border-slate-700">
                        <a href="${launch.url || "https://ll.thespacedevs.com/"}" target="_blank" rel="noopener noreferrer"
                            class="flex-1 px-4 py-2 bg-slate-700 rounded-lg hover:bg-slate-600 transition-colors text-sm font-semibold text-center">
                            Details
                        </a>

                        <button class="px-3 py-2 bg-slate-700 rounded-lg hover:bg-slate-600 transition-colors">
                            <i class="far fa-heart"></i>
                        </button>
                    </div>
                </div>
            </div>
        `
    }).join("")
}

getLaunches()




let apiKey = "iA7aeWUWEvBDAAzyJzI80PAI8U2gQmSOmwpC2dY5"

let dateInput = document.getElementById("apod-date-input")
let loadDateBtn = document.getElementById("load-date-btn")
let todayBtn = document.getElementById("today-apod-btn")

let apodDate = document.getElementById("apod-date")
let apodImage = document.getElementById("apod-image")
let apodTitle = document.getElementById("apod-title")
let apodDateDetail = document.getElementById("apod-date-detail")
let apodExplanation = document.getElementById("apod-explanation")
let apodCopyright = document.getElementById("apod-copyright")
let apodDateInfo = document.getElementById("apod-date-info")
let apodMediaType = document.getElementById("apod-media-type")
let apodLoading = document.getElementById("apod-loading")
let apodImageFallback = document.getElementById("apod-image-fallback")
let selectedDate = document.getElementById("apod-selected-date")

apodImage.addEventListener("error", function () {
    apodImage.classList.add("hidden")
    apodImageFallback.classList.remove("hidden")
})

let today = new Date().toLocaleDateString("en-CA")

dateInput.max = today
dateInput.value = today
selectedDate.textContent = today

async function getAPOD(date = today) {
    try {
        apodLoading.classList.remove("hidden")
        apodImageFallback.classList.add("hidden")
        apodImage.classList.add("hidden")

        let response = await fetch(
            `https://api.nasa.gov/planetary/apod?api_key=${apiKey}&date=${date}`
        )

        if (!response.ok) {
            throw new Error("Failed to fetch NASA APOD")
        }

        let data = await response.json()

        apodDate.textContent = `Astronomy Picture of the Day - ${data.date}`
        apodTitle.textContent = data.title
        apodDateDetail.innerHTML = `<i class="far fa-calendar mr-2"></i>${data.date}`
        apodExplanation.textContent = data.explanation
        apodCopyright.textContent = data.copyright
            ? `© ${data.copyright}`
            : "© NASA"
        apodDateInfo.textContent = data.date
        apodMediaType.textContent = data.media_type

        if (data.media_type === "image") {
            apodImage.src = data.url
            apodImage.alt = data.title
            apodImageFallback.classList.add("hidden")
            apodImage.classList.remove("hidden")
        } else {
            apodImageFallback.classList.remove("hidden")
        }

    } catch (error) {
        console.error(error)
        apodDate.textContent = "Astronomy Picture of the Day - Invalid Date"
        apodTitle.textContent = "Invalid Date"
        apodDateDetail.innerHTML = '<i class="far fa-calendar mr-2"></i>Invalid Date'
        apodExplanation.textContent = ""
        apodCopyright.textContent = "NASA APOD"
        apodDateInfo.textContent = "Invalid Date"
        apodMediaType.textContent = "Video"
        apodImageFallback.classList.remove("hidden")
    } finally {
        apodLoading.classList.add("hidden")
    }
}

loadDateBtn.addEventListener("click", function () {
    if (dateInput.value) {
        getAPOD(dateInput.value)
    }
})

dateInput.addEventListener("change", function () {
    selectedDate.textContent = dateInput.value
})

todayBtn.addEventListener("click", function () {
    dateInput.value = today
    selectedDate.textContent = today
})

getAPOD()

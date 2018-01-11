var key = "c7dc2200f66725961863fb901fd1e553";
var apiLink = "https://api.openweathermap.org/data/2.5/weather?";
var iconLink = "http://openweathermap.org/img/w/";
var currentWeatherObject = null;
var currentScreen = null;



// Weather class
var Weather = function() {
	this.weatherState = "10d";
	this.temperature = 0;
	this.location = "London";
	this.description = "none";
	this.humidity = 0;
	this.velocity = 0;
	this.direction = 0;
};

// Screen class
var Screen = function(doc) {
	this.doc = doc;
	this.currentUnits = "si-base-units";
	this.temperatureUnits = " C";
	this.velocityUnits = " m/s";
	this.temperatureId = doc.getElementById("temperature");
	this.temperatureUnitsId = doc.getElementById("temperature-units");
	this.locationId = doc.getElementById("location");
	this.iconId = doc.getElementById("icon");
	this.descriptionId = doc.getElementById("description");
	this.humidityId = doc.getElementById("humidity");
	this.velocityId = doc.getElementById("velocity");
	this.velocityUnitsId = doc.getElementById("velocity-units");
	this.directionId = doc.getElementById("direction");
};

window.onload = function() {
	currentScreen = new Screen(document);
	currentWeatherObject = new Weather();
	getWeather("Kyiv");
	updateScreen(currentScreen, currentWeatherObject);

	// add event listener to Reset button
	document.getElementById("base-units").addEventListener("click", function(event) {
		switchUnits(currentScreen, event.target.value);
	});
}

// utility functions
function getWeather(loc) {
	var url = apiLink + "q=" + loc + "&units=metric&APPID=" + key;
	var xmlhttp = new XMLHttpRequest();
	xmlhttp.open("GET", url, true);
	var messageShown = false;
	xmlhttp.onreadystatechange = function() {
		if (xmlhttp.status == 404 && !messageShown) {
			alert("City not found!")
			messageShown = true;
			return;
		}
		if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
			var data = JSON.parse(xmlhttp.responseText);
			var weatherObject = new Weather();
			weatherObject.weatherState = data.weather[0].icon;
			weatherObject.temperature = data.main.temp;
			weatherObject.location = data.name;
			weatherObject.description = data.weather[0].description;
			weatherObject.humidity = data.main.humidity;
			weatherObject.velocity = data.wind.speed;
			weatherObject.direction = data.wind.deg;
			updateScreen(currentScreen, weatherObject);
		}
	};
	xmlhttp.send();
};
function updateScreen(screen, weather) {
	screen.temperatureId.innerHTML = Math.round(weather.temperature);
	screen.temperatureUnitsId.innerHTML = screen.temperatureUnits;
	screen.locationId.innerHTML = weather.location;
	screen.iconId.src = iconLink + weather.weatherState + ".png";
	screen.descriptionId.innerHTML = weather.description;
	screen.humidityId.innerHTML = weather.humidity;
	screen.velocityId.innerHTML = Math.round(weather.velocity);
	screen.velocityUnitsId.innerHTML = screen.velocityUnits;
	screen.directionId.innerHTML = weather.direction;
};
function switchUnits(screen, units) {
	if (screen.currentUnits == units) return;
	if (units == "si-base-units") {
		screen.currentUnits = "si-base-units";
		screen.temperatureId.innerHTML = toCelsius(screen.temperatureId.innerHTML);
		screen.temperatureUnits = " C";
		screen.velocityId.innerHTML = toMs(screen.velocityId.innerHTML);
		screen.velocityUnits = " m/s";
	} else {
		screen.currentUnits = "us-customary-units";
		screen.temperatureId.innerHTML = toFahrenheit(screen.temperatureId.innerHTML);
		screen.temperatureUnits = " F";
		screen.velocityId.innerHTML = toMph(screen.velocityId.innerHTML);
		screen.velocityUnits = " mph";

	}
	// TODO: update screen
	screen.temperatureUnitsId.innerHTML = screen.temperatureUnits;
	screen.velocityUnitsId.innerHTML = screen.velocityUnits;
};
function toFahrenheit(value) {
	return Math.round(value * 1.8 + 32);
};
function toCelsius(value) {
	return Math.round((value - 32) / 1.8);
};
function toMph(value) {
	return Math.round(value * 2.25);
};
function toMs(value) {
	return Math.round(value / 2.25);
};

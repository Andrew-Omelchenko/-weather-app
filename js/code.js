var key = "c7dc2200f66725961863fb901fd1e553";
var apiLink = "https://api.openweathermap.org/data/2.5/weather?";


// Weather class
var Weather = function() {
	this.weatherState = "sn";
	this.temperature = 0;
	this.location = "London";
	this.humidity = 0;
	this.velocity = 0;
	this.direction = "N";
};
// public methods
Weather.prototype.get = function(loc) {
	this._updateData(loc);
};
// private methods
Weather.prototype._updateData = function(loc) {
	var url = apiLink + "q=" + loc + "&APPID=" + key;
	this._sendRequest(url);
};
Weather.prototype._sendRequest = function(url) {
	var xmlhttp = new XMLHttpRequest();
	xmlhttp.open("GET", url, true);
	xmlhttp.onreadystatechange = function() {
		if (xmlhttp.readystate === 4 && xmlhttp.status === 200) {
			console.log("Inside");
			var data = JSON.parse(xmlhttp.responseText);
			this.weatherState = data.weather[0].id;
			this.temperature = data.main.temp;
			this.location = data.name;
			this.humidity = data.main.humidity;
			this.velocity = data.wind.speed;
			this.direction = data.wind.deg;
		}
	};
	xmlhttp.send();
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
	this.humidityId = doc.getElementById("humidity");
	this.velocityId = doc.getElementById("velocity");
	this.velocityUnitsId = doc.getElementById("velocity-units");
	this.directionId = doc.getElementById("direction");
};
Screen.prototype.update = function(weather) {
	this.temperatureId.innerHTML = weather.temperature;
	this.temperatureUnitsId.innerHTML = this.temperatureUnits;
	this.locationId.innerHTML = weather.location;
//	this.iconId.src = baseUrl + imagePath + weather.weatherState + ".svg";
	this.humidityId.innerHTML = weather.humidity;
	this.velocityId.innerHTML = weather.velocity;
	this.velocityUnitsId.innerHTML = this.velocityUnits;
	this.directionId.innerHTML = weather.direction;
};
Screen.prototype.switchUnits = function(units) {
	if (this.currentUnits == units) return;
	if (units == "si-base-units") {
		this.currentUnits = "si-base-units";
		this.temperatureUnits = " C";
		this.velocityUnits = " m/s";
	} else {
		this.currentUnits = "us-customary-units";
		this.temperatureUnits = " F";
		this.velocityUnits = " mph";
	}
	// TODO: update screen
	this.temperatureUnitsId.innerHTML = this.temperatureUnits;
	this.velocityUnitsId.innerHTML = this.velocityUnits;
};

window.onload = function() {
	var screen = new Screen(document);
	var weather = new Weather();
	weather.get("Kyiv");
	screen.update(weather);

	// add event listener to Reset button
	document.getElementById("base-units").addEventListener("click", function(event) {
		screen.switchUnits(event.target.value);
	});
}
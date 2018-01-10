var baseUrl = "https://www.metaweather.com";
var imagePath = "/static/img/weather/";
var locationSearchQuery = "/api/location/search/?query=";
var locationSearchLattLong = "/api/location/search/?lattlong="
var requestByLocation = "/api/location/";

// Weather class
var Weather = function() {
	this.weatherState = "sn";
	this.temperature = 0;
	this.location = "Kiev";
	this.humidity = 0;
	this.velocity = 0;
	this.direction = "N";
	this.woeid = 924938;
};
// public methods
Weather.prototype.get = function(loc) {
	this._getWoeid(loc);
	this._updateData();
};
// private methods
Weather.prototype._getWoeid = function(locString) {
	var url = baseUrl + locationSearchQuery + locString;
	var xmlhttp = new XMLHttpRequest();
	xmlhttp.onreadystatechange = function() {
		if (xmlhttp.readystate == 4 && xmlhttp.status == 200) {
			var data = JSON.parse(xmlhttp.responseText);
			this.woeid = data.woeid;
		}
	};
	xmlhttp.open("GET", url, true);
	xmlhttp.send();
};
Weather.prototype._updateData = function() {
	var url = baseUrl + requestByLocation + this.woeid + "/";
	this._sendRequest(url);
};
Weather.prototype._sendRequest = function(url) {
	var xmlhttp = new XMLHttpRequest();
	xmlhttp.onreadystatechange = function() {
		if (xmlhttp.readystate == 4 && xmlhttp.status == 200) {
			var data = JSON.parse(xmlhttp.responseText);
			this.weatherState = data.consolidated_weather.weather_state_abbr;
			this.temperature = data.consolidated_weather.the_temp;
			this.location = data.title;
			this.humidity = data.consolidated_weather.humidity;
			this.velocity = data.consolidated_weather.wind_speed;
			this.direction = data.consolidated_weather.wind_direction_compass;
		}
	};
	xmlhttp.open("GET", url, true);
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
	this.iconId.src = baseUrl + imagePath + weather.weatherState + ".svg";
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
	weather.get("Kiev");
	screen.update(weather);

	// add event listener to Reset button
	document.getElementById("base-units").addEventListener("click", function(event) {
		screen.switchUnits(event.target.value);
	});
}
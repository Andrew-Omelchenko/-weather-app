// Weather class
var Weather = function() {
	this.temperature = 0;
	this.location = "Kyiv";
//	this.icon = ???;
	this.humidity = 0;
	this.velocity = 0;
	this.direction = "N";
};
Weather.prototype.get = function() {
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
//	this.iconId = doc.getElementById("icon");
	this.humidityId = doc.getElementById("humidity");
	this.velocityId = doc.getElementById("velocity");
	this.velocityUnitsId = doc.getElementById("velocity-units");
	this.directionId = doc.getElementById("direction");
};
Screen.prototype.update = function(weather) {
	this.temperatureId.innerHTML = weather.temperature;
	this.temperatureUnitsId.innerHTML = this.temperatureUnits;
	this.locationId.innerHTML = weather.location;
//	this.iconId.src = "img/" + weather.icon + ".png";
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
	screen.update(new Weather());

	// add event listener to Reset button
	document.getElementById("base-units").addEventListener("click", function(event) {
		screen.switchUnits(event.target.value);
	});
}
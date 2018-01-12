const key = "c7dc2200f66725961863fb901fd1e553";
const apiLink = "https://api.openweathermap.org/data/2.5/weather?";
const iconLink = "http://openweathermap.org/img/w/";
var currentWeatherObject = null;
var currentScreen = null;



// Weather class
var Weather = function() {
	this.weatherState = "10d";
	this.temperature = 0;
	this.tempMin = 0;
	this.tempMax = 0;
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
	this.temperatureUnits = "C";
	this.velocityUnits = "m/s";
	this.temperatureId = doc.getElementById("temperature");
	this.temperatureUnitsId = doc.getElementById("temperature-units");
	this.tempMinId = doc.getElementById("temp-min");
	this.tempMinUnitsId = doc.getElementById("temp-min-units");
	this.tempMaxId = doc.getElementById("temp-max");
	this.tempMaxUnitsId = doc.getElementById("temp-max-units");
	this.locationId = doc.getElementById("location");
	this.iconId = doc.getElementById("icon");
	this.descriptionId = doc.getElementById("description");
	this.humidityId = doc.getElementById("humidity");
	this.velocityId = doc.getElementById("velocity");
	this.velocityUnitsId = doc.getElementById("velocity-units");
	this.directionId = doc.getElementById("direction");
};
Screen.prototype.init = function() {
	var dataList = document.getElementById("list-of-cities");
	var opt = null;
	for (var i = 0; i < cities.length; i++) {
		opt = document.createElement("option");
		opt.value = cities[i];
		dataList.appendChild(opt);
	}
}

window.onload = function() {
	currentScreen = new Screen(document);
	currentScreen.init();
	currentWeatherObject = new Weather();
	getWeather("Kyiv");
	updateScreen(currentScreen, currentWeatherObject);

	// add event listener to Go button
	document.getElementById("go-button").addEventListener("click", function(event) {
		var loc = document.getElementById("loc-field").value;
		if (loc == "") return;
		getWeather(loc);
	});

	// add event listener to Clear button
	document.getElementById("clear-button").addEventListener("click", function(event) {
		var fld = document.getElementById("loc-field");
		fld.value = "";
	});

	// add event listener to select element
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
			weatherObject.tempMin = data.main.temp_min;
			weatherObject.tempMax = data.main.temp_max;
			weatherObject.location = data.name;
			weatherObject.description = data.weather[0].main;
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
	screen.tempMinId.innerHTML = Math.round(weather.tempMin);
	screen.tempMinUnitsId.innerHTML = screen.temperatureUnits;
	screen.tempMaxId.innerHTML = Math.round(weather.tempMax);
	screen.tempMaxUnitsId.innerHTML = screen.temperatureUnits;
	screen.locationId.innerHTML = weather.location;
	screen.iconId.src = iconLink + weather.weatherState + ".png";
	screen.descriptionId.innerHTML = weather.description;
	screen.humidityId.innerHTML = weather.humidity;
	screen.velocityId.innerHTML = Math.round(weather.velocity);
	screen.velocityUnitsId.innerHTML = screen.velocityUnits;
	screen.directionId.innerHTML = toVerbose(weather.direction);
	if (screen.currentUnits == "us-customary-units") {
		screen.temperatureId.innerHTML = toFahrenheit(screen.temperatureId.innerHTML);
		screen.tempMinId.innerHTML = toFahrenheit(screen.tempMinId.innerHTML);
		screen.tempMaxId.innerHTML = toFahrenheit(screen.tempMaxId.innerHTML);
		screen.velocityId.innerHTML = toMph(screen.velocityId.innerHTML);
	}
};
function switchUnits(screen, units) {
	if (screen.currentUnits == units) return;
	if (units == "si-base-units") {
		screen.currentUnits = "si-base-units";
		screen.temperatureId.innerHTML = toCelsius(screen.temperatureId.innerHTML);
		screen.tempMinId.innerHTML = toCelsius(screen.tempMinId.innerHTML);
		screen.tempMaxId.innerHTML = toCelsius(screen.tempMaxId.innerHTML);
		screen.temperatureUnits = "C";
		screen.velocityId.innerHTML = toMs(screen.velocityId.innerHTML);
		screen.velocityUnits = "m/s";
	} else {
		screen.currentUnits = "us-customary-units";
		screen.temperatureId.innerHTML = toFahrenheit(screen.temperatureId.innerHTML);
		screen.tempMinId.innerHTML = toFahrenheit(screen.tempMinId.innerHTML);
		screen.tempMaxId.innerHTML = toFahrenheit(screen.tempMaxId.innerHTML);
		screen.temperatureUnits = "F";
		screen.velocityId.innerHTML = toMph(screen.velocityId.innerHTML);
		screen.velocityUnits = "mph";

	}
	// TODO: update screen
	screen.temperatureUnitsId.innerHTML = screen.temperatureUnits;
	screen.tempMinUnitsId.innerHTML = screen.temperatureUnits;
	screen.tempMaxUnitsId.innerHTML = screen.temperatureUnits;
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
function toVerbose(value) {
	var slice = 360 / 8;
	var angle = value % 360;
	for (var i = 0; i < directions.length; i++) {
		if (angle >= slice * (i - 0.5) && angle <= slice * (i + 0.5)) {
			return directions[i];
		}
	}
	return "indeed?";
};

// List of verbose directions
const directions = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"];

// List of cities
const cities = [
	"Kyiv",
	"Alchevsk",
	"Antratsyt",
	"Artemivsk",
	"Berdiansk",
	"Berdychiv",
	"Bila Tserkva",
	"Bilhorod-Dnistrovskyi",
	"Boryslav",
	"Boryspil",
	"Brianka",
	"Brovary",
	"Cherkasy",
	"Chernihiv",
	"Chernivtsi",
	"Chervonohrad",
	"Dniprodzerzhynsk",
	"Dnipropetrovsk",
	"Donetsk",
	"Drohobych",
	"Druzhkivka",
	"Dubno",
	"Dymytrov",
	"Dzerzhynsk",
	"Dzhankoy",
	"Enerhodar",
	"Evpatoria",
	"Fastiv",
	"Feodosia",
	"Horlivka",
	"Illichivsk",
	"Inhulets",
	"Ivano-Frankivsk",
	"Izium",
	"Izmail",
	"Kakhovka",
	"Kalush",
	"Kamianets-Podilskyi",
	"Kerch",
	"Kharkiv",
	"Khartsyzk",
	"Kherson",
	"Khmelnytskyi",
	"Kirovohrad",
	"Kolomyia",
	"Komsomolsk",
	"Konotop",
	"Korosten",
	"Kostiantynivka",
	"Kotovsk",
	"Kovel",
	"Kramatorsk",
	"Krasnoarmiysk",
	"Krasnodon",
	"Krasnyi Luch",
	"Kremenchuk",
	"Kryvyi Rih",
	"Kuznetsovsk",
	"Lozova",
	"Lubny",
	"Luhansk",
	"Lutsk",
	"Lviv",
	"Lysychansk",
	"Makiivka",
	"Marhanets",
	"Mariupol",
	"Melitopol",
	"Mukachevo",
	"Mykolaiv",
	"Myrhorod",
	"Nikopol",
	"Nizhyn",
	"Nova Kakhovka",
	"Novohrad-Volynskyi",
	"Novomoskovsk",
	"Novovolynsk",
	"Odesa",
	"Okhtyrka",
	"Oleksandriia",
	"Ordzhonikidze",
	"Pavlohrad",
	"Pervomaisk",
	"Pervomaisk",
	"Poltava",
	"Pryluky",
	"Rivne",
	"Romny",
	"Rovenky",
	"Rubizhne",
	"Sambir",
	"Sevastopol",
	"Severodonetsk",
	"Shakhtarsk",
	"Shepetivka",
	"Shostka",
	"Simferopol",
	"Sloviansk",
	"Smila",
	"Snizhne",
	"Stakhanov",
	"Stryi",
	"Sumy",
	"Sverdlovsk",
	"Svitlovodsk",
	"Ternopil",
	"Tokmak",
	"Torez",
	"Uman",
	"Uzhhorod",
	"Vinnytsia",
	"Volodymyr-Volynskyi",
	"Voznesensk",
	"Yalta",
	"Yenakiieve",
	"Yuzhnoukrainsk",
	"Zaporizhzhya",
	"Zhmerynka",
	"Zhovti Vody",
	"Zhytomyr"
];
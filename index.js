var menubar = require('menubar');

var mb = menubar()

mb.on('ready', function ready () {
	console.log('app is ready');

	if (!process.env.WEATHER_TOKEN) {
		$('body').write('Please provide data for the following variables:');
	} else {
		$('body').write('Loading weather...');
		getWeather();
	}

	function getWeather() {
		var request = require('request');

		var options = {
			method: 'GET',
			url: 'http://api.openweathermap.org/data/2.5/weather',
			qs: {
				id: process.env.WEATHER_CITY,
				appid: process.env.WEATHER_TOKEN,
				units: 'imperial'
			},
			headers: {
				'Cache-Control': 'no-cache'
			}
		};

		request(options, function (error, response, body) {
		if (error) throw new Error(error);
		
		body = JSON.parse(body);

		var desc = body.weather[0].main;
		var temp = body.main.temp;

		document.write("<h1>" + desc + ' - ' + temp + "</h1>");
		});
	}
});
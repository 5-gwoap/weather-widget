const request = require('request');

function getWeather(callback) {
  const options = {
    method: 'GET',
    url: 'http://api.openweathermap.org/data/2.5/weather',
    qs: {
      id: '5342992',
      appid: process.env.WEATHER_TOKEN,
      units: 'imperial'
    },
    headers: {
      'Cache-Control': 'no-cache'
    }
  };

  request(options, (error, response, body) => {
    if (error) throw new Error(error);

    body = JSON.parse(body);

    const desc = body.weather[0].main;
    const temp = body.main.temp;
    const tooltip = desc + ' - ' + temp + ' ' + Date();

    // TODO: create node or element and write to client dom. OR Load another page displaying weather.
    callback(tooltip)
  });
}

module.exports = getWeather;

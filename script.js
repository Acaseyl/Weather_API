$(document).ready(function () {
  $("#cityWeather, #past-searches").on("click", function () {
    let clickEvent = $(event.target)[0];
    let location = "";
    if (clickEvent.id === "cityWeather") {
      location = $("#citySearched").val().trim().toUpperCase();
    } else if (clickEvent.className === "cityList") {
      location = clickEvent.innerText;
    }
    if (location == "") return;

    updateLocalStorage(location);

    getCurrentWeather(location);
  });

  function convertDate(UNIXtimestamp) {
    let convertedDate = "";
    let a = new Date(UNIXtimestamp * 1000);
    let months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    let year = a.getFullYear();
    let month = months[a.getMonth()];
    let date = a.getDate();
    convertedDate = month + " " + date + ", " + year;
    return convertedDate;
  }

  function updateLocalStorage(location) {
    let cityList = JSON.parse(localStorage.getItem("cityList")) || [];
    cityList.push(location);
    cityList.sort();

    for (let i = 1; i < cityList.length; i++) {
      if (cityList[i] === cityList[i - 1]) cityList.splice(i, 1);
    }

    localStorage.setItem("cityList", JSON.stringify(cityList));

    $("#citySearched").val("");
  }

  function getCurrentWeather(local) {
    let cityList = JSON.parse(localStorage.getItem("cityList")) || [];

    $("#past-searches").empty();

    cityList.forEach(function (city) {
      let searchHistory = $("<div>");
      searchHistory.addClass("cityList");
      searchHistory.attr("value", city);
      searchHistory.text(city);
      $("#past-searches").append(searchHistory);
    });

    $("#city-search").val("");

    if (typeof local === "object") {
      city = `lat=${local.latitude}&lon=${loc.longitude}`;
    } else {
      city = `q=${local}`;
    }

    var currentURL = "https://api.openweathermap.org/data/2.5/weather?";
    var cityName = city;
    var unitsURL = "&units=imperial";
    var apiIdURL = "&appid=";
    var apiKey = "1d93cb853b596e409d092698032889d7";
    var openCurrWeatherAPI =
      currentURL + cityName + unitsURL + apiIdURL + apiKey;

    $.ajax({
      url: openCurrWeatherAPI,
      method: "GET",
    }).then(function (response1) {
      weatherObject = {
        city: `${response1.name}`,
        wind: response1.wind.speed,
        humidity: response1.main.humidity,
        temp: Math.round(response1.main.temp),
        date: convertDate(response1.dt),
        desc: response1.weather[0].description,
      };

      $("#forecast").empty();
      $("#cityName").text(weatherObject.city + " (" + weatherObject.date + ")");
      $("#currentTemp").text("Temperature: " + weatherObject.temp + " " + "°F");
      $("#currentHumidity").text("Humidity: " + weatherObject.humidity + "%");
      $("#currentWind").text("Windspeed: " + weatherObject.wind + " MPH");

      $.ajax({
        url: openCurrWeatherAPI,
        method: "GET",
      }).then(function (response2) {
        var cityLon = response2.coord.lon;
        var cityLat = response2.coord.lat;
        city = `lat=${cityLat}&lon=${cityLon}`;
        let weatherArray = [];
        let weatherObject = {};
        var currentURL = "https://api.openweathermap.org/data/2.5/onecall?";
        var cityName = city;
        var exclHrlURL = "&exclude=hourly";
        var unitsURL = "&units=imperial";
        var apiIdURL = "&appid=";
        var apiKey = "1d93cb853b596e409d092698032889d7";
        var openFcstWeatherAPI =
          currentURL + cityName + exclHrlURL + unitsURL + apiIdURL + apiKey;

        $.ajax({
          url: openFcstWeatherAPI,
          method: "GET",
        }).then(function (response3) {
          for (let i = 1; i < response3.daily.length - 2; i++) {
            let cur = response3.daily[i];
            weatherObject = {
              weather: cur.weather[0].description,
              minTemp: Math.round(cur.temp.min),
              maxTemp: Math.round(cur.temp.max),
              humidity: cur.humidity,
              date: convertDate(cur.dt),
            };
            weatherArray.push(weatherObject);
          }
          for (let i = 0; i < weatherArray.length; i++) {
            let $colmx1 = $('<div class="col mx-1">');
            let $cardBody = $('<div class="card-body forecast-card">');
            let $cardTitle = $('<h6 class="card-title">');

            $cardTitle.text(weatherArray[i].date);

            let $ul = $("<ul>");

            let $iconLi = $("<li>");
            let $iconI = $("<img>");
            let $weathLi = $("<li>");
            let $tempMaxLi = $("<li>");
            let $tempMinLi = $("<li>");
            let $humLi = $("<li>");

            $iconI.attr("src", weatherArray[i].icon);
            $weathLi.text(weatherArray[i].weather);
            $tempMaxLi.text("Temp High: " + weatherArray[i].maxTemp + " °F");
            $tempMinLi.text("Temp Low: " + weatherArray[i].minTemp + " °F");
            $humLi.text("Humidity: " + weatherArray[i].humidity + "%");

            $iconLi.append($iconI);
            $ul.append($iconLi);
            $ul.append($weathLi);
            $ul.append($tempMaxLi);
            $ul.append($tempMinLi);
            $ul.append($humLi);
            $cardTitle.append($ul);
            $cardBody.append($cardTitle);
            $colmx1.append($cardBody);

            $("#forecast").append($colmx1);
          }
        });
      });
    });
  }
});

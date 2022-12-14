var searchForm = document.querySelector('#searchForm');
var mainEl = document.getElementById("todayForecast");
var cityArray = [];
var citiesEl = document.getElementById("pastCities");
var clearButton = document.getElementById("clearSearches");

var cityStorage = localStorage.getItem("cityStorage");



searchForm.addEventListener('submit', function (event) {
    event.preventDefault();
    var userInput = document.querySelector('#city').value
    clearPastCities();
    getCoordinates(userInput);
    // this makes the search button fun our getCoordinates and clearPastCities function when clicked
})

clearButton.addEventListener('click', function(cityStorage) {
    clearPastCities();
    localStorage.clear();

    window.alert("clicked");
   // this allows us to clear the past cities when the button is clicked
    
})

// this function is saving out searches to local storage
function saveCity (userInput, cityStorage) {

    var cityStorage = localStorage.getItem("cityStorage");
    if (cityStorage === null) {
    cityStorage = cityArray;

    }
    else {
    cityStorage = JSON.parse(cityStorage);
    }
    cityStorage.push(userInput);
    var nameCity = JSON.stringify(cityStorage);
    localStorage.setItem("cityStorage", nameCity);

    clearPastCities();
    pastCities(cityStorage);

};

function clearPastCities () {
    var pastT = document.querySelectorAll(".pastButton");
    cityArray = [];
    console.log(pastT);
    pastT.forEach(function (pastT) {
        pastT.remove();
    });

    // this function clears away the past cities searched when a button is clicked
  };




function pastCities (cityStorage) {
    
   
    for (var i = 0; i < cityStorage.length; i++) { 
        var cityButton = document.createElement("button");

        cityButton.setAttribute("class", "pastButton")
        cityButton.textContent = cityStorage[i];
        citiesEl.append(cityButton);
        cityButton.addEventListener('click', function(event) {
            var city = event.target.innerText
            getCoordinates(city)
        })
        // this function creates the past cities into buttons and adds a class so they can pull up the forecast again
        
    }
};


function getCoordinates(cityName) {
    saveCity(cityName);
    var url = `https://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=5&appid=e83c587e46527b4ae82ea6920b0630db`

    fetch(url)
        .then(function (response) {
            return response.json();
        })
            
        .then(function (data) {
            // console.log(data)
            var cityLat = data[0].lat;
            var cityLon = data[0].lon;

            getWeather(cityLat, cityLon, cityName);
        })
}


function getWeather(cityLat, cityLon, cityName) {

    var url2 = `https://api.openweathermap.org/data/2.5/onecall?lat=${cityLat}&lon=${cityLon}&units=imperial&appid=e83c587e46527b4ae82ea6920b0630db`

    fetch(url2)
        .then(function (response) {
            return response.json();
        })

        .then(function (data) {

            var newDate = "Today's Date: " + new Date(data.current.dt * 1000).toLocaleDateString('en-US');


            var cityTemp = "temp: " + data.current.temp + " &#176F";

            var nameCity = cityName;

            // this is will append our div tags, by creating new variables to store the data pulled from the array

            var cityHumid = "Humidity: " + data.current.humidity;

            var cityWind = "Wind Speed: " + data.current.wind_speed;

            var cityUV = "UV: " + data.current.uvi;





            var list = data.list;



            
            // creating the p elements for today's forecast and appending in the variable from our data array
            mainEl.innerHTML = `<h1>${nameCity}</h1><h4>${newDate}</h4><p>${cityTemp}</p><p>${cityHumid}</p><p>${cityWind}</p><p id=todayUvi>${cityUV}</p>`;
            const forecastImg = document.createElement("img");
            forecastImg.setAttribute("src", "https://openweathermap.org/img/wn/" + data.current.weather[0].icon + "@2x.png"
            );
            // this grabs the image from the weather api based on the forecast
            forecastImg.setAttribute("alt", data.current.weather[0].description
            );

            if (data.current.uvi < 4) {
                var uviCol = document.getElementById("todayUvi")
                uviCol.setAttribute("class", "text-success bg-white w-25")
            }
            else if (data.current.uvi >= 4 || data.current.uvi < 9) {
                var uviCol = document.getElementById("todayUvi")
                uviCol.setAttribute("class", "text-warning bg-white w-25")
            }
            else {
                var uviCol = document.getElementById("todayUvi")
                uviCol.setAttribute("class", "text-danger bg-white w-25")
            }

            mainEl.append(forecastImg);
        });






    function getForecast() {
        var url3 = "https://api.openweathermap.org/data/2.5/forecast?q=" + cityName + "&units=imperial" + "&APPID=e83c587e46527b4ae82ea6920b0630db";

        fetch(url3)
            .then(function (response) {
                return response.json();
            })

            .then(function (data) {
                



                // this for loop is going to ensure we only do a 5 day forecast
                const forecastEl = document.querySelectorAll(".forecast");
                for (var i = 0; i < forecastEl.length; i++) {
                    forecastEl[i].innerHTML = "";

                    // this allows us to dynamically get the info for the forecast
                    const forecastIndex = i * 8 + 4;
                    const forecastDate = new Date(data.list[forecastIndex].dt * 1000);
                    const forecastDay = forecastDate.getDate();
                    const forecastMonth = forecastDate.getMonth() + 1;
                    const forecastYear = forecastDate.getFullYear();
                    const forecastDateEl = document.createElement("p");

                    forecastDateEl.setAttribute("class", "mt-3 mb-0 forecast-date");
                    forecastDateEl.innerHTML = forecastMonth + "/" + forecastDay + "/" + forecastYear;
                    forecastEl[i].append(forecastDateEl);

                    const forecastImg = document.createElement("img");
                    forecastImg.setAttribute("src", "https://openweathermap.org/img/wn/" + data.list[forecastIndex].weather[0].icon + "@2x.png"
                    );
                    // this grabs the image from the weather api based on the forecast
                    forecastImg.setAttribute("alt", data.list[forecastIndex].weather[0].description
                    );
                    forecastEl[i].append(forecastImg);

                    const forecastTemp = document.createElement("p");
                    forecastTemp.innerHTML = "temp: " + data.list[forecastIndex].main.temp + " &#176F";
                    forecastEl[i].append(forecastTemp);

                    const forecastWind = document.createElement("p");
                    forecastWind.innerHTML = "wind: " + data.list[forecastIndex].wind.speed + "mph";
                    forecastEl[i].append(forecastWind);

                    const forecastHum = document.createElement("p");
                    forecastHum.innerHTML = "humidity: " + data.list[forecastIndex].main.humidity + "%";
                    forecastEl[i].append(forecastHum);
                    // all the above is grabbing data from our array, and appending it to the corresponding divs


                }

            });
    }
    getForecast();


    //    }


};


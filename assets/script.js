var searchForm = document.querySelector('#searchForm');
var mainEl = document.getElementById("todayForecast");

searchForm.addEventListener('submit', function(event) {
  event.preventDefault();
  var userInput = document.querySelector('#city').value
  getCoordinates(userInput);
})

function getCoordinates(cityName) {
  var url = `http://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=5&appid=e83c587e46527b4ae82ea6920b0630db`
  
  fetch(url)
  .then(function(response) {
    return response.json();
  })

  .then(function(data) {
    // console.log(data)
    var cityLat = data[0].lat;
    var cityLon = data[0].lon;
    
    getWeather(cityLat, cityLon, cityName);
  })
}


function getWeather(cityLat, cityLon, cityName){

   var url2 = `https://api.openweathermap.org/data/2.5/onecall?lat=${cityLat}&lon=${cityLon}&units=imperial&appid=e83c587e46527b4ae82ea6920b0630db`

   fetch(url2)
   .then(function(response) {
    return response.json();
   })

   .then(function(data) {
    

    var cityTemp = data.current.temp;
    
    var nameCity = cityName;
   
    var newDate = new Date(data.current.dt * 1000).toLocaleDateString('en-US') ;
    
    var cityHumid = "Humidity: " + data.current.humidity;
   
    var cityWind = "Wind Speed: " + data.current.wind_speed;

    var cityUV = "UV: " + data.current.uvi;
    var list = data.list;
    
    

    console.log(data);
    // creating the p elements for today's forecast and appending in the variable from our data array
    mainEl.innerHTML = `<h1>${nameCity}</h1><p>${cityTemp}</p><p>${newDate}</p><p>${cityHumid}</p><p>${cityWind}</p><p>${cityUV}</p>`;
    const forecastImg = document.createElement("img");
    forecastImg.setAttribute("src", "https://openweathermap.org/img/wn/" + data.current.weather[0].icon + "@2x.png"
    );
    // this grabs the image from the weather api based on the forecast
    forecastImg.setAttribute("alt", data.current.weather[0].description
    );
    mainEl.append(forecastImg);
});









// function createList(weatherArray) {

//  for (var i = 0; i < weatherArray.length; i++) {
//      var weatherList = weatherArray
//      //weatherList.textContent = weatherArray[i];
//      mainEl.append(weatherList);
//      //console.log(weatherArray);
//      //console.log(weatherArray[i]);
//  }

//  };


   
    function getForecast() {
        var url3 = "https://api.openweathermap.org/data/2.5/forecast?q=" + cityName + "&units=imperial" + "&APPID=e83c587e46527b4ae82ea6920b0630db";
        
        fetch(url3)
        .then(function(response) {
         return response.json();
        })
     
        .then(function(data) {
         console.log(data);



                // this for loop is going to ensure we only do a 5 day forecast
        const forecastEl = document.querySelectorAll(".forecast");
        for (var i = 0; i < forecastEl.length; i++) {
          forecastEl[i].innerHTML = "";
        
          // this allows us to dynamically get the info for the forecast
          const forecastIndex = i * 8 + 4;
          const forecastDate = new Date(data.list[forecastIndex].dt *1000); 
          const forecastDay = forecastDate.getDate();
          const forecastMonth = forecastDate.getMonth() +1;
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
            forecastHum.innerHTML = "humidity: " + data.list[forecastIndex].main.humidity+ "%";
            forecastEl[i].append(forecastHum);
            // all the above is grabbing data from our array, and appending it to the corresponding divs
          
    
        }
    
        });
    }
    getForecast()
  
 
//    }

   
};


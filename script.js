$(document).ready(function () {
  var dayDate = moment().format('M/D/YY')
  
// GET THE CITY FROM THE UNIQUECITIES ARRAY IN LOCAL STORAGE. IF IT DOESN'T EXIST, CREATE IT
  uniqueCities = JSON.parse(localStorage.getItem("city"));
    if (!uniqueCities) {
      uniqueCities = [];
    }
  var selectedCity = $("citySearchBox").val();
  var LastSearchedCity = uniqueCities[uniqueCities.length-1];
  
  
// ELIMINATE DUPLICATES IN CITY LIST OBJECT
  var uniqueCities = [...new Set(uniqueCities)];
  for (var i = uniqueCities.length; i > 0; i--) {
    if (uniqueCities[i] != undefined){

// BUILD BUTTONS FOR RECENT SEARCHES
    var cityRow = $("<tr>");
    var cityColumn = $("<td>")
    var cityLink = $("<button>")
    cityLink.attr("class", "btn btn-med");
    cityLink.attr("city-name", uniqueCities[i]);
    cityLink.text(uniqueCities[i]);
    $(cityColumn).append(cityLink);
    $(cityRow).append(cityColumn);
    $("#tbodyRecent").append(cityRow);
    
  
}

};
   $("#searchBtn").on('click', function () {//This opens the button click function

    var selectedCity = $("#citySearchBox").val().trim();
    uniqueCities.push(selectedCity);
    localStorage.setItem("city", JSON.stringify(uniqueCities));
    uniqueCities = JSON.parse(localStorage.getItem("city"));
    var targetCity = uniqueCities[uniqueCities.length-1];


//CALL THE FUNCTION WITHIN THE SEARCH BUTTON
getWeather();  
  });
  
 //CALL THE FUNCTION OUTSIDE THE SEARCH BUTTON
  getWeather();
  function getWeather(){
// CHECK FOR AN EMPTY SEARCH BOX - IF SO, LOAD LAST SEARCHED CITY
  if (citySearchBox.value.length==0){
    var  targetCity=LastSearchedCity;
    }else{
    var targetCity = uniqueCities[uniqueCities.length-1]; 
    }const myWeatherKey = "eb316842a585fb8c5d377857dda881c6"
  console.log("Target City for API Call= "+targetCity)
 
//RUN FIRST API CALL TO OPENWEATHER TO GET BACK LATITUDE AND LONGITUDE BASED ON THE CITY
  var queryURL = "https://api.openweathermap.org/data/2.5/weather?q="+targetCity+"&appid="+myWeatherKey  
  $.ajax({
      url: queryURL,
      method: 'GET'})
      .then(function(data){
    
//STORE LAT AND LONG IN VARIABLES FOR USE BY SECOND API CALL  
  var lat = data.coord.lat;
  var long = data.coord.lon;

//SECOND API CALL (ONE CALL) TO BRING BACK 5 DAY FORECAST DATA AND CURRENT DAY'S UV INDEX  
  var queryOneCallURL = "https://api.openweathermap.org/data/2.5/onecall?lat="+lat+"&lon="+long+"&appid="+myWeatherKey
  $.ajax({
      url: queryOneCallURL,
      method: 'GET'})
      .then(function(dataOC){

    
// STORE THE ONE CALL RESPONSE IN LOCAL STORAGE AS AN OBJECT (WEATHEROBJ) 
    localStorage.setItem("weather", JSON.stringify(dataOC));
    weatherObj = JSON.parse(localStorage.getItem("weather"));  
  
      
//CURRENT DATA FROM THE OPENWEATHER ONE CALL API CALL  
    var currDate = moment.unix(dataOC.current.dt).format('MM/DD/YY');
    var currTemp = (((dataOC.current.temp)-273.15)*9/5+32).toFixed(0)+"°F";
    var currHumidity = (dataOC.current.humidity+"%");
    var currWindSpeed = (dataOC.current.wind_speed*2.237).toFixed(0)+" mph";
    var currUVI = Math.floor(dataOC.current.uvi);
    var wthrIcon = "http://openweathermap.org/img/w/"+dataOC.current.weather[0].icon+".png"

//POPULATE UI FOR CURRENT FORECAST WITH DATA RETURNED FROM API CALLS       
    $("#currDate").text(currDate);
    $("#cityAndDate").text(data.name+"  ("+currDate+")");
    $("#apiLat").text(data.coord.lat);
    $("#apiLong").text(data.coord.lon);
    $("#apiDate").text(moment().format('MM/DD/YY'));
    $("#wIcon").attr("src",wthrIcon);
    $("#apiTemp").text(currTemp);
    $("#apiHumidity").text(currHumidity);
    $("#apiWind").text(currWindSpeed);
    $("#apiUV").text(currUVI);
  
    function btnRecentDisplay() {
      console.log($(this).attr("city-name"));
      // var city2 = $(this).attr("city-name");
      // var queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" +
      //     city2 + "&appid=1f2cf6d8fabf4123eb61df651c4f522d";
};

$(".btn").on("click", btnRecentDisplay);


    
// CHANGE UV INDEX BOX COLOR. LEVELS REFLECT EPA GUIDELINES: https://www.epa.gov/sunsafety/uv-index-scale-0
// 0-2 = FAVORABLE, 3-7 = MODERATE, 8+ = High 
  
  if (currUVI >=8) {
    $("#apiUV").removeClass();
    $("#apiUV").addClass("hiUV");
    } 
    else if (currUVI <=2){ 
      $("#apiUV").removeClass();
      $("#apiUV").addClass("lowUV");
    }
    else{
      $("#apiUV").removeClass();
      $("#apiUV").addClass("modUV");
    }
       


// LOOP THROUGH AN ARRAY TO POPULATE THE 5 DAY FORECAST  
    dayLoop = [0, 1, 2, 3, 4, 5, 6]
    for (var i = 0; i < dayLoop.length; i++) {
    var dayDate = moment.unix(weatherObj.daily[i].dt).format('MM/DD/YY');
    var dayTemp = (((weatherObj.daily[i].temp.day)-273.15)*9/5+32).toFixed(0)+"°F";
    var dayHumidity = (weatherObj.daily[i].humidity+"%");
    var dayWindSpeed = (weatherObj.daily[i].wind_speed*2.237).toFixed(0)+" mph";
    var dayWthrIcon = "http://openweathermap.org/img/w/"+weatherObj.daily[i].weather[0].icon+".png" 

// DISPLAY TODAY'S WEATHER DATA IN THE DISPLAY PANE
    $("#day"+ dayLoop[i]+"_date").text(dayDate);
    $("#day"+ dayLoop[i]+"_icon").attr("src",dayWthrIcon);
    $("#day"+ dayLoop[i]+"_temp").text("Temp: "+dayTemp);
    $("#day"+ dayLoop[i]+"_humidity").text("Humidity: "+dayHumidity);
  };
   
 
  });
  }); 
  }; 

  })
  
  
  
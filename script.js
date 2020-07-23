$(document).ready(function () {
  var dayDate = moment().format('M/D/YY')
  
  // Get the city from the cityListObj array in Local Storage. If the array doesn't exist, create an empty array
  cityListObj = JSON.parse(localStorage.getItem("city"));
    if (!cityListObj) {
      cityListObj = [];
    }//if statement close
  var selectedCity = $("citySearchBox").val();
  var LastSearchedCity = cityListObj[cityListObj.length-1];
  
  
  
  console.log("Last City= "+LastSearchedCity);
  console.log("Selected City= "+selectedCity);
  // console.log("Target City= "+targetCity);
  
   $("#searchBtn").on('click', function () {//This opens the button click function
  // event.preventDefault()
    var selectedCity = $("#citySearchBox").val().trim();
    cityListObj.push(selectedCity);
    localStorage.setItem("city", JSON.stringify(cityListObj));
    cityListObj = JSON.parse(localStorage.getItem("city"));
    var targetCity = cityListObj[cityListObj.length-1];

    console.log("Button Last City= "+LastSearchedCity);
    console.log("Button Selected City= "+selectedCity);
    console.log("Button Target City= "+targetCity);


getWeather();  
  }); //Search button close   
  
  // targetCity=LastSearchedCity;
  
  
  getWeather();
  function getWeather(){

  if (citySearchBox.value.length==0){
    var  targetCity=LastSearchedCity;
    }else{
    var targetCity = cityListObj[cityListObj.length-1]; 
    }const myWeatherKey = "eb316842a585fb8c5d377857dda881c6"
  console.log("Target City for API Call= "+targetCity)
  var queryURL = "https://api.openweathermap.org/data/2.5/weather?q="+targetCity+"&appid="+myWeatherKey  
  $.ajax({
      url: queryURL,
      method: 'GET'})
      .then(function(data){
    // console.log(data);    
  
  var lat = data.coord.lat;
  var long = data.coord.lon;
  
  var queryOneCallURL = "https://api.openweathermap.org/data/2.5/onecall?lat="+lat+"&lon="+long+"&appid="+myWeatherKey
  $.ajax({
      url: queryOneCallURL,
      method: 'GET'})
      .then(function(dataOC){
    // console.log(dataOC);
    
    // Store One Call response in Local Storage as an object (weather) 
    localStorage.setItem("weather", JSON.stringify(dataOC));
    weatherObj = JSON.parse(localStorage.getItem("weather"));  
  
      
  //CURRENT DATA FROM THE OPENWEATHER ONE CALL API CALL  
    var currDate = moment.unix(dataOC.current.dt).format('MM/DD/YY');
    var currTemp = (((dataOC.current.temp)-273.15)*9/5+32).toFixed(0)+"°F";
    var currHumidity = (dataOC.current.humidity+"%");
    var currWindSpeed = (dataOC.current.wind_speed*2.237).toFixed(0)+" mph";
    var currUVI = Math.floor(dataOC.current.uvi);
    var wthrIcon = "http://openweathermap.org/img/w/"+dataOC.current.weather[0].icon+".png"
    
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
  
    
  
  // Change UV Index box color. Levels reflect EPA guidelines: https://www.epa.gov/sunsafety/uv-index-scale-0
  // 0-2 = Low, 3-7 = Moderate, 8+ = High 
  
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
       
    cityListObj = JSON.parse(localStorage.getItem("city"));
                  if (!cityListObj) {
                      cityListObj = [];
                  }//This is end of the "if" statement
                  // cityListObj.push(targetCity);
                  // localStorage.setItem("city", JSON.stringify(cityListObj)); 
  
                  // ELIMINATE DUPLICATES IN CITY LIST OBJECT IN LOCAL STORAGE TO BUILD THE BUTTONS FOR RECENT SEARCHES
  var uniqueCities = [...new Set(cityListObj)];
  
  
  
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
  };//dayLoop close
   
 
  
  // for (var i = 0; i < cityListObj.length; i++) {
  });//initial AJAX block ("data") 
  }); //second AJAX block ("dataOC")
  };//Ready function close  
   //get data function close 
// getWeather(); 
  })
  
  
  
$('document').ready(function() {
  scale = "C";
  currentTemp = null;
  currentIcon = null;
  forecastMin = [];
  forecastMax = [];
  forecastIcons = [];
  getLocation();
});

$("#convert").click(changeScale);

function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(getWeatherData);
    } else {
        $("#location").text("Geolocation is not supported by this browser.");
    }
}

function changeScale(){
  if(scale == "C"){
    scale = "F";
    $("#convert").text("Convert to Celsius");
  }
  else {
    scale = "C";
    $("#convert").text("Convert to Fahrenheit");
  }
  displayTemperatures();
}

function displayTemperatures(){
  $('#weather').removeClass().addClass("inline text-center " + currentIcon);
  $('#temperature').html(getTemp(currentTemp));
  for (var i = 0; i < forecastMin.length; i++) {
    min = "Min: " + getTemp(forecastMin[i]);
    max = "Max: " + getTemp(forecastMax[i]);
    weatherclass = "wi wi-forecast-io-" + forecastIcons[i];
    $(".min").eq(i).text(min);
    $(".max").eq(i).text(max);
    $(".forecast").eq(i).removeClass().addClass("forecast inline text-center " + weatherclass);
  }
}

function getTemp(temp){
  temp = parseFloat(temp);
  if(scale == "C"){
    return Math.round((temp - 32)*5/9) + "℃";
  }
  return Math.round(temp) + "℉";
}



function getWeatherData(position){
  lat = position.coords.latitude;
  lon = position.coords.longitude;
  locationurl = "https://maps.googleapis.com/maps/api/geocode/json?latlng="+lat +"," + lon +"&key=AIzaSyCFq5tNiecZKENiGpdWno4OP518lYe0J4M";
  $.ajax({url: locationurl, success: function(result){
       $("#location").html(result["results"][4]["formatted_address"]);
   }});
  var url = "https://api.darksky.net/forecast/07f153858d65b5faf164c79ab958a9f6/" + lat + "," + lon;

  $.getJSON(url+ "?callback=?", function(result) {
    current = result["currently"];
    currentTemp = current["temperature"];
    currentIcon = "wi wi-forecast-io-" + current["icon"];
    day = result["daily"]["data"];
    console.log(day);
    for (var i = 0; i < day.length - 1; i++) {
      forecastMin[i] = day[i+1]["temperatureMin"];
      forecastMax[i] = day[i+1]["temperatureMax"];
      forecastIcons[i] = "wi wi-forecast-io-" + day[i+1]["icon"];
    }
    displayTemperatures();
  });
}

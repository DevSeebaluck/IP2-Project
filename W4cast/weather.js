$(document).ready(function(){
   $('#submitWeather').click(function(){
       var city = $("#city").val();
       if (city !=''){
           $.ajax({
               url:'http://api.openweathermap.org/data/2.5/weather?q=' + city + "&units=metric" + "&appid=6e2efa854e56fb546fe9393e9e9d5dd6",
               type:"GET",
               dataType: "jsonp",
               success: function(data){
                  var widget = show(data);
                   
                   $("#show").html(widget);
                   $("#city").val('');
               }
               

           });
       }else{
           $("#error").html('Please Try Again');
           
       }
   })
});

function show(data){
    return "<h3><strong>Weather</strong>: "+ data.weather[0].main +"</h3>" + "<h3><strong>Description</strong>: "+ data.weather[0].description +"</h3>"+ "<h3><strong>Temperature</strong>: "+ data.main.temp +"</h3>"+ "<h3><strong>Humidity</strong>: "+ data.main.humidity +"</h3>"
    
}
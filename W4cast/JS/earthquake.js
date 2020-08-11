var map;
//initMap() called when Google Maps API code is loaded - when web page is opened/refreshed 
function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
        zoom: 2,
        center: new google.maps.LatLng(2.8, -187.3), // Center Map. 
        mapTypeId: 'terrain' 
    });
    loadMap("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/significant_hour.geojson");
}

function loadMap(link) {
    
    $.ajax({
        
        url: link,

        
        error: function () {
            console.log('no map loaded');
            $('#info').html('<p>An error has occurred</p>');
        },

        
        success: function (data) {
            var i = 0;
            var markers = [];
            $.each(data.features, function (key, val) {
                var coords = val.geometry.coordinates;
                var latLng = new google.maps.LatLng(coords[1], coords[0]);
                var marker = new google.maps.Marker({
                    position: latLng,
                    map: map
                });
                markers[i++] = marker; 
                var infowindow = new google.maps.InfoWindow({
                    content: "<h3>" + val.properties.title + "</h3><p><a href='" + val.properties.url + "'>Details</a></p>"
                });
                marker.addListener('click', function () {
                    var lat = marker.position.lat();
                    var lng = marker.position.lng();
                    
                   theURL = 'http://api.weatherstack.com/current?access_key=723cb3bab322319fa8afcd2268cd819c' + lat.toFixed(4) + ',' + lng.toFixed(4);
                    $.ajax({
                        url: theURL,
                        success: function (data) {
                            console.log(data);
                            image = new Image();
                            $('.navs').append('<div class="weather-card"><div id="weatherImage"></div><div id="weatherInfo"></div><div id="wind_dir"></div></div>')
                            if (data.error) {
                            image.src = "https://cdn.pixabay.com/photo/2016/04/24/22/30/monitor-1350918_960_720.png"; 
                            }
                            else {
                                image.src = "http:" + data.current.condition.icon; 

                                $('#weatherInfo').html('<p>' + data.current.condition.text + '</p>'); 
                                $('#wind_dir').html('<p>Wind Direction: ' + data.current.wind_dir + '</p>');
                            }
                            image.onload = function () {
                                $('#weatherImage').empty().append(image);
                            };

                        },
                        error: function () { 
                            image = new Image();
                            image.src = "https://cdn.pixabay.com/photo/2016/04/24/22/30/monitor-1350918_960_720.png"; 
                            
                            image.onload = function () {
                                
                                $('#weatherImage').empty().append(image);
                            };
                        }
                    });
                    infowindow.open(map, marker); 
                });
            }); 
            var markerCluster = new MarkerClusterer(map, markers,
                {imagePath: 'https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m'});
        }
    });
}

$(document).ready(function () {
    
    initMap();
});

function processLink(magnitude, duration) {
    var link = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/" + magnitude + "_" + duration + ".geojson";
    initMap();
    loadMap(link);
}

$('.earthquake-selections li').click(function() {
    var magnitude = $(this).attr('class');
    var parent = $(this).closest('ul').attr('id');

    $('.earthquake-selections li').each(function(){
        if($(this).is('.active')) $(this).removeClass('active');
    });

    $(this).addClass('active');

    processLink(magnitude, parent);
});
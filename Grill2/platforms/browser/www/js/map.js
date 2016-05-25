var Latitude = undefined;
var Longitude = undefined;

var Grillplatz = {
    'latitude' : '',
    'longitude' : '',
    'name' : '',
    'beschreibung' : ''
    
};

var plaetze = [];

var TempGrill = {
    'lat' : '',
    'lng' : ''
}
var map;

var tempMarker;
// Get geo coordinates

function isGrillplatz(latitude, longitude){
    TempGrill.lat = latitude();
    TempGrill.lng = longitude();
    
    if( latitude() > 47.67 && latitude() < 47.68){
        var platz = {
        'latitude' : latitude,
        'longitude' : longitude,
        'name' : 'ibson',
        'beschreibung' : 'Büro'
    
        };
        return platz;
    }else{
        return null;
    }
    
}

function onGrillConfirm(buttonIndex){
    if(buttonIndex == 1){
    alert('Grillplatz hinzugefügt\n' + 'Name: ' + Grillplatz.name + '\nBeschreibung: ' + Grillplatz.beschreibung);
    plaetze.push(Grillplatz);
    }else{
        return false;
    }
}


function onGrillBeschreibung(results){
    if (results.buttonIndex == 1){
        if (results.input1 == ''){
            alert('Geben Sie eine Beschreibung ein!');
            onMarkerClick(null);
        }
        else{
        Grillplatz.beschreibung = results.input1;
        navigator.notification.confirm(
        'Name: ' + Grillplatz.name + '\nBeschreibung: ' + Grillplatz.beschreibung ,  // message
            onGrillConfirm,                  // callback to invoke
        'Neuer Grillplatz',            // title
        ['Weiter','Zurück']             // buttonLabels
       
        );
        }
    }
    else{
        onMarkerClick(null);
    }
    
}

function onGrillName(results) {
    if (results.buttonIndex == 1){
        console.log(results.input1);
        if (results.input1 == ''){
            alert('Geben Sie einen Namen ein!');
            onMarkerClick(null);
        }
        else{
        Grillplatz.name = results.input1;
        navigator.notification.prompt(
        'Geben Sie eine kurze Beschreibung ab',  // message
            onGrillBeschreibung,                  // callback to invoke
        'Neuer Grillplatz',            // title
        ['Weiter','Zurück'],             // buttonLabels
        Grillplatz.beschreibung                 // defaultText
        );
        }
    }
    else{
        onMarkerClick(null);
    }
}


function onMakeGrill(buttonIndex) {
    if (buttonIndex == 1){
        
        Grillplatz.latitude = TempGrill.lat;
        Grillplatz.longitude = TempGrill.lng;
        
        navigator.notification.prompt(
    'Vergeben Sie einen Namen',  // message
    onGrillName,                  // callback to invoke
    'Neuer Grillplatz',            // title
    ['Weiter','Zurück'],             // buttonLabels
    Grillplatz.name                 // defaultText
);
    }
    else{
        tempMarker.setMap(null);
        tempMarker = null;
    }
}

function onMarkerClick(marker){
    tempMarker = marker;
    var pos = tempMarker.getPosition();
    var tmpPlatz = isGrillplatz(pos.lat, pos.lng);
    if (tmpPlatz == null){
        navigator.notification.confirm(
        'Grillplatz hinzufügen?', // message
        onMakeGrill,            // callback to invoke with index of button pressed
        'Neuer Ort entdeckt',           // title
        ['Ja','Nein']     // buttonLabels
);
    }
    else{
    var infowindow = new google.maps.InfoWindow({
    content: '<div id="content">'+
      '<div id="siteNotice">'+
      '</div>'+
      '<h1 id="firstHeading" class="firstHeading">' + tmpPlatz.name + '</h1>'+
      '<div id="bodyContent">'+
      '<p>' + tmpPlatz.beschreibung + '</p>'+
      '</div>'+
      '</div>'
        });
    infowindow.open(map, marker);     
    }
}

function getMapLocation() {
    console.log('MapLocation');
    navigator.geolocation.getCurrentPosition
    (onMapSuccess, onMapError, { enableHighAccuracy: true });
}

// Success callback for get geo coordinates

var onMapSuccess = function (position) {
    
    Latitude = position.coords.latitude;
    Longitude = position.coords.longitude;
    console.log(Latitude);
    
    getMap(Latitude, Longitude);
    
    
}

// Get map by using coordinates

function getMap(latitude, longitude) {
    
    var mapOptions = {
        center: new google.maps.LatLng(0, 0),
        zoom: 1,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    };

    map = new google.maps.Map
    (document.getElementById("map"), mapOptions);


    var latLong = new google.maps.LatLng(latitude, longitude);

    var marker = new google.maps.Marker({
        position: latLong
    });
    

    marker.setMap(map);
    map.setZoom(15);
    map.setCenter(marker.getPosition());
    map.addListener('click', function(event) {
        addGrillplatz(event.latLng);
    });
    
   marker.addListener('click', function(event){                    
       onMarkerClick(marker);
   });
                                               
    
}

function addGrillplatz(location){
    var marker = new google.maps.Marker({
    position: location,
    map: map
    });
     marker.addListener('click', function(event){                    
       onMarkerClick(marker);
   });
}

// Success callback for watching your changing position

var onMapWatchSuccess = function (position) {

    var updatedLatitude = position.coords.latitude;
    var updatedLongitude = position.coords.longitude;

    if (updatedLatitude != Latitude && updatedLongitude != Longitude) {

        Latitude = updatedLatitude;
        Longitude = updatedLongitude;

        getMap(updatedLatitude, updatedLongitude);
    }
}

// Error callback

function onMapError(error) {
    console.log('code: ' + error.code + '\n' +
        'message: ' + error.message + '\n');
}

// Watch your changing position

function watchMapPosition() {

    return navigator.geolocation.watchPosition
    (onMapWatchSuccess, onMapError, { enableHighAccuracy: true });  
}


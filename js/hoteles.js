
var layers = [] 
var collection = {}

var hotel_users = {} 
var select = ""; 

function removeMarker(lat,lon){

        for (var i = 0; i < layers.length; i++) {

            if (layers[i]._latlng.lat==lat && layers[i]._latlng.lng==lon){

                map.removeLayer(layers[i]);
                layers.splice(i, 1);
                break;
            }
        };
}

function show_info(no){

    var accomodation = accomodations[no];
    var lat = accomodation.geoData.latitude;
    var lon = accomodation.geoData.longitude;
    var url = accomodation.basicData.web;
    var name = accomodation.basicData.name;
    select = name; 
    var desc = accomodation.basicData.body;
    var imgs = accomodation.multimedia.media;
    var cat = accomodation.extradata.categorias.categoria.item[1]['#text'];
    var subcat = accomodation.extradata.categorias.categoria
        .subcategorias.subcategoria.item[1]['#text'];

    $('#info').html('<h2>' + name + '</h2>'
        + '<p>Type: ' + cat + ', subtype: ' + subcat + '</p>'
        + desc);

    $('#descHotelSelect').html('<h2>' + name + '</h2>'
    + '<p>Type: ' + cat + ', subtype: ' + subcat + '</p>'
    + desc);

   
    $("#carousel-indicators").html("");
    $("#carousel-imgs").html("");
    var first = ["class='active'"," active"];

    for (var i = 0; i < imgs.length; i++) {

        $("#carousel-indicators").append("<li data-target='#carousel' data-slide-to='" + i +"' " + first[0] + "></li>");
        $("#carousel-imgs").append("<div class='item" + first[1] + "'>" +
                "<img src='" + imgs[i].url + "' alt='" + i + "'>" +
                "</div>");

        first = ["",""];
    };
    $("#carouselFotos").show();

    $("#content").html("");
    var id;
    hotel_users[name].forEach(function(id){

     makeApiCall(id,name,"");

    });

}


function show_accomodation(){

    var no = $(this).attr('no');
    var accomodation = accomodations[no];
    var lat = accomodation.geoData.latitude;
    var lon = accomodation.geoData.longitude;
    var url = accomodation.basicData.web;
    var name = accomodation.basicData.name;
    var markerexists = false;
    

    var Icon = L.icon({
        iconUrl: 'images/casa.png',

        iconSize:     [55, 55],
        iconAnchor:   [22, 94], 
        popupAnchor:  [6, -83] 
    });
    var marker = L.marker([lat, lon], {icon: Icon});
   
    for (var i = 0; i < layers.length; i++) {

        if (layers[i]._latlng.lat==lat && layers[i]._latlng.lng==lon){
            markerexists = true;
            marker = layers[i];
            break;
        }
    }
    if (!markerexists){

        layers.push(marker);
        marker.addTo(map).bindPopup('<a no="'+ no +'" href="#">' + name + '</a><br/>' + "<button id='borrarPopUp' onclick='removeMarker("+lat+","+lon+")'></button><br/>")
       
    }
    marker.openPopup();
    map.setView([lat, lon], 14); 

};

function get_accomodations(){
    $.getJSON("json/alojamientos.json").done(function(data){
      accomodations = data.serviceList.service;

      $(".listaHoteles").html('');
      var hotel = $(".listaHoteles").html();

      var encontrados = '<h4><strong>Hoteles encontrados: ' + accomodations.length +'</strong></h4>';

      hotel += encontrados + '<ul>';
      for (var i = 0; i < accomodations.length; i++) {
        hotel += '<li no=' + i + '>' + accomodations[i].basicData.title + '</li>';
        var users_plus = [];
        hotel_users[accomodations[i].basicData.title] =  users_plus;
      }
      hotel += "</ul>";
      
      $(".listaHoteles").html(hotel);
      $('#printHoteles li').click(show_accomodation);
      
      $('#moverHoteles li').draggable({revert:true,appendTo:"body",helper:"clone"});
           
    });
};


function cargarFormulario(){
    $('#form_load').bPopup({
        easing: 'easeOutBack',
        speed: 1500,
        transition: 'slideDown',
        fadeSpeed: 'slow',
        followSpeed: 1500,
        modalColor: 'greenYellow',
        transitionClose: 'slideBack'
    });
};


function guardarFormulario(){
    $('#form_save').bPopup({
        easing: 'easeOutBack',
        speed: 1500,
        transition: 'slideDown',
        fadeSpeed: 'slow',
        followSpeed: 1500,
        modalColor: 'greenYellow',
        transitionClose: 'slideBack'
    });
};


$(document).ready(function() {
    $('#tabs').tab();

    map = L.map('map').setView([40.4175, -3.708], 11);
    L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    $("#cargarHoteles").click(get_accomodations);

    $('#botonCargar').click(cargarFormulario);
    $('#botonGuardar').click(guardarFormulario);


    map.on('popupopen', function() {
        show_info($(this._popup._content).attr('no'));
    });  

          $("#containerCollections" ).droppable({
              drop: function( event, ui ) {

                var key = $(".col_title")[0].textContent;
                if (key == "") return;

                var no = ui.draggable[0].attributes[0].value;
                var hotel = accomodations[no].basicData.name;
                collection[key].push(accomodations[no])

                $("#mostrarColecciones ul").append("<li>" + hotel + "</li>");

              }
          });

          $( "#form1" ).submit(function(event) {
              event.preventDefault();
              var new_col = $("#col_name1")[0].value;
              $("#col_name1")[0].value = "";
              if(new_col != ""){
                  $(".columColecciones2 ul").append("<li>" + new_col + "</li>");
              }
              var c_accomodations = []
              collection[new_col] = c_accomodations;

              $(".columColecciones2 li").click(function(event){
                var coll = event.target.textContent;
                
                $(".col_title").html(coll)
                var colum = coll + ":";
                $("#colSelect").html(colum)

                $("#mostrarColecciones ul").html("");
                $(".columColecciones ul").html("");
                var hotel;
                collection[coll].forEach(function(n){

                  hotel = n.basicData.name;
                  $("#mostrarColecciones ul").append("<li>" + hotel + "</li>")
                  $(".columColecciones ul").append("<li>" + hotel + "</li>");
                });
                
              });
              
          });


          $( "#form2" ).submit(function(event) {
              event.preventDefault(); 
              var new_id = $("#col_name2")[0].value;
              if (new_id == ""){
                alert("Debes introducir un id")
                return;
              }
              $("#col_name2")[0].value = "";
              if (select == ""){
                return; 
                
              }
              makeApiCall(new_id,select,"new");

          });


        $( "#form_save" ).submit(function(event) {

          event.preventDefault(); 

          var github;
          var repo;

         
          var token = $("#f-token")[0].value; 
          github = new Github({
            token: token,
            auth: "oauth"
          });

          
          var username = "a-malagon";
          var reponame = $("#f-name-r")[0].value;
          repo = github.getRepo(username, reponame);


          

         
          var dict_global = {collection: collection, hotel_users: hotel_users};
          var nombreFichero = $("#f-name-f")[0].value;
          var contenidoFichero = JSON.stringify(dict_global);
          var mensajeCommit = $("#f-name-c")[0].value;

          repo.write('master', nombreFichero, contenidoFichero, mensajeCommit);

        });

        
    $( "#form_load" ).submit(function(event) {

        event.preventDefault(); 
        var github;
        var repo;

        
        var token = $("#f-token2")[0].value; 
        github = new Github({
          token: token,
          auth: "oauth"
        });

        
        var username = "a-malagon";
        var reponame = $("#f-name-r2")[0].value;
        repo = github.getRepo(username, reponame);
        var nombreFichero = $("#f-name-f2")[0].value;

        repo.read('master', nombreFichero , function(err, data) {
          console.log (err, data);
          var json = JSON.parse(data);

          collection = json.collection;
          hotel_users = json.hotel_users;

          $(".columColecciones2 ul").html("");
          Object.keys(collection).forEach(function(i){

            $(".columColecciones2 ul").append("<li>" + i + "</li>");


          });

          
              $(".columColecciones2 li").click(function(event){
                var coll = event.target.textContent;
                
                $(".col_title").html(coll)
                var colum = coll + ":";
                $("#colSelect").html(colum)

                $("#mostrarColecciones ul").html("");
                $(".columColecciones ul").html("");
                var hotel;
                collection[coll].forEach(function(n){

                  hotel = n.basicData.name;
                  $("#mostrarColecciones ul").append("<li>" + hotel + "</li>")
                  $(".columColecciones ul").append("<li>" + hotel + "</li>");
                });
                
              });


          console.log(json.collection)

        })

    });

});

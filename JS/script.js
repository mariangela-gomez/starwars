window.onscroll = function(){miFuncion()};

var starwars = document.getElementById("starwars");
var darthvader = document.getElementById("darthvader");
var obiwan = document.getElementById("obiwan");
var yoda = document.getElementById("yoda");

var distancia_starwars, distancia_darthvader, distancia_obiwan;

function miFuncion(){
    distancia_starwars = window.innerHeight - starwars.getBoundingClientRect().top;
    if(distancia_starwars >= 200){
        starwars.classList.add("efecto-starwars");
    }
    
    distancia_darthvader = window.innerHeight - darthvader.getBoundingClientRect().top;
    if(distancia_darthvader >= 200){
        darthvader.classList.add("efecto-darthvader");
    }

    distancia_obiwan = window.innerHeight - obiwan.getBoundingClientRect().top;
    if(distancia_obiwan>= 200){
        obiwan.classList.add("efecto-obiwan");
    }

    distancia_yoda = window.innerHeight - yoda.getBoundingClientRect().top;
    if(distancia_yoda >= 200){
        yoda.classList.add("efecto-yoda");
    }
}
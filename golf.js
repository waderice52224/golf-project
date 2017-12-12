//finished yards, add total yards
//add total par - or +


var closeCourses;
var currentCourse;
var numholes;
var numPlayers;
var pos;
var map, infoWindow;
function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
        center: {lat: -34.397, lng: 150.644},
        zoom: 6
    });
    infoWindow = new google.maps.InfoWindow;

    // Try HTML5 geolocation.
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function (position) {
            pos = {
                latitude: position.coords.latitude,
                longitude: position.coords.longitude,
                radius: 48.3
            };
            loadMe();
        }, function () {
            handleLocationError(true, infoWindow, map.getCenter());
        });

    }
}

function loadMe() {
    $.post("https://golf-courses-api.herokuapp.com/courses", pos, function (data, status) {
        closeCourses = JSON.parse(data);
        $(".container").append("<select id='courseselect' onchange='getCourse(this.value)'></select>");
        $(".container").append("<select id='teeselect'></select>");
        $(".container").append("<button id='done-btn' onclick='howManyPlayersPage()'>Done</button>");
        for (var p in closeCourses.courses){
            console.log(closeCourses.courses[p].name);
            $("#courseselect").append("<option value='"+ closeCourses.courses[p].id +"'>"+ closeCourses.courses[p].name +"</option>")
        }
    });
}
initMap();
function getCourse(courseid) {
    $("#teeselect").html("");
    $.get("https://golf-courses-api.herokuapp.com/courses/" + courseid, function (data) {
        currentCourse = JSON.parse(data);
        console.log(currentCourse);
        for (var t in currentCourse.course.tee_types) {
            var teeName = currentCourse.course.tee_types[t].tee_type;
            $("#teeselect").append("<option value='" + teeName + "'>"+teeName+"</option");
        }
    });
}
function howManyPlayersPage() {
    $( "#courseselect" ).remove();
    $( "#teeselect" ).remove();
    $( "#done-btn" ).remove();
    $("#num-players-div").append("<label for='num-players'>How many players</label><input id='num-players'>")
    $("#done-btn2-div").append("<button id='done-btn2' onclick='playerNames()'>Done</button>")
}
function playerNames() {
    numPlayers = document.getElementById("num-players").value;
    var x = 1;
    while (x <= numPlayers){
        $("#playerNamesPage").append("<label id='lable-for-player-name"+ x +"' for='playerName"+ x +"'>Player "+ x +"</label><input id='playerName"+ x +"'>");
        x++;
    }
    $("#done-btn3-div").append("<button id='done-btn3' onclick='buildCard()'>Done</button>");
    $( "#num-players-div" ).remove();
    $( "#done-btn2-div" ).remove();
}
function buildCard(mytee) {
    numholes = currentCourse.course.holes;
    console.log(numholes);
    $(".players-column").append("<div id='top-corner'></div>");
    var i = 0;
    while(i < numPlayers){
        $(".players-column").append("<div class='player-name-sec'> <div class='delete-btn' id='delete-btn"+ parseInt(i + parseInt(1)) +"' onclick='deleteButton(this)'></div> <div id='player"+ parseInt(i + parseInt(1)) +"' class='player-names'></div></div>");
        i++;
    }
    $(".headerColumn").append("<div id='header'>Hole 1</div>");
    for(var c in numholes){
        $(".headerColumn").append ("<div id='header"+ (Number(c) + 1) +"' class='header-class'><div class='upper-header'>Hole "+ parseInt(parseInt(c) + parseInt(2)) +"</div><div id='lower-header" +(Number(c) + 1)+ "' class='lower-header'></div></div>");
        $(".scoreColumn").append ("<div id='column"+ (Number(c) + 1) +"' class='column'></div>")
    }
    var z = 0;
    while (z < numPlayers){
        $(".totalScore").append("<div id='total"+ (Number(z) +1) +"' class='scoreboxes'></div>");
        z++;
    }
    $("head").append("<style>#container {margin: 50px auto}</style>");
    fillCard();
}
function fillCard() {
    for(var p = 1; p <= numPlayers; p++){
        $(".playerColumn").append("<input id='pl"+ p +"' class='playerNames>");
        for(var h = 1; h <= numholes.length; h++){
            $("#column" + h).append("<div id='player"+ p +"hole"+ h +"' type'text' class='holeinput'><input class='inputThatSucks' value='0'></div> ");
        }
    }
    var q = 1;
    while (q <= numPlayers){
        $("#player"+ q).append($("#playerName"+ q).val());
        q++;
    }
    var p = 1;
    while (p <= numPlayers){
        $("#playerName"+ p).remove();
        $("#lable-for-player-name"+ p).remove();
        p++;
    }
    $("#done-btn3-div").remove();
    if (numholes.length === 9){
        $("head").append("<style> .totalScore{max-width: 122px;}</style>");
    }
    else {
        $("head").append("<style> .totalScore{max-width: 71px;}</style>");
    }
    holePar1();
    distance1();

}
function deleteButton(theThing) {
    nodeToString(theThing);
    function nodeToString ( node ) {
        var tmpNode = document.createElement( "div" );
        tmpNode.appendChild( node.cloneNode( true ) );
        var str = tmpNode.innerHTML;
        tmpNode = node = null; // prevent memory leaks in IE
        console.log(str);
        console.log(str[38]);
        var dltNum = str[38];
        var w = 1;
        while (w <= numholes.length){
            $("#player"+ dltNum+ "hole"+ w +"").remove();
            w++;
        }
        $("#total"+dltNum).remove();
        return str;
        //39
    }
    $(theThing).parent().remove();
}
function addPlayerScore() {
    var t = 1;
    var r =1;
    var placeHold = 0;
    parseInt(placeHold);
    var playerTotalScore;
    while  (t <= numPlayers){
        document.getElementById("total"+t).innerHTML = "";
        r = 1;
        while (r < numholes.length){
            placeHold = parseInt(placeHold) + parseInt($("#player"+ t +"hole"+ r)[0].children[0].value);
            r++;
        }
        $("#total"+ t).append(parseInt(placeHold));
        window['playerTotalScore' + t] = placeHold;
        placeHold = 0;
        t++;
    }
    playerTotalScoreBottomBox();
}
function holePar1() {
        $("#header").append("<div class='lower-header'></div>");
        $(".lower-header").append("Par " + currentCourse.course.holes[0].tee_boxes[0].par);
        holePar();
}
function holePar() {
    var h = 0;
    while (h <= numholes.length - parseInt(1)){
        $("#header"+ h).append("<div class='lower-header"+ h +"'></div>");
        $("#lower-header"+ parseInt(h)).replaceWith("Par "+ currentCourse.course.holes[h].tee_boxes[0].par);
        h++;
    }
    $("#header"+ h).replaceWith("<div id='header"+ h +"' class='header-class'>Total</div>");
}
var placeHold = 0;
function distance1() {
    $(".lower-header").append("<div>"+ currentCourse.course.holes[0].tee_boxes[0].yards+" Yards</div>");
    placeHold = placeHold + currentCourse.course.holes[0].tee_boxes[0].yards;
    var h = 1;
    while (h <= numholes.length - parseInt(1)){

        $(".lower-header"+ h).append("<div>"+ currentCourse.course.holes[h].tee_boxes[0].yards +" Yards</div>");
        placeHold = placeHold + currentCourse.course.holes[h].tee_boxes[0].yards;
        h++;
    }
    $(".totals-div-container").append("<div class='totals-div'><div class='total-yardage'>Total Yardage: "+ placeHold +"</div></div>");
    calTotalPar();
    bottomBoxNames();
}
var totalPar = 0;
var courseTotalPar;
function calTotalPar() {
    var u = 0;
    while (u < numholes.length) {
        totalPar = parseInt(totalPar + parseInt(currentCourse.course.holes[u].tee_boxes[0].par));
        u++;
    }
$(".totals-div-container").append("<div class='total-par'>Total Par "+ totalPar +"</div>");
    window.courseTotalPar = totalPar;
}
var test3;
function bottomBoxNames() {
    var t = 1;
    $(".totals-div-container").append("<div class='players-over-all-par'>");
    $(".players-over-all-par").append("<div class='player-names-bottom-box'></div>");
    while (t <= numPlayers) {
        test3 = $("#player" + t).html();
        $(".player-names-bottom-box").append("<div>"+ test3 +"</div>");
        t++;
    }

}
function playerTotalScoreBottomBox() {
    var i = 1;
    var playerTotalJustForThisFunction;
    $(".players-over-all-par").append("<div class='bottom-total'></div>");
    while (i <= numPlayers){
        playerTotalJustForThisFunction = $("#total"+ i).html();
        var boi = parseInt(playerTotalJustForThisFunction - courseTotalPar);
        $(".bottom-total").replaceWith(boi);
        i++;
    }
}
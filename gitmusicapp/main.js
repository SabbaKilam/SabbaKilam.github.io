/**
    Author: Abbas Abdulmalik
    Creation Date: April 2, 2016
    Title:  Git Y'r Music
    Revised: April 27, 2016
    Purpose: A music playlist sharing app
    Notes: added boz scaggs album cover picture
*/
"use strict";

//====| Global Objects and Data |====
/*global rekwire*/
var toggleOn = false;

function id(string) {
    return document.getElementById(string);
}
/*global CreateListMixer*/
var cycleTime = 0.5; // half a second?
var shuffleImages = ["images/shuffle3.png","images/shuffle1.png","images/shuffle2.png","images/shuffle4.png",];
var getRandomSong = CreateListMixer();
var nextSong = id("nextSong");
var content = id("content");
var gitName = id("gitName");
var friendButton = id("friendButton");
var chooser = id("chooser");
var playlist = id("playlist");
var audioPlayer = id("audioPlayer");
var currentlyPlaying = id("currentlyPlaying");
var menuButton = id("menuButton");
var menu = id("menu");
var X = id("X");
var appTitle = id("appTitle");
var colorSlider = id("colorSlider");
var shadowSlider = id("shadowSlider");
var gitColor = id("gitColor");
var fileInput = id("fileInput");
var removeList = id("removeList");
var searchBox = id("searchBox");
var listRefresher = id("refreshList");

var propNames = Object.keys;
var playlistHeader = "Choose a Song";
var ajax = new XMLHttpRequest();
var lists = {};
var namesArray = [];
var songsArray = [];
var songsArrayBackup = [];
var currentUrl = "";
var currentPlayListName = "";
var busyFlashingColor = false;
var busyFlashingStyle = false;
var menuOpen = false;
var prefix = ["-webkit-","-moz-","-ms-","-o-",""];
var mainColorAngle = 186;
var backgroundColorAngle = 6;
var shuffleBox = id("shuffleBox");
var shuffleState = id("shuffleState");
var shuffleIcon = id("shuffleIcon");
var shuffleOn = false;
var shuffleTimerId = null;

//====| The Driver's Seat |====

window.onload = initialize;
searchBox.onkeyup = findMatches;
chooser.onchange = changePlayList;
playlist.onchange = playSong;
friendButton.onclick = getNewList;
menuButton.onclick = toggleAndFlash;
X.onclick = toggleAndFlash;
appTitle.onclick = toggleAndFlash;
shuffleBox.onclick = toggleShuffle;
nextSong.onclick = playNextSong;
listRefresher.onclick = refreshList;
audioPlayer.onended = function(){
    if(shuffleOn){
        playNextSong();
    }
};

id("pictureDiv").addEventListener("click", function(e){
    e.stopPropagation();
    if(toggleOn){
        contractPicture(e);
        toggleOn = false;
    }
    else{
        expandPicture(e);
        toggleOn = true;
    }
});


//---| menu actions |------

gitName.onkeyup = getNewList;
gitName.onclick =clearInput;
fileInput.onchange = uploadSong;
colorSlider.oninput = showColors;
colorSlider.onmousedown = showColors;
gitColor.onmouseup = hideColors;
removeList.onchange = removePlaylist;

//---| END menu actions |------

//------| testing out stuff |--------
shadowSlider.onblur = function(e){
    shadowSlider.style.visibility = "hidden";
};
shadowSlider.onclick = function(e){
    shadowSlider.style.visibility = "hidden";
};
menu.onclick = function(e){
    shadowSlider.style.visibility = "hidden";
};

//====| Under The Hood |====


function initialize() {
    // 1. Augment our lists object with downloaded lists
    addListsFromServer();
    // 2. Fill our chooser with lists' names
    //addPlaylistNamesToBox();//called from within 1. above
    // 3. Further augment our lists object with browser's copy
    addListsFromBrowser();
    // 4. Store lists object on the browser
    //storeListsToBrowser();
    configureResizing();
    loadColorsFromBrowser();
    hasOneList();

} //===| END of initialize() |=====
function hasOneList(){
    setTimeout(function(){
        if(chooser.options.length === 2){
            chooser.selectedIndex = 1;
            changePlayList();
        }
    },500);
}
function refreshList(e){
    if(chooser.selectedIndex !== 0){
        flashObjectStyle(listRefresher,"box-shadow","inset 1px 1px 1px black", 0.5);
        flashObjectColor(listRefresher,"white", 0.5);
        //-----------

        var currentOption = chooser.options[chooser.selectedIndex];
        var listname = currentOption.innerHTML;
        var E = {};

        E.target = chooser;
        removePlaylist(E);
        E.target = removeList;
        removePlaylist(E);

        gitName.value = listname;
        E.keyCode = 13;
        getNewList(E);

        toggleMenu();
        setTimeout(function(){
            chooser.selectedIndex = chooser.options.length-1;
        },500);
    }
}

function findMatches(e){
    var keyCode = e.keyCode;
    //if the search box is empty, restore old playlist
    if(e.target.value === ""){
            //restore playlist and anything else that needs restoring:
            playlist.size = 0;
            songsArray = songsArrayBackup;
            changePlayList();
            return;
    }
    var matchedSongsArray = subList(searchBox.value,songsArrayBackup);
    if(matchedSongsArray.length !== 0 && searchBox.value !== ""){
        songsArray = matchedSongsArray;
        playlist.innerHTML = "";
        var list = chooser.options[chooser.selectedIndex].innerHTML;
        var header = document.createElement("option");
        header.innerHTML = playlistHeader;
        playlist.appendChild(header);
        songsArray.forEach(function (m) {
            var artistTitle = lists[list][m].artist + " - " + lists[list][m].title;
            var option = document.createElement("option");
            option.innerHTML = artistTitle;
            playlist.appendChild(option);
        });
        playlist.selectedIndex = 0;//choose first matched song

        //show list
        if(songsArray.length >= 7){
            playlist.size = 7;
        }
        else{
            playlist.size = songsArray.length + 2;
        }

        if(keyCode === 13){
            playlist.size = 0;
            playSong();
        }
    }
    else{
        playlist.size = 0;
        songsArray = songsArrayBackup;
        changePlayList();
    }
}
//----------
function removePlaylist(e,x){
    var source = e.target;
    var listToRemove = source.options[source.selectedIndex].innerHTML;
   // var listToRemove = removeList.options[removeList.selectedIndex].innerHTML;
    var arrayOfplaylists = [].slice.call(chooser.options,0);
    arrayOfplaylists.forEach(function(m,i,a){
        if(m.innerHTML === listToRemove){
            chooser.removeChild(chooser[i]);
            //remove old list from menu

            removeList.removeChild(removeList[i]);
            removeList.selectedIndex = 0;

            //remove from lists
            delete lists[listToRemove];

            //save reduced list to local storage:
            storeListsToBrowser(lists);

            //save reduced list to server:
            sendListToServer(lists);
        }
    });
}
//----------
function playNextSong(e){
    var highestIndex = songsArray.length;
    if(chooser.selectedIndex !== 0){
        if(shuffleOn){
            playlist.selectedIndex = songsArray.indexOf(getRandomSong()) + 1;
            playSong();
        }
        else if(playlist.selectedIndex !== highestIndex){
            playlist.selectedIndex += 1;
            playSong();
        }
        else{
            playlist.selectedIndex = 1;
            playSong();
        }
        flashObjectStyle(nextSong,"box-shadow","inset 1px 1px 1px black", 0.5);
        flashObjectColor(nextSong,"white", 0.5);
    }
}
//----------
function playSong() {
    playlist.size = 0;//close select element to show only item playing
    var i = playlist.selectedIndex;
    if (i > 0) {
        currentlyPlaying.innerHTML = playlist[i].innerHTML + " (" + currentPlayListName + ")";
        flashObjectStyle(currentlyPlaying,"text-shadow","0 2px 0 black", 0.25);
        flashObjectColor(currentlyPlaying,"lightgray", 0.25);
    }
    i -= 1;
    if (i >= 0) {
        var url = currentUrl + songsArray[i] + ".mp3";
        audioPlayer.src = url;
    }
    //--see if we can show a piture
    var currentList = lists[chooser.options[chooser.selectedIndex].innerHTML];
    var picture = currentList[songsArray[i]].picture;
    var pictureDiv = id("pictureDiv");
    pictureDiv.style.background = "hsla(0, 0%, 0%, 0.3)";
    if(picture){
        setTimeout(function(){
            pictureDiv.style.background = "url(/music/pictures/"+ picture +") no-repeat center";
            pictureDiv.style.backgroundSize = "contain";
        },1);
    }

}
//----------
function uploadSong(){
    try{
        var file = this.files[0];
        var noMp3 = file.name.substring(0, file.name.length - 4);
        var artist = noMp3.split("-")[0].trim();
        var title = noMp3.split("-")[1].trim();
        /**
         * 0.) Limit file to .mp3 files.
         * 1.) Pop a dialog and get title and artist.
         * 2.) Validate file, artist and title (no blank fields)
         * 3.) Ajax post to getMusicFile.php setting requestHeaders
         *
        */
        //---| ajax post |---
        var fileSender = new XMLHttpRequest();
        fileSender.open("POST","phpfiles/getMusicFile.php");
        fileSender.setRequestHeader("title", title);
        fileSender.setRequestHeader("artist", artist);
        fileSender.setRequestHeader("filename", file.name);
        fileSender.send(file);

        //---| post's response |---
        fileSender.onreadystatechange = function(){
            if(fileSender.readyState === 4){
                alert("Status: "+
                    fileSender.status +
                    "\n" +
                    fileSender.responseText
                );
            }
        };
    }
    catch(error){
        alert("Problems uploading a song.\n" + error);
    }
}
//----------
function toggleShuffle(){
    if(shuffleOn){
        turnShuffle2Off();
    }
    else{
        turnShuffle2On();
    }
}
toggleShuffle.angle = 0;
//----------
function turnShuffleOn(){
    if(chooser.selectedIndex === 0){return;}
    playlist.selectedIndex = songsArray.indexOf(getRandomSong(songsArray)) + 1;
    playSong();
    shuffleBox.style.boxShadow = "inset 1px 1px 1px black";
    shuffleState.innerHTML = "on";
    shuffleState.style.color = "lightgray";
    shuffleIcon.style.color = "lightgray";
    shuffleState.style.textShadow = "0 1px 0 black";
    shuffleIcon.style.textShadow = "0 1px 0 black";
    shuffleOn = true;
    toggleShuffle.angle = -10;
    shuffleTimerId = setInterval(function(){
        toggleShuffle.angle += 10;
        shuffleIcon.style.transform = "rotateZ(" + toggleShuffle.angle % 360 + "deg)";
    },100);
}
//----------
function turnShuffleOff(){
    shuffleBox.style.boxShadow = "1px 1px 1px black";
    shuffleState.innerHTML = "off";
    shuffleState.style.textShadow = "0 1px 0 hsl(165,50%,70%)";
    shuffleIcon.style.textShadow = "0 1px 0 hsl(165,50%,70%)";
    shuffleState.style.color = "black";
    shuffleIcon.style.color = "black";
    clearInterval(shuffleTimerId);
    shuffleIcon.style.transform = "rotateZ(90deg)";
    shuffleOn = false;
}
//----------
function turnShuffle2On(){
    if(chooser.selectedIndex === 0){return;}

    var songOnDeck = getRandomSong(songsArray);
    //if a song is not already playing, play song:
    if(audioPlayer.paused){
        playlist.selectedIndex = songsArray.indexOf(songOnDeck) + 1;
        playSong();
    }
    shuffleBox.style.boxShadow = "inset 1px 1px 1px black";
    shuffleState.innerHTML = "on";
    shuffleState.style.color = "lightgray";
    shuffleIcon.style.color = "lightgray";
    shuffleState.style.textShadow = "0 1px 0 black";
    shuffleIcon.style.textShadow = "0 1px 0 black";
    shuffleOn = true;
    fadeShuffleImage();
}
//----------
function turnShuffle2Off(){
    shuffleBox.style.boxShadow = "1px 1px 1px black";
    shuffleState.innerHTML = "off";
    shuffleState.style.textShadow = "0 1px 0 hsl(165,50%,70%)";
    shuffleIcon.style.textShadow = "0 1px 0 hsl(165,50%,70%)";
    shuffleState.style.color = "black";
    shuffleIcon.style.color = "black";
    clearInterval(shuffleTimerId);
    shuffleIcon.style.transform = "rotateZ(0deg)";

	shuffleIcon.style.opacity = "1";
	shuffleIcon.style.background = "url(images/shuffle.png) no-repeat center";
	shuffleIcon.style.backgroundSize = "contain";

    shuffleOn = false;
}
//----------
function fadeShuffleImage(){
	var minOpacity = 0.3;
	var opacity = minOpacity;
	var brighter = 1, darker = -1;
	var direction = brighter;
	var steps = 10;
	if(shuffleOn){
		shuffleTimerId = setInterval(function(){
			opacity += (1/steps)* direction;
			if(opacity >= 1){
				direction = darker;

			}
			if (opacity <= minOpacity){
				direction = brighter;
				//rotate images
				shuffleImages.push(shuffleImages.shift());
				shuffleIcon.style.background = "url("+ shuffleImages[0] +") no-repeat center";
				shuffleIcon.style.backgroundSize = "contain";

			}
			shuffleIcon.style.opacity = opacity +"";
		}, cycleTime*1000/steps);
	}
	else{
		clearInterval(shuffleTimerId);
		shuffleIcon.style.opacity = "1";
		shuffleIcon.style.background = "url(images/shuffle.png) no-repeat center";
		shuffleIcon.style.backgroundSize = "contain";
	}
}
//----------
function loadColorsFromBrowser(){
    if(window.localStorage){
        var possibleAngle = window.localStorage.getItem("mainColorAngle");
        if(possibleAngle){
            mainColorAngle = possibleAngle;
            colorSlider.value = mainColorAngle;
            setMainColor();
        }
        else{
            setMainColor();
        }
        possibleAngle = window.localStorage.getItem("backgroundColorAngle");
        if(possibleAngle){
            backgroundColorAngle = possibleAngle;
            setBackgroundColor();
        }
        else{
           setBackgroundColor();
        }
    }
}
//----------
function toggleAndFlash(e){
    e.stopPropagation();
    toggleMenu(e);
    flashObjectColor(menuButton, "white", 0.25);
}
//----------
function clearInput(e){
    e.target.value = "";
}
//----------
function showColors(e){
    e.stopPropagation();
    setMainColor();
    setBackgroundColor();
    menu.style.transition = "all 0s ease";
    menu.style.visibility = "hidden";
    shadowSlider.style.visibility = "visible";
    shadowSlider.value = colorSlider.value;
    menuOpen = false;
}
//----------
function hideColors(){
    menu.style.transition = "all 1s ease;";
    shadowSlider.style.visibility = "hidden";
}
//----------
function setMainColor(){
    mainColorAngle = colorSlider.value;
    prefix.forEach(function(pre){
        content.style.background = pre +
            "linear-gradient(-60deg, hsl(" +
            mainColorAngle +
            ", 50%, 50%), white)"
        ;
    });
    if(window.localStorage){
        window.localStorage.setItem("mainColorAngle",mainColorAngle);
    }
}
//----------
function setBackgroundColor(){
    backgroundColorAngle = (mainColorAngle - 180);
    prefix.forEach(function(m){
        document.body.style.background = m +
            "linear-gradient(60deg, white, hsl(" +
            backgroundColorAngle +
            ", 50%, 50%)) no-repeat"
        ;
        document.body.style.backgroundSize = "cover";
        appTitle.style.background = m +
            "linear-gradient(60deg, white, hsl("+
            backgroundColorAngle +
            ", 50%, 50%)) no-repeat"
        ;
    });
    if(window.localStorage){
        window.localStorage.setItem("backgroundColorAngle",backgroundColorAngle);
    }
}
//----------
function addListsFromBrowser(){
    if(window.localStorage){
        if(window.localStorage.getItem("lists")){
            var serverList = window.localStorage.getItem("lists");
            var userLists = JSON.parse(serverList);
            for (var list in userLists) {
                if (!lists[list]) {
                    lists[list] = userLists[list];
                }
                addToRemoveList(list);
            }
        }
    }
}
//------
function addToRemoveList(listName){
    var option = document.createElement("option");
    option.innerHTML = listName;
    id("removeList").appendChild(option);
}
//----------
function addListsFromServer() {
    var listGetter = new XMLHttpRequest();
    listGetter.open("GET", "lists.json");
    listGetter.send();
    //-----
    listGetter.onload = function () {
        if (listGetter.status === 200) {
            var userLists = JSON.parse(listGetter.response);
            for (var list in userLists) {
                if (!lists[list]) {
                    lists[list] = userLists[list];
                }
            }
        }
        addPlaylistNamesToBox(); //the slippery slope to callback hell
        storeListsToBrowser();
    };
}
//----------
function storeListsToBrowser() {
    if(window.localStorage !== undefined){
        var listString = JSON.stringify(lists);
        window.localStorage.setItem("lists", listString);
    }
}
//----------
function configureResizing() {
    resizeAndCenter();
    window.onresize = resizeAndCenter;
    //----helpers-----
    function resizeRootEm() {
        document.documentElement.style.fontSize = 1.2 * window.innerWidth / 100 + 10 + "px";
    }
    function centerPlayer() {
        var dimensions = id("content").getBoundingClientRect();
        var top = 1 / 2 * (window.innerHeight - dimensions.height).toFixed(2) + "px";
        var left = 1 / 2 * (window.innerWidth - dimensions.width).toFixed(2) + "px";
        content.style.top = top;
        content.style.left = left;
        menu.style.top = top;
        menu.style.left = left;
    }
    function alignSliders(){
        var sliderStats = colorSlider.getBoundingClientRect();
        shadowSlider.style.position = "absolute";
        shadowSlider.style.left = sliderStats.left + "px";
        shadowSlider.style.top = sliderStats.top  + "px";
        shadowSlider.value = colorSlider.value;

    }
    //-------------------
    function resizeAndCenter() {
        resizeRootEm();
        centerPlayer();
        alignSliders();
    }
    //-------------
}
//----------
function addPlaylistNamesToBox() {
    for (var userName in lists) {
        addNameToBox(userName);
        /**
            Let the addNameToBox() function
            sort out duplicates
        */
    }
}
//----------
function getNewList(e) {
    var enterKey = 13;
    if (e.keyCode && e.keyCode !== enterKey) {
        return;
    }
    // add to remove list
    addToRemoveList(gitName.value);
    //point to url
    var url = "https://" + gitName.value + ".github.io/music/list.json";
    ajax.open("GET", url);
    ajax.send();
    //------------
    ajax.onload = function () {
        if (ajax.status === 200) {
            saveNewList();
        } else {
            alert("Trouble getting list:\n" + ajax.response);
        }
    };
}
//----------
function saveNewList() {
    toggleMenu();
    var newname = gitName.value.toLowerCase().trim();
    if (!lists[newname]) {
        //save new list to our lists object
        var newListObject = JSON.parse(ajax.response);
        var sortedListObject = sortedListByArtist(newListObject);
        newListObject = sortedListObject;
        lists[newname] = newListObject;
        addNameToBox(newname);
        sendListToServer(lists);
        //if only one list ...
        if(Object.keys(lists).length === 1){
            chooser.selectedIndex = 1;
            changePlayList();
        }
    }
    storeListsToBrowser(lists);
}
//----------
function addNameToBox(newGitName) {
    //make a real array of options from chooser
    var opsArray = [].slice.call(chooser.options, 0);
    namesArray = [];
    opsArray.forEach(function (m) {
        namesArray.push(m.innerHTML);
    });
    //add newGitName only if not aready there
    if (namesArray.indexOf(newGitName) === -1) {
        var op = document.createElement("option");
        op.innerHTML = newGitName;
        chooser.appendChild(op);
        gitName.value = "";
        gitName.placeholder = newGitName + " playlist saved";
    }
}
//----------
function changePlayList(e) {
    //turnShuffleOff();
    turnShuffle2Off();
    //searchBox.value="";
    if (chooser.selectedIndex === 0) {
        playlist.innerHTML = "";
        var topOption = document.createElement("option");
        topOption.innerHTML = playlistHeader;
        playlist.appendChild(topOption);
        playlist.selectedIndex = 0;
        return;
    }
    var list = chooser.options[chooser.selectedIndex].innerHTML;
    currentPlayListName = list;
    currentUrl = "https://" + list + ".github.io" + "/music/";
    songsArray = propNames(lists[list]);
    songsArrayBackup = songsArray;

    playlist.innerHTML = "";
    var header = document.createElement("option");
    header.innerHTML = playlistHeader;
    playlist.appendChild(header);
    songsArray.forEach(function (m) {
        var artistTitle = lists[list][m].artist + " - " + lists[list][m].title;
        var option = document.createElement("option");
        option.innerHTML = artistTitle;
        playlist.appendChild(option);
    });
    flashObjectColor(playlist, "white", 0.3);
    flashObjectStyle(playlist, "textShadow", "1px 1px 1px black", 0.4);
}
//----------

function sendListToServer(listObject) {
    var listString = JSON.stringify(listObject);
    var listSender = new XMLHttpRequest();
    var form = new FormData();
    listSender.open("POST", "phpfiles/getPlaylists.php");
    form.append("lists", listString);
    listSender.send(form);
    //----------------------
    listSender.onload = function () {
        if (listSender.status !== 200) {
            alert(listSender.response);
        }
    };
}
//-------
function flashObjectColor(object, color, durationSeconds) {
    if (busyFlashingColor) return;
    busyFlashingColor = true;
    var oldColor = object.style.color;
    object.style.color = color;
    setTimeout(function () {
        object.style.color = oldColor;
        busyFlashingColor = false;
    }, 1000 * durationSeconds);
}
//-----
function flashObjectStyle(object, style, value, durationSeconds) {
    if (busyFlashingStyle) return;
    busyFlashingStyle = true;
    var oldStyle = object.style[style];
    object.style[style] = value;
    setTimeout(function () {
        object.style[style] = oldStyle;
        busyFlashingStyle = false;
    }, 1000 * durationSeconds);
}
//---------
function sortedListByArtist(object){
    var artist, title, joiner = "```";//tripple backtick unlikely to conflict
	//first gather the song filenames (keys of the list object)
	var recordNames = Object.keys(object);
	//prepare for a list of primary keys: artist```title
	var primaryKeys = [];
	//combine the artist and title of each song
	recordNames.forEach(function(m){
		artist = object[m].artist;
		title = object[m].title;
		var primaryKey = artist + joiner + title;
		primaryKeys.push(primaryKey);
	});
	//of course sort the primary keys. This is the central action
	primaryKeys.sort();

	//prepare for a sorted collection of song filenames (keys of the list object)
	var sortedObject = {};
	for(var i=0; i < primaryKeys.length; i++){
		artist = primaryKeys[i].split(joiner)[0];
		title = primaryKeys[i].split(joiner)[1];
		/*
			1.) Iterate through each member of the original object & look for this artist.
			2.) Match this artist to this title in the orignal object.
			3.) Save the original song to the new object song list.
			4.) Return the completed sorted object.
		*/
		//1.) Iterate through each, etc. ...
		for(var aSong in object){
			if(object[aSong].artist === artist){
				//2.) Match this artist to this title, etc. ...
				if(object[aSong].title === title){
				    //3.) Save the origianl song, etc..
					sortedObject[aSong] = object[aSong];
				}
			}
		}
	}
	//4.) return the sorted object.
	return sortedObject;
}//===| end of sortedListByArtist() |=====
//----------
function toggleMenu(){
    if(menuOpen){
        menu.style.transition = "all 1s ease";
        menu.style.visibility = "hidden";
        menu.style.opacity = 0;
        menuOpen = false;
    }
    else{
        menu.style.transition = "all 1s ease";
        menu.style.visibility = "visible";
        menu.style.opacity = 1;
        menuOpen = true;
    }
}
//-------
function subList(string, list){
/**
 * A function that is given a string and an array.
 * It returns a (possibly) smaller array of elements
 * that match the string.
 * It returns nothing if both the string and array
 * are not provided.
*/
	var returnList = null;

	//test the arguments
	if(list === undefined){
		return;
	}
	else if(typeof string !== "string"){
		return;
	}
	else if(typeof list !== "object"){
		return;
	}
	//done testing arguments

	if(type(list) === "Array"){
		buildSubArray();
	}
	else{
		buildSubObject();
	}
	return returnList;

	//---helper functions---
	function buildSubArray(){
		returnList = [];
		if(string.length !== 0){
			list.forEach(function(m){
				if(m.toLowerCase().indexOf(string.toLowerCase()) !== -1){
					returnList.push(m);
				}
			});
		}
	}
	//----
	function buildSubObject(){
		returnList={};
		if(string.length !== 0){
			for(var prop in list){
				if(prop.toLowerCase().indexOf(string.toLowerCase()) !== -1){
					returnList[prop] = list[prop];
				}
			}
		}
	}
	//----
	function type(arg){
		var prefix = '[object ';
		var trueType = {}.toString.call(arg);
		trueType = trueType.slice(prefix.length, trueType.length-1);
		return trueType;
	}
	//---end of helpers--
}//=====| END of subList() |==========
//-------
function substringSubarray(string, array){
/**
 * A function that is given a string and an array.
 * It returns a (possibly) smaller array of elements
 * that match the string.
 * It returns nothing if both the string and array
 * are not provided.
*/
	//Needs both arguments, else returns nothing
	if(array === undefined){
		return [];
	}
	//first argument needs to be string
	else if(typeof string !== 'string'){
		return [];
	}
	//second argument needs to be an array
	else if(type(array) !== '[object Array]'){
		return [];
	}

	return matchedArray();

	//---| helper function |---
	function type(thing){
		return {}.toString.call(thing);
	}
	function matchedArray(){
		var newArray = [];
		//fill this array with the items that match the string
		array.forEach(function(m){
			//push m to the newArray,
			//if it contains the substring
			//ignoring case
			if(m.toLowerCase().indexOf(string.toLowerCase()) !== -1){
				newArray.push(m);
			}
		});
		return newArray;
	}
}//===| END of substringSubarray() |===
//-------
function expandPicture(e){
    var me = e.target;
    me.style.position = "fixed";
    me.style.right="0";
    me.style.top = "0";
    me.style.left = "0";
    me.style.bottom= "0";
    me.style.margin= "auto";
    me.style.height = "100%";
    me.style.width = "100%";
}
//--------------
function contractPicture(e){
    var me = e.target;
    me.style.width = "7rem";
    me.style.height = "7rem";
    setTimeout(function(){
        me.style.position = "relative";
        me.style.float = "right";
        me.style.marginRight = "2rem";
        me.style.marginBottom = "1.5rem";        
    },800);
}

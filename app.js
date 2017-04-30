var YOUTUBE_BASE_URL = "https://www.googleapis.com/youtube/v3/search";
var nextPageToken = null;
var prevPageToken = null;
var prevPageCount = 0;

//scrolls body to result sections
function goToResults(){
	$('html,body').animate({
        scrollTop: $("#results-section").offset().top},
        'slow');
};


//enables and disables navigation buttons
function buttonControl(){
	if (nextPageToken === null){
		$(".js-next-button").addClass("hidden")
	}
	else {
		$(".js-next-button").removeClass("hidden")
	}
	if (prevPageToken === null || prevPageCount == 0){
		$(".js-previous-button").addClass("hidden")
	}
	else {
		$(".js-previous-button").removeClass("hidden")
	}
}

// grabs json data from api, takes arguments
// searchTerm which is the user entered search
//call back which displays the data
//t which is the page token
function getDataFromAPI(searchTerm, callback, t){
	var query = {
		pageToken: t,
		part: 'snippet',
		key: "AIzaSyDa-7rsVeanOqJ2vQiWkNX4-t7RB3XZVV4",
		q: searchTerm,
		maxResults: 6,
		type: "video",
	}
	$.getJSON(YOUTUBE_BASE_URL, query, callback);
}

//function edits the DOM to display the data
function displayYoutubeSearchData(data){
	var resultElement= "";
	if (data.items){
		data.items.forEach(function(item){
			resultElement += //adds below code for each item in the json file
			"<div class=\'col-sm-12 col-lg-6 result\'>" + 
				"<div class=\"item-container\">" + //sets bootstrap div and then a div inside of it
					'<p class=\'result-title\'>' + item["snippet"]["title"] + '</p>' + //places title of video above video
					"<a href=\'https://www.youtube.com/watch?v=" + item["id"]["videoId"] + "\' data-lity>"+ //creates hyperlink to lightbox around thumbnail
					"<img src=\'" + item["snippet"]["thumbnails"]["high"]["url"] + '\'>' + //places high-res thumbnail
					'</a>'+
					"<div><a class = \'btn btn-default channel-id\'href=\'https://www.youtube.com/channel/" + item["snippet"]["channelId"] + "\'><p class=\'channel-id-title\'>Similar Videos</p></a>" +
					"</div>" +	
				"</div>" +
			"</div>"; //closes both divs
		});
		nextPageToken = data["nextPageToken"]; //updates next page token
		prevPageToken = data["prevPageToken"]; //updates next page token
		buttonControl();
	}
	else {
		resultElement += '<p>No results</p>'; //displays no results if user doesn't input a valid search
	}
	$("#js-all-results").html(resultElement); //updates DOM with result Element
}

function watchSearch(){
	$("#js-search-form").submit(function(event){ //watches for form to be submitted
		event.preventDefault(); //prevents page refresh
		var query = $(this).find("#js-search").val(); //sets query to user inputted data
		getDataFromAPI(query, displayYoutubeSearchData, null); //calls function that takes user input as query, display function as callback, and null as token
		goToResults();
	});
};

function navButton(){ //creates functions for nav buttons
	$(".js-next-button").click(function(event){ //watches for next button click and loads next page of data
		var query = $("#js-search-form").find("#js-search").val(); //sets query for getdata function
		getDataFromAPI(query, displayYoutubeSearchData, nextPageToken); //calls getdata function taking user input as query, display function as callback, and nextPageToken as token
		goToResults();
		prevPageCount++;
	});

	$(".js-previous-button").click(function(event){ //watches for previous button and loads previous page of data
		var query = $("#js-search-form").find("#js-search").val(); //sets query for getdata function
		getDataFromAPI(query, displayYoutubeSearchData, prevPageToken); //calls getdata function taking user input as query, display function as callback, and prevPageToken as token
		goToResults();
		prevPageCount--;
	});
	buttonControl();
}

$(function(){ //ready function
	watchSearch();
	$( "#js-search" ).focus();
	navButton();
});
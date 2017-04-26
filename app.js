var YOUTUBE_BASE_URL = "https://www.googleapis.com/youtube/v3/search";

function getDataFromAPI(searchTerm, callback){
	var query = {
		part: 'snippet',
		key: "AIzaSyDa-7rsVeanOqJ2vQiWkNX4-t7RB3XZVV4",
		q: searchTerm
	}
	$.getJSON(YOUTUBE_BASE_URL, query, callback);
}

function displayYoutubeSearchData(data){
	var resultElement= "";
	if (data.items){
		data.items.forEach(function(item){
			resultElement += 
			"<div class=\'col-sm-12 col-md-4\'><div>" +
				"<a href=\'https://www.youtube.com/watch?v=" + item["id"]["videoId"] + "\' data-lity>"+
				"<img src=\'" + item["snippet"]["thumbnails"]["medium"]["url"] + '\'>' +
				'</a>'+
				'<p>' + item["snippet"]["title"] + '</p>' +
			"</div></div>";
		});
	}
	else {
		resultElement += '<p>No results</p>';
	}
	$("#js-all-results").html(resultElement);
}

function watchSearch(){
	$("#js-search-form").submit(function(event){
		event.preventDefault();
		var query = $(this).find("#js-search").val();
		getDataFromAPI(query, displayYoutubeSearchData);
	});
}

$(function(){
	watchSearch();
});
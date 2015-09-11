$(document).ready(function() {



    twitchSearch();

});

function twitchSearch() {
    var searchTerm = "";
    var searchType = "";

    $("#search-btn").on('click', function(e) {
        e.preventDefault();
        searchTerm = $("#search-input").val();
        console.log(searchTerm);
        twitchApiSearchCall(searchType, searchTerm);
    });

    $(".search-type").on('click', function(e) {
        e.preventDefault();
        searchType = $(this).attr("data-id");

    });
}

function twitchApiSearchCall(searchType, searchTerm) {

    var urlString = "";

    if(searchType === "games") {
        urlString = "https://api.twitch.tv/kraken/search/games?type=suggest"
    } else {
        urlString = "https://api.twitch.tv/kraken/search/" + searchType + "?";
    }

    $.ajax({
        url: urlString,

        data: {
            q: searchTerm,
            limit: 13

        },
        success: function (response) {
            console.log(response);
            var data = [];
            if(searchType === "channels") {
                data = response.channels;
            } else if(searchType === "streams") {
                data = response.streams;
            } else {
                data = response.games;
            }

            displaySearchResults(data);


        }
    });

    $("#page-title").html("Twitch.tv/" + searchType + "/" + searchTerm);
    $("#sort-pop").addClass('active');

}

function displaySearchResults(data) {

    $(".index").fadeOut('slow', function() {

    });

    console.log(data);


}







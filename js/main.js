$(document).ready(function() {


main();


});

function main() {

    var next = '';
    var self = '';
    var prev = '';


    twitchSearch();

    $("#page-previous").on('click', function() {
       if(prev) {
           pagePrev();
       }
    });


    $("#page-next").on('click', function() {
       if(next) {
           pageNext();
       }

    });


    function twitchSearch() {
        var searchTerm = "";
        var searchType = "";
        var params = {};
        var url = "";

        $(".search-type").on('click', function (e) {
            e.preventDefault();
            searchType = $(this).attr("data-id");

        });

        $("#search-btn").on('click', function (e) {
            e.preventDefault();
            if(!searchType) {
                searchType = "channels";
            } else if (searchType === "games") {
                url = "https://api.twitch.tv/kraken/search/games?type=suggest"
            } else {
                url = "https://api.twitch.tv/kraken/search/" + searchType + "?";
            }
            searchTerm = $("#search-input").val();
            params = {'q': searchTerm, 'limit': 13};
            var call = new twitchApiCall(searchType, searchTerm, params, url);
            call.call();
        });


    }

    function twitchApiCall(searchType, searchTerm, params, url) {
        this.searchType = searchType;
        this.searchTerm = searchTerm;
        this.params = params;
        this.url = url;


        this.call = function() {
            $.ajax({
                url: this.url,

                data: this.params,

                success: function (response) {
                    var data = [];
                    next = response._links.next;
                    prev = response._links.prev;
                    console.log(next + " - " + self);
                    if (searchType === "channels") {
                        data = response.channels;
                    } else if (searchType === "streams") {
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
    }




    /*function twitchApiSearchCall(searchType, searchTerm, params, url) {

        var urlString = "";
        if (url) {
            urlString = url;
            params = {};
        } else if (searchType === "games") {
            urlString = "https://api.twitch.tv/kraken/search/games?type=suggest"
        } else {
            urlString = "https://api.twitch.tv/kraken/search/" + searchType + "?";
        }


        $.ajax({
            url: urlString,

            data: params,

            success: function (response) {
                console.log(response);
                var data = [];
                next = response._links.next;
                prev = response._links.prev;
                console.log(next + " - " + self);
                if (searchType === "channels") {
                    data = response.channels;
                } else if (searchType === "streams") {
                    data = response.streams;
                } else {
                    data = response.games;
                }

                displaySearchResults(data);

            }
        });

        $("#page-title").html("Twitch.tv/" + searchType + "/" + searchTerm);
        $("#sort-pop").addClass('active');

    }*/


    function displaySearchResults(data) {
        console.log(data);
        $(".index").fadeOut('slow');
        $("#main-row").fadeOut('slow', function () {
            $("#main-row").empty();
            for (var i = 0; i < data.length; i++) {
                $("#main-row").append('<div class="col-md-4"><div class="well stream-blocks"><div class="row"><div class="col-sm-12 text-center"><h4>' + data[i].display_name + '</h4></div></div><div class="row"><div class="col-md-6"><img class="stream-images img-responsive" src="' + data[i].logo + '"></div><div class="col-md-6 text-center"><h5>offline</h5><h5>' + data[i].views + ' Total Views</h5><h5>' + data[i].followers + ' Followers</h5><h5><a href="' + data[i].url + '" target="_blank">View on Twitch</a> </h5></div></div></div></div>');

            }
        });

        $("#main-row").fadeIn('slow');

    }

    function pageNext() {
        console.log(next);
    }

    function pagePrev() {
        console.log(prev);
    }

}








$(document).ready(function() {


    main();




});

function main() {

//Declare main() variables
    var next = '';
    var self = '';
    var prev = '';
    var searchType = 'channels';




    //Click event handlers
    $(".search-type").on('click', function(e) {
        e.preventDefault();
        searchType = $(this).attr("data-id");

    });

    $("#search-btn").on('click', function(e) {
        e.preventDefault();
        var searchTerm = $("#search-input").val();
        twitchSearch(searchTerm);
    });

    $("#featured").on('click', function(e) {
        e.preventDefault();

    });





    $("#page-previous").on('click', function() {
       if(prev) {
           pagePrev();
       }
    });


    $("#page-next").on('click', function() {
       if(next) {
           pageNext();
           console.log(next);
       }

    });






    function twitchSearch(searchTerm) {
        var params = {'q': searchTerm, 'limit': 9};
        var url = "https://api.twitch.tv/kraken/search/" + searchType + "?";

        if(searchType === "games") {
            url = "https://api.twitch.tv/kraken/search/games?type=suggest";
            TwitchApiCall(params, url, function(data) {
                displaySearchResults(data.games);
            });

        } else if (searchType === "channels") {
            TwitchApiCall(params, url, function(data) {
                displaySearchResults(data.channels);
            });

        } else {
            TwitchApiCall(params, url, function(data) {
                displaySearchResults(data.streams);
            });
        }
        $("#page-title").html("Twitch.tv/" + searchType + "/" + searchTerm);
        $("#sort-pop").addClass('active');
    }

    //API call
    function TwitchApiCall(params, url, callback) {
        if(params === '') {
            $.ajax({
                url: url,
                success: function (response) {
                    next = response._links.next;
                    prev = response._links.prev;
                    console.log(response);
                    callback(response);
                },
                error: function (jqXHR, textStatus) {
                    $("#main-row").append('<div class="col-md-12"><div class="well error-well stream-blocks"><h3>The request has failed: ' + textStatus + '</h3></div></div>');
                }
            });
        } else {
            $.ajax({
                url: url,
                data: params,
                success: function(response) {
                    next = response._links.next;
                    prev = response._links.prev;
                    console.log(response);
                    callback(response);
                },
                error: function(jqXHR, textStatus) {
                    $("#main-row").fadeOut('slow', function () {
                        $("#main-row").empty();
                        $("#main-row").append('<div class="col-md-12"><div class="well error-well stream-blocks"><h3>The request has failed: ' + textStatus + '</h3></div></div>');
                        $("#main-row").fadeIn('slow');
                    })
                }
            });
        }



    }


    function displaySearchResults(data) {
        $(".index").fadeOut('slow');
        $("#main-row").fadeOut('slow', function () {
            $("#main-row").empty();
            for (var i = 0; i < data.length; i++) {
                var displayName = data[i].display_name;
                var logo = '';
                if(data[i].logo) {
                    logo = data[i].logo;
                } else {
                    logo = "images/offline.png"
                }
                var views = data[i].views;
                var followers = data[i].followers;
                var twitchLink = data[i].url;

                $("#main-row").append('<div class="col-md-4"><div class="well stream-blocks"><div class="row"><div class="col-sm-12 text-center"><h4>' + displayName + '</h4></div></div><div class="row"><div class="col-md-6"><img class="stream-images img-responsive" src="' + logo + '"></div><div class="col-md-6 text-center"><h5>offline</h5><h5>' + views + ' Total Views</h5><h5>' + followers + ' Followers</h5><h5><a href="' + twitchLink + '" target="_blank">View on Twitch</a></h5></div></div></div></div>');
            }
        });
        $("#main-row").fadeIn('slow');
    }

    function pageNext() {
        console.log(next);
        var params = '';
        TwitchApiCall(params, next, function(data) {
            data = data;
            displaySearchResults(data.channels);
        });

    }

    function pagePrev() {
        console.log(prev);
        var params = '';
        TwitchApiCall(params, prev, function(data) {
            data = data;
            displaySearchResults(data.channels);
        });
    }








}








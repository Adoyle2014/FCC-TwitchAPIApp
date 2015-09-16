$(document).ready(function() {


    main();




});

function main() {

//Declare main() variables
    var next = '';
    var self = '';
    var prev = '';
    var searchType = 'channels';



//Click event handlers============================
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
        twitchFeaturedStreams();
    });

    $("#game-streams").on('click', function(e) {
        e.preventDefault();
        twitchGameStreams();
    });

    $("#top-videos").on('click', function(e) {
        e.preventDefault();
        twitchTopVideos();
    });

    $("#top-games").on('click', function(e) {
        e.preventDefault();
        twitchTopGames();
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




//Get API call data============================
    function twitchFeaturedStreams() {
        var params = {'limit': 9};
        var url = "https://api.twitch.tv/kraken/streams/featured?";
        TwitchApiCall(params, url, function(data) {
            displayStreamsResults(data);
        });
    }

    function twitchGameStreams() {
        var params = {'game': "*", 'limit': 9};
        var url = "https://api.twitch.tv/kraken/streams?";
        TwitchApiCall(params, url, function(data) {
            displayStreamsResults(data);
        });
    }

    function twitchTopGames() {
        var params = {'limit': 9};
        var url = "https://api.twitch.tv/kraken/games/top?";
        TwitchApiCall(params, url, function(data) {
            displayGamesResults(data);
        });
    }

    function twitchTopVideos() {
        var params = {'limit': 9};
        var url = "https://api.twitch.tv/kraken/videos/top?";
        TwitchApiCall(params, url, function(data) {
            displayVideosResults(data);
        });
    }

    function twitchSearch(searchTerm) {
        var params = {'q': searchTerm, 'limit': 9};
        var url = "https://api.twitch.tv/kraken/search/" + searchType + "?";

        if(searchType === "games") {
            url = "https://api.twitch.tv/kraken/search/games?type=suggest";
            TwitchApiCall(params, url, function(data) {
                displayGamesResults(data.games);
            });

        } else if (searchType === "channels") {
            TwitchApiCall(params, url, function(data) {
                displayChannelResults(data.channels);
            });

        } else {
            TwitchApiCall(params, url, function(data) {
                displayStreamsResults(data.streams);
            });
        }
        $("#page-title").html("Twitch.tv/" + searchType + "/" + searchTerm);
        $("#sort-pop").addClass('active');
    }









//Display results of api calls=====================
    function displayStreamsResults(data) {
        console.log(data);
        $(".index").fadeOut('slow');
        $("#main-row").fadeOut('slow', function () {
            $("#main-row").empty();

            for (var i = 0; i < data.length; i++) {
                var game = data[i].game;
                var viewers = data[i].viewers;
                var streamId = data[i]._id;
                var channelId = data[i].channel._id;
                var channelName = data[i].channel.display_name;
                var channelFollowers = data[i].channel.followers;
                var channelViews = data[i].channel.views;
                var channelUrl = data[i].channel.url;
                var channelLogo = data[i].channel.logo;
                var channelStatus = data[i].channel.status;
                var channelVideosLink = data[i].channel._links.videos;
                var previewMedium = data[i].preview.medium;







            }
        });
        $("#main-row").fadeIn('slow');


    }

    function displayGamesResults(data) {

    }

    function displayChannelResults(data) {
        $(".index").fadeOut('slow');
        $("#main-row").fadeOut('slow', function () {
            $("#main-row").empty();
            for (var i = 0; i < data.length; i++) {
                var displayName = data[i].display_name;
                var logo = '';
                var views = data[i].views;
                var followers = data[i].followers;
                var twitchLink = data[i].url;
                var videoLink = data[i]._links.videos;
                if(data[i].logo) {
                    logo = data[i].logo;
                } else {
                    logo = "images/offline.png"
                }


                $("#main-row").append('<div class="col-md-4"><div class="well stream-blocks"><div class="row"><div class="col-sm-12 text-center"><h4>' + displayName + '</h4></div></div><div class="row"><div class="col-md-6"><img class="stream-images img-responsive" src="' + logo + '"></div><div class="col-md-6 text-center"></div></br><h5>' + views + ' Total Views</h5><h5>' + followers + ' Followers</h5><h5><a href="' + twitchLink + '" target="_blank">View on Twitch</a></h5><h5>Check out ' + displayName + '\'s <a href="' + videoLink + '">videos</a></h5></div></div></div></div>');
            }
        });
        $("#main-row").fadeIn('slow');
    }




//Pagination========================
    function pageNext() {
        console.log(next);
        var params = '';
        TwitchApiCall(params, next, function(data) {
            return (data.channels);
        });
    }

    function pagePrev() {
        console.log(prev);
        var params = '';
        TwitchApiCall(params, prev, function(data) {
            data = data;
            displayChannelResults(data.channels);
        });
    }


//API call===================================
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






}








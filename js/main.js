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
    $("#search-input").on('focus', function(e) {
        e.preventDefault();
        if(!searchType) {
            searchType = "channels";
        }

    });

    $(".search-type").on('click', function(e) {
        e.preventDefault();
        searchType = $(this).attr("data-id");

    });

    $("#search-btn").on('click', function(e) {
        e.preventDefault();
        var searchTerm = $("#search-input").val();
        if(searchType != "channels" || searchType != "streams" || searchType != "games") {
            searchType = "channels";
        }
        twitchSearch(searchTerm);
    });

    $("#featured").on('click', function(e) {
        e.preventDefault();
        searchType = $(this).attr("data-id");
        twitchFeaturedStreams();
    });

    $("#game-streams").on('click', function(e) {
        e.preventDefault();
        twitchGameStreams();
    });

    $("#top-videos").on('click', function(e) {
        e.preventDefault();
        twitchVideos();
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
       }
    });

    $("#main-row").on('click', '.showChannelVideos', function(e) {
        e.preventDefault();
        var dataUrl = $(this).attr("data-url");
        twitchVideos(dataUrl);
    });




//Get API call data============================
    function twitchFeaturedStreams() {
        var params = {'limit': 8};
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

    function twitchVideos(url) {
        var params = {'limit': 9};
        if(!url) {
            url = "https://api.twitch.tv/kraken/videos/top?";
        }
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
        data = data.featured;
        $(".index").fadeOut('slow');
        $("#main-row").fadeOut('slow', function () {
            $("#main-row").empty();

            var game, viewers, streamTitle, streamId, channelId, channelName, channelFollowers, channelViews, channelUrl, channelLogo, channelStatus, channelVideosLink, previewMedium;

            for (var i = 0; i < data.length; i++) {
                game = data[i].stream.game;
                viewers = data[i].stream.viewers;
                streamTitle = data[i].title;
                streamId = data[i].stream._id;
                channelId = data[i].stream.channel._id;
                channelName = data[i].stream.channel.display_name;
                channelFollowers = data[i].stream.channel.followers;
                channelViews = data[i].stream.channel.views;
                channelUrl = data[i].stream.channel.url;
                channelLogo = data[i].stream.channel.logo;
                channelStatus = data[i].stream.channel.status;
                channelVideosLink = data[i].stream.channel._links.videos;//use with call to twitchApiCall
                previewMedium = data[i].stream.preview.medium;

                $("#main-row").append('<div class="col-md-6"><div class="well stream-blocks"><div class="row row-margin-bottom-20"><div class="col-sm-12 text-center"><h3>' + streamTitle +'</h3></div></div><div class="row"><div class="col-md-6"><h4 class="text-center">' + game + '</h4><img class="stream-images" src="' + previewMedium + '"><div class="col-md-6"><h5>' + viewers + ' viewing Live</h5></div><div class="col-md-6"><h5><a href="' + channelUrl + '" target="_blank">Watch on Twitch</a></h5></div></div><div class="col-md-6 text-center"><h4><a href="' + channelUrl + '" target="_blank">' + channelName + '</a></h4><h5>Check out ' + channelName + 's <a href="#" class="showChannelVideos" data-url="' + channelVideosLink + '">videos!</a></h5><img class="stream-channel-logo" src="' + channelLogo + '"><h5>' + channelViews + ' Total Views</h5><h5>' + channelFollowers + ' Followers</h5></div></div></div></div>');
            }

        });
        $("#page-title").html("Featured Streams");
        $("#sort-pop").addClass('active');
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
            if(searchType === "featured") {
                displayStreamsResults(data)
            } else {
                displayChannelResults(data.channels);
            }
        });
    }

    function pagePrev() {
        console.log(prev);
        var params = '';
        TwitchApiCall(params, prev, function(data) {
            if(searchType === "featured") {
                displayStreamsResults(data)
            } else {
                displayChannelResults(data.channels);
            }
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
                    callback(response);
                    $("#pagination").removeClass("hidden");
                    if (!prev) {
                        $("#page-previous").addClass("disabled");
                    } else {
                        $("#page-previous").removeClass("disabled");
                    }
                    if(!next) {
                        $("#page-next").addClass("disabled");
                    }
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
                    callback(response);
                    $("#pagination").removeClass("hidden");
                    if (!prev) {
                        $("#page-previous").addClass("disabled");
                    } else {
                        $("#page-previous").removeClass("disabled");
                    }
                    if(!next) {
                        $("#page-next").addClass("disabled");
                    }

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








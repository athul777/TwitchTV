/*
    This is a project that displays TwitchTV information for some users.
    It displays whether the user is online, prints a description if any and also
    displays the logo. 
*/

//New array for pushing each streamer object that stores all the data for all the streamers. Online, Offline are for all objects that are either online or offline. searchBox is for determining which array should be used in the search box while looping through to search for matching strings.
var streamInfoArr = [];
var onlineStreamersArr = [];
var offlineStreamerArr = [];
var searchBoxArr = streamInfoArr;

//List of streamers in an array.
var streamersArr = ['freecodecamp', 'chess', 'storbeck', 'riotgames', 'RobotCaleb', 'medrybw', 'itshafu', 'justin', 'KittyPlaysGames', 'sodapoppin', 'trumpsc'];

//Transfers data from the getJSON methods and assigns them to a streamer object and subsequently pushes each streamer object to the streamInfoArr array. This function also calls the createDiv method.
function transferData(display_name, bio, logo, link, isStreaming) {
    var streamer = {
        display_name: "",
        bio: "",
        logo: "",
        links: {
            self: ""
        },
        isStreaming: ""
    };
    streamer.display_name = display_name;
    streamer.bio = bio;
    streamer.logo = logo;
    streamer.links.self = "https://twitch.tv/" + display_name;
    streamer.isStreaming = isStreaming;
    streamInfoArr.push(streamer);
    createDiv(streamer);
}

//The createDiv method appends each streamer's information to #streamer-list.
function createDiv(obj) {
    var description;
    if (obj.bio === null || obj.bio === undefined) {
        description = "No description available.";
    } else {
        description = obj.bio;
        if (description.length >= 55) {
            description = description.substr(0, 53) + '...';
        }
    }
    
    if (obj.isStreaming === null) {
        $('#streamer-list').append("<a class = 'link-to-twitch' href = '"+obj.links.self+"' target = '_blank'><div class = 'streamer-wrapper'><img class = 'streamer-image' src='"+obj.logo+"'></img><div class = 'channel-text'><div class = 'streamer-text oxygen'>"+obj.display_name+"</div><div class = 'description-text openSans'>"+description+"</div></div><div class = 'is-streaming-logo'><i class = 'fa fa-times x-icon'></i></div></div></a>");
    }
    else {
        $('#streamer-list').append("<a class = 'link-to-twitch' href = '"+obj.links.self+"' target = '_blank'><div class = 'streamer-wrapper'><img class = 'streamer-image' src='"+obj.logo+"'></img><div class = 'channel-text'><div class = 'streamer-text oxygen'>"+obj.display_name+"</div><div class = 'description-text openSans'>"+description+"</div></div><div class = 'is-streaming-logo'><i class = 'fa fa-play play-icon'></i></div></div></a>");
    }
}

//Deletes all Divs. This method is used when clicking the All, Online, and Offline buttons.
function deleteDivs () {
    $('.streamer-wrapper').remove();
    $('.link-to-twitch').remove();
    $('.streamer-image').remove();
    $('.channel-text').remove();
    $('.streamer-text').remove();
    $('.description-text').remove();
    $('.is-streaming-logo').remove();
}

$(document).ready(function() {
    //Gets each streamers' JSON information.
    streamersArr.forEach(function(user) {
        $.getJSON("https://api.twitch.tv/kraken/users/"+user+"/?callback=?", function(element) {
            var username = element.display_name;
            var bio = element.bio;
            var logo = element.logo;
            var link = element._links.self;
            //console.log("test!");
            $.getJSON("https://api.twitch.tv/kraken/streams/"+user+"/?callback=?", function(elementstream) {
                var isStreaming = elementstream.stream;
                transferData(username, bio, logo, link, isStreaming);
            });
        });
    });
    
    //When each button is clicked.
    $('#all-button').click(function() {
        deleteDivs();
        $(this).addClass('arrow-pointer');
        $('#offline-button').removeClass('arrow-pointer');
        $('#online-button').removeClass('arrow-pointer');
        streamInfoArr.forEach(function(streamer) {
            createDiv(streamer);
        });
        searchBoxArr = streamInfoArr;
    });
    
    $('#online-button').click(function() {
        onlineStreamersArr = [];
        deleteDivs();
        $(this).addClass('arrow-pointer');
        $('#all-button').removeClass('arrow-pointer');
        $('#offline-button').removeClass('arrow-pointer');
        streamInfoArr.forEach(function(streamer) {
            if (streamer.isStreaming !== null) {
                createDiv(streamer);
                onlineStreamersArr.push(streamer);
            }
        });
        searchBoxArr = onlineStreamersArr;
    });
    
    $('#offline-button').click(function() {
        offlineStreamerArr = [];
        deleteDivs();
        $(this).addClass('arrow-pointer');
        $('#all-button').removeClass('arrow-pointer');
        $('#online-button').removeClass('arrow-pointer');
        streamInfoArr.forEach(function(streamer) {
            if (streamer.isStreaming === null) {
                createDiv(streamer);
                offlineStreamerArr.push(streamer);
            }
        });
        searchBoxArr = offlineStreamerArr;
    });
    
    //Search
    $('#search-box').on('input', function() {
        var searchStr = $('#search-box').val().toLowerCase();
        deleteDivs();
        searchBoxArr.forEach(function(user) {
            //Function returns true if substring in the search box is found in the display name and false if it isn't.
            var isMatch = function() {
                return user.display_name.toLowerCase().indexOf(searchStr) > -1;
            }
            if (isMatch() == true) {
                createDiv(user);
            }
        });
    });
});
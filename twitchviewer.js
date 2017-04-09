var streamersArr = ['freecodecamp', 'chess', 'storbeck', 'riotgames', 'RobotCaleb', 'medrybw', 'itshafu', 'justin', 'KittyPlaysGames', 'sodapoppin', 'trumpsc'];

function createDivs (num) {
    for (var i=0; i<num; i++) {
        var idStr = i.toString();
        $('#streamer-list').append('<a class = "link-to-twitch" id="twitchlink'+idStr+'"></a>');
        $('#twitchlink' + idStr).append('<div class = "streamer-wrapper" id="wrapper'+idStr+'"></div>');
        $('#wrapper' + idStr).append('<div class = "streamer-container" id="container'+idStr+'"></div>')
        $('#container' + idStr).append('<div class = "streamer-image" id="image'+idStr+'"></div>');
        $('#container' + idStr).append('<div class = "channel-text" id="channel-text'+idStr+'"></div>');
        $('#channel-text' + idStr).append('<div class = "streamer-text" id="text'+idStr+'"></div>');
        $('#channel-text' + idStr).append('<div class = "description-text" id="description'+idStr+'"></div>');
        $('#container' + idStr).append('<div class = "is-streaming-logo" id="is-streaming-logo'+idStr+'"></div>');
    } 
}

function getTwitchData (arr) {
    var displayName;
    var logo;
    var description;
    var stream;
    for (var i=0; i<arr.length; i++) {
        var idStr = i.toString();
        (function (i) {
            $.getJSON("https://api.twitch.tv/kraken/users/"+arr[i]+"/?callback=?", function (data) {
                var idStr = i.toString();
                displayName = data.display_name;
                logo = data.logo;
                description = data.bio;
                if (description === null) {
                    description = 'No Description Available';
                }
                else if (description.length >= 55) {
                    description = description.substr(0, 53) + '..';
                }
                
                $('<img src="'+logo+'">').appendTo('#image' + idStr).addClass('main-image');
                $('#text' + idStr).html(displayName).addClass('oxygen');
                $('#description' + idStr).html(description).addClass('openSans');
                $('#twitchlink' + idStr).attr('href', 'http://www.twitch.tv/' + arr[i]);
                $('#twitchlink' + idStr).attr('target', '_blank');
            });
        })(i);
    }
    
    for (var j=0; j<arr.length; j++) {
        (function (j) {
            var idStr2 = j.toString();
            $.getJSON("https://api.twitch.tv/kraken/streams/"+arr[j]+"/?callback=?", function (elem) {
                stream = elem.stream;
                if (stream === null) {
                    $('#is-streaming-logo' + idStr2).append('<i class = "fa fa-times x-icon"></i>');
                }
                else {
                    $('#is-streaming-logo' + idStr2).append('<i class = "fa fa-play play-icon"></i>');
                }
            });
        })(j);  
    }
}

function deleteDivs () {
    $('.streamer-wrapper').remove();
    $('.streamer-container').remove();
    $('.streamer-image').remove();
    $('.channel-text').remove();
    $('.streamer-text').remove();
    $('.description-text').remove();
    $('.is-streaming-logo').remove();
}


$(document).ready(function () {
    createDivs(streamersArr.length);
    getTwitchData(streamersArr);
    var stopClick = 0;
    $('#all-button').click(function (e) {
        if (e.timeStamp - stopClick > 600) {
            deleteDivs();
            var pseudostreamersArr = [];
            var onlineArr = [];
            var offlineArr = [];

            for (var i=0; i<streamersArr.length; i++) {
                pseudostreamersArr[i] = streamersArr[i];
            }
            for (var j=0; j<streamersArr.length; j++) {
                (function (j) {
                    $.getJSON("https://api.twitch.tv/kraken/streams/"+pseudostreamersArr[j]+"/?callback=?", function (elem) {
                        stream = elem.stream;

                        if (stream === null) {
                            offlineArr.push(pseudostreamersArr[j]);
                        }
                        else {
                            onlineArr.push(pseudostreamersArr[j]);
                        }
                        if (j === pseudostreamersArr.length - 1) {
                            createDivs(pseudostreamersArr.length);
                            getTwitchData(pseudostreamersArr);
                        }

                    });
                })(j);
            }
        }
        $(this).addClass('arrow-pointer');
        $('#offline-button').removeClass('arrow-pointer');
        $('#online-button').removeClass('arrow-pointer');
         
        stopClick = e.timeStamp;
    });
    $('#online-button').click(function (e) {
        if (e.timeStamp - stopClick > 600) {
            deleteDivs();
            var pseudostreamersArr = [];
            var onlineArr = [];
            var offlineArr = [];

            for (var i=0; i<streamersArr.length; i++) {
                pseudostreamersArr[i] = streamersArr[i];
            }
            for (var j=0; j<streamersArr.length; j++) {
                (function (j) {
                    $.getJSON("https://api.twitch.tv/kraken/streams/"+pseudostreamersArr[j]+"/?callback=?", function (elem) {
                        stream = elem.stream;

                        if (stream === null) {
                            offlineArr.push(pseudostreamersArr[j]);
                        }
                        else {
                            onlineArr.push(pseudostreamersArr[j]);
                        }
                        setTimeout(function () {
                            if (j === pseudostreamersArr.length - 1 && offlineArr.length + onlineArr.length == pseudostreamersArr.length) {
                                createDivs(onlineArr.length);
                                getTwitchData(onlineArr);
                            }
                        }, 500);
                    });
                })(j);
            }
            
            stopClick = e.timeStamp;
        }
        $(this).addClass('arrow-pointer');
        $('#offline-button').removeClass('arrow-pointer');
        $('#all-button').removeClass('arrow-pointer');
            
    });
    $('#offline-button').click(function (e) {
        if (e.timeStamp - stopClick > 600) {
            deleteDivs();
            var pseudostreamersArr = [];
            var onlineArr = [];
            var offlineArr = [];

            for (var i=0; i<streamersArr.length; i++) {
                pseudostreamersArr[i] = streamersArr[i];
            }
            for (var j=0; j<streamersArr.length; j++) {
                (function (j) {
                    $.getJSON("https://api.twitch.tv/kraken/streams/"+pseudostreamersArr[j]+"/?callback=?", function (elem) {
                        stream = elem.stream;

                        if (stream === null) {
                            offlineArr.push(pseudostreamersArr[j]);
                        }
                        else {
                            onlineArr.push(pseudostreamersArr[j]);
                        }
                        setTimeout(function () {
                            if (j === pseudostreamersArr.length - 1 && offlineArr.length + onlineArr.length == pseudostreamersArr.length) {
                                createDivs(offlineArr.length);
                                getTwitchData(offlineArr);
                            }
                        }, 500);
                    });
                })(j);
            }
            
            stopClick = e.timeStamp;
        }
        
        $(this).addClass('arrow-pointer');
        $('#all-button').removeClass('arrow-pointer');
        $('#online-button').removeClass('arrow-pointer');
    });
    
});
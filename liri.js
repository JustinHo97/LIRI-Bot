require("dotenv").config();
var fs = require("fs");
var keys = require("./key.js");
var Spotify = require("node-spotify-api");
var Twitter = require("twitter");
var request = require("request");
var spotify = new Spotify(keys.spotify);
var client = new Twitter(keys.twitter);
var input1 = process.argv[2];
var input2 = process.argv[3];
function check(input1, input2){
    if (input1 === "my-tweets"){
        tweets();
    }
    else if (input1 === "spotify-this-song"){
        spotifySong(input2);
    }
    else if (input1 === "movie-this"){
        movie(input2);
    }
    else if (input1 === "do-what-it-says"){
        itSays();
    }
    else {
        console.log("Invalid Command");
    }
}

function tweets(){
    client.get("statuses/user_timeline", function(error, tweets, response){
        if (err){
            console.log(err);
            return;
        }
        for (var i = 0; i < tweets.length; i++){
            console.log(tweets[i].created_at);
            console.log(tweets[i].text+"\r\n");
        }
    })
}

function spotifySong(input2){
    spotify.search({ type: "track", query: input2}, function(err, data){
        if (err){
            console.log(err);
            return;
        }
        if (data.tracks.total === 0){
            spotifySong("The Sign");
            return;
        }
        let track = data.tracks.items[0];
        console.log("Artists: " + track.artists[0].name);
        console.log("Track: " + track.name);
        console.log("Spotify Link: " + track.external_urls.spotify);
        console.log("Album: " + track.album.name);
    })
}

function movie(input2){
    var queryUrl = "http://www.omdbapi.com/?t=" + input2 + "&y=&plot=short&apikey=trilogy";

    request(queryUrl, function (error, response, body){
        if (!error && response.statusCode === 200){
      
          var result = JSON.parse(body);
          console.log("Title: " + result.Title);
          console.log("Release year: " + result.Year);
          console.log("IMDB Rating: " + result.imdbRating);
          console.log("Rotten Tomatoes Rating: " + result.Ratings[1].Value);
          console.log("Country: " + result.Country);
          console.log("Language: " + result.Language);
          console.log("Plot: " + result.Plot);
          console.log("Actors: " + result.Actors);
          
        }
      })
}

function itSays(){
    fs.readFile("./random.txt", "utf8", function(err, data){
        var dataArr = data.split(",");
        check(dataArr[0], dataArr[1]);
    })
}
check(input1, input2);
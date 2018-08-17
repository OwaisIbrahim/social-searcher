"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var fs = require("fs");
var readline = require("readline");
var dotenv = require("dotenv");
dotenv.config();
var googleapis_1 = require("googleapis");
var OAuth2 = googleapis_1.google.auth.OAuth2;
// If modifying these scopes, delete your previously saved credentials
// at ~/.credentials/youtube-nodejs-quickstart.json
var SCOPES = ["https://www.googleapis.com/auth/youtube.readonly"];
var TOKEN_DIR = (process.env.HOME || process.env.HOMEPATH || process.env.USERPROFILE) +
    "/.credentials/";
var TOKEN_PATH = TOKEN_DIR + "youtube-nodejs-quickstart.json";
var Youtube = /** @class */ (function () {
    function Youtube() {
        // Authorize a client with the loaded credentials, then call the YouTube API.
        this.authorize();
    }
    Youtube.prototype.authorize = function () {
        var clientSecret = process.env.YT_CLIENT_SECRET;
        var clientId = process.env.YT_CLIENT_ID;
        var redirectUrl = process.env.YT_REDIRECT_URIS;
        var oauth2Client = new OAuth2(clientId, clientSecret, redirectUrl);
        var token;
        try {
            token = fs.readFileSync(TOKEN_PATH);
            // console.log('token = '+ token);
        }
        catch (err) {
            this.getNewToken(oauth2Client);
            return;
        }
        oauth2Client.credentials = JSON.parse(token.toString("utf-8"));
        // Store the token for later use
        this._authentication = oauth2Client;
        // console.log('in Authorize auth = '+JSON.stringify(this._authentication));
    };
    Object.defineProperty(Youtube.prototype, "_authentication", {
        get: function () {
            return this.authentication;
        },
        set: function (val) {
            this.authentication = val;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Get and store new token after prompting for user authorization, and then
     * execute the given callback with the authorized OAuth2 client.
     *
     * @param {google.auth.OAuth2} oauth2Client The OAuth2 client to get token for.
     */
    Youtube.prototype.getNewToken = function (oauth2Client) {
        var authUrl = oauth2Client.generateAuthUrl({
            access_type: "offline",
            scope: SCOPES,
        });
        console.log("Authorize this app by visiting this url: ", authUrl);
        var rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout,
        });
        rl.question("Enter the code from that page here: ", function (code) {
            rl.close();
            oauth2Client.getToken(code, function (err, token) {
                if (err) {
                    console.log("Error while trying to retrieve access token", err);
                    return;
                }
                oauth2Client.credentials = token;
                // ----- this.storeToken(token); ------
                try {
                    fs.mkdirSync(TOKEN_DIR);
                }
                catch (err) {
                    if (err.code != "EEXIST") {
                        throw err;
                    }
                }
                fs.writeFile(TOKEN_PATH, JSON.stringify(token), function (err) {
                    if (err)
                        throw err;
                    console.log("Token stored to " + TOKEN_PATH);
                });
                console.log("Token stored to " + TOKEN_PATH);
                this.authentication = oauth2Client;
            });
        });
    };
    /**
     * Store token to disk be used in later program executions.
     *
     * @param {Object} token The token to store to disk.
     */
    Youtube.prototype.storeToken = function (token) {
        try {
            fs.mkdirSync(TOKEN_DIR);
        }
        catch (err) {
            if (err.code != "EEXIST") {
                throw err;
            }
        }
        fs.writeFile(TOKEN_PATH, JSON.stringify(token), function (err) {
            if (err)
                throw err;
            console.log("Token stored to " + TOKEN_PATH);
        });
        console.log("Token stored to " + TOKEN_PATH);
    };
    // Our Required Functions Starts here
    Youtube.prototype.normalizeResult = function (data) {
        var resArray = [];
        for (var i = 0; i < data.length; i++) {
            var yt = data[i];
            var params = {
                title: yt.snippet.title,
                user: yt.snippet.channelTitle,
                url: "https://www.youtube.com/embed/" + yt.id.videoId,
                views: yt.id.kind,
                desc: yt.snippet.description,
                created_time: new Date(yt.snippet.publishedAt).toUTCString(),
            };
            resArray.push(params);
        }
        return resArray;
    };
    Youtube.prototype.channelsList = function (auth, requestData, res) {
        var service = googleapis_1.google.youtube("v3");
        var parameters = requestData["params"];
        parameters["auth"] = auth;
        service.channels.list(parameters, function (err, response) {
            if (err) {
                console.log("The API returned an error: " + err);
                return;
            }
            // var str = JSON.stringify(response.data.items, 0, 2);
            res.render("code_mockup", { data: response.data.items });
        });
    };
    Youtube.prototype.searchByUsername = function (channelName) {
        var service = googleapis_1.google.youtube("v3");
        service.channels.list({
            auth: this.authentication,
            part: "snippet,contentDetails,statistics",
            forUsername: channelName,
        }, function (err, response) {
            if (err) {
                console.log("The API returned an error: " + err);
                return;
            }
            var channels = response.data.items;
            if (channels.length == 0) {
                console.log("No channel found.");
            }
            else {
                console.log("This channel's ID is %s. Its title is '%s', and " +
                    "it has %s views.", channels[0].id, channels[0].snippet.title, channels[0].statistics.viewCount);
            }
        });
    };
    Object.defineProperty(Youtube.prototype, "result", {
        get: function () {
            return this.result;
        },
        set: function (val) {
            this.result = val;
        },
        enumerable: true,
        configurable: true
    });
    //
    // search(){
    //   var service = google.youtube('v3');
    //   return service.search.list;
    // }
    /**
     * @description Function search by keyword and on basis of various criterias provided via the JSON object.
     * @param {JSON} query a json object containing the search parameters and query
     * @returns {JSON} returns a JSON object containing search results. Extract the results using obj.data
     */
    Youtube.prototype.searchByKeyword = function (reqData, resolve, reject) {
        var _this = this;
        var params = this.checkParameters(reqData);
        var service = googleapis_1.google.youtube("v3");
        service.search
            .list(params)
            .then(function (response) {
            _this.youtubeData = response.data.items;
            resolve(response.data.items);
        })
            .catch(function (err) {
            console.log(err);
            reject(err);
        });
    };
    Youtube.prototype.checkParameters = function (reqData) {
        var params = {
            auth: this.authentication,
            part: "snippet",
            q: reqData.q,
            maxResults: 5,
            order: "relevance",
            relevanceLanguage: "",
            safeSearch: "none",
        };
        if (reqData.maxResults) {
            params.maxResults = reqData.maxResults;
        }
        if (reqData.sort) {
            params.order = reqData.sort;
        }
        return params;
    };
    Youtube.prototype.resultCatcher = function (err, data) {
        if (err)
            console.log(err);
        console.log("in result catcher");
        this.result = data;
        return data;
    };
    /**
     * Remove parameters that do not have values.
     *
     * @param {Object} params A list of key-value pairs representing request
     *                        parameters and their values.
     * @return {Object} The params object minus parameters with no values set.
     */
    Youtube.prototype.removeEmptyParameters = function (params) {
        for (var p in params) {
            if (!params[p] || params[p] == "undefined") {
                delete params[p];
            }
        }
        return params;
    };
    return Youtube;
}()); //End of Class
exports.Youtube = Youtube;

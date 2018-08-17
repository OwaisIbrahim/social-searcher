"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var fs = require("fs");
var readline = require("readline");
var dotenv = require("dotenv");
dotenv.config();
var googleapis_1 = require("googleapis");
var OAuth2 = googleapis_1.google.auth.OAuth2;
var SCOPES = ["https://www.googleapis.com/auth/plus.me"];
var TOKEN_DIR = (process.env.HOME || process.env.HOMEPATH || process.env.USERPROFILE) +
    "/.credentials/";
var TOKEN_PATH = TOKEN_DIR + "youtube-nodejs-quickstart.json";
var GooglePlus = /** @class */ (function () {
    function GooglePlus() {
        this.authorize();
    }
    Object.defineProperty(GooglePlus.prototype, "contents", {
        get: function () {
            return this.content;
        },
        set: function (val) {
            this.content = val;
        },
        enumerable: true,
        configurable: true
    });
    GooglePlus.prototype.authorize = function () {
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
        oauth2Client.credentials = JSON.parse(token);
        // Store the token for later use
        this.authentication = oauth2Client;
        // console.log('in Authorize auth = '+JSON.stringify(this.authentication));
    };
    Object.defineProperty(GooglePlus.prototype, "_authentication", {
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
     * @description Function search by keyword and on basis of various criterias provided via the JSON object.
     * @param {JSON} query a json object containing the search parameters and query
     * @returns {JSON} returns a JSON object containing search results. Extract the results using obj.data
     */
    GooglePlus.prototype.searchByKeyword = function (reqData, resolve, reject) {
        var _this = this;
        var params = this.checkParameters(reqData);
        var service = googleapis_1.google.plus({
            auth: process.env.GP_AUTH,
            version: "v1",
        });
        service.activities
            .search(params)
            .then(function (response) {
            // res.render('index', {youtube_data: response.data.items, data_type: 'youtube'});
            _this.googlePlusData = response.data.items;
            resolve(response.data.items);
        })
            .catch(function (err) {
            console.log(err);
            reject(err);
        });
    };
    /**
     * Get and store new token after prompting for user authorization, and then
     * execute the given callback with the authorized OAuth2 client.
     *
     * @param {google.auth.OAuth2} oauth2Client The OAuth2 client to get token for.
     */
    GooglePlus.prototype.getNewToken = function (oauth2Client) {
        var _this = this;
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
                    if (err.code !== "EEXIST") {
                        throw err;
                    }
                }
                fs.writeFile(TOKEN_PATH, JSON.stringify(token), function (err) {
                    if (err) {
                        throw err;
                    }
                    console.log("Token stored to " + TOKEN_PATH);
                });
                console.log("Token stored to " + TOKEN_PATH);
                _this.authentication = oauth2Client;
            });
        });
    };
    /**
     * Store token to disk be used in later program executions.
     *
     * @param {Object} token The token to store to disk.
     */
    GooglePlus.prototype.storeToken = function (token) {
        try {
            fs.mkdirSync(TOKEN_DIR);
        }
        catch (err) {
            if (err.code !== "EEXIST") {
                throw err;
            }
        }
        fs.writeFile(TOKEN_PATH, JSON.stringify(token), function (err) {
            if (err) {
                throw err;
            }
            console.log("Token stored to " + TOKEN_PATH);
        });
        console.log("Token stored to " + TOKEN_PATH);
    };
    // Our Required Functions Starts here
    GooglePlus.prototype.normalizeResult = function (data) {
        var resArray = [];
        for (var i = 0; i < data.length; i++) {
            var gp = data[i];
            var params = {
                title: gp.title,
                user: gp.actor.displayName,
                url: gp.url,
                views: gp.object.replies.totalItems,
                desc: gp.object.attachments,
                created_time: gp.published,
            };
            resArray.push(params);
        }
        return resArray;
    };
    GooglePlus.prototype.checkParameters = function (reqData) {
        var params = {
            maxResults: "5",
            orderBy: reqData.orderBy,
        };
        if (reqData.query) {
            params.query = reqData.query;
        }
        if (reqData.language) {
            params.language = reqData.language;
        }
        if (reqData.maxResults) {
            params.maxResults = reqData.maxResults;
        }
        else {
            params.maxResults = "5";
        }
        if (reqData.sort) {
            params.orderBy = reqData.sort;
        }
        if (reqData.pageToken) {
            params.pageToken = reqData.pageToken;
        }
        return params;
    };
    return GooglePlus;
}()); // End of Class
exports.GooglePlus = GooglePlus;

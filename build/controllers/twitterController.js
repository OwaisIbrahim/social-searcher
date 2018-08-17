"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// import * as twit from "twitter";
var twit = require("twit");
var dotenv = require("dotenv");
dotenv.config();
var Twitter = /** @class */ (function () {
    function Twitter() {
        this.config();
    }
    Twitter.prototype.searchByKeyword = function (params, resolve, reject) {
        var _this = this;
        this.api.get("search/tweets", params, function (err, data, response) {
            if (err) {
                console.log("API returned error: " + JSON.stringify(err));
                reject(err);
            }
            else {
                _this.result = data;
                //console.log(data);
                resolve(data);
            }
        });
    };
    Twitter.prototype.normalizeResult = function (data) {
        var filteredParams = [];
        for (var i = 0; i < data.statuses.length; i++) {
            var tweet = data.statuses[i];
            var params = {
                title: tweet.user.name,
                user: tweet.user.name,
                url: tweet.sources,
                views: tweet.retweet_count,
                desc: tweet.text,
                created_time: tweet.created_at,
            };
            filteredParams.push(params);
        }
        return filteredParams;
    };
    Twitter.prototype.config = function () {
        this.api = new twit({
            // access_token_key: "1009470072056840192-RymIYBTusOOMKVApihFbyQ2CHA9t1I",
            access_token: process.env.TW_ACCESS_TOKEN,
            access_token_secret: process.env.TW_TOKEN_SECRET,
            consumer_key: process.env.TW_CONSUMER_KEY,
            consumer_secret: process.env.TW_CONSUMER_SECRET,
        });
    };
    return Twitter;
}());
exports.Twitter = Twitter;

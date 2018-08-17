"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tumblr = require("tumblr.js");
var dotenv = require("dotenv");
dotenv.config();
var Tumblr = /** @class */ (function () {
    function Tumblr() {
        this.client = tumblr.createClient({
            consumer_key: process.env.TM_CONSUMER_KEY,
            consumer_secret: process.env.TM_COSNSUMER_SECRET,
            token: process.env.TM_TOKEN,
            token_secret: process.env.TM_TOKEN_SECRET,
        });
        this.TumblrData = "Nothing";
    }
    Tumblr.prototype.searchByKeyword = function (reqData, resolve, reject) {
        var _this = this;
        //let myParams = this.checkParameters(reqData);
        this.client.taggedPosts(reqData.query, reqData, function (err, response) {
            if (err) {
                console.log("API returned error: " + JSON.stringify(err));
                reject(err);
            }
            else {
                _this.TumblrData = response;
                resolve(response);
            }
        });
    };
    Tumblr.prototype.normalizeResult = function (data) {
        var resArray = [];
        for (var i = 0; i < data.length; i++) {
            var tm = data[i];
            var params = {
                title: tm.blog_name,
                user: tm.blog_name,
                url: tm.short_url,
                views: tm.note_count,
                desc: tm.summary,
                embed: tm.short_url,
                created_time: new Date(tm.date).toUTCString(),
                extras: {
                    slug: tm.slug,
                    post_info: {
                        type: tm.type,
                        body: tm.body,
                        video_url: tm.type === "video"
                            ? tm.video_url || tm.permalink_url
                            : undefined,
                        img_url: tm.type === "photo" ? tm.photos[0].original_size.url : undefined,
                    },
                },
            };
            resArray.push(params);
        }
        return resArray;
    };
    return Tumblr;
}());
exports.Tumblr = Tumblr;

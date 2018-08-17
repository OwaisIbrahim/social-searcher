"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var dotenv = require("dotenv");
dotenv.config();
var DM = require("dailymotion-sdk");
var DMClient = DM.client;
var client;
var DailyMotion = /** @class */ (function () {
    function DailyMotion() {
        this.clientId = process.env.DM_CLIENT_ID; // Fill yours
        this.clientSecret = process.env.DM_CLIENT_SECRET; // Fill yours
        this.scope = [
            // 'desired scopes',
            // 'refer to API documentation',
            "email",
            // 'userinfo',
            "feed",
            "manage_videos",
        ];
        client = new DMClient(this.clientId, this.clientSecret, this.scope);
        // For authorization there are several ways possible in the API
        // First being using login/password : 'password'
        client.setCredentials(DMClient.GRANT_TYPES.PASSWORD, {
            password: process.env.DM_PASSWORD,
            username: process.env.DM_USERNAME,
        });
        // Then there is 'client_credentials' using only client ID/Secret pair to access unauthorized API parts only
        client.setCredentials(DMClient.GRANT_TYPES.CLIENT_CREDENTIALS);
    }
    DailyMotion.prototype.normalizeResult = function (data) {
        var resArray = [];
        for (var i = 0; i < data.list.length; i++) {
            var dm = data.list[i];
            var params = {
                title: dm.title,
                user: "no user",
                url: dm.url,
                views: dm.views_total,
                desc: dm.description,
                embed: dm.embed_html,
                created_time: new Date(dm.created_time).toUTCString(),
            };
            resArray.push(params);
        }
        return resArray;
    };
    DailyMotion.prototype.searchByKeyword = function (reqData, resolve, reject) {
        var _this = this;
        // this.resolve=resolve;
        // this.reject=reject;
        //let myParams = this.checkParameters(reqData);
        var self = this;
        new Promise(function (res, rej) {
            client.createToken(function () { return _this.next(resolve, reject, reqData); });
        });
    };
    DailyMotion.prototype.checkParameters = function (reqData) {
        var myParams = {};
        if (reqData.query) {
            myParams.search = reqData.query;
        }
        if (reqData.sort) {
            myParams.sort = reqData.sort;
        }
        if (reqData.maxResults) {
            myParams.limit = reqData.maxResults;
        }
        return myParams;
    };
    // If you're using 'password' or 'authorzation_code' (with uri/code pair)
    // you must create an access token prior making any requests
    // Otherwise, refresh your access_token/refresh_token pair
    // client.refreshToken(next);
    DailyMotion.prototype.next = function (resolve, reject, reqData) {
        // Now you should be able to make fully authenticated requests to the DM API
        // console.log(datum);
        var self = this;
        client.get("/videos", {
            fields: [
                "thumbnail_240_url",
                "description",
                "id",
                "url",
                "embed_html",
                "created_time",
                "title",
                "views_total",
                "moods",
            ],
            // fields: ['list']
            limit: reqData.limit || 10,
            search: reqData.query,
            sort: reqData.sort || "relevance",
        }, function (err, req, data) {
            if (err) {
                console.log(err);
                return reject("not done");
            }
            //  console.log(req); // req is the original request object, useful to get headers, debug stuff and so on
            //  console.log(data);
            self.dailymotionData = data; // the api response is here
            resolve(data);
        });
    };
    return DailyMotion;
}());
exports.DailyMotion = DailyMotion;

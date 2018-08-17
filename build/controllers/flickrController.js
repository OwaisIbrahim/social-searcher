"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var flickrapi = require("flickrapi");
var dotenv = require("dotenv");
dotenv.config();
var flickrOptions = {
    api_key: process.env.FK_API_KEY,
    secret: process.env.FK_SECRET,
};
var Flickr = /** @class */ (function () {
    function Flickr() {
        this.flickrData = "nothing";
    }
    Flickr.prototype.searchByKeyword = function (reqData, resolve, reject) {
        var _this = this;
        // let myParams = this.checkParameters(reqData);
        console.log(reqData.sort);
        flickrapi.tokenOnly(flickrOptions, function (error, flickr) {
            // we can now use "flickr" as our API object
            flickr.photos.search(reqData, function (err, result) {
                if (err) {
                    console.log("API returned error: " + JSON.stringify(err));
                    reject(err);
                }
                else {
                    _this.flickrData = result.photos.photo;
                    resolve(result.photos.photo);
                }
            });
        });
    };
    Flickr.prototype.normalizeResult = function (data) {
        var filteredParams = [];
        for (var i = 0; i < data.length; i++) {
            var params = {
                title: data[i].title,
                user: data[i].owner,
                url: "https://farm" +
                    data[i].farm +
                    ".staticflickr.com/" +
                    data[i].server +
                    "/" +
                    data[i].id +
                    "_" +
                    data[i].secret +
                    ".jpg",
                views: "no views",
                desc: "no desc",
                created_time: "no created_time",
            };
            filteredParams.push(params);
        }
        return filteredParams;
    };
    return Flickr;
}());
exports.Flickr = Flickr;

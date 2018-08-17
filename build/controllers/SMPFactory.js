"use strict";
/**
 *
 *
 * @export
 * @class SMPfactory
 * @description class to generate objects of different APIs
 */
Object.defineProperty(exports, "__esModule", { value: true });
// ----------------- Import all the wrappers here as well --------------
var youtubeController_1 = require("./youtubeController");
var twitterController_1 = require("./twitterController");
var googleplusController_1 = require("./googleplusController");
var flickrController_1 = require("./flickrController");
var tumblrController_1 = require("./tumblrController");
var vimeoController_1 = require("./vimeoController");
var dailymotionController_1 = require("./dailymotionController");
var SMPfactory = /** @class */ (function () {
    function SMPfactory() {
        //none
    }
    SMPfactory.prototype.generate = function (name) {
        // Rough implemenatation to give idea
        switch (name) {
            case "youtube": {
                return new youtubeController_1.Youtube();
            }
            case "twitter": {
                return new twitterController_1.Twitter();
            }
            case "googleplus": {
                return new googleplusController_1.GooglePlus();
            }
            case "flickr": {
                return new flickrController_1.Flickr();
            }
            case "tumblr": {
                return new tumblrController_1.Tumblr();
            }
            case "vimeo": {
                return new vimeoController_1.VimeoModule();
            }
            case "dailymotion": {
                return new dailymotionController_1.DailyMotion();
            }
            default:
                return null;
        }
    };
    return SMPfactory;
}());
exports.default = SMPfactory;

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var SMPFactory_1 = require("../controllers/SMPFactory");
var es6_promise_1 = require("es6-promise");
var uni = require("array-unique");
var unique = uni.immutable;
var query;
(function (query) {
    query["flickr"] = "text";
    query["twitter"] = "q";
    query["youtube"] = "q";
    query["dailymotion"] = "query";
    query["vimeo"] = "query";
    query["tumblr"] = "query";
    query["googleplus"] = "query";
})(query || (query = {}));
var maxResults;
(function (maxResults) {
    maxResults["youtube"] = "maxResults";
    maxResults["twitter"] = "count";
    maxResults["flickr"] = "per_page";
    maxResults["dailymotion"] = "limit";
    maxResults["vimeo"] = "per_page";
    maxResults["tumblr"] = "limit";
    maxResults["googleplus"] = "maxResults";
})(maxResults || (maxResults = {}));
var relevance;
(function (relevance) {
    relevance["youtube"] = "relevance";
    relevance["googleplus"] = "best";
    relevance["twitter"] = "mixed";
    relevance["vimeo"] = "relevant";
    relevance["dailymotion"] = "relevance";
    relevance["flickr"] = "relevance";
    relevance["tumblr"] = "";
})(relevance || (relevance = {}));
var rating;
(function (rating) {
    rating["youtube"] = "rating";
    rating["googleplus"] = "best";
    rating["twitter"] = "popular";
    rating["vimeo"] = "likes";
    rating["dailymotion"] = "trending";
    rating["flickr"] = "interestingness-asc";
    rating["tumblr"] = "";
})(rating || (rating = {}));
var recency;
(function (recency) {
    recency["youtube"] = "date";
    recency["googleplus"] = "recent";
    recency["twitter"] = "recent";
    recency["vimeo"] = "date";
    recency["dailymotion"] = "recent";
    recency["flickr"] = "date-posted-desc";
    recency["tumblr"] = "";
})(recency || (recency = {}));
var title;
(function (title) {
    title["youtube"] = "title";
    title["googleplus"] = "best";
    title["twitter"] = "mixed";
    title["vimeo"] = "alphabetical";
    title["dailymotion"] = "relevance";
    title["flickr"] = "relevance";
    title["tumblr"] = "";
})(title || (title = {}));
var views;
(function (views) {
    views["youtube"] = "viewCount";
    views["googleplus"] = "best";
    views["twitter"] = "popular";
    views["vimeo"] = "plays";
    views["dailymotion"] = "trending";
    views["flickr"] = "interestingness-asc";
    views["tumblr"] = "";
})(views || (views = {}));
var RequestHandler = /** @class */ (function () {
    function RequestHandler() {
        var _this = this;
        // the /seearch will redirect to this page and only this method will handle the request
        this.handleAllRequest = function (req, res) {
            // Array of results
            // let result: JSON[] = new Array();
            var smpCreator = new SMPFactory_1.default();
            var numSocialMediaAccounts = 9;
            var myPromises = new Array(numSocialMediaAccounts);
            var myeditList = [];
            // Cycle through all the user requested smps
            for (var _i = 0; _i < req.body.smpList.length; _i++) {
                // Generate smp
                _this.smp = smpCreator.generate(req.body.smpList[_i].name);
                if (_this.smp) {
                    // Call that smps search and initialize the result var with its result
                    //    result.push(null);  // Increase length of result array
                    myPromises[_i] = new es6_promise_1.Promise(function (resolve, reject) {
                        _this.smp.searchByKeyword(req.body.smpList[_i].params, resolve, reject);
                    });
                    myeditList.push(myPromises[_i]);
                }
            }
            es6_promise_1.Promise.all(myeditList)
                .then(function (values) {
                res.send(values);
            })
                .catch(function (err) {
                console.log("Reject_Error: " + err);
                res.send(err);
            });
        };
        this.handleSocialSearchRequest = function (req, res) {
            // Array of results
            // let result: JSON[] = new Array();
            var smpCreator = new SMPFactory_1.default();
            var numSocialMediaAccounts = 9;
            var myPromises = new Array(numSocialMediaAccounts);
            var myeditList = [];
            var _loop_1 = function () {
                // Generate smp
                _this.smp = smpCreator.generate(req.body.smpList[_i]);
                if (_this.smp) {
                    // Call that smps search and initialize the result var with its result
                    //    result.push(null);  // Increase length of result array
                    var myParams_1 = {};
                    myPromises[_i] = new es6_promise_1.Promise(function (resolve, reject) {
                        myParams_1 = _this.resolveEnum(req.body.smpList[_i], req.body.params, res);
                        _this.smp.searchByKeyword(myParams_1, resolve, reject);
                    });
                    myeditList.push(myPromises[_i]);
                }
            };
            // Cycle through all the user requested smps
            for (var _i = 0; _i < req.body.smpList.length; _i++) {
                _loop_1();
            }
            es6_promise_1.Promise.all(myeditList)
                .then(function (values) {
                res.send(_this.mapResult(req.body.smpList, values, req.body.params.query, req.body.params.maxResults));
                //        res.send(values);
            })
                .catch(function (err) {
                console.log("Reject_Error: " + err);
                res.send(err);
            });
        };
    }
    RequestHandler.prototype.resolveEnum = function (str, myParams, res) {
        var params = {};
        if (myParams.query !== "undefined" ||
            myParams.query != null ||
            myParams.query !== "") {
            params[query[str]] = myParams.query;
        }
        else {
            res.status(403).send("Invalid parameters");
            res.end();
        }
        if (myParams.maxResults === "undefined" ||
            myParams.maxResults == null ||
            myParams.maxResults === 0) {
            myParams.maxResults = 5;
        }
        params[maxResults[str]] = myParams.maxResults;
        params.sort = this.sortType(myParams.sort, str);
        return params;
    };
    RequestHandler.prototype.sortType = function (str, platform) {
        if (str) {
            if (str === "rating") {
                return rating[platform];
            }
            else if (str === "recency") {
                return recency[platform];
            }
            else if (str === "title") {
                return title[platform];
            }
            else if (str === "views") {
                return views[platform];
            }
            else {
                return relevance[platform];
            }
        }
        else {
            return relevance[platform];
        }
    };
    /**
     *
     * @param smpList
     * @param data
     * @param q
     * @param resultCount
     * @description function to map result data to a simpler format
     */
    RequestHandler.prototype.mapResult = function (smpList, data, q, resultCount) {
        var result = {};
        var platform;
        var factory = new SMPFactory_1.default();
        result.query = q;
        result.resultList = new Array(smpList.length);
        var i = 0; // to traverse each smp
        for (var _a = 0, smpList_1 = smpList; _a < smpList_1.length; _a++) {
            var smp = smpList_1[_a];
            // Create results array
            result.resultList[i] = {};
            // Create results array
            result.resultList[i].name = smp;
            result.resultList[i].results = new Array(resultCount);
            // create smp
            platform = factory.generate(smp);
            // Query each smps noramlizer and initialize its result
            result.resultList[i].results = platform.normalizeResult(data[i]);
            i++;
        }
        return result;
    };
    return RequestHandler;
}());
exports.RequestHandler = RequestHandler;

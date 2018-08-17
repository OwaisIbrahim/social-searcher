"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/* ******************* Autocomplete **************************/
var GoogleTrends = /** @class */ (function () {
    function GoogleTrends() {
        this.googleTrends = require("../node_modules/google-trends-api/lib/google-trends-api.min.js");
    }
    GoogleTrends.prototype.autoComplete = function () {
        this.googleTrends
            .autoComplete({ keyword: "Back to school" })
            .then(function (res) {
            console.log("this is res", res);
        })
            .catch(function (err) {
            console.log("got the error", err);
            console.log("error message", err.message);
            console.log("request body", err.requestBody);
        });
    };
    /* ******************* Interest over time **************************/
    GoogleTrends.prototype.searchByKeyword = function () {
        this.googleTrends
            .interestOverTime({ keyword: "Valentines Day" })
            .then(function (res) {
            console.log("this is res", res);
        })
            .catch(function (err) {
            console.log("got the error", err);
            console.log("error message", err.message);
            console.log("request body", err.requestBody);
        });
    };
    GoogleTrends.prototype.interestOverDate = function () {
        this.googleTrends.interestOverTime({
            keyword: "Valentines Day",
            startTime: new Date(Date.now() - 4 * 60 * 60 * 1000),
            granularTimeResolution: true,
        }, function (err, results) {
            if (err)
                console.log("oh no error!", err);
            else
                console.log(results);
        });
    };
    /* ****** Interest over time - Set a custom timezone ***************/
    GoogleTrends.prototype.interestOverTime = function () {
        this.googleTrends.interestOverTime({
            keyword: "Valentines Day",
            timezone: new Date().getTimezoneOffset() / 60,
        }, function (err, results) {
            if (err)
                console.log("oh no error!", err);
            else
                console.log(results);
        });
    };
    /* ****** Interest over time - Comparing multiple keywords *********/
    GoogleTrends.prototype.searchByMultipleKeywords = function () {
        this.googleTrends
            .interestOverTime({ keyword: ["Valentines Day", "Christmas Day"] })
            .then(function (res) {
            console.log("this is res", res);
        })
            .catch(function (err) {
            console.log("got the error", err);
        });
    };
    /* ******************* Interest by region **************************/
    GoogleTrends.prototype.interestByRegion = function () {
        this.googleTrends
            .interestByRegion({
            keyword: "Donald Trump",
            startTime: new Date("2017-02-01"),
            endTime: new Date("2017-02-06"),
            resolution: "CITY",
        })
            .then(function (res) {
            console.log(res);
        })
            .catch(function (err) {
            console.log(err);
        });
    };
    GoogleTrends.prototype.interestByLocation = function () {
        this.googleTrends
            .interestByRegion({
            keyword: "Donald Trump",
            startTime: new Date("2017-02-01"),
            endTime: new Date("2017-02-06"),
            geo: "US-CA",
        })
            .then(function (res) {
            console.log(res);
        })
            .catch(function (err) {
            console.log(err);
        });
    };
    /* ******************* Related queries **************************/
    GoogleTrends.prototype.relatedQueries = function () {
        this.googleTrends
            .relatedQueries({ keyword: "Westminster Dog Show" })
            .then(function (res) {
            console.log(res);
        })
            .catch(function (err) {
            console.log(err);
        });
    };
    /* ******************* Related topics **************************/
    GoogleTrends.prototype.relatedTopics = function () {
        this.googleTrends
            .relatedTopics({
            keyword: "Chipotle",
            startTime: new Date("2015-01-01"),
            endTime: new Date("2017-02-10"),
        })
            .then(function (res) {
            console.log(res);
        })
            .catch(function (err) {
            console.log(err);
        });
    };
    return GoogleTrends;
}());
exports.GoogleTrends = GoogleTrends;

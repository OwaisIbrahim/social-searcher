"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express = require("express");
var bodyParser = require("body-parser");
var dotenv = require("dotenv");
dotenv.config();
// import routers
var ReqHandler_1 = require("./router/ReqHandler");
// server class
var Server = /** @class */ (function () {
    function Server() {
        this.app = express();
        this.req = new ReqHandler_1.RequestHandler();
        this.config();
        this.routes();
    }
    Server.prototype.config = function () {
        // config
        this.app.use(bodyParser.json());
        this.app.use(bodyParser.urlencoded({ extended: true }));
    };
    Server.prototype.routes = function () {
        var router;
        router = express.Router();
        // this.app.get("/", router);
        this.app.post("/search", this.req.handleAllRequest);
        this.app.post("/socialsearch", this.req.handleSocialSearchRequest);
    };
    return Server;
}());
exports.default = new Server().app;

import {Router, Request, Response, NextFunction} from "express";
import SMP from "../controllers/SMP";
import SMPfactory from "../controllers/SMPFactory";
import {Promise} from "es6-promise";

import * as uni from "array-unique";

const unique = uni.immutable;

enum query {
  flickr = "text",
  twitter = "q",
  youtube = "q",
  dailymotion = "query",
  vimeo = "query",
  tumblr = "query",
  googleplus = "query",
}
enum maxResults {
  youtube = "maxResults",
  twitter = "count",
  flickr = "per_page",
  dailymotion = "limit",
  vimeo = "per_page",
  tumblr = "limit",
  googleplus = "maxResults",
}

export class RequestHandler {
  private smp: SMP;
  constructor() {}

  // the /seearch will redirect to this page and only this method will handle the request
  public handleAllRequest = (req: Request, res: Response) => {
    // Array of results
    // let result: JSON[] = new Array();
    let smpCreator = new SMPfactory();
    let numSocialMediaAccounts: number = 9;
    let myPromises = new Array(numSocialMediaAccounts);
    let myeditList = [];
    // Cycle through all the user requested smps
    for (var _i = 0; _i < req.body.smpList.length; _i++) {
      // Generate smp
      this.smp = smpCreator.generate(req.body.smpList[_i].name);
      if (this.smp) {
        // Call that smps search and initialize the result var with its result
        //    result.push(null);  // Increase length of result array

        myPromises[_i] = new Promise((resolve, reject) => {
          this.smp.searchByKeyword(
            req.body.smpList[_i].params,
            resolve,
            reject,
          );
        });
        myeditList.push(myPromises[_i]);
      }
    }

    Promise.all(myeditList)
      .then(values => {
        res.send(values);
      })
      .catch(err => {
        console.log("Reject_Error: " + err);
      });
  };

  public handleSocialSearchRequest = (req: Request, res: Response) => {
    // Array of results
    // let result: JSON[] = new Array();
    let smpCreator = new SMPfactory();
    let numSocialMediaAccounts: number = 9;
    let myPromises = new Array(numSocialMediaAccounts);
    let myeditList = [];
    // Cycle through all the user requested smps
    for (var _i = 0; _i < req.body.smpList.length; _i++) {
      // Generate smp
      this.smp = smpCreator.generate(req.body.smpList[_i]);
      if (this.smp) {
        // Call that smps search and initialize the result var with its result
        //    result.push(null);  // Increase length of result array
        let myParams = {};
        myPromises[_i] = new Promise((resolve, reject) => {
          myParams = this.resolveEnum(req.body.smpList[_i], req.body.params);
          this.smp.searchByKeyword(myParams, resolve, reject);
        });
        myeditList.push(myPromises[_i]);
      }
    }

    Promise.all(myeditList)
      .then(values => {
        res.send(values);
      })
      .catch(err => {
        console.log("Reject_Error: " + err);
      });
  };

  public resolveEnum(str: string, myParams): {} {
    let params = {};
    console.log(str);
    console.log(myParams);
    params[query[str]] = myParams.query;
    params[maxResults[str]] = myParams.maxResults;

    console.log(params);
    return params;
  }
}

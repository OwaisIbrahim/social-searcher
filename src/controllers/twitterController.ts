// import * as twit from "twitter";
import * as twit from "twit";

var Sentiment = require ('sentiment');
var sentiment = new Sentiment();

var fs = require('fs');

import SMP from "./SMP";
import * as dotenv from "dotenv";
dotenv.config();
export class Twitter implements SMP {
  private result: Object;
  private api: twit;
  constructor() {
    this.config();
  }

  public searchByKeyword(params: JSON, resolve, reject) {
    this.api.get(
      "search/tweets",
      params as twit.Params,
      (err, data, response) => {
        if (err) {
          console.log("API returned error: " + JSON.stringify(err));
          reject(err);
        } else {
          // for(let i=0; i<data["statuses"].length; i++) {
          //   data["statuses"][i]["tag"] = 'twitter'
          // }
          this.result = data;
          //console.log(data);
          // var p = {lat: 24.926294, long: 67.022095};
          // this.trendsAvailable(resolve, reject);
          // this.trendsClosest(p, resolve, reject);
          // this.trendsPlace( {"id": 7}, resolve, reject);
          this.doSentimentAnalysis(data.statuses);
          resolve(data);
        }
      },
    );
  }

  public doSentimentAnalysis(data: any) {
    var result;
    for (let index = 0; index < data.length; index++) {
      result = sentiment.analyze(data[index].full_text);
      if( result.comparative == 0 )
        data[index]['sentiment'] = '#b3b3b3';
      else if(result.comparative > 0)
        data[index]['sentiment'] = '#8caa0b';
      else
        data[index]['sentiment'] = '#ff0000';
      // console.log('Node result: ' + JSON.stringify(result))
    }
  }
  



  // {"score":3,"comparative":0.06}



  public trendsAvailable(resolve, reject) {
    this.api.get(
      "trends/available",
      (err, data, response) => {
        if (err) {
          console.log("API returned error: " + JSON.stringify(err));
          reject(err);
        } else {
          // this.result = data;
          console.log('trendsAvailable RESPONSE: ', JSON.stringify(data, null, 2));
          // fs.writeFile('trendsAvailable.json', JSON.stringify(data, null, 2));
          resolve(data);
        }
      },
    );
  }

  public trendsClosest(params: any, resolve, reject) {    //params will contain {lat: 37.781157, long: -122.400612831116}
    this.api.get(
      "trends/closest",
      params as twit.Params,
      (err, data, response) => {
        if (err) {
          console.log("API returned error: " + JSON.stringify(err));
          reject(err);
        } else {
          // this.result = data;
          console.log('trendsClosest(', params, ') RESPONSE: ', JSON.stringify(data, null, 2));
          // fs.writeFile('trendsClosest.json', JSON.stringify(data, null, 2));
          resolve(data);
        }
      },
    );
  }

  
  public trendsPlace(params: any, resolve, reject) {    //params will contain {id: 1}
    this.api.get(
      "trends/place",
      params as twit.Params,
      (err, data, response) => {
        if (err) {
          console.log("API returned error: " + JSON.stringify(err));
          reject(err);
        } else {
          // this.result = data;
          console.log('trendsPlace(', params, ') RESPONSE: ', JSON.stringify(data, null, 2));
          // fs.writeFile('trendsPlace.json', JSON.stringify(data, null, 2));
          resolve(data);
        }
      },
    );
  }

  public normalizeResult(data: any): JSON[] {
    let filteredParams = [];
    for (let i = 0; i < data.statuses.length; i++) {
      let tweet = data.statuses[i];
      let params = {
        title: "no title",
        user: tweet.user.name,
        url: "https://twitter.com/statuses/" + tweet.id_str,
        views: tweet.retweet_count,
        desc: tweet.text,
        created_time: new Date(tweet.created_at).toUTCString(),
        extras: {
          user_info: {
            profile_img: tweet.user.profile_image_url,
            statuses_count: tweet.user.statuses_count,
            friends_count: tweet.user.friends_count,
            followers_count: tweet.user.followers_count,
          },
          tweet_info: {
            favorite_count: tweet.favorite_count,
            retweet_count: tweet.retweet_count,
            hashtags: tweet.entities.hashtags,
          },
        },
      };
      filteredParams.push(params);
    }
    return filteredParams;
  }

  public config() {
    this.api = new twit({
      access_token: process.env.TW_ACCESS_TOKEN,
      access_token_secret: process.env.TW_TOKEN_SECRET,
      consumer_key: process.env.TW_CONSUMER_KEY,
      consumer_secret: process.env.TW_CONSUMER_SECRET,
    });
  }
}

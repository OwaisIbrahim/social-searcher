import SMP from "./SMP";
import * as vimeoModule from "../../node_modules/vimeo";
const Vimeo = vimeoModule.Vimeo;

export class VimeoModule implements SMP {
  private VimeoData: any;

  constructor() {}

  public makeRequest(lib, params, resolve, reject) {
    // Make an API request

    lib.request(
      {
        // This returns the first page of videos containing the term "vimeo staff".
        // These videos will be sorted by most relevant to least relevant.
        path: "/videos",
        query: {
          //page: params.page,
          per_page: params.per_page,
          query: params.query,
          sort: params.sort,
          direction: params.direction,
          filter: params.filter,
          //uris:params.uris,
          //links:params.links
        },
      },
      (error, body, statusCode, headers) => {
        if (error) {
          console.log("\nerror: " + error);
          reject("not done vimeo");
        } else {
          this.VimeoData = body.data;
          console.log(this.VimeoData);
          resolve(body.data);
        }
      },
    );
  }

  public normalizeResult(data: JSON) {
    throw new Error("Method not implemented.");
  }

  public searchByKeyword(reqData, resolve, reject) {
    let myParams = this.checkParameters(reqData);

    let lib = new Vimeo(process.env.VM_CLIENT_ID, process.env.VM_CLIENT_SECRET);

    if (process.env.VM_ACCESS_TOKEN) {
      lib.setAccessToken(process.env.VM_ACCESS_TOKEN);
      this.makeRequest(lib, myParams, resolve, reject);
    } else {
      // Unauthenticated API requests must request an access token. You should not request a new access token for each
      // request, you should request an access token once and use it over and over.
      lib.generateClientCredentials("public", (err, response) => {
        if (err) {
          throw err;
        }

        // Assign the access token to the library
        lib.setAccessToken(response.access_token);

        this.makeRequest(lib, myParams, resolve, reject);
      });
    }
  }

  public checkParameters(reqData) {
    let params = {};
    if (reqData.query) {
      params.query = reqData.query;
    }
    // if (reqData.vimeo_uris) { params.uris = reqData.vimeo_uris; console.log("\nid: " + params.uris); }
    // else {params.uris='';}
    // if (reqData.vimeo_links) { params.links = reqData.vimeo_links; console.log("\nid: " + params.links); }
    // else {params.links='';}
    if (reqData.vimeo_count) {
      params.page = reqData.vimeo_count;
    } else {
      params.page = 1;
    }
    if (reqData.vimeo_orderby) {
      params.sort = reqData.vimeo_orderby;
    } else {
      params.sort = "relevant";
    }
    if (reqData.vimeo_direction) {
      params.direction = reqData.vimeo_direction;
    } else {
      params.direction = "asc";
    }
    if (reqData.vimeo_per_page) {
      params.per_page = reqData.vimeo_per_page;
    } else {
      params.per_page = 10;
    }
    if (reqData.vimeo_filter) {
      params.filter = reqData.vimeo_filter;
    } else {
      params.filter = null;
    }

    return params;
  }
}

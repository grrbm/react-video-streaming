const CronJob = require("cron").CronJob,
  request = require("request"),
  helpers = require("../helpers/helpers"),
  config = require("../config/default"),
  port = config.rtmp_server.http.port;

const environment = process.env.NODE_ENV;
let baseUrl;
if (environment === "production") {
  //if it's in production
  baseUrl = config.productionUrl;
} else {
  baseUrl = "http://127.0.0.1";
}
const job = new CronJob(
  "*/5 * * * * *",
  function () {
    let fullUrl = `${baseUrl}:` + port + "/api/streams";
    fullUrl = fullUrl.replace(/https/, "http");
    request.get(fullUrl, function (error, response, body) {
      if (error) {
        console.log("There was an error fetching thumbnail: " + error);
        console.log("Tried to fetch: " + fullUrl);
        return;
      }
      let streams = JSON.parse(body);
      if (typeof (streams["live"] !== undefined)) {
        let live_streams = streams["live"];
        for (let stream in live_streams) {
          if (!live_streams.hasOwnProperty(stream)) continue;
          helpers.generateStreamThumbnail(stream);
        }
      }
    });
  },
  null,
  true
);

module.exports = job;

var axios = require('axios');
var toJSON = require('xml2js').parseString;

var url =
  process.env.SMUGMUG_FEED ||
  'https://www.huchteman.com/hack/feed.mg?Type=gallery&Data=74290744_v7dhQT&format=rss200';

module.exports = () => {
  return new Promise((resolve, reject) => {
    axios
      .get(url)
      .then(response => {
        // turn the feed XML into JSON
        toJSON(response.data, function(err, result) {
          // var refjson = result;
          // fs.writeFile(
          //   __dirname + "/sm-feed.json",
          //   JSON.stringify(refjson),
          //   err => {
          //     if (err) {
          //       console.log(err);
          //     } else {
          //       console.log("file ready!!!!!!!");
          //     }
          //   }
          // );

          // create a path for each item based on Medium's guid URL
          result.rss.channel[0].item.forEach(element => {
            var url = element.link[0].split('/');
            //console.log(result.rss.channel[0].item);
            element.path = url.pop() || url.pop();
          });

          resolve({url: url, posts: result.rss.channel[0].item});
        });
      })
      .catch(error => {
        reject(error);
      });
  });
};
const axios = require('axios');
const fs = require('fs');

require('dotenv').config();
const INSTAGRAM_AUTH = process.env.INSTAGRAM_AUTH;
var url = `https://api.instagram.com/v1/users/self/media/recent/?access_token=${INSTAGRAM_AUTH}`;

module.exports = async function() {
  //  let url = `https://api.meetup.com/${process.env.MEETUP_URL}/events?photo-host=public&page=20&sig_id=${process.env.MEETUP_KEY}`;

  return axios
    .get(url)
    .then(function(response) {
      return response.data.data;
    })
    .catch(function(error) {
      console.log(error);
    });
};

// module.exports = () => {
//   return new Promise((resolve, reject) => {
//     axios
//       .get(url)
//       .then(response => {
//         // Handy to save the results to a local file
//         // to prime the dev data source
//         console.log(process.env.ELEVENTY_ENV);
//        // if (process.env.ELEVENTY_ENV == 'prime') {
//         fs.writeFile(
//           __dirname + '/dev/instagram.json',
//           JSON.stringify(response.data.data),
//           err => {
//             if (err) {
//               console.log(err);
//             } else {
//               console.log('Instagram content primed for dev.');
//             }
//           }
//         );
//         }
//         resolve(response.data.data);
//       })
//       .catch(err => {
//         reject(err);
//       });
//   });
// };

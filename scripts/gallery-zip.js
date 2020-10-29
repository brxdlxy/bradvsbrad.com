const dbConn = require('./db/dbconfig');
const fs = require('fs');

//selects all active galleries
const gSqlStr = `Select JSON_OBJECT(
    'gallery_id', g.gallery_id,
    'gallery_description', g.gallery_description,
    'gallery_weight', g.gallery_weight,
    'gallery_name', g.gallery_name,
    'gallery_permalink', g.gallery_permalink,
    'gallery_slug', g.gallery_slug,
    'gallery_socialImage', g.gallery_socialImage,
    'gallery_type', g.gallery_type
    ) AS 'JSON'
    FROM galleries g Where status=1;`;

// Selects photos that belong to galleries
const pSqlStr = `SELECT JSON_OBJECT(
    'gallery_id', i.gallery_id,
    'photo_id', i.photo_id,
    'public_id', i.public_id,
    'title', i.title,
    'caption', i.caption,
    'priority_weight', i.priority_weight) AS 'json'
    FROM gallery_photo_items i;`;

function writeZipped(galleries, photos) {
  galleries.forEach((gallery) => {
    gallery.gallery_photos = photos.filter(
      (photos) => photos.gallery_id == gallery.gallery_id
    );
  });

  //save data file
  fs.writeFile(
    __dirname + '/src/_data/galleries.json',
    JSON.stringify(galleries),
    (err) => {
      if (err) {
        console.log(err);
      } else {
        console.log('galleries zipped!!!!!!!');
      }
    }
  );
}
let galleries = [];

dbConn.query(gSqlStr, function (error, results, fields) {
  if (error) throw error;
  results.forEach((item) => {
    galleries.push(JSON.parse(item.JSON));
  });

  // console.log(JSON.stringify(galleries));
});

let photos = [];

dbConn.query(pSqlStr, function (error, results, fields) {
  if (error) throw error;
  //   console.log(results[0]);
  results.forEach((item) => {
    photos.push(JSON.parse(item.json));
  });
  writeZipped(galleries, photos);
});

//console.log(JSON.stringify(galleries));

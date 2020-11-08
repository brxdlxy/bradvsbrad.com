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

const pAllSqlStr = `SELECT JSON_OBJECT('photo_id', photo_id,
  'public_id', public_id,
  'title', title,
  'caption', caption,
  'width', width,
  'height', height,
  'smugmug_slug', smugmug_slug,
  'camera_maker', camera_maker,
  'camera_model', camera_model,
  'keywords', keywords,
  'geo_location', geo_location,
  'format', format,
  'media_type', media_type,
  'slug', slug ) AS 'JSON'
  FROM photos WHERE status = 1 ORDER BY photo_id DESC;`;

function writeZipped(galleries, galleryitems) {
  galleries.forEach((gallery) => {
    gallery.gallery_photos = galleryitems.filter(
      (galleryitems) => galleryitems.gallery_id == gallery.gallery_id
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

let galleryitems = [];

dbConn.query(pSqlStr, function (error, results, fields) {
  if (error) throw error;
  // console.log(results[0]);
  results.forEach((item) => {
    galleryitems.push(JSON.parse(item.json));
  });
  writeZipped(galleries, galleryitems);
});

let photos = {photos: []};
dbConn.query(pAllSqlStr, function (error, results, fields) {
  if (error) throw error;
  // console.log(results[0]);
  results.forEach((item) => {
    photos.photos.push(JSON.parse(item.JSON));
  });
  // console.log(photos);
  fs.writeFile(__dirname + '/src/_data/bvbphotos.json', JSON.stringify(photos), (err) => {
    if (err) {
      console.log(err);
    } else {
      console.log('bvbphotos data is finished!');
    }
  });
});

//console.log(JSON.stringify(galleries));

const fs = require('fs');
let galleries = require('./galleries-table.json');
let photos = require('./gallery-photo-items.json');

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

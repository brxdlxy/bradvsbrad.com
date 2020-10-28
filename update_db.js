const dbConn = require('./db/dbconfig');
let fs = require('fs');
const del = require('del');

// import json of files we just uploaded to cloudinary
let cldManifest = require('./db/cloudinary-manifest.json');

// gets timestamp to help archive manifest
function getTsSlug() {
  const date = new Date();
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, '0');
  const day = `${date.getDate()}`.padStart(2, '0');
  const hours = `${date.getHours()}`.padStart(2, '0');
  const mins = `${date.getMinutes()}`.padStart(2, '0');
  const secs = `${date.getSeconds()}`.padStart(2, '0');
  return `${year}-${month}-${day}-${hours}${mins}${secs}`;
}

// Clean assets
function clean() {
  return del([
    'ingest/**/*',
    '!ingest/photos',
    '!ingest/art',
    '!ingest/cards',
    '!ingest/posts',
  ]);
}
let insertIDArr = [];
async function insertMedia({public_id, width, height, format}) {
  let sqlStr = `INSERT INTO photos (public_id, width, height, format, media_type, status, title) VALUES ('${public_id}',${width},${height},'${format}',${getMediaType(
    public_id
  )}, 2, '${public_id}');`;
  dbConn.query(sqlStr, {public_id, width, height, format}, (error, results) => {
    if (error) throw error;
    insertIDArr.push(results.insertId);
    console.log('Last insert ID:', results.insertId);
    // console.log('insertIDArr.length :', insertIDArr.length);
    if (insertIDArr.length == Object.keys(cldManifest).length) {
      console.log('exits');
      process.exitCode = 1;
    }
  });
  // console.log('sql:', sqlStr);
}

// pulls type from public id
function getMediaType(pubid) {
  var folder = pubid.split('/');
  switch (folder[0]) {
    case 'photos':
      return 1;
    case 'art':
      return 2;
    case 'cards':
      return 3;
    case 'posts':
      return 4;
    default:
      return 0;
  }
}

// console.log(Object.keys(cldManifest).length)
function updateFromManifest() {
  console.log('begin update');
  for (let item in cldManifest) {
    let itemData = cldManifest[item];
    console.log('before insert');
    insertMedia(itemData);
  }

  // move manifest file to archive after completed
  let oldpath = '/Users/brxdlxy/1-sites/bradvsbrad.com/db/cloudinary-manifest.json';
  let timestampStr = getTsSlug();
  let newpath = `/Users/brxdlxy/1-sites/bradvsbrad.com/db/manifests/${timestampStr}_cloudinary-manifest.json`;

  fs.copyFile(oldpath, newpath, (err) => {
    if (err) throw err;
    console.log('manifest copied to archive');
  });
  // remove the imported files
  clean();
}

updateFromManifest();

// module.exports = {updateFromManifest()};
// console.log(updateFromManifest());

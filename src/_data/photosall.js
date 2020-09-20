const fs = require('fs');
require('dotenv').config();
let cloudinary = require('cloudinary').v2;
cloudinary.config({
  cloud_name: 'bradvsbrad',
  api_key: '244689219856367',
  api_secret: process.env.CLOUDINARY_SECRET,
});

async function getPhotoMeta(item) {
  //console.log('getPhotoMeta -> item', item);
  const photoMeta = await cloudinary.api.resource(
    item.public_id,
    {
      colors: true,
      image_metadata: true,
    },
    function (error, result) {
      // console.log(result, error);
    }
  );
  const merged = Object.assign({}, item, photoMeta);
  return merged;
}

async function main() {
  const myphotos = await cloudinary.search
    .expression('resource_type:image AND tags:photo')
    .sort_by('public_id', 'desc')
    .max_results(500)
    .execute()
    .then((response) => {
      //      console.log('getphotos -> response.resources', response.resources);
      return response.resources;
    })
    .catch((err) => {
      console.error(err);
    });

  //   console.log('main -> myphotos', myphotos);

  let container = [];
  for (let item of myphotos) {
    const merged = await getPhotoMeta(item);
    //console.log('main -> merged', merged);

    container.push(merged);
  }
  //console.log("main -> container", container)
  // const sortedContainer = container.sort((a, b) => a.created_at - b.created_at);
  // console.log('main -> container', sortedContainer.slice(0, 10));
  // console.log(JSON.stringify(container));

  const formattedphotos = container.map((item) => {
    return {
      public_id: item.public_id,
      format: item.format,
      created_at: item.created_at,
      uploaded_at: item.uploaded_at,
      bytes: item.bytes,
      width: item.width,
      height: item.height,
      aspect_ratio: item.aspect_ratio,
      status: item.status,
      tags: item.tags,
      colors: item.colors,
      predominant: item.predominant.google,
    };
  });

  fs.writeFile(__dirname + '/photos.json', JSON.stringify(formattedphotos), (err) => {
    if (err) {
      console.log(err);
    } else {
      console.log('file ready!!!!!!!');
    }
  });

  return formattedphotos;
}

const path = __dirname + '/photos.json';

try {
  if (fs.existsSync(path)) {
    //file exists
    console.log('using existing photos.json on dev.  delete file for fresh data');
  } else {
    module.exports = main();
  }
} catch (err) {
  console.error(err);
}

// export for 11ty

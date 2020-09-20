const fs = require('fs')
require('dotenv').config();
let cloudinary = require('cloudinary').v2;
cloudinary.config({
  cloud_name: 'bradvsbrad',
  api_key: '244689219856367',
  api_secret: process.env.CLOUDINARY_SECRET
});
// gets meta/details for a single image/resource
async function getCardMeta(item) {
  const cardMeta = await cloudinary.api.resource(
    item.public_id,
    {
      colors: true,
      image_metadata: true,
    },
    function (error, result) {
      // console.log(result, error);
    }
  );
  const merged = Object.assign({}, item, cardMeta);
  return merged;
}

async function main() {
  //get list of resources
  const myCards = await cloudinary.search
    .expression('resource_type:image AND folder=cards')
    .sort_by('public_id', 'desc')
    .max_results(500)
    .execute()
    .then((response) => {
      return response.resources;
    })
    .catch((err) => {
      console.error(err);
    });

  //   console.log('main -> myCards', myCards);
  //makes a additional call for each resource and merges new data objects
  let container = [];
  for (let item of myCards) {
    const merged = await getCardMeta(item);
    container.push(merged);
  }
// reformat merged object in container[]
  const formattedCards = container.map((item) => {
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

  //save data file
  fs.writeFile(__dirname + '/cards.json', JSON.stringify(formattedCards), err => {
    if (err) {
      console.log(err);
    } else {
      console.log('file ready!!!!!!!');
    }
  });

  return formattedCards;
}


const path = __dirname + '/cards.json'

try {
  if (fs.existsSync(path)) {
    console.log('using existing cards.json on dev.  delete file for fresh data')
  } else {
    module.exports = main();
  }
} catch (err) {
  console.error(err)
}

// export for 11ty


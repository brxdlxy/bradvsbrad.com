require('dotenv').config();
let cloudinary = require('cloudinary').v2;
cloudinary.config({
  cloud_name: 'bradvsbrad',
  api_key: '244689219856367',
  api_secret: process.env.CLOUDINARY_SECRET
});

async function getCardMeta(item) {
  //console.log('getCardMeta -> item', item);
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

async function getCards() {
  cloudinary.search
    .expression('resource_type:image AND folder=cards')
    .sort_by('created_at', 'desc')
    .max_results(5)
    .execute()
    .then((response) => {
      //   console.log('getCards -> response.resources', response.resources);
      return response.resources;
    })
    .catch((err) => {
      console.error(err);
    });
}
async function main() {
  const myCards = await cloudinary.search
    .expression('resource_type:image AND folder=cards')
    .sort_by('public_id', 'desc')
    .max_results(500)
    .execute()
    .then((response) => {
      //      console.log('getCards -> response.resources', response.resources);
      return response.resources;
    })
    .catch((err) => {
      console.error(err);
    });

  //   console.log('main -> myCards', myCards);

  let container = [];
  for (let item of myCards) {
    const merged = await getCardMeta(item);
    //console.log('main -> merged', merged);

    container.push(merged);
  }
  //console.log("main -> container", container)
  // const sortedContainer = container.sort((a, b) => a.created_at - b.created_at);
  // console.log('main -> container', sortedContainer.slice(0, 10));
  // console.log(JSON.stringify(container));

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
  return formattedCards;
}
// export for 11ty
module.exports = main();

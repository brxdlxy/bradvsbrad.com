const rssPlugin = require('@11ty/eleventy-plugin-rss');
const syntaxHighlight = require('@11ty/eleventy-plugin-syntaxhighlight');


// const pluginRespimg = require("eleventy-plugin-respimg");
  // eleventyConfig.cloudinaryCloudName = 'bradvsbrad';
  // eleventyConfig.srcsetWidths = [320, 916, 1350, 1600];
  // eleventyConfig.fallbackWidth = 916;

  // eleventyConfig.addPlugin(pluginRespimg);


// Import filters
const dateFilter = require('./src/filters/date-filter.js');
const markdownFilter = require('./src/filters/markdown-filter.js');
const w3DateFilter = require('./src/filters/w3-date-filter.js');

// Import transforms
const htmlMinTransform = require('./src/transforms/html-min-transform.js');
const parseTransform = require('./src/transforms/parse-transform.js');

// Import data files
const site = require('./src/_data/site.json');

module.exports = function(config) {
  // Filters
  config.addFilter('dateFilter', dateFilter);
  config.addFilter('markdownFilter', markdownFilter);
  config.addFilter('w3DateFilter', w3DateFilter);

  // Layout aliases
  config.addLayoutAlias('home', 'layouts/home.njk');

  // Transforms
  config.addTransform('htmlmin', htmlMinTransform);
  config.addTransform('parse', parseTransform);

  // Passthrough copy
  config.addPassthroughCopy('src/favicon.ico');
  config.addPassthroughCopy('src/icons');
  config.addPassthroughCopy('src/fonts');
  config.addPassthroughCopy('src/images');
  config.addPassthroughCopy('src/js');
  config.addPassthroughCopy('src/resume/bhuchteman_2019.pdf');
  config.addPassthroughCopy('src/admin/config.yml');
  config.addPassthroughCopy('src/admin/previews.js');
  config.addPassthroughCopy('node_modules/nunjucks/browser/nunjucks-slim.js');

  const now = new Date();

  // Custom collections

  const livePosts = post => post.date <= now && !post.data.draft;
  config.addCollection('posts', collection => {
    return [
      ...collection.getFilteredByGlob('./src/posts/*.md').filter(livePosts)
    ].reverse();
  });

  config.addCollection('postFeed', collection => {
    return [...collection.getFilteredByGlob('./src/posts/*.md').filter(livePosts)]
      .reverse()
      .slice(0, site.maxPostsPerPage);
  });

  // Plugins
  config.addPlugin(rssPlugin);
  config.addPlugin(syntaxHighlight);

  config.cloudinaryCloudName = 'bradvsbrad';
  config.srcsetWidths = [320, 916, 1350, 1600];
  config.fallbackWidth = 916;
  config.lazyLoad = true;
  // config.addPlugin(pluginRespimg);
  config.addShortcode('respimg', (path, alt, sizes, className, srcsetWidths = config.srcsetWidths) => {
    const fetchBase = `https://res.cloudinary.com/${config.cloudinaryCloudName}/image/fetch/`;
    const src = `${fetchBase}q_auto,f_auto,w_${config.fallbackWidth}/${path}`;
    if (!Array.isArray(srcsetWidths)) {
      srcsetWidths = srcsetWidths.split(',');
    }

    const srcset = srcsetWidths.map(w => {
      return `${fetchBase}q_auto:eco,f_auto,w_${w}/${path} ${w}w`;
    }).join(', ');

    return `<img loading="lazy" src="${src}" srcset="${srcset}" class="${className ? className : "respimg"}" sizes="${sizes ? sizes : '100vw'}" alt="${alt ? alt : ''}">`;
  });


  return {
    dir: {
      input: 'src',
      output: 'dist'
    }
    // ,
    // feed:
    //   process.env.SMUGMUG_FEED ||
    //   'https://www.huchteman.com/hack/feed.mg?Type=gallery&Data=74290744_v7dhQT&format=rss200',
    // passthroughFileCopy: true
  };
};

require('dotenv').config();
const {src, dest} = require('gulp');
const cloudinaryUpload = require('gulp-cloudinary-upload');

async function defaultTask() {
  src('ingest/**/*', {debug: true})
    .pipe(
      cloudinaryUpload({
        config: {
          cloud_name: 'bradvsbrad',
          api_key: '244689219856367',
          api_secret: process.env.CLOUDINARY_SECRET,
        },
      })
    )
    .pipe(cloudinaryUpload.manifest())
    .pipe(dest('db'));
}

exports.default = defaultTask;

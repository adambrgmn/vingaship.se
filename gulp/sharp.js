/* eslint-disable import/no-extraneous-dependencies */
const gutil = require('gulp-util');
const sharp = require('sharp');
const through = require('through2-concurrent');
const prettyBytes = require('pretty-bytes');
const plur = require('plur');

const PLUGIN_NAME = 'gulp-sharp';

const availableExtensions = ['jpeg', 'png', 'webp', 'tiff', 'raw'];

module.exports = (opts = {}) => {
  let totalBytes = 0;
  let totalSavedBytes = 0;
  let totalFiles = 0;

  return through.obj(
    { maxConcurrency: 8 },
    (file, enc, cb) => {
      if (file.isNull()) {
        cb(null, file);
        return;
      }

      const newFile = new gutil.File({
        cwd: file.cwd,
        base: file.base,
        path: file.path,
      });

      if (opts.format && !availableExtensions.includes(opts.format)) {
        cb(new gutil.PluginError(PLUGIN_NAME, `Format '${opts.format}' is not provided. Available extensions are: [${availableExtensions.join(', ')}]`));
      }

      const transformer = sharp(file.isBuffer() ? file.contents : undefined);
      transformer
        .resize(opts.width, opts.height)
        .withoutEnlargement(opts.withoutEnlargement);

      if (opts.format) transformer.foFormat(opts.format);

      if (file.isStream()) {
        totalFiles += 1;
        newFile.contents = file.contents.pipe(transformer); // eslint-disable-line no-param-reassign
        cb(null, newFile);
      }

      if (file.isBuffer()) {
        transformer.toBuffer()
          .then((data) => {
            const originalSize = file.contents.length;
            const optimizedSize = data.length;
            const saved = originalSize - optimizedSize;

            totalBytes += originalSize;
            totalSavedBytes += saved;
            totalFiles += 1;

            newFile.contents = data; // eslint-disable-line no-param-reassign
            cb(null, newFile);
          })
          .catch(err => cb(new gutil.PluginError(PLUGIN_NAME, err, { fileName: file.path })));
      }
    },
    (cb) => {
      const percent = totalBytes > 0 ? (totalSavedBytes / totalBytes) * 100 : 0;
      let msg = `Scaled ${totalFiles} ${plur('image', totalFiles)}`;

      if (totalFiles > 0) {
        msg += gutil.colors.gray(` (saved ${prettyBytes(totalSavedBytes)} - ${percent.toFixed(1).replace(/\.0$/, '')}%)`);
      }

      gutil.log(PLUGIN_NAME, msg);
      cb();
    } // eslint-disable-line comma-dangle
  );
};

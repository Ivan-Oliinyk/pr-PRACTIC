import * as csv from 'fast-csv';
import * as fs from 'fs';
import * as path from 'path';

const oldIconPath = path.resolve(__dirname, '..', 'static', 'mobile-icons');
fs.readdir(oldIconPath, (err, files) => {
  console.log(files);
});
fs.createReadStream(path.resolve(__dirname, 'icon-tags.csv'))
  .pipe(csv.parse())
  .on('error', error => console.error(error))
  .on('data', onRodData)
  .on('end', (rowCount: number) => console.log(`Parsed ${rowCount} rows`));

function onRodData(row) {
  const folderPath = path.resolve(
    __dirname,
    '..',
    '..',
    'static',
    'icons-new',
    row[1],
  );
  !fs.existsSync(folderPath) && fs.mkdirSync(folderPath);
  const imgName = `${row[0]}.png`;
  const oldIconPath = path.resolve(
    __dirname,
    '..',
    '..',

    'static',
    'mobile-icons',
    imgName,
  );
  const newIconPath = path.resolve(folderPath, imgName);
  fs.rename(oldIconPath, newIconPath, function(err) {
    if (err) return console.log(`not found icons ${imgName}`);
    // console.log(`Successfully moved ${newIconPath}`);
  });
}

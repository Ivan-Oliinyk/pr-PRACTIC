import * as csv from 'fast-csv';
import * as fs from 'fs';
import { groupBy, map, omit } from 'lodash';
// import { groupBy } from 'lodash';
import * as path from 'path';

fs.createReadStream(path.resolve(__dirname, 'icon-tags.csv'))
  .pipe(csv.parse({ headers: true }))
  .on('error', error => console.error(error))
  .on('data', onRodData)
  .on('end', onEnd);
const data = [];
function onEnd() {
  const filteredDada = data.filter(e => {
    const pathToImg = path.resolve(
      __dirname,
      '..',
      '..',
      'static',
      'icons',
      e.group,
      `${e.name}.png`,
    );
    return fs.existsSync(pathToImg);
  });
  const groupedByGroup = groupBy(filteredDada, 'group');

  Object.keys(groupedByGroup).forEach(category => {
    const filePath = path.resolve(
      __dirname,
      '..',
      '..',
      'static',
      'icons',
      category,
      'icon-tags.csv',
    );
    const dataWithoutCategory = map(groupedByGroup[category], obj =>
      omit(obj, 'group'),
    );

    const ws = fs.createWriteStream(filePath, { flags: 'w+' });
    csv
      .write(dataWithoutCategory, { headers: true })
      .pipe(ws)
      .on('error', console.log)
      .on('end', console.log);
  });
}
function onRodData(row) {
  data.push(row);
}

import fs from 'fs';

import yaml from 'yaml';

import parseGame from './game';
import parseLayTileMoves from './lay-tile-moves';

export default function readYaml(path, options = {}) {
  const content = fs.readFileSync(path, 'utf-8');

  const fileAsObj = yaml.parse(content);

  return parse(fileAsObj, options);
}

export function parse(obj, {kind = 'game'} = {}) {
  switch (kind) {
    case 'game':
    default:
      return parseGame(obj);
    case 'layTileMoves':
      return parseLayTileMoves(obj);
  }
}

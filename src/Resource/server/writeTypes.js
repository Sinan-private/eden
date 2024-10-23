import fs from 'fs';
import path from 'path';
import {PATH} from './path.js';
import {fileURLToPath} from "url";
import {updateResourceTypes} from "./updateResourceTypes.js";

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// Path to the JSON file
// const typeFilePath = path.join(__dirname, PATH + 'resourceTypes.json');
// const keyFilePath = path.join(__dirname, PATH + 'resourceKeys.ts');

// const typesFromFile = JSON.parse(fs.readFileSync(typeFilePath, 'utf-8'));
// const keysFromFile = JSON.parse(fs.readFileSync(keyFilePath, 'utf-8'));

export const writeTypes = (newResources) => {
  updateResourceTypes(newResources);
  // const types = newResources.map(({type}) => type).concat(typesFromFile);
  // const cleanTypes = getUniqueValues(types);
  // fs.writeFileSync(typeFilePath, JSON.stringify(cleanTypes, null, 2), (err) => {
  //   if (err) throw err;
  //   console.log('Types generated successfully!');
  // });
  //
  // const keys = newResources.map(({key}) => key).concat(keysFromFile);
  // const cleanKeys = getUniqueValues(keys);
  // console.log(cleanKeys)
  // fs.writeFileSync(keyFilePath, JSON.stringify(cleanKeys, null, 2), (err) => {
  //   if (err) throw err;
  //   console.log('Types generated successfully!');
  // });
}

const getUniqueValues = (arr) => {
  return Array.from(new Set(arr));
}
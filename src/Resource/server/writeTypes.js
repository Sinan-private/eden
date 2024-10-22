import fs from 'fs';
import path from 'path';
import {PATH} from './path.js';
import {fileURLToPath} from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Path to the JSON file
const resourceFilePath = path.join(__dirname, PATH + 'resourceTypes.json');

// Path where the TypeScript file will be written
const tsFilePath = path.join(__dirname, PATH + 'generatedTypes.ts');

// Step 1: Read the JSON file
const resources = JSON.parse(fs.readFileSync(resourceFilePath, 'utf-8'));

// Step 2: Generate TypeScript content from JSON data
let tsContent = `
export type BaseResourceKeys = ${resources.BaseResourceKeys.map(key => `'${key}'`).join(' | ')};
export type BuildResourceKeys = ${resources.BuildResourceKeys.map(key => `'${key}'`).join(' | ')};
export type ProcessedResourceKeys = ${resources.ProcessedResourceKeys.map(key => `'${key}'`).join(' | ')};
export type CitizenResourceKeys = ${resources.CitizenResourceKeys.map(key => `'${key}'`).join(' | ')};
export type CurrencyResourceKeys = ${resources.CurrencyResourceKeys.map(key => `'${key}'`).join(' | ')};

export type ResourceKeys =
  | BaseResourceKeys
  | BuildResourceKeys
  | ProcessedResourceKeys
  | CitizenResourceKeys
  | CurrencyResourceKeys;

export type TradeResourceKeys = BuildResourceKeys | ProcessedResourceKeys;

export type ResourceTypes = ${resources.ResourceTypes.map(type => `'${type}'`).join(' | ')};
`;


// Step 3: Write the TypeScript content to the file
export const writeTypes = () => {
  fs.writeFileSync(tsFilePath, tsContent, (err) => {
    if (err) throw err;
    console.log('TypeScript types generated successfully!');
  });
}
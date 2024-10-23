import fs from 'fs';
import path from 'path';
import {PATH} from './path.js';
import {fileURLToPath} from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Path to your file (adjust this to match your setup)

export const updateResourceTypes = (fileName, fileConversion) => {
const filePath = path.join(__dirname, PATH + fileName + '.ts');
// Step 1: Read the file
  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      console.error("Error reading the file:", err);
      return;
    }

    // Step 2: Extract the array
    const arrayPattern = /export\s+const\s+resourceTypes\s+=\s+\[(.*?)\] as const;/s;
    const match = data.match(arrayPattern);
    if (!match) {
      console.error("Something is wrong with the file");
      return;
    }

    // Step 2: Extract the array content (without eval)
    const resourceArray = match[1]
      .split(',')
      .map(item => item.trim().replace(/["']/g, '')); // Remove extra quotes and whitespace

    console.log("Original array:", resourceArray);

    // Step 3: Modify the array (for example, adding a new resource type)
    resourceArray.push('new_resource');

    console.log("Updated array:", resourceArray);

    // Step 4: Update the file content with the modified array
    const newArrayString = JSON.stringify(resourceArray, null, 2)
      .replace(/^\[|\]$/g, '') // Remove square brackets
      .replace(/"/g, '\"');    // Escape quotes for TypeScript format

    const updatedContent = data.replace(arrayPattern, `export const resourceTypes = [${newArrayString}] as const;`);

    // Step 5: Write the updated file
    fs.writeFile(filePath, updatedContent, 'utf8', (err) => {
      if (err) {
        console.error("Error writing the file:", err);
        return;
      }
      console.log("File successfully updated!");
    });
  });
}
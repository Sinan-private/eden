import fs from 'fs';
import path from './path.js';
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
    const arrayPattern = new RegExp(`export\\s+const\\s+${fileName}\\s+=\\s+\\[(.*?)\\] as const;`, 's');
    const match = data.match(arrayPattern);
    if (!match) {
      console.error("Something is wrong with the file");
      return;
    }

    // Step 2: Extract the array content
    const values = match[1]
      .split(',')
      .map(item => item.trim().replace(/["']/g, '')); // Remove extra quotes and whitespace

    // Step 3: Firing the calback
    const updatedValues = typeof fileConversion === 'function' ? fileConversion(values) : values;

    // Step 4: Update the file content with the modified array
    const newArrayString = JSON.stringify(updatedValues, null, 2)
      .replace(/^\[|\]$/g, '') // Remove square brackets
      .replace(/"/g, '\"');    // Escape quotes for TypeScript format

    const updatedContent = data.replace(arrayPattern, `export const ${fileName} = [${newArrayString}] as const;`);

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
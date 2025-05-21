import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import { fileURLToPath } from 'url'; // Required for ES module to handle __dirname
import path from 'path';
import {PATH} from './path.js';
import fs from 'fs';
import {writeKeys} from "./writeKeys.js";
import {writeTypes} from "./writeTypes.js";
import {removeType} from "./removeType.js";
// Serve static frontend files
// For ES modules, __dirname isn't available, so we calculate it using the following code
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(bodyParser.json());
app.use(cors());

const resourcesFilePath = path.join(__dirname, PATH + 'initialResources.json');

// Get all resources
app.get('/resources', (req, res) => {
  fs.readFile(resourcesFilePath, 'utf8', (err, data) => {
    if (err) {
      return res.status(500).json({ message: 'Error reading resources file', error: err });
    }
    const resources = JSON.parse(data);
    res.json(resources);
  });
});

app.get('/resource_keys', (req, res) => {
  // This is working but not in use currently. I am keeping this still to be able to fetch the keys
  // if I have any reloading issues
  const fileName = 'resourceKeys'
  const filePath = path.join(__dirname, PATH + fileName + '.ts');
  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      console.error("Error reading the resourceKeys.ts:", err);
      return reject(err);
    }

    try {
      const values = fileToArray(fileName, data);
      res.json(values);
    } catch (error) {
      reject(error);
    }
  });
});

app.get('/types', (req, res) => {
  // This is working but not in use currently. I am keeping this still to be able to fetch the keys
  // if I have any reloading issues
  const fileName = 'resourceTypes'
  const filePath = path.join(__dirname, PATH + fileName + '.ts');
  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      console.error("Error reading the resourceTypes.ts:", err);
      return reject(err);
    }

    try {
      const values = fileToArray(fileName, data);
      res.json(values);
    } catch (error) {
      reject(error);
    }
  });
});


// Update od add new resources
app.post('/resources', (req, res) => {
  // const tempTarget = './src/gameRules/initialResources_test.json'
  const newResources = req.body;

  // Write the new resources data to the resources.json file
  // This is weird. This writeKeys() triggered a reload I needed to fix. Now something in my changes
  // fixed this issue, and I am not sure what. So when the problem returns and saving triggers
  // a reload, this is the place to check
  //   writeKeys(newResources);
  fs.writeFile(resourcesFilePath, JSON.stringify(newResources, null, 2), 'utf8', (err) => {
    if (err) {
      return res.status(500).json({ message: 'Error writing to resources file', error: err });
    }
    res.json({ message: 'Resources updated successfully' });
  });
});

app.post('/add_resource_key', (req, res) => {
  const newResources = req.body;
  // This is weird. This writeKeys() triggered a reload I needed to fix. Now something in my changes
  // fixed this issue, and I am not sure what. So when the problem returns and saving triggers
  // a reload, this is the place to check
    writeKeys(newResources);
});

app.post('/add_type', (req, res) => {
  // const tempTarget = './src/gameRules/initialResources_test.json'
  const type = req.body;
  writeTypes(type)
  res.json({ message: 'Type added successfully' });
  // Write the new resources data to the resources.json file

});

app.post('/remove_type', (req, res) => {
  // const tempTarget = './src/gameRules/initialResources_test.json'
  const type = req.body;
  console.log(type);
  removeType(type)
  res.json({ message: 'Type removed successfully' });

  // Write the new resources data to the resources.json file

});


// Serve React app or any frontend from the "public" folder or build folder if applicable
app.use(express.static(path.join(__dirname, 'public')));

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

// !! Caution !! - For some reason I don't know the fileToArray can not be exported into its own file.
// When doing so the whole app breaks ungratefully with a 500. Exploding head emoji
const fileToArray = (fileName, data) => {
  const arrayPattern = new RegExp(`export\\s+const\\s+${fileName}\\s+=\\s+\\[(.*?)\\] as const;`, 's');
  const match = data.match(arrayPattern);
  if (!match) {
    return null
    // throw new Error("Could not find array in file")
  }

  const values = match[1]
    .split(',')
    .map(item => item.trim().replace(/["']/g, ''));
  return values
}

import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import path from 'path';
import {PATH} from './path.js';
import { fileURLToPath } from 'url'; // Required for ES module to handle __dirname
import fs from 'fs';
import {writeTypes} from "./writeTypes.js";

// Serve static frontend files
// For ES modules, __dirname isn't available, so we calculate it using the following code
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(bodyParser.json());
app.use(cors());

// Sample in-memory data structure (resources)
let resources = [
  { id: 1, name: 'Gold', quantity: 1000 },
  { id: 2, name: 'Wood', quantity: 500 },
  { id: 3, name: 'Stone', quantity: 300 }
];

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


// Add a new resource
app.post('/resources', (req, res) => {
  // const tempTarget = './src/gameRules/initialResources_test.json'
  const newResources = req.body;

  // Write the new resources data to the resources.json file
  fs.writeFile(resourcesFilePath, JSON.stringify(newResources, null, 2), 'utf8', (err) => {
    if (err) {
      return res.status(500).json({ message: 'Error writing to resources file', error: err });
    }
      writeTypes();
    res.json({ message: 'Resources updated successfully' });
  });
});


// Serve React app or any frontend from the "public" folder or build folder if applicable
app.use(express.static(path.join(__dirname, 'public')));

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});


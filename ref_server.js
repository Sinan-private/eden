import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(bodyParser.json());
app.use(cors());

// Setup for __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Path to the resources.json file
const resourcesFilePath = path.join(__dirname, 'resources.json');

// Endpoint to get resources from resources.json
app.get('/api/resources', (req, res) => {
  console.log('me')
  fs.readFile(resourcesFilePath, 'utf8', (err, data) => {
    if (err) {
      return res.status(500).json({ message: 'Error reading resources file', error: err });
    }
    const resources = JSON.parse(data);
    res.json(resources);
  });
});

// Endpoint to overwrite the resources.json file
app.post('/api/resources', (req, res) => {
  const newResources = req.body;

  // Write the new resources data to the resources.json file
  fs.writeFile(resourcesFilePath, JSON.stringify(newResources, null, 2), 'utf8', (err) => {
    if (err) {
      return res.status(500).json({ message: 'Error writing to resources file', error: err });
    }
    res.json({ message: 'Resources updated successfully' });
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

const fs = require('fs');
const path = require('path');

const dbPath = path.join(__dirname, '../data/store.json');

const readDb = () => {
  if (!fs.existsSync(dbPath)) {
    return { users: [], papers: [] };
  }
  const data = fs.readFileSync(dbPath, 'utf8');
  return JSON.parse(data);
};

const writeDb = (data) => {
  fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));
};

module.exports = { readDb, writeDb };

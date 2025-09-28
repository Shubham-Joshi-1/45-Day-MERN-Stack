const { MongoClient } = require('mongodb');

const mongoUrl = 'mongodb://localhost:27017';
const dbName = 'blogDB';
let db;

async function connectDB() {
  const client = await MongoClient.connect(mongoUrl);
  db = client.db(dbName);
  console.log("✅ Connected to MongoDB");
  return db;
}

function getDB() {
  if (!db) throw new Error("Database not initialized, call connectDB first.");
  return db;
}

module.exports = { connectDB, getDB };







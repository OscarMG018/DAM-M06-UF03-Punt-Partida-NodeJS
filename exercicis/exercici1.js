const fs = require('fs');
const path = require('path');
const { MongoClient } = require('mongodb');
const xml2js = require('xml2js');
require('dotenv').config();
const Logger = require('./logger');

const xmlFilePath = path.join(__dirname, '../data/posts.xml');

async function parseXMLFile(filePath) {
    try {
      const xmlData = fs.readFileSync(filePath, 'utf-8');
      const parser = new xml2js.Parser({ 
        explicitArray: false,
        mergeAttrs: true
      });
      
      return new Promise((resolve, reject) => {
        parser.parseString(xmlData, (err, result) => {
          if (err) {
            reject(err);
          } else {
            resolve(result);
          }
        });
      });
    } catch (error) {
      Logger.error('Error llegint o analitzant el fitxer XML:', error);
      throw error;
    }
}

function decodeHTMLEntities(text) {
    // Method for Node.js environment using a simple regex-based approach
    return text.replace(/&#x([0-9A-F]+);/gi, (match, hex) => {
        return String.fromCharCode(parseInt(hex, 16));
      })
      // Handle decimal entities (like &#60;)
      .replace(/&#(\d+);/g, (match, dec) => {
        return String.fromCharCode(dec);
      })
      // Handle named entities
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"')
      .replace(/&apos;/g, "'")
      .replace(/&nbsp;/g, ' ');
  }

function processData(data) {
    // Make sure we have data to process
    if (!data.posts.row || !Array.isArray(data.posts.row)) {
        Logger.error('Invalid data: Expected an array');
      return [];
    }
    // Use map correctly to transform each row
    return data.posts.row.map(row => {
      // Return the transformed object directly
        return {
            "Id": parseInt(row.Id) || 0,
            "PostTypeId": parseInt(row.PostTypeId) || 1,
            "AcceptedAnswerId": parseInt(row.AcceptedAnswerId) || 0,
            "CreationDate": row.CreationDate || new Date().toISOString(),
            "Score": parseInt(row.Score) || 0,
            "ViewCount": parseInt(row.ViewCount) || 0,
            "Body": decodeHTMLEntities(row.Body || ""),
            "OwnerUserId": parseInt(row.OwnerUserId) || 0,
            "LastActivityDate": row.LastActivityDate || new Date().toISOString(),
            "Title": row.Title || "",
            "Tags": row.Tags || "",
            "AnswerCount": parseInt(row.AnswerCount) || 0,
            "CommentCount": parseInt(row.CommentCount) || 0,
            "ContentLicense": row.ContentLicense || "CC BY-SA 2.5"
        };
    });
  }

async function loadDataToMongoDB() {
    const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/';
    const client = new MongoClient(uri);

    try {
        await client.connect();
        Logger.log('Connectat a MongoDB');
        
        const database = client.db('post_db');
        const collection = database.collection('posts');
        
        Logger.log('Llegint el fitxer XML...');
        const xmlData = await parseXMLFile(xmlFilePath);
        
        Logger.log('Processant les dades...');
        const posts = processData(xmlData);
        
        Logger.log('Eliminant dades existents...');
        await collection.deleteMany({});

        Logger.log('Inserint dades a MongoDB...');
        const result = await collection.insertMany(posts);
        
        Logger.log(`${result.insertedCount} documents inserits correctament.`);
        Logger.log('Dades carregades amb èxit!');
        
    } catch (error) {
        Logger.error('Error carregant les dades a MongoDB:', error);
    } finally {
        await client.close();
        Logger.log('Connexió a MongoDB tancada');
    }
}

loadDataToMongoDB();
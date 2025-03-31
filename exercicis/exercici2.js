const { MongoClient } = require('mongodb');
const Logger = require('./logger');


const uri = process.env.MONGODB_URI || "mongodb://localhost:27017";
const dbName = 'post_db';
const collectionName = 'posts';
// --------------------

async function runQueries() {
    const client = new MongoClient(uri);

    try {
        // Connect to the MongoDB cluster
        await client.connect();
        Logger.log("Successfully connected to MongoDB.");

        // Get the database and collection
        const database = client.db(dbName);
        const postsCollection = database.collection(collectionName);

        // --- Query 1: Preguntes amb ViewCount > mitjana ---
        Logger.log("\n--- Query 1: Finding posts with ViewCount > average ---");

        // 1.a Calculate the average ViewCount using aggregation
        const avgPipeline = [
            {
                $group: {
                    _id: null, // Group all documents together
                    averageViewCount: { $avg: '$ViewCount' }
                }
            }
        ];

        const avgResultCursor = postsCollection.aggregate(avgPipeline);
        const avgResult = await avgResultCursor.next(); // Get the single result document

        if (!avgResult) {
            Logger.log("Could not calculate average ViewCount (collection might be empty or lack 'ViewCount' field).");
        } else {
            const averageViewCount = avgResult.averageViewCount;
            Logger.log(`Average ViewCount calculated: ${averageViewCount}`);

            // 1.b Find posts where ViewCount is greater than the calculated average
            const highViewCountQuery = {
                ViewCount: { $gt: averageViewCount }
            };
            // Optional: Select only relevant fields to display
            const projection = { Title: 1, ViewCount: 1, _id: 0 };

            const highViewCountCursor = postsCollection.find(highViewCountQuery).project(projection);

            const highViewCountPosts = await highViewCountCursor.toArray();

            if (highViewCountPosts.length > 0) {
                Logger.log("");
                Logger.log(`Found ${highViewCountPosts.length} posts with ViewCount > ${averageViewCount}:`);
                Logger.log("");
                // Print limited results for brevity
                highViewCountPosts.slice(0, 10).forEach(post => Logger.log(post));
                 if (highViewCountPosts.length > 10) {
                    Logger.log("... and more.");
                }
            } else {
                Logger.log(`No posts found with ViewCount greater than the average (${averageViewCount}).`);
            }
        }


        // --- Query 2: Preguntes amb títols que contenen paraules específiques ---
        Logger.log("\n--- Query 2: Finding posts with specific words in Title ---");

        const searchWords = ["pug", "wig", "yak", "nap", "jig", "mug", "zap", "gag", "oaf", "elf"];

        // Create a regex pattern: /pug|wig|yak|...|elf/i  (case-insensitive)
        const titleRegexPattern = searchWords.join('|');
        const titleRegex = new RegExp(titleRegexPattern, 'i'); // 'i' for case-insensitive

        const titleQuery = {
            Title: { $regex: titleRegex }
        };
        // Optional: Select only relevant fields
        const titleProjection = { Title: 1, _id: 0 };

        const titleCursor = postsCollection.find(titleQuery).project(titleProjection);
        const matchingTitlePosts = await titleCursor.toArray();

        if (matchingTitlePosts.length > 0) {
            Logger.log("");
            Logger.log(`Found ${matchingTitlePosts.length} posts with titles containing specified words:`);
            Logger.log("");
             // Print limited results for brevity
            matchingTitlePosts.slice(0, 10).forEach(post => Logger.log(post));
             if (matchingTitlePosts.length > 10) {
                Logger.log("... and more.");
            }
        } else {
            Logger.log("No posts found with titles matching the specified words.");
        }

    } catch (error) {
        Logger.error("An error occurred:", error);
    } finally {
        // Ensures that the client will close when you finish/error
        await client.close();
        Logger.log("\nConnection closed.");
    }
}

// Run the main function
runQueries().catch(Logger.error);
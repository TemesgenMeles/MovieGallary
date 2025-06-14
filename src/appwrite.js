import { Client, Databases, Query } from "appwrite";

const PROJECT_ID = import.meta.env.VITE_APPWRITE_PROJECT_ID;
const DATABSE_ID = import.meta.env.VITE_APPWRITE_DATABASE_ID;
const COLLECTION_ID = import.meta.env.VITE_APPWRITE_COLLECTION_ID;

// create a new Appwrite client instance and set the endpoint and project ID 
//this initializes the Appwrite client to interact with the Appwrite backend
const client = new Client()
  .setEndpoint('https://cloud.appwrite.io/v1') // Your Appwrite endpoint
  .setProject(PROJECT_ID);
// create a new Databases instance to interact with the Appwrite database
// this allows you to perform database operations like creating, reading, updating, and deleting documents
const database = new Databases(client);

export const updateSearchCount = async (id, title, poster_path) => {
    try{
        
        const result = await database.listDocuments(DATABSE_ID, COLLECTION_ID, [
            Query.equal('movie_title', title)
        ]); // Search for the document with the given search term

        // Check if the search term already exists in the database
        if (result.documents.length > 0) {
            // If the search term already exists, update the count
            const document = result.documents[0];
            await database.updateDocument(
                DATABSE_ID,
                COLLECTION_ID,
                document.$id,
                {
                    count: document.count + 1,
                }
            );
        } else {
            // If the search term does not exist, create a new document
            await database.createDocument(
                DATABSE_ID,
                COLLECTION_ID,
                'unique()',
                {
                    movie_title: title,
                    count: 1,
                    movie_id: id, // Store the movie details
                    poster_url: `https://image.tmdb.org/t/p/w500/${poster_path}`, // Store the poster URL
                }
            );
        }
    } catch (error) {
        console.error( error);
    }
}

export const getTradingMovies = async () => {
    try {
        const result = await database.listDocuments(DATABSE_ID, COLLECTION_ID, [
            Query.orderDesc('count'),
            Query.limit(5), // Limit to 5 most searched movies
        ]);

        return result.documents;
    } catch (error) {
        console.error('Error fetching trading movies:', error);
        return [];
    }
}
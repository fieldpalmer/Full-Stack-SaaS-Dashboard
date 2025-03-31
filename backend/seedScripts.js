import dotenv from 'dotenv';
import { MongoClient } from 'mongodb';
import axios from 'axios';

dotenv.config();

const MONGO_URI = process.env.MONGO_URI;
const LASTFM_API_KEY = process.env.LASTFM_API_KEY;
const TMDB_API_KEY = process.env.TMDB_API_KEY;

async function seedMusic() {
     const client = new MongoClient(MONGO_URI);

     try {
          await client.connect();
          console.log('Connected to MongoDB');

          const db = client.db('saas_dashboard');
          const musicCollection = db.collection('music');

          const response = await axios.get('http://ws.audioscrobbler.com/2.0/', {
               params: {
                    method: 'chart.gettopartists',
                    api_key: LASTFM_API_KEY,
                    format: 'json',
                    limit: 50
               }
          });

          const musicData = response.data.artists.artist.map((artist) => ({
               name: artist.name,
               listeners: parseInt(artist.listeners, 10),
               image: artist.image?.[3]?.['#text'],
               url: artist.url
          }));

          await musicCollection.deleteMany({});
          const result = await musicCollection.insertMany(musicData);

          console.log(`Inserted ${result.insertedCount} artists into 'music' collection.`);
     } catch (err) {
          console.error('Seeding error:', err.message);
     } finally {
          await client.close();
          console.log('Disconnected from MongoDB');
     }
}

async function fetchPopularMovies(page = 1) {
     const res = await axios.get('https://api.themoviedb.org/3/movie/popular', {
          params: {
               api_key: TMDB_API_KEY,
               language: 'en-US',
               page
          }
     });

     return res.data.results.map((movie) => ({
          title: movie.title,
          overview: movie.overview,
          release_date: movie.release_date,
          rating: movie.vote_average,
          popularity: movie.popularity,
          poster_url: movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : null,
          tmdb_id: movie.id
     }));
}

async function seedMovies() {
     const client = new MongoClient(MONGO_URI);
     try {
          await client.connect();
          console.log('Connected to MongoDB');

          const db = client.db('saas_dashboard');
          const moviesCollection = db.collection('movies');

          const allMovies = [];
          for (let i = 1; i <= 3; i++) {
               const pageMovies = await fetchPopularMovies(i);
               allMovies.push(...pageMovies);
          }

          await moviesCollection.deleteMany({});
          const result = await moviesCollection.insertMany(allMovies);

          console.log(`Seeded ${result.insertedCount} movies into 'movies' collection.`);
     } catch (err) {
          console.error('Error:', err.message);
     } finally {
          await client.close();
          console.log('Disconnected from MongoDB');
     }
}

const subjects = ['fiction', 'nonfiction', 'biography', 'science', 'technology', 'art', 'history'];

async function fetchBooksBySubject(subject, maxResults = 10) {
     const res = await axios.get('https://www.googleapis.com/books/v1/volumes', {
          params: {
               q: `subject:${subject}`,
               maxResults
          }
     });

     return (res.data.items || []).map((item) => {
          const volume = item.volumeInfo;

          return {
               title: volume.title,
               authors: volume.authors || [],
               description: volume.description || '',
               publishedDate: volume.publishedDate || '',
               categories: volume.categories || [],
               thumbnail: volume.imageLinks?.thumbnail || null,
               infoLink: volume.infoLink,
               googleId: item.id
          };
     });
}

async function seedBooks() {
     const client = new MongoClient(MONGO_URI);
     try {
          await client.connect();
          console.log('Connected to MongoDB');

          const db = client.db('saas_dashboard');
          const booksCollection = db.collection('books');

          const allBooks = [];

          for (const subject of subjects) {
               console.log(`Fetching books for: ${subject}`);
               const books = await fetchBooksBySubject(subject, 10);
               allBooks.push(...books);
          }

          await booksCollection.deleteMany({});
          const result = await booksCollection.insertMany(allBooks);

          console.log(`Seeded ${result.insertedCount} books into 'books' collection.`);
     } catch (err) {
          console.error('Error:', err.message);
     } finally {
          await client.close();
          console.log('Disconnected from MongoDB');
     }
}

seedBooks();
seedMovies();
seedMusic();

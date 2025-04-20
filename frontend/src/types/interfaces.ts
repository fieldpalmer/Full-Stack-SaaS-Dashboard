export interface Movie {
   _id: string;
   title: string;
   release_date: string;
   rating: number;
   popularity: number;
   poster_url: string;
   tmdb_id: number;
}

export interface Book {
   _id: string;
   title: string;
   authors: string[];
   description: string;
   publishedDate: string;
   categories: string[];
   thumbnail: string;
   infoLink: string;
   googleId: string;
   pageCount: number;
}

export interface Music {
   _id: string;
   name: string;
   listeners: number;
   image: string;
   url: string;
}

export interface UserFavorites {
   movies: Movie[];
   books: Book[];
   music: Music[];
}

export interface YearDistribution {
   [key: number]: number;
}

export interface MovieStats {
   count: number;
   avgRating: number;
   avgPopularity: number;
   oldestMovie: Date | null;
   newestMovie: Date | null;
   ratingDistribution: Array<{
      rating: string;
      count: number;
   }>;
}

export interface BookStats {
   count: number;
   uniqueAuthors: number;
   avgPages: number;
   oldestBook: Date | null;
   newestBook: Date | null;
   yearDistribution: YearDistribution;
}

export interface BookData {
   _id: string;
   title: string;
   authors: string[];
   description: string;
   publishedDate: string;
   categories: string[];
   thumbnail: string;
   infoLink: string;
   googleId: string;
   pageCount: number;
}

export interface MusicStats {
   totalArtists: number;
   totalListeners: number;
   averageListeners: number;
   topArtists: Array<{
      name: string;
      listeners: number;
      tracks: number;
   }>;
}

export interface MovieData {
   _id: string;
   title: string;
   overview: string;
   release_date: string;
   rating: number;
   popularity: number;
   poster_url: string;
   tmdb_id: number;
}

export interface MusicData {
   _id: string;
   name: string;
   artist: string;
   album: string;
   duration_ms: number;
   popularity: number;
   preview_url: string;
   spotify_url: string;
   spotify_id: string;
   release_date: string;
   description: string;
}

export interface ArtistStats {
   name: string;
   listeners: number;
   tracks: number;
}

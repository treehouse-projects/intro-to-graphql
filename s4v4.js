
// Treehouse - Introduction to GraphQL - Stage 4 - Video 4

const { ApolloServer } = require("apollo-server");

const directors = [
  {
    id: "director_0",
    name: "Steven Spielburg",
    movieIds: [
      "movie_0",
      "movie_1",
    ],
  },
];

const studios = [
  {
    id: "studio_0",
    name: "Paramount",
    location: "Hollywood",
    movieIds: [
      "movie_0",
      "movie_1",
      "movie_2",
    ]
  },
  {
    id: "studio_1",
    name: "Universal",
    location: "Universal City",
    movieIds: [
      "movie_3",
    ]
  },
];

const movies = [
  {
    id: "movie_0",
    title: "Arachnophobia",
    tagline: "Eight legs, two fangs, and an attitude.",
    revenue: 53200000,
    releaseYear: 2000,
  },
  {
    id: "movie_1",
    title: "Armageddon",
    tagline: "Earth. It was fun while it lasted.",
    revenue: 553700000,
    releaseYear: 2000,
  },
  {
    id: "movie_2",
    title: "Catch Me If You Can",
    tagline: "The true story of a real fake.",
    revenue: 352100000,
    releaseYear: 2000,
  },
  {
    id: "movie_3",
    title: "Christmas Vacation",
    tagline: "Yule crack up.",
    revenue: 71300000,
    releaseYear: 2001,
  },
];

let directorIdIndex = directors.length - 1;
let movieIdIndex = movies.length - 1;

/**
* This typeDefs variable holds our GraphQL Schema. This is the only 
* part of this file you need to know about, you can ignore the rest!
*/
const typeDefs = `
  type Movie {
    id: ID!
    title: String!
    tagline: String
    revenue: Int
    studio: Studio
    releaseYear: Int
    directors: [Director!]
  }

  type Studio {
    id: ID!
    name: String!
    location: String!
  }

  type Director {
    id: ID!
    name: String!
  }

  type Query {
    allMovies: [Movie!]
    topMovieByRevenue: Movie!
    movieById (
      movieId: ID!
    ): Movie!
    randomMovieByYear (
      year: Int!
    ): Movie!
  }

  input DirectorInput {
    name: String!
  }

  type Mutation {
    createMovie (
      title: String!
      tagline: String
      revenue: Int
    ): Movie
    addDirectorToMovie (
      movieId: ID!
      director: DirectorInput
    ): Movie
  }
`;

const resolvers = {
  Query: {
    allMovies: (root, args, context) => {
      return movies;
    },
    topMovieByRevenue: (root, args, context) => {
      const moviesByRevenueDesc = movies.sort((movieA, movieB) => (movieA.revenue < movieB.revenue));

      return moviesByRevenueDesc[0];
    },
    movieById: (root, args, context) => {
      return movies.find(movie => movie.id === args.movieId);
    },
    randomMovieByYear: (root, args, context) => {
      const moviesByYear = movies.filter(movie => movie.releaseYear === args.year);
      const randomSeed = Math.floor(Math.random() * moviesByYear.length);

      return moviesByYear[randomSeed];
    }
  },
  Mutation: {
    createMovie: (root, args, context) => {
      const newMovie = {
        id: `movie_${++movieIdIndex}`,
        ...args
      };

      movies.push(newMovie);

      return newMovie;
    },
    addDirectorToMovie: (root, args, context) => {
      const newDirector = {
        id: `director_${++directorIdIndex}`,
        movieIds: [args.movieId],
        ...args.director
      };

      directors.push(newDirector);

      return movies.find(movie => movie.id === args.movieId);
    }
  },
  Movie: {
    studio: (root, args, context) => {
      return studios.find(studio => {
        return studio.movieIds.find(movieId => movieId === root.id);
      });
    },
    directors: (root, args, context) => {
      return directors.filter(director => {
        return director.movieIds.find(movieId => movieId === root.id);
      });
    }
  }
};

const server = new ApolloServer({
  typeDefs,
  resolvers
});

server.listen({ port: 3000 }).then(({ url }) => {
  console.log(`🚀 Server ready at ${url}`);
});

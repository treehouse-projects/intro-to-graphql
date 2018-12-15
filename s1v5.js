
// Treehouse - Introduction to GraphQL - Stage 1 - Video 5

const { ApolloServer } = require("apollo-server");

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
  },
  {
    id: "movie_1",
    title: "Armageddon",
    tagline: "Earth. It was fun while it lasted.",
    revenue: 553700000,
  },
  {
    id: "movie_2",
    title: "Catch Me If You Can",
    tagline: "The true story of a real fake.",
    revenue: 352100000,
  },
  {
    id: "movie_3",
    title: "Christmas Vacation",
    tagline: "Yule crack up.",
    revenue: 71300000,
  },
];

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
  }

  type Studio {
    id: ID!
    name: String!
    location: String!
  }

  type Query {
    allMovies: [Movie!]
  }
`;

const resolvers = {
  Query: {
    allMovies: (root, args, context) => {
      return movies;
    },
  },
  Movie: {
    studio: (root, args, context) => {
      return studios.find(studio => {
        return studio.movieIds.find(movieId => movieId === root.id);
      });
    },
  }
};

const server = new ApolloServer({
  typeDefs,
  resolvers
});

server.listen({ port: 3000 }).then(({ url }) => {
  console.log(`🚀 Server ready at ${url}`);
});

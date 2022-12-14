const { gql } = require('apollo-server-express');

const typeDefs = gql`

    type Query {
        me: User
    }
    
    type Mutation {
        loginUser(email: String!, password: String!): Auth
        addUser(username: String!, email: String!, password: String!): Auth
        saveBook(input: SavedBook!): User
        removeBook(bookId: String!): User
    }

    type User {
        _id: ID!
        username: String!
        email: String! 
        bookCount: Int 
        savedBooks: [Book]
    }

    type Book {
        bookId: String
        authors: [String]
        description: String
        title: String
        image: String
        link: String
    }

    input SavedBook {
        bookId: String
        authors: [String]
        description: String
        title: String
        image: String
        link: String
    }

    type Auth {
        token: ID!
        user: User
    }
`

module.exports = typeDefs;
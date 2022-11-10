const { AuthenticationError } = require('apollo-server-express');
const { Book, User } = require('./models');
const { signToken } = require('../utils/auth');

const resolvers = {
    Query: {
        me: async (context) => {
            if (context.user) {
                const userData = await User.findOne({ _id: context.user._id })
                  .select("-__v -password")
                  .populate("books");

                return userData;
            }
            throw new AuthenticationError('User not logged in!');
        },
    },

    Mutation: {

        loginUser: async (parent, {email, password}) => {
            const user  = await User.findOne({ email });
            if (!user) {
                throw new AuthenticationError('No user found');
            }

            const correctPassword = await user.isCorrectPassword(password);
            if (!correctPassword) {
                throw new AuthenticationError('Incorrect password');
              }
        },

        addUser: async (parent, args) => {
            const user = await User.create(args);
            const token = signToken(user);
            return { token, user };
        },

        saveBook: async (parent, args, context) => {
            if (context.user) {
                const userUpdated = await User.findByIdandUpdate(
                    { _id: context.user._id },
                    { $push: { savedBooks: args.input  }},
                    { new: true }
                    ); 
                
                return userUpdated;
            }
            
            throw new AuthenticationError('User not logged in!');
        },
 
        removeBook: async (parent, args, context) => {
            if (context.user) {
                const userUpdated = await User.findByIdandUpdate(
                    { _id: context.user._id },
                    { $pull: { savedBooks: { bookId: args.bookId } }},
                    { new: true }
                );

                return userUpdated
            }

            throw new AuthenticationError('User not logged in!');

        }

    }
}

module.exports = resolvers;
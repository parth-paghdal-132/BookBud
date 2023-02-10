const mongoCollections = require('../config/mongoCollections');
const {ObjectId} = require("mongodb");
const books = mongoCollections.books;
const users = mongoCollections.users;

const getBookByBookId = async (bookId) => {
    const bookCollection = await books()
    const book = await bookCollection.findOne({bookId: bookId})

    return book
}

const createBook = async (title, author, bookId) => {
    let newBook = {
        title: title,
        author: author,
        bookId: bookId,
        reviews: []
    }

    const bookCollection = await books()
    const insertInfo = await bookCollection.insertOne(newBook)
    if (!insertInfo.acknowledged || !insertInfo.insertedId) throw 'Could not add book';

    return await getBookByBookId(bookId)
}

const createReview = async (review, bookId, userId, username) => {
    const newReview = {_id: new ObjectId(), userThatPostedReview: username, review: review}
    const newUserReview = {bookId: bookId, review: review}

    const bookCollection = await books()
    const userCollection = await users()
    const updatedBook = {
        reviews: newReview
    }

    const updatedUser = {
        reviews: newUserReview
    }

    let updatedInfo = await bookCollection.updateOne({bookId: bookId}, {$push: updatedBook});
    if (updatedInfo.modifiedCount === 0) {
        throw 'Could not create review successfully';
    }

    updatedInfo = await userCollection.updateOne({_id: new ObjectId(userId)}, {$push: updatedUser})
    if (updatedInfo.modifiedCount === 0) {
        throw 'Could not update review in user document successfully';
    }

    return await getBookByBookId(bookId);
}

module.exports = {getBookByBookId, createBook, createReview}
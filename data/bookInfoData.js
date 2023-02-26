const mongoCollections = require('../config/mongoCollections');
const {ObjectId} = require("mongodb");
const books = mongoCollections.books;
const users = mongoCollections.users;
const authData = require("./authData")
const xss = require("xss")
const authValidations = require("../utils/authValidations")

const getBookByBookId = async (bookId) => {
    const bookCollection = await books()
    const book = await bookCollection.findOne({bookId: bookId})

    return book
}

const createBook = async (title, authors, description, categories, bookId, thumbImage, previewLink) => {
    let newBook = {
        title: title,
        authors: authors,
        description: description,
        categories: categories,
        bookId: bookId,
        thumbImage: thumbImage,
        previewLink: previewLink,
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

const getReviewsFromUsername = async (username) => {
    username = xss(username).trim()

    let errors = {}
    let user = await authData.getUserByUsername(username)
    
    const booksCollection = await books()
    const reviewsWithBookInformation = await booksCollection.find({reviews: {$elemMatch: {userThatPostedReview: username}}}).toArray()
    if(reviewsWithBookInformation === null) {
        errors.other = "No reviews found."
        throw errors
    }
    return reviewsWithBookInformation
}

const getReviewById = async (reviewId) => {
    reviewId = xss(reviewId).trim()

    let errors = {}
    authValidations.isValidId(reviewId, "review id", errors)

    const booksCollection = await books()
    const search = {
        "reviews": {
            $elemMatch: {
                _id: new ObjectId(reviewId)
            }
        }
    }
    const projection = {
        _id: 0,
        "reviews.$": 1
    }
    const data = await booksCollection.findOne(search, {projection})
    if(data.reviews === undefined) {
        errors.other = "No reviews found with given ID."
        throw errors
    }
    if(data.reviews[0] === undefined || data.reviews[0] == null){
        errors.other = "No reviews found with given ID."
        throw errors
    }
    return data.reviews[0]
}

const deleteReview = async (reviewId, username) => {
    reviewId = xss(reviewId).trim()
    username = xss(username).trim().toLowerCase()

    let errors = {}
    authValidations.isValidId(reviewId, "review id", errors)

    let reviewFromDB = await getReviewById(reviewId)
    if(reviewFromDB === null) {
        errors.other = "No review found with given ID."
        throw errors
    }

    if(reviewFromDB.userThatPostedReview !== username) {
        errors.other = "trying to delete some one elses reviews."
        throw errors
    }

    const bookWithThisReview = await getBookAssociatedWithThisReview(reviewId)
    
    const bookCollection = await books()
    const deletionInfo = await bookCollection.updateOne(
        {
            _id: bookWithThisReview._id
        }, 
        {
            $pull: {
                reviews: {
                    _id: new ObjectId(reviewId)
                }
            }
        }
    )
    if(deletionInfo.modifiedCount === 0) {
        errors.other = "Can not delete review at this moment, please try after some time."
        throw "Not able to delete review from movies"
    }
    return "Deleted"
}

const getBookAssociatedWithThisReview = async (reviewId) => {
    reviewId = xss(reviewId).trim()

    let errors = {}
    authValidations.isValidId(reviewId, "review id", errors)

    const booksCollection = await books()
    const search = {
        "reviews": {
            $elemMatch: {
                _id: new ObjectId(reviewId)
            }
        }
    }
    const projection = {
        _id: 1
    }

    const data = await booksCollection.findOne(search, {projection})
    if(data === null) {
        errors.other = "No book found with this review"
        throw errors
    }
    return data
}

const updateReview = async (reviewId, reviewMessage, username) => {
    reviewId = xss(reviewId).trim()
    reviewMessage = xss(reviewMessage).trim()
    username = xss(username).trim()

    let errors = {}
    authValidations.isValidId(reviewId, "review id", errors)
    authValidations.isValidReview(reviewMessage, errors)
    authValidations.isValidUserName(username, errors)

    let reviewFromDB = await getReviewById(reviewId)
    if(reviewFromDB == null) {
        errors.other = "No review with this id"
        throw errors
    }
    if(reviewFromDB.userThatPostedReview !== username) {
        errors.other = "Trying to update someone elses review."
        throw errors
    }

    const booksCollection = await books()
    const updateInfo = await booksCollection.updateOne({"reviews._id": new ObjectId(reviewId)},
    { $set: {"reviews.$[elem]":{review: reviewMessage, _id: new ObjectId(reviewId), userThatPostedReview: username}}},
    { arrayFilters:[{"elem._id": new ObjectId(reviewId)}]})

    if(updateInfo.modifiedCount == 0) {
        errors.other = "Can not update review at this moment, please try after some time."
        throw errors
    }
    return "Updated"
}

module.exports = {
    getBookByBookId, 
    createBook,
    createReview,
    getReviewsFromUsername,
    getReviewById,
    deleteReview,
    updateReview
}
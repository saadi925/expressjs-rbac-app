"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _Reviews_prisma;
Object.defineProperty(exports, "__esModule", { value: true });
exports.Reviews = void 0;
const client_1 = require("@prisma/client");
class Reviews {
    constructor() {
        _Reviews_prisma.set(this, void 0);
        __classPrivateFieldSet(this, _Reviews_prisma, new client_1.PrismaClient(), "f");
    }
    getReviewsByLawyerId(lawyerId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const reviews = yield __classPrivateFieldGet(this, _Reviews_prisma, "f").lawyerReview.findMany({
                    where: { lawyerId },
                });
                return reviews;
            }
            catch (error) {
                console.error('Error fetching reviews by lawyer ID:', error);
                throw error;
            }
        });
    }
    getReviewsByUserId(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const reviews = yield __classPrivateFieldGet(this, _Reviews_prisma, "f").lawyerReview.findMany({
                    where: { lawyerId: userId },
                });
                return reviews;
            }
            catch (error) {
                console.error('Error fetching reviews by user ID:', error);
                throw error;
            }
        });
    }
    createReview(reviewData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const review = yield __classPrivateFieldGet(this, _Reviews_prisma, "f").lawyerReview.create({
                    data: Object.assign(Object.assign({}, reviewData), { createdAt: new Date(), updatedAt: new Date() }),
                });
                // Calculate new rating for the lawyer based on the existing reviews
                const lawyerId = review.lawyerId;
                const reviews = yield __classPrivateFieldGet(this, _Reviews_prisma, "f").lawyerReview.findMany({
                    where: { lawyerId },
                });
                const totalScore = reviews.reduce((acc, cur) => acc + cur.score, 0);
                const newRating = totalScore / reviews.length;
                // Update LawyerProfile with the new rating
                yield __classPrivateFieldGet(this, _Reviews_prisma, "f").lawyerProfile.update({
                    where: { id: lawyerId },
                    data: { rating: newRating },
                });
                return review;
            }
            catch (error) {
                console.error('Error creating review:', error);
                throw error;
            }
        });
    }
    updateReview(reviewId, reviewData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const review = yield __classPrivateFieldGet(this, _Reviews_prisma, "f").lawyerReview.update({
                    where: { id: reviewId },
                    data: Object.assign(Object.assign({}, reviewData), { updatedAt: new Date() }),
                });
                // Update LawyerProfile rating after review update (if needed)
                if (reviewData.score !== undefined) {
                    const lawyerId = review.lawyerId;
                    const reviews = yield __classPrivateFieldGet(this, _Reviews_prisma, "f").lawyerReview.findMany({
                        where: { lawyerId },
                    });
                    const totalScore = reviews.reduce((acc, cur) => acc + cur.score, 0);
                    const newRating = totalScore / reviews.length;
                    yield __classPrivateFieldGet(this, _Reviews_prisma, "f").lawyerProfile.update({
                        where: { id: lawyerId },
                        data: { rating: newRating },
                    });
                }
                return review;
            }
            catch (error) {
                console.error('Error updating review:', error);
                throw error;
            }
        });
    }
}
exports.Reviews = Reviews;
_Reviews_prisma = new WeakMap();

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
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateReview = exports.createReview = exports.getReviewsByUserId = exports.getReviewsByLawyerId = void 0;
const Reviews_1 = require("../../prisma/queries/Reviews");
const cases_1 = require("../../prisma/queries/cases");
const reviewService = new Reviews_1.Reviews();
const getReviewsByLawyerId = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { lawyerId } = req.params;
    try {
        const reviews = yield reviewService.getReviewsByLawyerId(lawyerId);
        res.status(200).json(reviews);
    }
    catch (error) {
        console.error('Error fetching reviews by lawyer ID:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
exports.getReviewsByLawyerId = getReviewsByLawyerId;
const getReviewsByUserId = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req;
    if (!userId) {
        res.status(401).json({
            error: 'unauthorized',
        });
        return;
    }
    try {
        const reviews = yield reviewService.getReviewsByUserId(userId);
        res.status(200).json(reviews);
    }
    catch (error) {
        console.error('Error fetching reviews by user ID:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
exports.getReviewsByUserId = getReviewsByUserId;
const createReview = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req;
    const { score, caseId, comment } = req.body;
    if (!userId) {
        return res.status(401).json({ error: 'Unauthorized' });
    }
    // Check if the lawyer associated with the case matches the lawyerId in the request
    const lawyerId = yield (0, cases_1.getLawyerIdFromCase)(caseId, userId);
    if (!lawyerId) {
        return res
            .status(404)
            .json({ error: 'Lawyer not found for the given case' });
    }
    if (!score || !lawyerId || !comment) {
        return res.status(400).json({ error: 'Invalid request' });
    }
    const reviewData = { score, lawyerId, comment };
    try {
        // Add the user ID to the review data
        const review = yield reviewService.createReview(reviewData);
        res.status(201).json(review);
    }
    catch (error) {
        console.error('Error creating review:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
exports.createReview = createReview;
const updateReview = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { reviewId } = req.params;
    const { comment, caseId, score } = req.body;
    // Check if the lawyer associated with the case matches the lawyerId in the request
    const lawyerId = yield (0, cases_1.getLawyerIdFromCase)(caseId, req.userId);
    if (!lawyerId) {
        return res
            .status(404)
            .json({ error: 'Lawyer not found for the given case' });
    }
    if (!score || !lawyerId || !comment) {
        return res.status(400).json({ error: 'Invalid request' });
    }
    const reviewData = { comment, lawyerId, score };
    if (!reviewId) {
        return res.status(400).json({ message: 'Review ID is required' });
    }
    if (!comment && !lawyerId && !score) {
        return res.status(400).json({ message: 'At least one field is required' });
    }
    try {
        const updatedReview = yield reviewService.updateReview(reviewId, reviewData);
        if (updatedReview) {
            res.status(200).json(updatedReview);
        }
        else {
            res.status(404).json({ message: 'Review not found' });
        }
    }
    catch (error) {
        console.error('Error updating review:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
exports.updateReview = updateReview;

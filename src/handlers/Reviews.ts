import { Request, Response } from 'express';
import { Reviews } from '../../prisma/queries/Reviews';
import { RequestWithUser } from 'types/profile';
import { getLawyerIdFromCase } from '../../prisma/queries/cases';

const reviewService = new Reviews();

export const getReviewsByLawyerId = async (req: Request, res: Response) => {
  const { lawyerId } = req.params;
  try {
    const reviews = await reviewService.getReviewsByLawyerId(lawyerId);
    res.status(200).json(reviews);
  } catch (error) {
    console.error('Error fetching reviews by lawyer ID:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const getReviewsByUserId = async (req: Request, res: Response) => {
  const { userId } = req.params;
  try {
    const reviews = await reviewService.getReviewsByUserId(userId);
    res.status(200).json(reviews);
  } catch (error) {
    console.error('Error fetching reviews by user ID:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const createReview = async (req: RequestWithUser, res: Response) => {
  const { userId } = req;
  const { score, caseId, comment } = req.body;
  if (!userId) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  // Check if the lawyer associated with the case matches the lawyerId in the request
  const lawyerId = await getLawyerIdFromCase(caseId, userId);
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
    const review = await reviewService.createReview(reviewData);
    res.status(201).json(review);
  } catch (error) {
    console.error('Error creating review:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const updateReview = async (req: RequestWithUser, res: Response) => {
  const { reviewId } = req.params;

  const { comment, caseId, score } = req.body;
  // Check if the lawyer associated with the case matches the lawyerId in the request
  const lawyerId = await getLawyerIdFromCase(caseId, req.userId!);
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
    const updatedReview = await reviewService.updateReview(
      reviewId,
      reviewData,
    );
    if (updatedReview) {
      res.status(200).json(updatedReview);
    } else {
      res.status(404).json({ message: 'Review not found' });
    }
  } catch (error) {
    console.error('Error updating review:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

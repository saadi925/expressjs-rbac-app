import { PrismaClient, LawyerReview } from '@prisma/client';
type ReviewData = {
  score: number;
  lawyerId: string;
  comment: string;
};
export class Reviews {
  #prisma: PrismaClient;

  constructor() {
    this.#prisma = new PrismaClient();
  }

  async getReviewsByLawyerId(lawyerId: string): Promise<LawyerReview[]> {
    try {
      const reviews = await this.#prisma.lawyerReview.findMany({
        where: { lawyerId },
      });
      return reviews;
    } catch (error) {
      console.error('Error fetching reviews by lawyer ID:', error);
      throw error;
    }
  }

  async getReviewsByUserId(userId: string): Promise<LawyerReview[]> {
    try {
      const reviews = await this.#prisma.lawyerReview.findMany({
        where: { lawyerId: userId },
      });
      return reviews;
    } catch (error) {
      console.error('Error fetching reviews by user ID:', error);
      throw error;
    }
  }
  async createReview(reviewData: ReviewData): Promise<LawyerReview> {
    try {
      const review = await this.#prisma.lawyerReview.create({
        data: {
          ...reviewData,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      });

      // Calculate new rating for the lawyer based on the existing reviews
      const lawyerId = review.lawyerId;
      const reviews = await this.#prisma.lawyerReview.findMany({
        where: { lawyerId },
      });
      const totalScore = reviews.reduce((acc, cur) => acc + cur.score, 0);
      const newRating = totalScore / reviews.length;

      // Update LawyerProfile with the new rating
      await this.#prisma.lawyerProfile.update({
        where: { id: lawyerId },
        data: { rating: newRating },
      });

      return review;
    } catch (error) {
      console.error('Error creating review:', error);
      throw error;
    }
  }

  async updateReview(
    reviewId: string,
    reviewData: Partial<LawyerReview>,
  ): Promise<LawyerReview | null> {
    try {
      const review = await this.#prisma.lawyerReview.update({
        where: { id: reviewId },
        data: {
          ...reviewData,
          updatedAt: new Date(),
        },
      });

      // Update LawyerProfile rating after review update (if needed)
      if (reviewData.score !== undefined) {
        const lawyerId = review.lawyerId;
        const reviews = await this.#prisma.lawyerReview.findMany({
          where: { lawyerId },
        });
        const totalScore = reviews.reduce((acc, cur) => acc + cur.score, 0);
        const newRating = totalScore / reviews.length;

        await this.#prisma.lawyerProfile.update({
          where: { id: lawyerId },
          data: { rating: newRating },
        });
      }

      return review;
    } catch (error) {
      console.error('Error updating review:', error);
      throw error;
    }
  }
}

import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { RequestWithUser } from 'types/profile';

const prisma = new PrismaClient();

// Get lawyers based on reviews, location, availability, etc.
export async function GetLawyers(req: RequestWithUser, res: Response) {
  try {
    // Get user's location from the database based on the user ID
    const user = await prisma.user.findUnique({
      where: {
        id: req.userId,
      },
      select: {
        profile: {
          select: {
            location: true,
          },
        },
      },
    });

    if (!user || !user.profile || !user.profile.location) {
      return res.status(404).json({ error: 'User location not found' });
    }

    const location = user.profile.location;

    // Find lawyers by location
    let lawyersByLocation = await prisma.lawyerProfile.findMany({
      where: {
        user: {
          profile: {
            location: location,
          },
        },
        status: 'AVAILABLE', // Filter by availability
      },
      orderBy: {
        rating: 'desc', // Order by rating in descending order
      },
      select: {
        id: true,
        rating: true, // Only select necessary fields, excluding userId
        description: true,
        experience: true,
        bio: true,
        status: true,
        reviews: { select: { comment: true, score: true, id: true } },
        createdAt: true,
        // Add other fields as needed
      },
    });

    // Find top-rated available lawyers if no lawyers found by location
    if (!lawyersByLocation || lawyersByLocation.length === 0) {
      lawyersByLocation = await prisma.lawyerProfile.findMany({
        where: {
          status: 'AVAILABLE', // Filter by availability
        },
        orderBy: {
          rating: 'desc', // Order by rating in descending order
        },
        take: 10, // Limit the number of lawyers to be fetched
        select: {
          id: true,
          rating: true, // Only select necessary fields, excluding userId
          description: true,
          experience: true,
          bio: true,
          status: true,
          reviews: { select: { comment: true, score: true, id: true } },
          createdAt: true,
          // Add other fields as needed
        },
      });
    }

    // Fetch top-rated lawyers separately
    const topRatedLawyers = await prisma.lawyerProfile.findMany({
      where: {
        status: 'AVAILABLE', // Filter by availability
      },
      orderBy: {
        rating: 'desc', // Order by rating in descending order
      },
      take: 10, // Limit the number of lawyers to be fetched
      select: {
        id: true,
        rating: true, // Only select necessary fields, excluding userId
        description: true,
        // Add other fields as needed
        experience: true,
        bio: true,
        status: true,
        reviews: { select: { comment: true, score: true, id: true } },
        createdAt: true,
      },
    });

    // Merge lawyers by location and top-rated lawyers
    const mergedLawyers = [...lawyersByLocation, ...topRatedLawyers];

    res.status(200).json(mergedLawyers);
  } catch (error) {
    console.error('Error fetching lawyers:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

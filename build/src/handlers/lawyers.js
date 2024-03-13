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
exports.GetClients = exports.GetLawyers = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
// Get lawyers based on reviews, location, availability, etc.
function GetLawyers(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            // Get user's location from the database based on the user ID
            const user = yield prisma.user.findUnique({
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
            let lawyersByLocation = yield prisma.lawyerProfile.findMany({
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
                    rating: true,
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
                lawyersByLocation = yield prisma.lawyerProfile.findMany({
                    where: {
                        status: 'AVAILABLE', // Filter by availability
                    },
                    orderBy: {
                        rating: 'desc', // Order by rating in descending order
                    },
                    take: 10,
                    select: {
                        id: true,
                        rating: true,
                        description: true,
                        experience: true,
                        bio: true,
                        status: true,
                        user: {
                            select: {
                                profile: {
                                    select: {
                                        location: true,
                                        avatar: true,
                                        displayname: true,
                                    },
                                },
                            },
                        },
                        reviews: { select: { comment: true, score: true, id: true } },
                        createdAt: true,
                        // Add other fields as needed
                    },
                });
            }
            // Fetch top-rated lawyers separately
            const topRatedLawyers = yield prisma.lawyerProfile.findMany({
                where: {
                    status: 'AVAILABLE', // Filter by availability
                },
                orderBy: {
                    rating: 'desc', // Order by rating in descending order
                },
                take: 10,
                select: {
                    id: true,
                    rating: true,
                    description: true,
                    // Add other fields as needed
                    experience: true,
                    bio: true,
                    status: true,
                    user: {
                        select: {
                            online: true,
                            profile: {
                                select: {
                                    location: true,
                                    avatar: true,
                                    displayname: true,
                                },
                            },
                        },
                    },
                    reviews: { select: { comment: true, score: true, id: true } },
                    createdAt: true,
                },
            });
            // Merge lawyers by location and top-rated lawyers
            const mergedLawyers = [...lawyersByLocation, ...topRatedLawyers];
            //  remove duplicates
            const uniqueLawyers = mergedLawyers.filter((lawyer, index, self) => index === self.findIndex((l) => l.id === lawyer.id));
            res.status(200).json(uniqueLawyers);
        }
        catch (error) {
            console.error('Error fetching lawyers:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    });
}
exports.GetLawyers = GetLawyers;
function GetClients(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const userId = req.userId;
        if (!userId) {
            return res.status(401).json({ error: 'Unauthorized' });
        }
        try {
            //  get Cases with the 'Case' as Type
            const cases = yield prisma.case.findMany({
                where: {
                    status: 'OPEN',
                },
                select: {
                    id: true,
                    status: true,
                    title: true,
                    description: true,
                    category: true,
                    updatedAt: true,
                    createdAt: true,
                    client: {
                        select: {
                            online: true,
                            profile: {
                                select: {
                                    avatar: true,
                                    displayname: true,
                                    location: true,
                                },
                            },
                        },
                    },
                },
            });
            const serializedCases = cases.map((c) => {
                return {
                    id: BigInt(c.id).toString(),
                    status: c.status,
                    title: c.title,
                    description: c.description,
                    category: c.category,
                    updatedAt: c.updatedAt,
                    createdAt: c.createdAt,
                    client: c.client,
                };
            });
            res.status(200).json(serializedCases);
        }
        catch (error) {
            res.status(500).json({ error: 'Internal Server Error' });
        }
    });
}
exports.GetClients = GetClients;

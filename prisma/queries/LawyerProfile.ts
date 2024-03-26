import { PrismaClient, LawyerProfile } from '@prisma/client';
export type LawyerProfileData = Omit<Omit<LawyerProfile, 'id'>, 'isVerified'>;
export class PrismaLawyerProfile {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }
  async createOrUpdateLawyerProfile(
    data: Omit<LawyerProfileData, 'rating'>,
  ): Promise<LawyerProfile> {
    try {
      return await this.prisma.lawyerProfile.upsert({
        where: { userId: data.userId },
        update: { ...data },
        create: { ...data, isVerified: false },
      });
    } catch (error) {
      console.error('Error creating or updating lawyer profile:', error);
      throw new Error('Failed to create or update lawyer profile');
    }
  }

  async getLawyerProfileById(id: string) {
    const c = this.prisma.lawyerProfile.findUnique({
      where: { id },
      select: {
        contact: true,
        description: true,
        experience: true,
        specialization: true,
        status: true,
      },
    });
    return c;
  }

  async updateLawyerProfile(
    id: string,
    data: Partial<LawyerProfile>,
  ): Promise<LawyerProfile | null> {
    return this.prisma.lawyerProfile.update({ where: { id }, data });
  }

  async deleteLawyerProfile(id: string): Promise<LawyerProfile | null> {
    return this.prisma.lawyerProfile.delete({ where: { id } });
  }

  async getAllLawyerProfiles(): Promise<LawyerProfile[]> {
    return this.prisma.lawyerProfile.findMany();
  }
}

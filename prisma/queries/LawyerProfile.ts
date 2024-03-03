import { PrismaClient, LawyerProfile } from '@prisma/client';

export class PrismaLawyerProfile {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  async createLawyerProfile(
    data: Omit<LawyerProfile, 'id'>,
  ): Promise<LawyerProfile> {
    return this.prisma.lawyerProfile.create({ data });
  }

  async getLawyerProfileById(id: string): Promise<LawyerProfile | null> {
    return this.prisma.lawyerProfile.findUnique({ where: { id } });
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

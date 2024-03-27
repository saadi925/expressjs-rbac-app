import { PrismaClient, LawyerContact } from '@prisma/client';

export class PrismaLawyerContact {
  readonly prisma;
  constructor() {
    this.prisma = new PrismaClient();
  }
  async createLawyerContact(data: any, userId: string) {
    try {
      const profile = await this.prisma.lawyerContact.upsert({
        where: { lawyerId: userId },
        update: { ...data, email: data.email },
        create: {
          ...data,
          email: data.email,
        },
      });
      return profile;
    } catch (error) {
      console.error('Error creating lawyer contact:', error);
      throw error;
    }
  }
  async getLawyerContactById(id: string) {
    try {
      const profile = await this.prisma.lawyerContact.findUnique({
        where: {
          id,
        },
      });
      return profile;
    } catch (error) {
      console.error('Error fetching lawyer contact:', error);
      throw error;
    }
  }
  async updateLawyerContact(userId: string, data: any) {
    try {
      const profile = await this.prisma.lawyerContact.update({
        where: { lawyerId: userId },
        data: {
          ...data,
          updatedAt: new Date(),
        },
      });
      return profile;
    } catch (error) {
      console.error('Error updating lawyer contact:', error);
      throw error;
    }
  }
  async deleteLawyerContact(userId: string) {
    try {
      const profile = await this.prisma.lawyerContact.delete({
        where: { lawyerId: userId },
      });
      return profile;
    } catch (error) {
      console.error('Error deleting lawyer contact:', error);
      throw error;
    }
  }
}

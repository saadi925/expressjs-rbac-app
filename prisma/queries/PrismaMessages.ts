// PrismaMessages.ts
import { PrismaClient } from '@prisma/client';
export type MessageResponse = {
  id: string;
    content: string;
    createdAt: Date;
    type: string;
    receiverId: string;
    sender: {
        userId: string;
        avatar: string | null | undefined;
        name: string | null | undefined;
    };
}
export class PrismaMessages {
  #prisma;

  constructor() {
    this.#prisma = new PrismaClient();
  }

  async sendMessage(senderId: string, receiverId: string, content: string, type? : string) {
    const message = await this.#prisma.message.create({
      data: {
        content,
        senderId,
        receiverId,
        type : type ? type : 'text',
      },
      include :{
        sender :{
         select :{
          profile :{
            select :{
              avatar : true,
              displayname : true,
              userId : true
            }
          }
         }
        }
      }
    });
   const value = {
    id : message.id,
    content : message.content,
    createdAt : message.createdAt,
    type : message.type,
    receiverId : message.receiverId,
    sender :{
      userId : message.senderId,
      avatar : message.sender.profile?.avatar,
      name : message.sender.profile?.displayname
    }
   }
   return value
  }

  async markMessageAsSeen(messageId: string) {
    await this.#prisma.message.update({
      where: { id: messageId },
      data: { seen: true },
    });
  }

  async getMessages(
    senderId: string,
    receiverId: string,
    // limit: number,
    // offset: number,
  ) {
    const messages = await this.#prisma.message.findMany({
      where: {
        OR: [
          { senderId, receiverId },
          { senderId: receiverId, receiverId: senderId },
        ],
      },
      select :{
     id : true,
     content : true,
      senderId : true,
      receiverId : true,
      type : true,
      seen : true,
      createdAt : true,
       sender :{
          select :{
            profile :{
              select :{
                avatar : true,
                displayname : true,
              }
            }
          }
       }
      },
      orderBy: {
        createdAt: 'asc',
      },
    });
    const newMessages: MessageResponse[] = messages.map(message => {
      return {
        id: message.id,
        content: message.content,
        createdAt: message.createdAt,
        type: message.type,
        receiverId: message.receiverId,
        sender: {
          userId: message.senderId,
          avatar: message.sender.profile?.avatar,
          name: message.sender.profile?.displayname,
        },
      };
    });

    return newMessages;
  }
}

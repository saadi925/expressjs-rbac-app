// PrismaMessages.ts
import { PrismaClient } from '@prisma/client';
export interface User {
  _id: string | number;
  name?: string;
  avatar?: string;
}
export type MessageResponse =  {
  _id: string;
  text: string;
  createdAt: Date | number;
  user: User;
  image?: string;
  video?: string;
  audio?: string;
  // system?: boolean;
  sent?: boolean;
  received?: boolean;
  pending?: boolean;
  // quickReplies?: QuickReplies;
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
   const value : MessageResponse = {
    _id : message.id,
    text : message.content,
    createdAt : message.createdAt,
    user :{
      _id : message.senderId,
      avatar : message.sender.profile?.avatar || undefined,
      name : message.sender.profile?.displayname || 'advoco user'
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
        createdAt: 'desc',
      },
    });
    const newMessages: MessageResponse[] = messages.map(message => {
      return {
        _id: message.id,
        text: message.content,
        createdAt: message.createdAt,
        user: {
          _id: message.senderId,
          avatar: message.sender.profile?.avatar || undefined,
          name: message.sender.profile?.displayname || 'advoco user',
        },
      };
    });

    return newMessages;
  }
}

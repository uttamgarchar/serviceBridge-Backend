import api from '@/lib/api';

export const chatService = {
  getOrCreateChat: (bookingId: string) =>
    api.get(`/chat/${bookingId}`),

  sendMessage: (bookingId: string, message: string) =>
    api.post(`/chat/${bookingId}/message`, { message }),
};

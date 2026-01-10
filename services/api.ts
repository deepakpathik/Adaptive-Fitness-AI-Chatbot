import axios from 'axios';
import { Platform } from 'react-native';

const BASE_URL = Platform.OS === 'android' ? 'http://10.0.2.2:3000/api' : 'http://localhost:3000/api';

export const ChatService = {
    sendMessage: async (userId: string, message: string, lifestyleData?: any, personality?: string) => {
        try {
            const response = await axios.post(`${BASE_URL}/chat`, {
                userId,
                message,
                lifestyle: lifestyleData,
                personality, // Pass personality to create user if needed
            });
            return { reply: response.data.message };
        } catch (error) {
            console.error('API Error:', error);
            throw error;
        }
    }
};

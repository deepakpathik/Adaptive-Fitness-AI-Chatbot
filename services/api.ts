import axios from 'axios';
import Constants from 'expo-constants';

const getBaseUrl = () => {
    // Dynamically get the IP address of your computer from Expo
    const debuggerHost = Constants.expoConfig?.hostUri;
    const localhost = debuggerHost?.split(':')[0];

    if (!localhost) {
        // Fallback to localhost if we can't get the IP (e.g. valid for iOS simulator)
        return 'http://localhost:8000/api';
    }

    return `http://${localhost}:8000/api`;
};



const BASE_URL = getBaseUrl();

export const ChatService = {
    sendMessage: async (userId: string, message: string, lifestyleData?: any, personality?: string, usageDays?: number) => {
        try {
            const response = await axios.post(`${BASE_URL}/chat`, {
                userId,
                message,
                lifestyle: lifestyleData,
                personality,
                usageDays,
            });
            return { reply: response.data.message };
        } catch (error) {
            console.error('API Error:', error);
            throw error;
        }
    }
};

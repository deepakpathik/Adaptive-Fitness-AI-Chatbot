import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import Constants from 'expo-constants';

export const getUserId = async (): Promise<string> => {
    try {
        let distinctId = await AsyncStorage.getItem('distinctId');
        if (!distinctId) {
            distinctId = 'user-' + Date.now().toString(36) + '-' + Math.random().toString(36).substring(2, 9);
            await AsyncStorage.setItem('distinctId', distinctId);
        }
        return distinctId;
    } catch (e) {
        return 'user-' + Date.now().toString(36);
    }
};

const getBaseUrl = () => {
    if (process.env.EXPO_PUBLIC_API_URL) {
        return process.env.EXPO_PUBLIC_API_URL;
    }

    const debuggerHost = Constants.expoConfig?.hostUri;
    const localhost = debuggerHost?.split(':')[0];

    if (!localhost) {
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
            return { reply: response.data.message, coins: response.data.coins };
        } catch (error) {
            console.error('API Error:', error);
            throw error;
        }
    },
    getHistory: async (userId: string) => {
        try {
            const response = await axios.get(`${BASE_URL}/chat/history/${userId}`);
            return response.data;
        } catch (error) {
            console.error('API Error (History):', error);
            throw error;
        }
    }
};

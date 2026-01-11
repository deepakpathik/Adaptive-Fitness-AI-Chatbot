
import { ChatService, getUserId } from '@/services/api';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    FlatList,
    ImageBackground,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import Markdown from 'react-native-markdown-display';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface Message {
    id: string;
    role: 'user' | 'ai';
    content: string;
    createdAt: string;
}

export default function HistoryScreen() {
    const router = useRouter();
    const insets = useSafeAreaInsets();
    const [history, setHistory] = useState<Message[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadHistory();
    }, []);

    const loadHistory = async () => {
        try {
            const distinctId = await getUserId();
            if (distinctId) {
                const data = await ChatService.getHistory(distinctId);
                setHistory(data);
            }
        } catch (error: any) {
            console.error('Failed to load history:', error);
            import('react-native').then(({ Alert }) => {
                Alert.alert(
                    'Connection Error',
                    `Could not load history.\n\nError: ${error.message}\n\nURL: ${error.config?.url || 'Unknown'}`
                );
            });
        } finally {
            setLoading(false);
        }
    };

    const renderItem = ({ item, index }: { item: Message; index: number }) => (
        <Animated.View
            entering={FadeInDown.delay(index * 30).springify()}
            style={[
                styles.messageCard,
                item.role === 'user' ? styles.userCard : styles.aiCard
            ]}
        >
            <View style={styles.cardHeader}>
                <View style={styles.roleBadge}>
                    <Ionicons
                        name={item.role === 'user' ? 'person' : 'fitness'}
                        size={12}
                        color="#FFF"
                    />
                    <Text style={styles.roleText}>
                        {item.role === 'user' ? 'You' : 'Coach'}
                    </Text>
                </View>
                <Text style={styles.timestamp}>
                    {new Date(item.createdAt).toLocaleDateString()} {new Date(item.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </Text>
            </View>

            {item.role === 'user' ? (
                <Text style={styles.messageText}>{item.content}</Text>
            ) : (
                <Markdown
                    style={{
                        body: { color: '#E0E0E0', fontSize: 14, lineHeight: 20 },
                        bullet_list: { marginBottom: 4 },
                        ordered_list: { marginBottom: 4 },
                    }}
                >
                    {item.content}
                </Markdown>
            )}
        </Animated.View>
    );

    return (
        <View style={styles.container}>
            <ImageBackground
                source={require('@/assets/images/app_bg.png')}
                style={styles.background}
                resizeMode="cover"
            >
                <LinearGradient
                    colors={['rgba(0,0,0,0.7)', 'rgba(0,0,0,0.95)']}
                    style={styles.overlay}
                />

                <View style={{ flex: 1, paddingTop: insets.top }}>
                    {/* Header */}
                    <BlurView intensity={20} tint="dark" style={styles.header}>
                        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                            <Ionicons name="chevron-back" size={24} color="#FFF" />
                        </TouchableOpacity>
                        <Text style={styles.headerTitle}>Chat History</Text>
                        <View style={{ width: 40 }} />
                    </BlurView>

                    {loading ? (
                        <View style={styles.centerContainer}>
                            <ActivityIndicator size="large" color="#FF69B4" />
                        </View>
                    ) : (
                        <FlatList
                            data={history}
                            renderItem={renderItem}
                            keyExtractor={(item) => item.id}
                            contentContainerStyle={[
                                styles.listContent,
                                { paddingBottom: insets.bottom + 20 }
                            ]}
                            showsVerticalScrollIndicator={false}
                            ListEmptyComponent={
                                <View style={styles.emptyContainer}>
                                    <Ionicons name="chatbubbles-outline" size={48} color="#666" />
                                    <Text style={styles.emptyText}>No history yet</Text>
                                </View>
                            }
                        />
                    )}
                </View>
            </ImageBackground>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000',
    },
    background: {
        flex: 1,
    },
    overlay: {
        ...StyleSheet.absoluteFillObject,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255,255,255,0.1)',
    },
    backButton: {
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,0.1)',
        borderRadius: 20,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#FFF',
    },
    listContent: {
        padding: 16,
        gap: 12,
    },
    messageCard: {
        padding: 16,
        borderRadius: 16,
        borderWidth: 1,
    },
    userCard: {
        backgroundColor: 'rgba(0, 122, 255, 0.15)',
        borderColor: 'rgba(0, 122, 255, 0.3)',
        marginLeft: 20,
    },
    aiCard: {
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        borderColor: 'rgba(255, 255, 255, 0.2)',
        marginRight: 20,
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 8,
    },
    roleBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        backgroundColor: 'rgba(0,0,0,0.3)',
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 8,
    },
    roleText: {
        color: '#AAA',
        fontSize: 12,
        fontWeight: '600',
    },
    timestamp: {
        color: '#666',
        fontSize: 10,
    },
    messageText: {
        color: '#E0E0E0',
        fontSize: 14,
        lineHeight: 20,
    },
    centerContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 100,
        gap: 12,
    },
    emptyText: {
        color: '#666',
        fontSize: 16,
    },
});

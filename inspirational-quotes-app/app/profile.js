import { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Profile() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('liked');
  const [likedQuotes, setLikedQuotes] = useState([]);
  const [savedQuotes, setSavedQuotes] = useState([]);

  useEffect(() => {
    loadQuotes();
  }, []);

  const loadQuotes = async () => {
    const liked = JSON.parse(await AsyncStorage.getItem('likedQuotes') || '[]');
    const saved = JSON.parse(await AsyncStorage.getItem('savedQuotes') || '[]');
    setLikedQuotes(liked);
    setSavedQuotes(saved);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#007AFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Profile</Text>
        <View style={{ width: 24 }} />
      </View>

      <View style={styles.tabs}>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'liked' && styles.activeTab]}
          onPress={() => setActiveTab('liked')}
        >
          <Text style={styles.tabText}>Liked Quotes</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'saved' && styles.activeTab]}
          onPress={() => setActiveTab('saved')}
        >
          <Text style={styles.tabText}>Saved Quotes</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.quotesList}>
        {(activeTab === 'liked' ? likedQuotes : savedQuotes).map((quote, index) => (
          <View key={index} style={styles.quoteCard}>
            <Text style={styles.quoteText}>"{quote.text}"</Text>
            <Text style={styles.authorText}>- {quote.author}</Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
  },
  tabs: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  tab: {
    flex: 1,
    paddingVertical: 15,
    alignItems: 'center',
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: '#007AFF',
  },
  tabText: {
    color: '#333',
    fontSize: 16,
  },
  quotesList: {
    flex: 1,
    padding: 20,
  },
  quoteCard: {
    padding: 20,
    backgroundColor: '#F8F8F8',
    borderRadius: 12,
    marginBottom: 15,
  },
  quoteText: {
    fontSize: 18,
    color: '#333',
    marginBottom: 8,
  },
  authorText: {
    fontSize: 16,
    color: '#666',
    fontStyle: 'italic',
  },
}); 
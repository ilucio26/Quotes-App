import { StyleSheet, Text, View, TouchableOpacity, Dimensions } from 'react-native';
import { useState, useEffect } from 'react';
import { Link } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { PanResponder } from 'react-native';

const SWIPE_THRESHOLD = 50;
const screenHeight = Dimensions.get('window').height;

const quotes = [
  {
    text: "The only way to do great work is to love what you do.",
    author: "Steve Jobs"
  },
  {
    text: "Life is what happens when you're busy making other plans.",
    author: "John Lennon"
  },
  {
    text: "The future belongs to those who believe in the beauty of their dreams.",
    author: "Eleanor Roosevelt"
  },
  {
    text: "Success is not final, failure is not fatal: it is the courage to continue that counts.",
    author: "Winston Churchill"
  },
  {
    text: "The only limit to our realization of tomorrow will be our doubts of today.",
    author: "Franklin D. Roosevelt"
  }
];

export default function Home() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [likedQuotes, setLikedQuotes] = useState(new Set());
  const [bookmarkedQuotes, setBookmarkedQuotes] = useState(new Set());

  // Load liked and bookmarked quotes on component mount
  useEffect(() => {
    loadSavedStates();
  }, []);

  const loadSavedStates = async () => {
    try {
      const savedLiked = await AsyncStorage.getItem('likedQuotes');
      const savedBookmarked = await AsyncStorage.getItem('savedQuotes');
      
      if (savedLiked) {
        const likedArray = JSON.parse(savedLiked);
        setLikedQuotes(new Set(likedArray.map(quote => quote.text)));
      }
      
      if (savedBookmarked) {
        const bookmarkedArray = JSON.parse(savedBookmarked);
        setBookmarkedQuotes(new Set(bookmarkedArray.map(quote => quote.text)));
      }
    } catch (error) {
      console.error('Error loading saved states:', error);
    }
  };

  const handleNextQuote = () => {
    setCurrentIndex((prev) => (prev + 1) % quotes.length);
  };

  const handlePreviousQuote = () => {
    setCurrentIndex((prev) => (prev - 1 + quotes.length) % quotes.length);
  };

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onMoveShouldSetPanResponder: () => true,
    onPanResponderRelease: (e, gestureState) => {
      const { dy } = gestureState;
      
      if (dy > SWIPE_THRESHOLD) {
        handleNextQuote();
      } else if (dy < -SWIPE_THRESHOLD) {
        handlePreviousQuote();
      }
    },
  });

  const handleLike = async () => {
    const currentQuote = quotes[currentIndex];
    const newLikedQuotes = new Set(likedQuotes);
    
    if (newLikedQuotes.has(currentQuote.text)) {
      newLikedQuotes.delete(currentQuote.text);
    } else {
      newLikedQuotes.add(currentQuote.text);
    }
    
    setLikedQuotes(newLikedQuotes);
    
    // Save to AsyncStorage
    const likedArray = quotes.filter(quote => newLikedQuotes.has(quote.text));
    await AsyncStorage.setItem('likedQuotes', JSON.stringify(likedArray));
  };

  const handleBookmark = async () => {
    const currentQuote = quotes[currentIndex];
    const newBookmarkedQuotes = new Set(bookmarkedQuotes);
    
    if (newBookmarkedQuotes.has(currentQuote.text)) {
      newBookmarkedQuotes.delete(currentQuote.text);
    } else {
      newBookmarkedQuotes.add(currentQuote.text);
    }
    
    setBookmarkedQuotes(newBookmarkedQuotes);
    
    // Save to AsyncStorage
    const bookmarkedArray = quotes.filter(quote => newBookmarkedQuotes.has(quote.text));
    await AsyncStorage.setItem('savedQuotes', JSON.stringify(bookmarkedArray));
  };

  const isCurrentQuoteLiked = quotes[currentIndex] && likedQuotes.has(quotes[currentIndex].text);
  const isCurrentQuoteBookmarked = quotes[currentIndex] && bookmarkedQuotes.has(quotes[currentIndex].text);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Link href="/profile" asChild>
          <TouchableOpacity style={styles.profileButton}>
            <Ionicons name="person-circle-outline" size={32} color="#007AFF" />
          </TouchableOpacity>
        </Link>
      </View>

      <View 
        style={styles.quoteContainer}
        {...panResponder.panHandlers}
      >
        <Text style={styles.swipeHint}>Swipe up or down to change quotes</Text>
        <Text style={styles.quoteText}>"{quotes[currentIndex].text}"</Text>
        <Text style={styles.authorText}>- {quotes[currentIndex].author}</Text>
      </View>

      <View style={styles.actionButtons}>
        <TouchableOpacity style={styles.iconButton} onPress={handleLike}>
          <Ionicons 
            name={isCurrentQuoteLiked ? "heart" : "heart-outline"} 
            size={28} 
            color={isCurrentQuoteLiked ? "#FF2D55" : "#007AFF"} 
          />
        </TouchableOpacity>
        <TouchableOpacity style={styles.iconButton} onPress={handleBookmark}>
          <Ionicons 
            name={isCurrentQuoteBookmarked ? "bookmark" : "bookmark-outline"} 
            size={28} 
            color={isCurrentQuoteBookmarked ? "#007AFF" : "#007AFF"} 
          />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingTop: 60,
    paddingBottom: 20,
  },
  profileButton: {
    padding: 8,
  },
  quoteContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  swipeHint: {
    position: 'absolute',
    top: 20,
    color: '#999',
    fontSize: 14,
  },
  quoteText: {
    fontSize: 24,
    textAlign: 'center',
    marginBottom: 16,
    color: '#333',
    fontWeight: '500',
  },
  authorText: {
    fontSize: 18,
    color: '#666',
    fontStyle: 'italic',
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingBottom: 40,
    gap: 20,
  },
  iconButton: {
    padding: 12,
  },
}); 
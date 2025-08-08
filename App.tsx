import React, { useEffect, useState } from 'react';
import { StyleSheet, FlatList, TextInput, ActivityIndicator, View, TouchableOpacity, Text, Linking } from 'react-native';
import { Image } from 'expo-image';
import { StatusBar } from 'expo-status-bar';

export default function App() {
  const [articles, setArticles] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState("latest");

  const API_KEY = "396111dc7bc55716f3063e6d4065fb5d"; // Replace with your key

  const fetchNews = async (searchTerm: string) => {
    try {
      setLoading(true);
      const res = await fetch(
        `https://gnews.io/api/v4/search?q=${encodeURIComponent(searchTerm)}&lang=en&max=10&apikey=${API_KEY}`
      );
      const data = await res.json();
      setArticles(data.articles || []);
    } catch (err) {
      console.error("Error fetching news:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNews(query);
  }, []);

  return (
    <View style={styles.container}>
      {/* Search Bar */}
      <TextInput
        style={styles.searchInput}
        placeholder="Search news..."
        value={query}
        onChangeText={setQuery}
        onSubmitEditing={() => fetchNews(query)}
      />

      {/* Loader */}
      {loading ? (
        <ActivityIndicator size="large" style={{ marginTop: 20 }} />
      ) : (
        <FlatList
          data={articles}
          keyExtractor={(item) => item.url}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.articleCard}
              onPress={() => Linking.openURL(item.url)}
            >
              {item.image && (
                <Image source={{ uri: item.image }} style={styles.articleImage} />
              )}
              <View style={styles.articleContent}>
                <Text style={styles.articleTitle}>{item.title}</Text>
                <Text style={styles.articleDescription} numberOfLines={3}>
                  {item.description}
                </Text>
                <Text style={styles.articleSource}>
                  {item.source?.name || "Unknown Source"}
                </Text>
              </View>
            </TouchableOpacity>
          )}
        />
      )}

      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 10,
    paddingTop: 40,
  },
  searchInput: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 10,
    backgroundColor: '#f9f9f9',
  },
  articleCard: {
    flexDirection: 'row',
    backgroundColor: '#f1f1f1',
    borderRadius: 10,
    marginBottom: 10,
    overflow: 'hidden',
  },
  articleImage: {
    width: 100,
    height: 80,
  },
  articleContent: {
    flex: 1,
    padding: 8,
    justifyContent: 'center',
  },
  articleTitle: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 4,
  },
  articleDescription: {
    fontSize: 14,
    color: '#333',
  },
  articleSource: {
    fontSize: 12,
    color: '#888',
    marginTop: 4,
  },
});

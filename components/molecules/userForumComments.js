import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
  ActivityIndicator,
  StatusBar,
  Platform,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useUser } from '../atoms/UserContext';
import { useTranslation } from 'react-i18next';
import { formatDistanceToNow } from 'date-fns';
import { es, enUS } from 'date-fns/locale';

const UserForumComments = () => {
  const { getUserForumComments } = useUser();
  const navigation = useNavigation();
  const { t, i18n } = useTranslation('profile');
  const [isLoading, setIsLoading] = useState(true);
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState([]);
  const [activeTab, setActiveTab] = useState('questions');

  const locale = i18n.language === 'es' ? es : enUS;

  useEffect(() => {
    const fetchComments = async () => {
      try {
        setIsLoading(true);
        const data = await getUserForumComments();
        if (data.success) {
          setQuestions(data.questions);
          setAnswers(data.answers);
        }
      } catch (error) {
        console.error('Error fetching forum comments:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchComments();
  }, []);

  const formatDate = (timestamp) => {
    if (!timestamp) return '';

    let date;
    if (timestamp._seconds) {
      date = new Date(timestamp._seconds * 1000);
    } else if (typeof timestamp === 'string') {
      date = new Date(timestamp);
    } else {
      return '';
    }

    return formatDistanceToNow(date, { addSuffix: true, locale });
  };

  const navigateToForum = (forumId, forumName) => {
    navigation.navigate('Forum', {
      forumId: forumId,
      localityName: forumName,
    });
  };

  const renderQuestionItem = ({ item }) => (
    <TouchableOpacity
      style={styles.itemContainer}
      onPress={() => navigateToForum(item.forumId, item.forumName)}
    >
      <Text style={styles.itemTitle}>{item.text}</Text>
      <View style={styles.itemFooter}>
        <Text style={styles.forumName}>{item.forumName}</Text>
        <Text style={styles.date}>{formatDate(item.date)}</Text>
      </View>
    </TouchableOpacity>
  );

  const renderAnswerItem = ({ item }) => (
    <TouchableOpacity
      style={styles.itemContainer}
      onPress={() => navigateToForum(item.forumId, item.forumName)}
    >
      <Text style={styles.questionText}>
        En respuesta a: {item.questionText}
      </Text>
      <Text style={styles.itemTitle}>{item.text}</Text>
      <View style={styles.itemFooter}>
        <Text style={styles.forumName}>{item.forumName}</Text>
        <Text style={styles.date}>{formatDate(item.date)}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>← {t('back')}</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{t('headerComments')}</Text>
      </View>

      <View style={styles.tabs}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'questions' && styles.activeTab]}
          onPress={() => setActiveTab('questions')}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === 'questions' && styles.activeTabText,
            ]}
          >
            {t('questions')} ({questions.length})
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'answers' && styles.activeTab]}
          onPress={() => setActiveTab('answers')}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === 'answers' && styles.activeTabText,
            ]}
          >
            {t('answers')} ({answers.length})
          </Text>
        </TouchableOpacity>
      </View>

      {isLoading ? (
        <ActivityIndicator size='large' color='#572364' style={styles.loader} />
      ) : (
        <FlatList
          data={activeTab === 'questions' ? questions : answers}
          renderItem={
            activeTab === 'questions' ? renderQuestionItem : renderAnswerItem
          }
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContainer}
          ListEmptyComponent={
            <Text style={styles.emptyText}>
              {activeTab === 'questions'
                ? t('no-questions-found')
                : t('no-answers-found')}
            </Text>
          }
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop:
      Platform.OS === 'android'
        ? Math.min(StatusBar.currentHeight || 30, 30)
        : 0,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  backButton: {
    marginRight: 10,
  },
  backButtonText: {
    fontSize: 16,
    color: '#572364',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    flex: 1,
    textAlign: 'center',
  },
  tabs: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  tab: {
    flex: 1,
    paddingVertical: 15,
    alignItems: 'center',
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: '#572364',
  },
  tabText: {
    fontSize: 16,
    color: '#888',
  },
  activeTabText: {
    color: '#572364',
    fontWeight: 'bold',
  },
  loader: {
    marginTop: 50,
  },
  listContainer: {
    padding: 15,
  },
  itemContainer: {
    padding: 15,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    marginBottom: 15,
    borderLeftWidth: 4,
    borderLeftColor: '#572364',
  },
  itemTitle: {
    fontSize: 16,
    marginBottom: 10,
  },
  questionText: {
    fontSize: 12,
    color: '#888',
    marginBottom: 5,
    fontStyle: 'italic',
  },
  itemFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 5,
  },
  forumName: {
    fontSize: 12,
    color: '#572364',
  },
  date: {
    fontSize: 12,
    color: '#888',
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 50,
    color: '#888',
  },
});

export default UserForumComments;

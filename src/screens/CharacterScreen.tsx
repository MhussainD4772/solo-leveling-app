import React from 'react'
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Image,
} from 'react-native'
import { useGameStore } from '../store/gameStore'
import { LinearGradient } from 'expo-linear-gradient'
import { Ionicons } from '@expo/vector-icons'
import Animated, {
  useAnimatedStyle,
  withSpring,
  useSharedValue,
} from 'react-native-reanimated'

const { width } = Dimensions.get('window')

const StatCard = ({ title, value, icon }) => {
  const scale = useSharedValue(1)

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
    }
  })

  const handlePress = () => {
    scale.value = withSpring(1.1, {}, () => {
      scale.value = withSpring(1)
    })
  }

  return (
    <TouchableOpacity onPress={handlePress} activeOpacity={0.8}>
      <Animated.View style={[styles.statCard, animatedStyle]}>
        <Ionicons name={icon} size={24} color="#6366f1" />
        <Text style={styles.statValue}>{value}</Text>
        <Text style={styles.statTitle}>{title}</Text>
      </Animated.View>
    </TouchableOpacity>
  )
}

const CharacterScreen = () => {
  const { player } = useGameStore()

  return (
    <ScrollView style={styles.container}>
      <LinearGradient
        colors={['#1a1a1a', '#2d2d2d']}
        style={styles.gradient}
      >
        {/* Character Header */}
        <View style={styles.header}>
          <View style={styles.avatarContainer}>
            <View style={styles.avatar}>
              <Image source={player.avatar} style={styles.avatarImage} />
            </View>
            <View style={styles.rankBadge}>
              <Text style={styles.rankText}>{player.rank}</Text>
            </View>
          </View>
          <Text style={styles.nameText}>{player.name}</Text>
          <Text style={styles.levelText}>Level {player.level}</Text>
        </View>

        {/* Stats Grid */}
        <View style={styles.statsGrid}>
          <StatCard
            title="Tasks Completed"
            value={player.stats.tasksCompleted}
            icon="checkmark-circle"
          />
          <StatCard
            title="Total XP"
            value={player.stats.totalXpEarned}
            icon="star"
          />
          <StatCard
            title="Current Streak"
            value={player.stats.currentStreak}
            icon="flame"
          />
          <StatCard
            title="Longest Streak"
            value={player.stats.longestStreak}
            icon="trophy"
          />
        </View>

        {/* Progress Section */}
        <View style={styles.progressSection}>
          <Text style={styles.sectionTitle}>Progress</Text>
          <View style={styles.progressCard}>
            <View style={styles.progressHeader}>
              <Text style={styles.progressTitle}>Experience</Text>
              <Text style={styles.progressValue}>
                {player.exp}/{player.level * 100} XP
              </Text>
            </View>
            <View style={styles.progressBar}>
              <View
                style={[
                  styles.progressFill,
                  { width: `${(player.exp / (player.level * 100)) * 100}%` },
                ]}
              />
            </View>
          </View>
        </View>

        {/* Achievements Section */}
        <View style={styles.achievementsSection}>
          <Text style={styles.sectionTitle}>Achievements</Text>
          <View style={styles.achievementsGrid}>
            <View style={styles.achievementCard}>
              <Ionicons name="medal" size={24} color="#6366f1" />
              <Text style={styles.achievementTitle}>Task Master</Text>
              <Text style={styles.achievementDesc}>
                Complete 100 tasks
              </Text>
            </View>
            <View style={styles.achievementCard}>
              <Ionicons name="flame" size={24} color="#6366f1" />
              <Text style={styles.achievementTitle}>Streak King</Text>
              <Text style={styles.achievementDesc}>
                Maintain a 7-day streak
              </Text>
            </View>
          </View>
        </View>
      </LinearGradient>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a1a',
  },
  gradient: {
    flex: 1,
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 24,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#2d2d2d',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#6366f1',
  },
  avatarImage: {
    width: 64,
    height: 64,
    borderRadius: 32,
  },
  rankBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#6366f1',
    borderRadius: 12,
    padding: 4,
    minWidth: 24,
    alignItems: 'center',
  },
  rankText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  nameText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 4,
    textAlign: 'center',
  },
  levelText: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  statCard: {
    width: (width - 48) / 2,
    backgroundColor: '#2d2d2d',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    alignItems: 'center',
  },
  statValue: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
    marginVertical: 8,
  },
  statTitle: {
    color: '#ccc',
    fontSize: 12,
    textAlign: 'center',
  },
  progressSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  progressCard: {
    backgroundColor: '#2d2d2d',
    borderRadius: 16,
    padding: 16,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  progressTitle: {
    color: '#fff',
    fontSize: 16,
  },
  progressValue: {
    color: '#6366f1',
    fontSize: 16,
  },
  progressBar: {
    height: 8,
    backgroundColor: '#3d3d3d',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#6366f1',
    borderRadius: 4,
  },
  achievementsSection: {
    marginBottom: 24,
  },
  achievementsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  achievementCard: {
    width: (width - 48) / 2,
    backgroundColor: '#2d2d2d',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    alignItems: 'center',
  },
  achievementTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 8,
    marginBottom: 4,
  },
  achievementDesc: {
    color: '#ccc',
    fontSize: 12,
    textAlign: 'center',
  },
})

export default CharacterScreen 
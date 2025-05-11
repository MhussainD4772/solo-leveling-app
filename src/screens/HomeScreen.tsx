import React from 'react'
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from 'react-native'
import { useGameStore } from '../store/gameStore'
import { LinearGradient } from 'expo-linear-gradient'
import Animated, {
  useAnimatedStyle,
  withSpring,
  useSharedValue,
  withSequence,
  withDelay,
} from 'react-native-reanimated'

const { width } = Dimensions.get('window')

const HomeScreen = () => {
  const { player } = useGameStore()
  const scale = useSharedValue(1)

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
    }
  })

  const handlePress = () => {
    scale.value = withSequence(
      withSpring(1.1),
      withDelay(100, withSpring(1))
    )
  }

  return (
    <ScrollView style={styles.container}>
      <LinearGradient
        colors={['#1a1a1a', '#2d2d2d']}
        style={styles.gradient}
      >
        {/* Player Stats Card */}
        <Animated.View style={[styles.statsCard, animatedStyle]}>
          <TouchableOpacity onPress={handlePress} activeOpacity={0.8}>
            <Text style={styles.rankText}>Rank {player.rank}</Text>
            <Text style={styles.levelText}>Level {player.level}</Text>
            <View style={styles.expBar}>
              <View
                style={[
                  styles.expFill,
                  { width: `${(player.exp / (player.level * 100)) * 100}%` },
                ]}
              />
            </View>
            <Text style={styles.expText}>
              EXP: {player.exp}/{player.level * 100}
            </Text>
          </TouchableOpacity>
        </Animated.View>

        {/* Streak Card */}
        <View style={styles.streakCard}>
          <Text style={styles.streakTitle}>Current Streak</Text>
          <Text style={styles.streakCount}>{player.streak} days</Text>
        </View>

        {/* Stats Summary */}
        <View style={styles.statsSummary}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{player.stats.tasksCompleted}</Text>
            <Text style={styles.statLabel}>Tasks Completed</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{player.stats.totalXpEarned}</Text>
            <Text style={styles.statLabel}>Total XP Earned</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{player.stats.longestStreak}</Text>
            <Text style={styles.statLabel}>Longest Streak</Text>
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
  statsCard: {
    backgroundColor: '#2d2d2d',
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
  rankText: {
    color: '#6366f1',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  levelText: {
    color: '#fff',
    fontSize: 18,
    marginBottom: 15,
  },
  expBar: {
    height: 10,
    backgroundColor: '#3d3d3d',
    borderRadius: 5,
    overflow: 'hidden',
    marginBottom: 10,
  },
  expFill: {
    height: '100%',
    backgroundColor: '#6366f1',
    borderRadius: 5,
  },
  expText: {
    color: '#fff',
    fontSize: 14,
  },
  streakCard: {
    backgroundColor: '#2d2d2d',
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
    alignItems: 'center',
  },
  streakTitle: {
    color: '#fff',
    fontSize: 16,
    marginBottom: 10,
  },
  streakCount: {
    color: '#6366f1',
    fontSize: 32,
    fontWeight: 'bold',
  },
  statsSummary: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#2d2d2d',
    borderRadius: 20,
    padding: 20,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    color: '#6366f1',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  statLabel: {
    color: '#fff',
    fontSize: 12,
    textAlign: 'center',
  },
})

export default HomeScreen 
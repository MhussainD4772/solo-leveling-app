import React, { useState } from 'react'
import {
  View,
  Text,
  StyleSheet,
  Switch,
  TouchableOpacity,
  Alert,
} from 'react-native'
import { useGameStore } from '../store/gameStore'
import { Ionicons } from '@expo/vector-icons'
import DateTimePicker from '@react-native-community/datetimepicker'
import AsyncStorage from '@react-native-async-storage/async-storage'

const SettingsScreen = () => {
  const { player, updateActiveHours } = useGameStore()
  const [showStartPicker, setShowStartPicker] = useState(false)
  const [showEndPicker, setShowEndPicker] = useState(false)

  const [startTime, setStartTime] = useState(() => {
    const [hours, minutes] = player.activeHours.start.split(':')
    const date = new Date()
    date.setHours(parseInt(hours), parseInt(minutes))
    return date
  })

  const [endTime, setEndTime] = useState(() => {
    const [hours, minutes] = player.activeHours.end.split(':')
    const date = new Date()
    date.setHours(parseInt(hours), parseInt(minutes))
    return date
  })

  const handleStartTimeChange = (event: any, selectedDate?: Date) => {
    setShowStartPicker(false)
    if (selectedDate) {
      setStartTime(selectedDate)
      const hours = selectedDate.getHours().toString().padStart(2, '0')
      const minutes = selectedDate.getMinutes().toString().padStart(2, '0')
      updateActiveHours(`${hours}:${minutes}`, player.activeHours.end)
    }
  }

  const handleEndTimeChange = (event: any, selectedDate?: Date) => {
    setShowEndPicker(false)
    if (selectedDate) {
      setEndTime(selectedDate)
      const hours = selectedDate.getHours().toString().padStart(2, '0')
      const minutes = selectedDate.getMinutes().toString().padStart(2, '0')
      updateActiveHours(player.activeHours.start, `${hours}:${minutes}`)
    }
  }

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }

  return (
    <View style={styles.container}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Active Hours</Text>
        <View style={styles.settingItem}>
          <Text style={styles.settingLabel}>Start Time</Text>
          <TouchableOpacity
            style={styles.timeButton}
            onPress={() => setShowStartPicker(true)}
          >
            <Text style={styles.timeText}>{formatTime(startTime)}</Text>
            <Ionicons name="time-outline" size={24} color="#6366f1" />
          </TouchableOpacity>
        </View>
        <View style={styles.settingItem}>
          <Text style={styles.settingLabel}>End Time</Text>
          <TouchableOpacity
            style={styles.timeButton}
            onPress={() => setShowEndPicker(true)}
          >
            <Text style={styles.timeText}>{formatTime(endTime)}</Text>
            <Ionicons name="time-outline" size={24} color="#6366f1" />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Notifications</Text>
        <View style={styles.settingItem}>
          <Text style={styles.settingLabel}>Task Reminders</Text>
          <Switch
            value={true}
            onValueChange={() => {}}
            trackColor={{ false: '#767577', true: '#6366f1' }}
            thumbColor="#f4f3f4"
          />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>About</Text>
        <TouchableOpacity
          style={styles.settingItem}
          onPress={() => {
            Alert.alert(
              'About Solo Leveling',
              'Version 1.0.0\n\nA productivity app inspired by the Solo Leveling manhwa.'
            )
          }}
        >
          <Text style={styles.settingLabel}>Version</Text>
          <Text style={styles.settingValue}>1.0.0</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.settingItem, { backgroundColor: '#f87171' }]}
          onPress={async () => {
            await AsyncStorage.clear();
            Alert.alert('Profile Reset', 'App data cleared. Please restart the app to see changes.');
          }}
        >
          <Text style={[styles.settingLabel, { color: '#fff' }]}>Reset Profile</Text>
        </TouchableOpacity>
      </View>

      {showStartPicker && (
        <DateTimePicker
          value={startTime}
          mode="time"
          is24Hour={true}
          display="default"
          onChange={handleStartTimeChange}
        />
      )}

      {showEndPicker && (
        <DateTimePicker
          value={endTime}
          mode="time"
          is24Hour={true}
          display="default"
          onChange={handleEndTimeChange}
        />
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a1a',
    padding: 20,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#2d2d2d',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  settingLabel: {
    color: '#fff',
    fontSize: 16,
  },
  settingValue: {
    color: '#6366f1',
    fontSize: 16,
  },
  timeButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  timeText: {
    color: '#6366f1',
    fontSize: 16,
    marginRight: 8,
  },
})

export default SettingsScreen 
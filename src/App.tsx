import React from 'react'
import { StatusBar } from 'react-native'
import { Navigation } from './navigation'
import { SafeAreaProvider } from 'react-native-safe-area-context'

export default function App() {
  return (
    <SafeAreaProvider>
      <StatusBar barStyle="light-content" backgroundColor="#1a1a1a" />
      <Navigation />
    </SafeAreaProvider>
  )
} 
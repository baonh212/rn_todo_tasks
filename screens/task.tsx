import React, {} from 'react'
import { Text, StyleSheet, View } from 'react-native'

export default function Task() {
  return (
    <View style={styles.container}>
      <Text>task</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  }
})

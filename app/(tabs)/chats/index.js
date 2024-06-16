import { StyleSheet, Text, View,Animated } from 'react-native'
import React, { useRef } from 'react'


const index = () => {
  const fadeAnim=useRef(new Animated.Value(0)).current


  return (
    <View>
      <Text>index</Text>
    </View>
  )
}

export default index

const styles = StyleSheet.create({})
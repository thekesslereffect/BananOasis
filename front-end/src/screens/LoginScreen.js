import React, { useState } from 'react';
import { View, TextInput, Button, Alert } from 'react-native';

export default function LoginScreen({ navigation }) {  // Add navigation prop here
  const [bananoAddress, setBananoAddress] = useState('');

  const handleLogin = () => {
    if (!bananoAddress) {
      Alert.alert('Error', 'Please enter your Banano address');
      return;
    }

    // Navigate to MainScreen when user successfully logs in
    navigation.navigate('Main');
  };

  return (
    <View className="flex-1 items-center justify-center bg-white">
      <TextInput
        className="border border-gray-300 px-4 py-2 w-64 rounded"
        placeholder="Enter your Banano address"
        onChangeText={setBananoAddress}
        value={bananoAddress}
      />
      <Button
        className="mt-4 px-4 py-2 bg-yellow-500 text-white rounded"
        title="Login"
        onPress={handleLogin}
      />
    </View>
  );
}

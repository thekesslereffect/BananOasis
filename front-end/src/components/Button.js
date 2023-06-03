import React from 'react';
import { Text, TouchableOpacity } from 'react-native';

export default function Button({ text }) {
  return (
    <TouchableOpacity className="px-5 py-3 rounded-lg bg-yellow-500">
      <Text className="font-bold text-lg">{text}</Text>
    </TouchableOpacity>
  );
}

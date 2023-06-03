import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import axios from 'axios';

export default function MainScreen() {
  const [faucets, setFaucets] = useState([]);
  const [region, setRegion] = useState({
    latitude: 37.78825,
    longitude: -122.4324,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });

  useEffect(() => {
    axios
      .get('http://192.168.1.20:3000/api/getAvailableFaucets')
      .then((response) => {
        setFaucets(response.data);
        console.log('Received faucet data: ', response.data);
      })
      .catch((error) => {
        console.error('Error fetching faucet data: ', error);
      });
  }, []);

  return (
    <View className="flex-1">
      <MapView region={region} style={{ flex: 1 }}>
        {faucets.map((faucet, index) => (
          <Marker
            key={index}
            coordinate={{
              latitude: faucet.location.coordinates[1],
              longitude: faucet.location.coordinates[0],
            }}
          />
        ))}
      </MapView>
      <TouchableOpacity className="absolute bottom-4 right-4 bg-yellow-500 px-4 py-2 rounded">
        <Text className="text-white">Create Faucet</Text>
      </TouchableOpacity>
    </View>
  );
}

import React, { useState } from 'react';
import { StyleSheet } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { Card, Spinner, Text, YStack } from 'tamagui';

const GoogleMap = () => {
    const [isMapReady, setIsMapReady] = useState(false);

    return (
        <YStack padding="$3" flex={1}>
            <Card elevate bordered overflow="hidden" flex={1} borderRadius="$4" backgroundColor="$background">
                <MapView
                    style={StyleSheet.absoluteFillObject}
                    initialRegion={{
                        latitude: 19.0760,
                        longitude: 72.8777,
                        latitudeDelta: 0.0922,
                        longitudeDelta: 0.0421,
                    }}
                    onMapReady={() => setIsMapReady(true)}
                >
                    {isMapReady && (
                        <Marker
                            coordinate={{ latitude: 19.0760, longitude: 72.8777 }}
                            title="Sample Location"
                            description="This is Mumbai, India"
                        />
                    )}
                </MapView>

                {!isMapReady && (
                    <YStack
                        style={StyleSheet.absoluteFillObject}
                        justifyContent="center"
                        alignItems="center"
                        backgroundColor="$background"
                        zIndex={10}
                        gap="$3"
                    >
                        <Spinner size="large" color="$primary" />
                        <Text color="$color" fontSize="$4" fontWeight="500">
                            Loading Map...
                        </Text>
                    </YStack>
                )}
            </Card>
        </YStack>
    );
};

export default GoogleMap;

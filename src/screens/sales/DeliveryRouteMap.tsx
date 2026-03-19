import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet } from 'react-native';
import Config from 'react-native-config';
import MapView, { Marker } from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions';
import { Circle, Spinner, Text, YStack, useTheme } from 'tamagui';

interface Stop {
    lat: number;
    lng: number;
    label: string;
    type?: 'PICK UP' | 'DELIVERY' | 'RETURN';
}

interface DeliveryRouteMapProps {
    stops: Stop[];
    onRouteInfoReady?: (info: { distance: string; duration: string }) => void;
}

export const DeliveryRouteMap: React.FC<DeliveryRouteMapProps> = ({ stops, onRouteInfoReady }) => {
    const theme = useTheme();
    const mapRef = useRef<MapView>(null);
    const [isMapReady, setIsMapReady] = useState(false);

    useEffect(() => {
        if (isMapReady && stops.length > 0 && mapRef.current) {
            mapRef.current.fitToCoordinates(
                stops.map((s) => ({ latitude: s.lat, longitude: s.lng })),
                {
                    edgePadding: { top: 50, right: 50, bottom: 50, left: 50 },
                    animated: true,
                }
            );
        }
    }, [stops, isMapReady]);

    const origin = stops.length > 0 ? { latitude: stops[0].lat, longitude: stops[0].lng } : null;
    const destination = stops.length > 1 ? { latitude: stops[stops.length - 1].lat, longitude: stops[stops.length - 1].lng } : null;
    const waypoints = stops.length > 2 ? stops.slice(1, -1).map(s => ({ latitude: s.lat, longitude: s.lng })) : undefined;

    return (
        <YStack height={500} borderRadius="$4" overflow="hidden" backgroundColor="$background">
            <MapView
                ref={mapRef}
                style={StyleSheet.absoluteFillObject}
                onMapReady={() => setIsMapReady(true)}
                initialRegion={{
                    latitude: stops[0]?.lat || 19.0760,
                    longitude: stops[0]?.lng || 72.8777,
                    latitudeDelta: 0.0922,
                    longitudeDelta: 0.0421,
                }}
            >
                {origin && destination && (
                    <MapViewDirections
                        origin={origin}
                        destination={destination}
                        waypoints={waypoints}
                        apikey={Config.GOOGLE_MAPS_API_KEY || ''}
                        strokeWidth={4}
                        strokeColor="#000000"
                        onReady={(result) => {
                            if (onRouteInfoReady) {
                                onRouteInfoReady({
                                    distance: `${result.distance.toFixed(2)} km`,
                                    duration: `${Math.floor(result.duration)} min`,
                                });
                            }
                        }}
                    />
                )}

                {stops.map((stop, index) => (
                    <Marker
                        key={index}
                        coordinate={{ latitude: stop.lat, longitude: stop.lng }}
                        title={stop.label}
                        description={stop.type}
                    >
                        <Circle
                            size={28}
                            backgroundColor={stop.type === 'PICK UP' ? '$blue10' : '$green10'}
                            borderWidth={2}
                            borderColor="white"
                            elevation={3}
                        >
                            <Text color="white" fontWeight="bold" fontSize="$1">
                                {index + 1}
                            </Text>
                        </Circle>
                    </Marker>
                ))}
            </MapView>

            {!isMapReady && (
                <YStack
                    style={StyleSheet.absoluteFillObject}
                    justifyContent="center"
                    alignItems="center"
                    backgroundColor="$background"
                    zIndex={10}
                >
                    <Spinner size="large" color="$primary" />
                </YStack>
            )}
        </YStack>
    );
};

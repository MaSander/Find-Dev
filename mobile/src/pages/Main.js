import React, { useState, useEffect } from 'react';
import { StyleSheet, Image, View, Text, TextInput, TouchableOpacity } from 'react-native';
import MapView, { Marker, Callout } from 'react-native-maps';
import { requestPermissionsAsync, getCurrentPositionAsync } from 'expo-location';
import { MaterialIcons } from '@expo/vector-icons'; //Biblioteca de icons trazida pelo expo

import Api from '../services/api';

function Main({ navigation }) {
    const [devs, setDevs] = useState([]);
    const [currentRegion, setCurrentRegion] = useState(null);

    useEffect(() => {
        async function loadInitialPosition() {
            const { granted } = await requestPermissionsAsync(); // Receber a permissão de localizção do usuario

            if (granted) {
                const { coords } = await getCurrentPositionAsync({
                    enableHighAccuracy: true //usar o gps
                });

                const { latitude, longitude } = coords;

                setCurrentRegion({
                    latitude,
                    longitude,
                    latitudeDelta: 0.04, // Zoom inicial do mapa
                    longitudeDelta: 0.04, // Zoom inicial do mapa
                })

            }

        }

        loadInitialPosition();
    }, []);

    async function loadDevs() {
        const { latitude, longitude } = currentRegion;

        const response = await Api.get('/search', {
            parms: {
                latitude,
                longitude,
                techs: 'ReactJs'
            }
        });

        setDevs(response.data.devs);
    }

    // Pega a lat. e long. em que o mapa está
    function handleRegionChanged(region) {
        // console.log(region);
        setCurrentRegion(region);
    }

    // Não carrega o mapa enquanto nao tiver a localização do usuario
    if (!currentRegion) {
        return null;
    }

    return (
        // <> </> coiso vazio que pode ser utilizado
        <>
            {/* Mapa */}
            < MapView onRegionChangeComplete={handleRegionChanged} initialRegion={currentRegion} style={styles.map}>
                {devs.map(dev => (
                    <Marker
                        key={dev._id}
                        coordinate={{
                            latitude: dev.location.coordinate[0],
                            longitude: dev.location.coordinate[1]
                        }}>
                        <Image
                            style={styles.avatar}
                            source={{
                                uri: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSrkuC1-v7ztkHduTCvmkQm7nVjn8DZpAYfPui03E5xbOTInJU6&s'
                            }} />

                        <Callout onPress={() => {
                            navigation.navigate('Profile', { github_username: dev.github_username });
                        }}>
                            <View style={styles.callout}>
                                <Text style={styles.devName}>{dev.name}</Text>
                                <Text style={styles.devBio}>{dev.bio}</Text>
                                <Text style={styles.devTechs}>{dev.tech.join(', ')}</Text>
                            </View>
                        </Callout>

                    </Marker>
                ))}
            </ MapView>
            {/* Busca de devs por techs */}
            <View style={styles.searchForm}>
                <TextInput
                    style={styles.searchInput}
                    placeholder='Buscar devs por techs... '
                    placeholderTextColor='#999'
                    autoCapitalize='words' // Primeira letra em caixa alta
                    autoCorrect={false} // Corretor automatico
                />

                <TouchableOpacity onPress={loadDevs} style={styles.loadButton}>
                    <MaterialIcons name='my-location' size={20} color='#FFF' />
                </TouchableOpacity>
            </View>
        </>
    )
}

const styles = StyleSheet.create({
    map: {
        flex: 1
    },
    avatar: {
        height: 54,
        width: 54,
        borderRadius: 4,
        borderWidth: 4,
        borderColor: '#FFF'
    },

    callout: {
        width: 260,
    },
    devName: {
        fontWeight: "bold",
        fontSize: 16,
    },
    devBio: {
        color: "#666",
        fontSize: 5
    },
    devTechs: {
        marginTop: 5,
    },

    searchForm: {
        position: 'absolute',
        top: 20,
        left: 20,
        right: 20,
        zIndex: 5,
        flexDirection: 'row'
    },
    searchInput: {
        flex: 1,
        height: 50,
        backgroundColor: '#FFF',
        color: '#333',
        borderRadius: 25,
        paddingHorizontal: 20, // Não tem 'padding: X X X X'
        fontSize: 16,
        shadowColor: '#000', // cor da sombra
        shadowOpacity: 0.2,
        shadowOffset: {
            width: 4,
            height: 4
        },
        elevation: 2, // elevação da sombra

    },
    loadButton: {
        width: 20,
        height: 50,
        backgroundColor: '#8e4dff',
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 15
    }
    // Display flex é padrão do react native, so tem ele e o 'none'
})

export default Main;
import React from 'react';
import { View, Text, Image, StyleSheet, Button, TouchableOpacity, Platform, TouchableNativeFeedback } from 'react-native';
import Colors from '../../constants/Colors';
import Card from '../UI/Card';


const ProductItem = (props) => {

    let TouchableCmp = TouchableOpacity;
    if (Platform.OS === 'android' && Platform.Version >= 21) {
        TouchableCmp = TouchableNativeFeedback;
    }

    return (

        <Card style={styles.product} >
            <View style={styles.touchable} >
                <TouchableCmp onPress={props.onSelect} useForeground>
                    <View>
                        <View style={styles.imageContainer} >
                            <Image style={styles.image} source={{ uri: props.image }} />
                        </View>
                        <View style={styles.container} >
                            <View style={styles.textContainer} >
                                <Text style={styles.title} >{props.title}</Text>
                                <Text style={styles.price} > {props.price.toFixed(2)} TL </Text>
                            </View>
                            {props.children}
                        </View>
                    </View>
                </TouchableCmp>
            </View>
        </Card>
    )
}


const styles = StyleSheet.create({
    product: {

        height: 300,
        margin: 20

    },
    touchable: {
        borderRadius: 10,
        overflow: 'hidden'
    },
    image: {
        width: '100%',
        height: '100%'
    },
    title: {
        fontFamily: 'openSansBold',
        fontSize: 18,
        marginVertical: 2
    },
    price: {
        fontFamily: 'openSansRegular',
        fontSize: 14,
        color: '#888'
    },
    container: {
        flexDirection: 'column',
        justifyContent: 'space-around',
        alignItems: 'center',
        height: '40%'
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        height: '35%',
        width: '100%',
        backgroundColor: Colors.primary
    },
    textContainer: {
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        height: '75%'
    },
    imageContainer: {
        width: '100%',
        height: '60%',
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
        overflow: 'hidden'

    }

});


export default ProductItem;
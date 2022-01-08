import React, { useState } from 'react'
import { View, Text, Image, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import Colors from '../../constants/Colors';
import * as cartActions from '../../store/actions/cart';
import { Fontisto, MaterialIcons } from '@expo/vector-icons';



const ProductDetailScreen = (props) => {
    const [isFavorite, setIsFavorite] = useState(false)
    const [cartCounter, setCartCounter] = useState(0)
    const productId = props.navigation.getParam('productId');
    const selectedProduct = useSelector(state => state.products.availableProducts.find(product => product.id === productId));
    const dispatch = useDispatch();


    return (
        <ScrollView style={styles.screen} >
            <Image style={styles.image} source={{ uri: selectedProduct.imageUrl }} />
            <View style={styles.priceAndCart} >
                <Text style={styles.price} >{selectedProduct.price.toFixed(2)} TL </Text>

                <View style={styles.buttonContainer} >
                    <TouchableOpacity
                        style={styles.addCartContainer}
                        onPress={() => {

                            setCartCounter(cartCounter + 1)

                            dispatch(cartActions.addToCart(selectedProduct));
                        }} >
                        {
                            cartCounter > 0 ? <Text style={{
                                fontSize: 15,
                                fontFamily: 'openSansBold',
                                color: 'white',
                                marginRight: 4
                            }} >{cartCounter}</Text> : null
                        }
                        <Fontisto name="shopping-basket" size={20} color="white" />
                    </TouchableOpacity>
                </View>
            </View>
            <Text style={styles.description} >{selectedProduct.description}</Text>
        </ScrollView>
    )
}

ProductDetailScreen.navigationOptions = navData => {
    return {
        headerTitle: navData.navigation.getParam('productTitle')
    };
}
const styles = StyleSheet.create({
    screen: {
        backgroundColor: 'white'
    },
    image: {
        width: '100%',
        height: 400,
        marginTop: 5
    },
    priceAndCart: {
        width: '100%',
        height: 100,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white'

    },
    price: {
        fontFamily: 'openSansBold',
        fontSize: 25,
        color: '#888',
        textAlign: 'center',
        marginBottom: 10

    },
    description: {
        fontFamily: 'openSansRegular',
        fontSize: 16,
        textAlign: 'center',
        marginHorizontal: 20,
        marginTop: 20,
        marginEnd: 10,
        marginBottom: 100,

    },
    addCartContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        height: 35,
        backgroundColor: Colors.primary
    },
    favoritePasiveContainer: {

        alignItems: 'center',
        justifyContent: 'center',
        width: '50%',
        height: 35,
        backgroundColor: '#888',
        borderRadius: 15,
        marginRight: 70
    },
    favoriteActiveContainer: {

        alignItems: 'center',
        justifyContent: 'center',
        width: '50%',
        height: 35,
        backgroundColor: 'red',
        borderRadius: 15,
        marginRight: 70
    },
    buttonContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        height: 40,
        marginBottom: 20
    },


});

export default ProductDetailScreen;
import React from 'react'
import { FlatList, TouchableOpacity, Text, Platform, StyleSheet } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import ProductItem from '../../components/shop/ProductItem';
import * as cartActions from '../../store/actions/cart';
import { HeaderButtons, Item } from 'react-navigation-header-buttons';
import CustomHeaderButton from '../../components/UI/HeaderButton';
import Colors from '../../constants/Colors';
import { FontAwesome5 } from '@expo/vector-icons';

const ProductOverviewScreen = props => {
    const products = useSelector(state => state.products.availableProducts
    );
    const dispatch = useDispatch();
    const selectItemHandler = (id, title) => {

        props.navigation.navigate('ProductDetail', {
            productId: id,
            productTitle: title
        });

    }
    return (
        <FlatList
            data={products}
            keyExtractor={item => item.id}
            renderItem={itemData => <ProductItem
                image={itemData.item.imageUrl}
                title={itemData.item.title}
                price={itemData.item.price}
                onSelect={() => {
                    selectItemHandler(itemData.item.id, itemData.item.title)
                }}
            >
                <TouchableOpacity style={styles.buttonContainer} onPress={() => dispatch(cartActions.addToCart(itemData.item))} >
                    <FontAwesome5 name="cart-plus" size={20} color="white" />
                    <Text style={{ fontFamily: 'openSansBold', color: 'white', fontSize: 14 }} > Sepete Ekle</Text>
                </TouchableOpacity>
            </ProductItem>
            }
        />

    )
}

ProductOverviewScreen.navigationOptions = navData => {
    return {
        headerTitle: 'Bütün Ürünler',
        headerLeft: (
            <HeaderButtons HeaderButtonComponent={CustomHeaderButton} >
                <Item
                    title='Menu'
                    iconName={Platform.OS === 'android' ? 'md-menu' : 'ios-menu'}
                    onPress={() => {
                        navData.navigation.toggleDrawer();
                    }}
                />
            </HeaderButtons>
        ),
        headerRight: (
            <HeaderButtons HeaderButtonComponent={CustomHeaderButton} >
                <Item
                    title='Cart'
                    iconName={Platform.OS === 'android' ? 'md-cart' : 'ios-cart'}
                    onPress={() => {
                        navData.navigation.navigate('Cart');
                    }}
                />
            </HeaderButtons>
        )
    }

}

const styles = StyleSheet.create({
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        height: '35%',
        width: '100%',
        backgroundColor: Colors.primary
    }
})


export default ProductOverviewScreen;


import React, { useEffect, useState, useCallback } from 'react'
import {
    FlatList,
    View,
    TouchableOpacity,
    Text,
    Platform,
    StyleSheet,
    ActivityIndicator,
    Button
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import ProductItem from '../../components/shop/ProductItem';
import * as cartActions from '../../store/actions/cart';
import * as productsActions from '../../store/actions/products';
import { HeaderButtons, Item } from 'react-navigation-header-buttons';
import CustomHeaderButton from '../../components/UI/HeaderButton';
import Colors from '../../constants/Colors';
import { FontAwesome5 } from '@expo/vector-icons';

const ProductOverviewScreen = props => {
    const [isLoading, setIsLoading] = useState(false);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [error, setError] = useState();
    const products = useSelector(state => state.products.availableProducts
    );
    const dispatch = useDispatch();

    const loadProducts = useCallback(
        async () => {
            setError(null)
            setIsRefreshing(true)
            try {
                await dispatch(productsActions.fetchProducts());
            } catch (error) {
                setError(error.message);
            }
            setIsRefreshing(false);
        }, [dispatch, setIsLoading, setError]);

    useEffect(() => {
        const willFocusSub = props.navigation.addListener(
            'willFocus',
            loadProducts
        );
        return () => {
            willFocusSub.remove();
        }
    }, [loadProducts])

    useEffect(() => {
        setIsLoading(true);
        loadProducts().then(() =>
            setIsLoading(false)
        );

    }, [dispatch, loadProducts])

    const selectItemHandler = (id, title) => {
        props.navigation.navigate('ProductDetail', {
            productId: id,
            productTitle: title
        });
    }

    if (error) {
        return (
            <View style={styles.centered} >
                <Text style={styles.message}>
                    Bir hata ile karşılaştık!
                </Text>
                <Button title='Yenile' onPress={loadProducts} color={Colors.primary} />
            </View>
        )
    }

    if (isLoading) {
        return (
            <View style={styles.centered} >
                <ActivityIndicator size="large" color={Colors.accent} />
            </View>
        )
    }

    if (!isLoading && products.length === 0) {
        return (
            <View style={styles.centered} >
                <Text style={styles.message} >Kayıtlı ürün bulunmadı!</Text>
            </View>
        )
    }

    return (
        <FlatList
            onRefresh={loadProducts}
            refreshing={isRefreshing}
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
    },
    centered: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    message: {
        fontSize: 20,
        fontFamily: 'openSansRegular',
        marginBottom: 10
    }
})


export default ProductOverviewScreen;


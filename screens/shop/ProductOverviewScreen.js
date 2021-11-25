import React from 'react'
import { FlatList, View, Text, Platform } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import ProductItem from '../../components/shop/ProductItem';
import * as cartActions from '../../store/actions/cart';
import { HeaderButtons, Item } from 'react-navigation-header-buttons';
import CustomHeaderButton from '../../components/UI/HeaderButton';


const ProductOverviewScreen = props => {
    const products = useSelector(state => state.products.availableProducts
    );
    const dispatch = useDispatch();
    return (
        <FlatList
            data={products}
            keyExtractor={item => item.id}
            renderItem={itemData => <ProductItem
                image={itemData.item.imageUrl}
                title={itemData.item.title}
                price={itemData.item.price}
                onViewDetail={() => {
                    props.navigation.navigate('ProductDetail', {
                        productId: itemData.item.id,
                        productTitle: itemData.item.title
                    });
                }}
                onAddtoCart={() => {
                    dispatch(cartActions.addToCart(itemData.item));
                }}
            />}
        />

    )
}

ProductOverviewScreen.navigationOptions = navData => {
    return {
        headerTitle: 'Bütün Ürünler',
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
export default ProductOverviewScreen;

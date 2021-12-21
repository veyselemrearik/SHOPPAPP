import React from "react";
import { FlatList, Platform, Button, StyleSheet, View, Alert, Text } from 'react-native';
import { useSelector, useDispatch } from "react-redux";
import { HeaderButtons, Item } from 'react-navigation-header-buttons';
import CustomHeaderButton from '../../components/UI/HeaderButton';
import ProductItem from '../../components/shop/ProductItem';
import Colors from "../../constants/Colors";
import * as productsActions from '../../store/actions/products'


const UserProductsScreen = props => {
    const userProducts = useSelector(state => state.products.userProducts);
    const dispatch = useDispatch();

    const editProductHandler = id => {
        props.navigation.navigate('EditProduct', { productId: id });
    }
    const deleteHandler = (id) => {
        Alert.alert('Emin misiniz?', 'Ürünü silmek istediğinizden emin misiniz?', [
            { text: 'Hayır', style: 'default' },
            {
                text: 'Evet',
                style: 'destructive',
                onPress: () => {
                    dispatch(productsActions.deleteProduct(id));
                }
            }
        ]);
    };

    if (userProducts.length === 0) {
        return <View style={styles.centered} >
            <Text style={styles.message} >Kayıtlı ürünün yok ürün ekleyebilirsin.</Text>
        </View>
    }

    return (<FlatList
        data={userProducts}
        keyExtractor={item => item.id}
        renderItem={itemData => <ProductItem
            image={itemData.item.imageUrl}
            title={itemData.item.title}
            price={itemData.item.price}
            onSelect={() => {
                editProductHandler(itemData.item.id)
            }}
        >
            <View style={styles.buttonContainer} >
                <Button
                    color={Colors.primary}
                    title="Düzenle"
                    onPress={() => {
                        editProductHandler(itemData.item.id)
                    }}

                />
                <Button
                    color={'red'}
                    title="      Sil     "
                    onPress={deleteHandler.bind(this, itemData.item.id)}

                />
            </View>
        </ProductItem>}
    />)
}


UserProductsScreen.navigationOptions = navData => {

    return {
        headerTitle: "Ürünlerim",
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
                    title='Add'
                    iconName={Platform.OS === 'android' ? 'md-create' : 'ios-create'}
                    onPress={() => {
                        navData.navigation.navigate('EditProduct');
                    }}
                />
            </HeaderButtons>
        ),
    };

}

const styles = StyleSheet.create({
    buttonContainer: {
        width: '100%',
        height: '30%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-around',
        marginBottom: 20
    },
    centered: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    message: {
        fontSize: 16,
        fontFamily: 'openSansRegular',
        marginBottom: 10
    }
})

export default UserProductsScreen;
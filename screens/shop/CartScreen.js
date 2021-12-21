
import React, { useState } from 'react';
import { View, Text, FlatList, Button, StyleSheet, Alert } from 'react-native';
import Colors from '../../constants/Colors';
import { useSelector, useDispatch } from 'react-redux';
import CartItem from '../../components/shop/CartItem';
import * as cartActions from '../../store/actions/cart';
import * as ordersActions from '../../store/actions/order';
import Card from '../../components/UI/Card';

const CartScreen = props => {
    const cartTotalAmount = useSelector(state => state.cart.totalAmount);
    const cartItems = useSelector(state => {
        const transformedCartItems = [];
        for (const key in state.cart.items) {
            transformedCartItems.push({
                productId: key,
                productTitle: state.cart.items[key].productTitle,
                productPrice: state.cart.items[key].productPrice,
                quantity: state.cart.items[key].quantity,
                sum: state.cart.items[key].sum,
            });
        }
        return transformedCartItems.sort((a, b) =>
            a.productPrice > b.productPrice ? 1 : -1
        );
    });
    const dispatch = useDispatch();


    const orderHandler = (item, totalAmount) => {
        Alert.alert('Ödemeniz Alındı', 'Ödemeniz başarıyla alındı. ', [
            {
                text: 'Devam',
                style: 'destructive',
                onPress: () => {
                    dispatch(ordersActions.addOrder(item, totalAmount));
                }
            }
        ]);

    };


    return (
        <View style={styles.screen} >
            <Card style={styles.summary} >
                <Text style={styles.summaryText} >
                    Toplam:{' '}
                    <Text style={styles.amount} >{Math.round(cartTotalAmount.toFixed(2) * 100) / 100} TL </Text>
                </Text>
                <Button
                    color={Colors.accent}
                    title='Sipariş Ver'
                    disabled={cartItems.length === 0}
                    onPress={() =>
                        orderHandler(cartItems, cartTotalAmount)
                    }
                />
            </Card>
            <FlatList
                data={cartItems}
                keyExtractor={item => item.productId}
                renderItem={itemData => (
                    <CartItem
                        quantity={itemData.item.quantity}
                        title={itemData.item.productTitle}
                        amount={itemData.item.sum}
                        deletable={true}
                        onRemove={() => {
                            dispatch(cartActions.removeFromCart(itemData.item.productId));
                        }}

                    />
                )}
            />
        </View>

    )
}

CartScreen.navigationOptions = {
    headerTitle: "Sepetim"
}

const styles = StyleSheet.create({

    screen: {
        margin: 20
    },
    summary: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 20,
        padding: 10,
    },
    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 22
    },
    summaryText: {
        fontFamily: 'openSansBold',
        fontSize: 18
    },
    amount: {
        color: Colors.primary
    }

});

export default CartScreen;
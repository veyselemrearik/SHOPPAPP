import React, { useEffect, useState } from 'react';
import { FlatList, Platform, ActivityIndicator, View, StyleSheet, Text } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { HeaderButtons, Item } from 'react-navigation-header-buttons';
import CustomHeaderButton from '../../components/UI/HeaderButton';
import OrderItem from '../../components/shop/OrderItem';
import * as ordersActions from '../../store/actions/order'
import Colors from '../../constants/Colors';


const OrdersScreen = props => {

    const [isLoading, setIsloading] = useState(false)
    const orders = useSelector(state => state.orders.orders);
    const dispatch = useDispatch();
    useEffect(() => {
        setIsloading(true);
        dispatch(ordersActions.fetchOrders()).then(() => {
            setIsloading(false);
        })
    }, [dispatch])


    if (isLoading) {
        return (
            <View style={styles.centered} >
                <ActivityIndicator size="large" color={Colors.accent} />
            </View>
        )
    }

    if (orders.length === 0) {
        return <View style={styles.centered} >
            <Text style={styles.message} >Kayıtlı siparişin yok!</Text>
        </View>
    }

    return (
        <FlatList
            data={orders}
            keyExtractor={item => item.id}
            renderItem={itemData => <OrderItem
                amount={itemData.item.totalAmount}
                date={itemData.item.readableDate}
                items={itemData.item.items}
            />}
        />
    )
}

OrdersScreen.navigationOptions = navData => {

    return {
        headerTitle: "Siparişlerim",
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
    };

}

const styles = StyleSheet.create({
    centered: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
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

export default OrdersScreen;
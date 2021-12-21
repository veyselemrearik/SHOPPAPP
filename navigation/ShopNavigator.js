import React from 'react'
import { useDispatch } from 'react-redux';
import { Platform, SafeAreaView, TouchableOpacity, View } from 'react-native';
import { createStackNavigator } from "react-navigation-stack";
import { createDrawerNavigator, DrawerNavigatorItems } from "react-navigation-drawer";
import { createAppContainer, createSwitchNavigator } from "react-navigation";
import ProductOverviewScreen from "../screens/shop/ProductOverviewScreen";
import ProductDetailScreen from "../screens/shop/ProductDetailScreen";
import CartScreen from "../screens/shop/CartScreen";
import OrdersScreen from "../screens/shop/OrdersScreen";
import UserProductsScreen from "../screens/user/UserProductScreen";
import EditProductScreen from "../screens/user/EditProductScreen";
import StartupScreen from "../screens/StartupScreen";
import Colors from "../constants/Colors";
import { Ionicons } from '@expo/vector-icons'
import AuthenticaScreen from "../screens/user/AuthenticaScreen";
import * as authActions from '../store/actions/authentication';

const defaultNavOptions = {
    headerStyle: {
        backgroundColor: Platform.OS === 'android' ? Colors.primary : ''
    },
    headerTitleStyle: {
        fontFamily: 'openSansBold'
    },
    headerBackTitleStyle: {
        fontFamily: 'openSansRegular'
    },
    headerTintColor: Platform.OS === 'android' ? 'white' : Colors.primary
}
const ProductsNavigator = createStackNavigator({
    ProductsOverview: ProductOverviewScreen,
    ProductDetail: ProductDetailScreen,
    Cart: CartScreen
}, {
    navigationOptions: {
        drawerIcon: drawerConfig => (
            <Ionicons
                name={Platform.OS === 'android' ? 'md-cart' : 'ios-cart'}
                size={23}
                color={drawerConfig.tintColor}
            />
        )
    },
    defaultNavigationOptions: defaultNavOptions
});


const OrdersNavigator = createStackNavigator({
    Orders: OrdersScreen
}, {
    navigationOptions: {
        drawerIcon: drawerConfig => (
            <Ionicons
                name={Platform.OS === 'android' ? 'md-list' : 'ios-list'}
                size={23}
                color={drawerConfig.tintColor}
            />
        )
    },
    defaultNavigationOptions: defaultNavOptions
});

const AdminNavigator = createStackNavigator({
    UserProducts: UserProductsScreen,
    EditProduct: EditProductScreen
}, {
    navigationOptions: {
        drawerIcon: drawerConfig => (
            <Ionicons
                name={Platform.OS === 'android' ? 'md-create' : 'ios-create'}
                size={23}
                color={drawerConfig.tintColor}
            />
        )
    },
    defaultNavigationOptions: defaultNavOptions
});



const ShopNavigator = createDrawerNavigator({
    Ürünler: ProductsNavigator,
    Siparişlerim: OrdersNavigator,
    Admin: AdminNavigator
}, {
    contentOptions: {
        activeTintColor: Colors.primary
    },
    contentComponent: props => {
        const dispatch = useDispatch();
        return (
            <View style={{ flex: 1, paddingTop: 20 }} >
                <View forceInset={{ top: 'always', horizontal: 'never' }} >
                    <DrawerNavigatorItems {...props} />
                    <View style={{
                        alignItems: 'center', justifyContent: 'center', marginTop: 30
                    }}  >
                        <TouchableOpacity
                            style={{
                                alignItems: 'center',
                                justifyContent: 'center',
                                width: '100%',
                                height: 30,
                                backgroundColor: Colors.primary,
                                borderRadius: 360
                            }}
                            onPress={() => {
                                dispatch(authActions.logout());
                                props.navigation.navigate('Auth');
                            }}
                        >
                            <Ionicons
                                name={Platform.OS === 'android' ? 'md-log-out-outline' : 'ios-log-out-outline'}
                                size={23}
                                color='white'
                            />
                        </TouchableOpacity>
                    </View>

                </View>

            </View>
        )
    }
}
);

const AuthenticateNavigator = createStackNavigator({
    Auth: AuthenticaScreen
},
    {
        defaultNavigationOptions: defaultNavOptions
    }
)

const MainNavigator = createSwitchNavigator({
    Startup: StartupScreen,
    Auth: AuthenticateNavigator,
    Shop: ShopNavigator,
});

export default createAppContainer(MainNavigator);
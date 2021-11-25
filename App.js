
import React, { useState } from 'react';
import { createStore, combineReducers } from 'redux';
import { Provider } from 'react-redux';
import { AppLoading } from 'expo';
import { useFonts } from 'expo-font';
import cartReducer from './store/reducers/cart';
import productsReducer from './store/reducers/product';
import ShopNavigator from './navigation/ShopNavigator';



const rootReducer = combineReducers({
  products: productsReducer,
  cart: cartReducer
});

const store = createStore(rootReducer);


export default function App() {

  const [loaded] = useFonts({
    openSansRegular: require('./assets/fonts/OpenSans-Regular.ttf'),
    openSansBold: require('./assets/fonts/OpenSans-Bold.ttf')
  })
  if (!loaded) {
    return null
  }

  return (
    <Provider store={store} >
      <ShopNavigator />
    </Provider>
  );
}




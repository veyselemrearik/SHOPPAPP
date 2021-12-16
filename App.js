
import React from 'react';
import { createStore, combineReducers, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import { useFonts } from 'expo-font';
import cartReducer from './store/reducers/cart';
import productsReducer from './store/reducers/product';
import ordersReducer from './store/reducers/order';
import ShopNavigator from './navigation/ShopNavigator';
import ReduxThunk from 'redux-thunk';



const rootReducer = combineReducers({
  products: productsReducer,
  cart: cartReducer,
  orders: ordersReducer
});

const store = createStore(rootReducer, applyMiddleware(ReduxThunk));


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




import React, { useCallback, useEffect, useReducer } from 'react'
import { useSelector, useDispatch } from 'react-redux';
import { View, StyleSheet, ScrollView, KeyboardAvoidingView, Platform, Alert } from 'react-native'
import { HeaderButtons, Item } from 'react-navigation-header-buttons';
import CustomHeaderButton from '../../components/UI/HeaderButton';
import * as productsActions from '../../store/actions/products';
import Input from '../../components/UI/Input';
const FORM_INPUT_UPDATE = 'FORM_INPUT_UPDATE';

const formReducer = (state, action) => {
    if (action.type === FORM_INPUT_UPDATE) {
        const updatedValues = {
            ...state.inputValues,
            [action.input]: action.value
        };
        const updatedValidities = {
            ...state.inputValidities,
            [action.input]: action.isValid
        }
        let updatedFormIsValid = true;
        for (const key in updatedValidities) {
            updatedFormIsValid = updatedFormIsValid && updatedValidities[key];
        }
        return {
            ...state,
            inputValidities: updatedValidities,
            inputValues: updatedValues,
            formIsValid: updatedFormIsValid
        };
    }
    return state;
}

const EditProductScreen = props => {
    const prodId = props.navigation.getParam('productId');
    const editedProduct = useSelector(state =>
        state.products.userProducts.find(prod => prod.id === prodId)
    )
    const dispatch = useDispatch();

    const [formState, dispatchFormState] = useReducer(formReducer, {
        inputValues: {
            title: editedProduct ? editedProduct.title : '',
            imageUrl: editedProduct ? editedProduct.imageUrl : '',
            price: editedProduct ? editedProduct.price.toString() : '',
            description: editedProduct ? editedProduct.description : ''
        },
        inputValidities: {
            title: editedProduct ? true : false,
            imageUrl: editedProduct ? true : false,
            price: editedProduct ? true : false,
            description: editedProduct ? true : false,
        },
        formIsValid: editedProduct ? true : false
    })

    const submitHandler = useCallback(() => {
        if (!formState.formIsValid) {
            Alert.alert('Yanlis Input!', 'Lütfen girdiğiniz inputlari kontrol ediniz.', [{ text: 'Tamam' }]);
            return;
        }
        if (editedProduct) {
            dispatch(
                productsActions.updateProduct(
                    prodId,
                    formState.inputValues.title,
                    formState.inputValues.description,
                    formState.inputValues.imageUrl,
                    +formState.inputValues.price
                )
            );
        } else {
            dispatch(
                productsActions.createProduct(
                    formState.inputValues.title,
                    formState.inputValues.description,
                    formState.inputValues.imageUrl,
                    +formState.inputValues.price
                )
            );
        }
        props.navigation.goBack();
    }, [dispatch, prodId, formState]);

    useEffect(() => {
        props.navigation.setParams({ 'submit': submitHandler });
    }, [submitHandler]);


    const inputChangeHandler = useCallback((inputIdentifier, inputValue, inputValidity) => {
        dispatchFormState({
            type: FORM_INPUT_UPDATE,
            value: inputValue,
            isValid: inputValidity,
            input: inputIdentifier
        });

    }, [dispatchFormState])

    return (

        <KeyboardAvoidingView
            style={{ flex: 1 }}
            keyboardVerticalOffset={100}
        >
            <ScrollView>
                <View styles={styles.form} >
                    <Input
                        id='title'
                        label='Başlık'
                        errorText='Lütfen uygun bir başlık girin!'
                        keyboardType='default'
                        autoCapitalize='sentences'
                        onInputChange={inputChangeHandler}
                        initialValue={editedProduct ? editedProduct.title : ''}
                        initiallyValid={!!editedProduct}
                        required
                    />
                    <Input
                        id='imageUrl'
                        label='Image URL'
                        errorText='Lütfen uygun bir resim linki girin!'
                        keyboardType='default'
                        onInputChange={inputChangeHandler}
                        initialValue={editedProduct ? editedProduct.imageUrl : ''}
                        initiallyValid={!!editedProduct}
                        required
                    />
                    <Input
                        id='price'
                        label='Fiyat'
                        errorText='Lütfen doğru bir fiyat değeri girin!'
                        keyboardType='decimal-pad'
                        onInputChange={inputChangeHandler}
                        initialValue={editedProduct ? editedProduct.price.toString() : ''}
                        initiallyValid={!!editedProduct}
                        required
                        min={0.1}

                    />
                    <Input
                        id='description'
                        label='Detay'
                        errorText='Bu alan boş bırakılamaz!'
                        keyboardType='default'
                        autoCapitalize='sentences'
                        multiline
                        numberOfLines={3}
                        onInputChange={inputChangeHandler}
                        initialValue={editedProduct ? editedProduct.description : ''}
                        initiallyValid={!!editedProduct}
                        required
                        minLength={5}
                    />
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    )
}

const styles = StyleSheet.create({
    form: {
        margin: 20,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center'
    },

})

EditProductScreen.navigationOptions = navData => {
    const submitFunction = navData.navigation.getParam('submit');
    return {
        headerTitle: navData.navigation.getParam('productId') ? 'Ürün Düzenleme' : 'Ürün Ekleme',
        headerRight: (
            <HeaderButtons HeaderButtonComponent={CustomHeaderButton} >
                <Item
                    title='Save'
                    iconName={Platform.OS === 'android' ? 'md-checkmark' : 'ios-checkmark'}
                    onPress={submitFunction}
                />
            </HeaderButtons>
        ),
    }
}

export default EditProductScreen;


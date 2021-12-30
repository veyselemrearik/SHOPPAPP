import React, { useCallback, useEffect, useReducer, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux';
import {
    View,
    StyleSheet,
    ScrollView,
    KeyboardAvoidingView,
    Platform,
    Alert,
    ActivityIndicator
} from 'react-native'
import ImageSelector from '../../components/UI/ImageSelector'
import { HeaderButtons, Item } from 'react-navigation-header-buttons';
import CustomHeaderButton from '../../components/UI/HeaderButton';
import * as productsActions from '../../store/actions/products';
import Input from '../../components/UI/Input';
import Colors from '../../constants/Colors';
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
    const [isLoading, setIsLoading] = useState(false);
    const [selectedImage, setSelectedImage] = useState()
    const [error, setError] = useState();
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
            price: editedProduct ? true : false,
            imageUrl: true,
            description: editedProduct ? true : false,
        },
        formIsValid: editedProduct ? true : false
    })

    useEffect(() => {
        if (error) {
            Alert.alert('Hata oluştu!', error, [{ text: 'Tamam' }]);
        }

    }, [error])

    const imageTakenHandler = async (imagePath) => {
        let photoUrl = await dispatch(
            productsActions.uploadProductImage(
                imagePath
            )
        );
        const photoUrlWithJpeg = photoUrl + '.jpeg';
        setSelectedImage(photoUrlWithJpeg);

    };

    const submitHandler = useCallback(async () => {
        if (!formState.formIsValid) {
            Alert.alert('Yanlis Input!', 'Lütfen girdiğiniz inputlari kontrol ediniz.', [{ text: 'Tamam' }]);
            return;
        }
        setIsLoading(true);
        setError(null);
        try {
            if (editedProduct) {
                await dispatch(
                    productsActions.updateProduct(
                        prodId,
                        formState.inputValues.title,
                        formState.inputValues.description,
                        selectedImage,
                        +formState.inputValues.price
                    )
                );
            } else {
                await dispatch(
                    productsActions.createProduct(
                        formState.inputValues.title,
                        formState.inputValues.description,
                        selectedImage,
                        +formState.inputValues.price
                    )
                );
            }
            props.navigation.goBack();
        } catch (error) {
            setError(error.message)
        }
        setIsLoading(false)
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

    if (isLoading) {
        return (
            <View style={styles.centered} >
                <ActivityIndicator size="large" color={Colors.accent} />
            </View>
        )
    }

    return (

        <KeyboardAvoidingView
            style={{ flex: 1 }}
            keyboardVerticalOffset={100}
        >
            <ScrollView>
                <View styles={styles.form} >
                    <ImageSelector onImageTaken={imageTakenHandler} title="" />
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
    centered: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    }

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


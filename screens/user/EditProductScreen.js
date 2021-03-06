import React, { useCallback, useEffect, useReducer, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux';
import {
    View,
    StyleSheet,
    ScrollView,
    KeyboardAvoidingView,
    Platform,
    Alert,
    ActivityIndicator,
    Image,
    Text
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
    const uploadedImage = useSelector(state =>
        state.products.uploadedImage
    )
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
            Alert.alert('Hata olu??tu!', error, [{ text: 'Tamam' }]);
        }

    }, [error])

    const imageTakenHandler = async (imagePath) => {

        dispatch(productsActions.uploadProductImage(imagePath)
        );

        setSelectedImage(uploadedImage);

    };

    const submitHandler = useCallback(async () => {
        /*    if (uploadedImage === null || uploadedImage === undefined) {
               Alert.alert('Yanlis Input!', 'Resim y??klenmedi', [{ text: 'Tamam' }]);
               return;
           } */
        if (!formState.formIsValid) {
            Alert.alert('Yanlis Input!', 'L??tfen girdi??iniz inputlari kontrol ediniz.', [{ text: 'Tamam' }]);
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
                        uploadedImage ? uploadedImage : formState.inputValues.imageUrl,
                        +formState.inputValues.price
                    )
                );
            } else {
                await dispatch(
                    productsActions.createProduct(
                        formState.inputValues.title,
                        formState.inputValues.description,
                        uploadedImage,
                        +formState.inputValues.price
                    )
                );
            }
            props.navigation.goBack();
        } catch (error) {
            setError(error.message)
        }
        setIsLoading(false)
    }, [dispatch, prodId, formState, uploadedImage]);

    useEffect(() => {
        props.navigation.setParams({ 'submit': submitHandler });
    }, [submitHandler]);

    useEffect(() => {
        return () => {
            dispatch(productsActions.clearUploadedImage())
        }
    }, [dispatch])


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
                    {/*   <Image source={{ uri: uploadedImage }} style={{ width: '100%', minHeight: 300 }} /> */}
                    <ImageSelector onImageTaken={imageTakenHandler} title="" />
                    <Input
                        id='title'
                        label='Ba??l??k'
                        errorText='L??tfen uygun bir ba??l??k girin!'
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
                        errorText='L??tfen do??ru bir fiyat de??eri girin!'
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
                        errorText='Bu alan bo?? b??rak??lamaz!'
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
        headerTitle: navData.navigation.getParam('productId') ? '??r??n D??zenleme' : '??r??n Ekleme',
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


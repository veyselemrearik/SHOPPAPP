import React, { useState, useCallback, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux';
import { View, Text, StyleSheet, ScrollView, TextInput, Platform, Alert } from 'react-native'
import { HeaderButtons, Item } from 'react-navigation-header-buttons';
import CustomHeaderButton from '../../components/UI/HeaderButton';
import * as productsActions from '../../store/actions/products';



const EditProductScreen = props => {
    const prodId = props.navigation.getParam('productId');
    const editedProduct = useSelector(state =>
        state.products.userProducts.find(prod => prod.id === prodId)
    )
    const dispatch = useDispatch();
    const [title, setTitle] = useState(editedProduct ? editedProduct.title : '');
    const [imageUrl, setImageUrl] = useState(editedProduct ? editedProduct.imageUrl : '');
    const [price, setPrice] = useState(editedProduct ? editedProduct.price.toString() : '');
    const [description, setDescription] = useState(editedProduct ? editedProduct.description : '');


    const submitHandler = useCallback(() => {
        if (editedProduct) {
            dispatch(
                productsActions.updateProduct(prodId, title, description, imageUrl, +price)
            );
        } else {
            dispatch(
                productsActions.createProduct(title, description, imageUrl, +price)
            );
        }
        props.navigation.goBack();
    }, [dispatch, prodId, title, description, imageUrl, price]);
    useEffect(() => {
        props.navigation.setParams({ 'submit': submitHandler });
    }, [submitHandler]);

    return (
        <ScrollView>
            <View styles={styles.form} >
                <View style={styles.formControl} >
                    <Text style={styles.label} >Title</Text>
                    <TextInput
                        style={styles.input}
                        value={title}
                        onChangeText={text => setTitle(text)} />
                </View>
                <View style={styles.formControl} >
                    <Text style={styles.label} >Image URL</Text>
                    <TextInput
                        style={styles.input}
                        value={imageUrl}
                        onChangeText={url => setImageUrl(url)} />
                </View>
                <View style={styles.formControl} >
                    <Text style={styles.label} >Price</Text>
                    <TextInput
                        style={styles.input}
                        value={price}
                        onChangeText={price => setPrice(price)} />
                </View>
                <View style={styles.formControl} >
                    <Text style={styles.label} >Description</Text>
                    <TextInput
                        style={styles.input}
                        value={description}
                        onChangeText={description => setDescription(description)} />
                </View>
            </View>
        </ScrollView>
    )
}


const styles = StyleSheet.create({
    form: {
        margin: 20,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center'
    },
    formControl: {
        width: '100%',
        paddingLeft: 8,
        paddingRight: 10
    },
    label: {
        fontFamily: 'openSansBold',
        marginVertical: 10
    },
    input: {
        paddingHorizontal: 2,
        paddingVertical: 5,
        borderBottomColor: '#ccc',
        borderBottomWidth: 1
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
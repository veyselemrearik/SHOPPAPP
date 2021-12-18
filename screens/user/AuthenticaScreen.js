import React, { useReducer, useCallback, useState, useEffect } from 'react';
import {
    View,
    ScrollView,
    KeyboardAvoidingView,
    StyleSheet,
    Button,
    ActivityIndicator,
    Alert
} from 'react-native';
import { useDispatch } from 'react-redux';
import Input from '../../components/UI/Input';
import Card from '../../components/UI/Card';
import Colors from '../../constants/Colors';
import { LinearGradient } from 'expo-linear-gradient';
import * as authActions from '../../store/actions/authentication'

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



const AuthenticaScreen = props => {
    const [isSingup, setIsSingup] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState();
    const dispatch = useDispatch();
    const [formState, dispatchFormState] = useReducer(formReducer, {
        inputValues: {
            email: '',
            password: ''
        },
        inputValidities: {
            email: false,
            password: false
        },
        formIsValid: false
    })
    useEffect(() => {
        if (error) {
            Alert.alert('Hata Oluştu!', error, [{ text: 'Tamam' }]);
        }
    }, [error])
    const authHandler = async () => {
        let action;
        if (isSingup) {
            action = authActions.signup(
                formState.inputValues.email,
                formState.inputValues.password
            )
        } else {
            action = authActions.login(
                formState.inputValues.email,
                formState.inputValues.password
            )
        }
        setError(null);
        setIsLoading(true);
        try {
            await dispatch(action);

        } catch (error) {
            setError(error.message);
        }

        setIsLoading(false)

    }
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
            behavior='height'
            keyboardVerticalOffset={50}
            style={styles.screen}
        >
            <LinearGradient colors={[Colors.primary, '#FAFF8F']} style={styles.gradient} >
                <Card style={styles.authContainer} >
                    <ScrollView>
                        <Input
                            id="email"
                            label="E-Mail"
                            keyboardType="email-address"
                            required
                            email
                            autoCapitalize="none"
                            errorText="Lütfen geçerli bir email adresi girin!"
                            onInputChange={inputChangeHandler}
                            initialValue=""
                        />
                        <Input
                            id="password"
                            label="Password"
                            keyboardType="default"
                            secureTextEntry
                            required
                            minLength={5}
                            autoCapitalize="none"
                            errorText="Lütfen geçerli bir şifre girin!"
                            onInputChange={inputChangeHandler}
                            initialValue=""
                        />
                        <View style={styles.buttonContainer} >
                            {
                                isLoading ?
                                    <ActivityIndicator size="small" color={Colors.primary} />
                                    : <Button title={isSingup ? 'Kaydol' : 'Giriş Yap'} color={Colors.primary} onPress={authHandler} />
                            }
                        </View>
                        <View style={styles.buttonContainer} >
                            <Button title={`${isSingup ? 'Girişe' : 'Kayıda'} Çevir`} color={Colors.accent} onPress={() => {
                                setIsSingup(prevState => !prevState);
                            }} />
                        </View>
                    </ScrollView>

                </Card>
            </LinearGradient>
        </KeyboardAvoidingView>
    )
}

AuthenticaScreen.navigationOptions = {
    headerTitle: ''
}

const styles = StyleSheet.create({
    screen: {
        flex: 1,
    },
    gradient: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    authContainer: {
        width: '80%',
        maxWidth: 400,
        maxHeight: 400,
        padding: 20
    },
    buttonContainer: {
        marginTop: 10,
        borderRadius: 10
    },
    centered: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    }
});

export default AuthenticaScreen;
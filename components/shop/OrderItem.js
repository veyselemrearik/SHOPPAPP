import React, { useState } from 'react'
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native'
import Colors from '../../constants/Colors';
import CartItem from './CartItem';
import Card from '../UI/Card';
import { MaterialIcons } from '@expo/vector-icons';

const OrderItem = props => {
    const [showDetails, setShowDetails] = useState(false)

    return (
        <Card style={styles.orderItem} >
            <View style={styles.summary} >
                <Text style={styles.totalAmount}>{props.amount.toFixed(2)} TL</Text>
                <Text style={styles.date} > {props.date} </Text>
            </View>
            <TouchableOpacity style={styles.button} onPress={() => {
                setShowDetails(prevState => !prevState)
            }} >
                <Text style={{ fontFamily: 'openSansBold', color: 'white' }} >Detay</Text>
                <MaterialIcons name={showDetails ? "keyboard-arrow-up" : 'keyboard-arrow-down'} size={24} color="white" />

            </TouchableOpacity>
            {showDetails &&
                <View style={styles.detailItems} >
                    {
                        props.items.map(cartItem => <CartItem
                            key={cartItem.productId}
                            quantity={cartItem.quantity}
                            amount={cartItem.sum}
                            title={cartItem.productTitle}
                            deletable={false}
                        />)
                    }
                </View>
            }
        </Card>
    )
}

const styles = StyleSheet.create({
    orderItem: {
        margin: 20,
        padding: 10,
        alignItems: 'center'
    },
    summary: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
        marginBottom: 20
    },
    totalAmount: {
        fontSize: 16,
        fontFamily: 'openSansBold'
    },
    date: {
        fontSize: 16,
        fontFamily: 'openSansRegular',
        color: '#888'
    },
    detailItems: {
        width: '100%'
    },
    button: {
        width: '100%',
        height: '20%',
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: Colors.accent,
        borderRadius: 100
    }
})

export default OrderItem;
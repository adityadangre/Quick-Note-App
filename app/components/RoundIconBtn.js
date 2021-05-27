import React from 'react';
import {View, StyleSheet} from 'react-native';
import colors from '../misc/colors';
import {AntDesign} from '@expo/vector-icons'

const RoundIconBtn = ({antIconName, size, color, style, onPress}) => {    
    return( 
        <AntDesign onPress={onPress} name={antIconName} size={size || 24} color={color || colors.LIGHT} style={[styles.icon, {...style}]} />
    );
}

const styles = StyleSheet.create({
    icon:{
        backgroundColor: colors.PRIMARY,
        padding:15,
        borderRadius: 50,
        elevation: 5,
    }
})

export default RoundIconBtn;
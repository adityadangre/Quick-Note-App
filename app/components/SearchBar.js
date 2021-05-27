import React from 'react';
import {View, StyleSheet, TextInput} from 'react-native';
import colors from '../misc/colors';
import {AntDesign} from '@expo/vector-icons'

const SearchBar = ({containerStyle, value, onChangeText, onClear}) => {    
    return( 
        <View style={[styles.container, { ...containerStyle}]}>
            <TextInput onChangeText={onChangeText} value={value} style={styles.searchBar} placeholder='Search here..' />
            {value ? <AntDesign style={styles.clearIcon} name="close" size={20} color={colors.PRIMARY} onPress={onClear} /> : null}
        </View>
    );
}

const styles = StyleSheet.create({
    container:{
        justifyContent: 'center'
    },
    searchBar:{
        borderWidth: 1,
        borderColor: '#6F4E3D',
        height: 40,
        borderRadius: 40,
        paddingLeft: 15,
        fontSize: 20,
    },
    clearIcon:{
        position: 'absolute',
        right: 10,       
    }
})

export default SearchBar;
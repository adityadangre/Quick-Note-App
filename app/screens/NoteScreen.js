import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {useEffect, useState} from 'react';
import {View, StyleSheet, Text, StatusBar, TouchableWithoutFeedback, Keyboard, FlatList, Dimensions} from 'react-native';
import Note from '../components/Note';
import NoteInputModal from '../components/NoteInputModal';
import NotFound from '../components/NotFound';
import RoundIconBtn from '../components/RoundIconBtn';
import SearchBar from '../components/SearchBar';
import { useNotes } from '../contexts/NoteProvider';
import colors from '../misc/colors';

const reverseData = data => {
    return data.sort((a, b) => {
      const aInt = parseInt(a.time);
      const bInt = parseInt(b.time);
      if (aInt < bInt) return 1;
      if (aInt == bInt) return 0;
      if (aInt > bInt) return -1;
    });
};

const NoteScreen = ({user, navigation}) => { 
    const [greet, setGreet] = useState('');
    const [modalVisible, setModalVisible] = useState(false)
    const {notes, setNotes, findNotes} = useNotes()
    const [searchQuery, setSearchQuery] = useState('')
    const [resultNotFound, setResultNotFound] = useState(false)

    const handleOnSubmit = async (title, desc) => {
        const note = {id: Date.now(), title, desc, time: Date.now()}
        const updatedNotes =  [...notes, note]
        setNotes(updatedNotes)
        await AsyncStorage.setItem('notes', JSON.stringify(updatedNotes))
    }

    const findGreet = () => {
        const hrs = new Date().getHours()
        if(hrs === 0 || hrs < 12) return setGreet('Morning')
        if(hrs === 1 || hrs < 17) return setGreet('Afternoon')
        setGreet('Evening')
    }

    useEffect(() => {
        findGreet()
    }, [])

    const reverseNotes = reverseData(notes)

    const openNote = note => {
        navigation.navigate('NoteDetail', { note });
    };

    const handleOnSearchInput = async (text) => {
        setSearchQuery(text);
        if(!text.trim()){
            setSearchQuery('')
            setResultNotFound(false)
            return await findNotes()
        }

        const filterNotes = notes.filter(note => {
            if(note.title.toLowerCase().includes(text.toLowerCase())){
                return note;
            }
        })

        if(filterNotes.length){
            setNotes([...filterNotes])
        }else{
            setResultNotFound(true)
        }
    }

    const handleOnClear = async () => {
        setSearchQuery('')
        setResultNotFound(false)
        await findNotes()
    }

    return( 
        <>
        <StatusBar barStyle='dark-content' backgroundColor={colors.LIGHT} />

        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>

        <View style={styles.container}>

        <Text style={styles.header}>{`Good ${greet} ${user.name}`}</Text> 

        {notes.length ? (
        <SearchBar onClear={handleOnClear} onChangeText={handleOnSearchInput} value={searchQuery} containerStyle={{ marginVertical: 15 }} />
        ) : null}

        {resultNotFound ? (<NotFound />) : 
        (<FlatList columnWrapperStyle={{ justifyContent: 'space-between', marginBottom: 15 }} numColumns={2} data={reverseNotes} keyExtractor={item => item.id.toString()} renderItem={({item}) => (
        <Note onPress={() => openNote(item)} item={item} />)} />)}

        {!notes.length ? 
        
        <View style={[ StyleSheet.absoluteFillObject, styles.emptyHeaderContainer]}>
            <Text style={styles.emptyHeader}>Add Notes</Text>
        </View> : null}

        </View>
        </TouchableWithoutFeedback>
        <RoundIconBtn onPress={()=>setModalVisible(true)} antIconName='plus' style={styles.addBtn} />
        <NoteInputModal visible={modalVisible} onClose={()=> setModalVisible(false)} onSubmit={handleOnSubmit} />
        </>
    );
}

const styles = StyleSheet.create({
    header:{
        fontSize: 25,
        fontWeight: 'bold',
        color: 'white',
        backgroundColor: '#6F4E3D',
        width: (Dimensions.get('window').width),
        height: 40,
        marginLeft: -20,
        textAlign: 'center'
    },
    container:{
        paddingHorizontal: 20,
        flex: 1,
        zIndex: 1,
        backgroundColor: '#EADABC',
    },
    emptyHeader:{
        fontSize: 30,
        textTransform: 'uppercase',
        fontWeight: 'bold',
        opacity: 0.2
    },
    emptyHeaderContainer:{
        justifyContent: 'center',
        alignItems: 'center',
        flex: 1,
        zIndex: -1
    },
    addBtn:{
        position: 'absolute',
        right: 15,
        bottom: 50,
        zIndex: 1
    }
})

export default NoteScreen;
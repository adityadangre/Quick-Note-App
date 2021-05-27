import React, { useState } from 'react';
import {View, StyleSheet, Text, ScrollView, Alert, Share, TouchableOpacity, Dimensions} from 'react-native';
import { useHeaderHeight } from '@react-navigation/stack';
import colors from '../misc/colors'
import RoundIconBtn from './RoundIconBtn';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNotes } from '../contexts/NoteProvider';
import NoteInputModal from './NoteInputModal';

const formatDate=ms=>{
    const date = new Date(ms);
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    const hrs = date.getHours();
    const min = date.getMinutes();
    const sec = date.getSeconds();

    return `${day}/${month}/${year} - ${hrs}:${min}:${sec}`;
}

const NoteDetail = props => {
    const [note, setNote] = useState(props.route.params.note)
    const headerHeight = useHeaderHeight()
    const {setNotes} = useNotes()
    const [showModal, setShowModal] = useState(false)
    const [isEdit, setIsEdit] = useState(false);

    const deleteNote = async () => {
        const result = await AsyncStorage.getItem('notes')
        let notes = []
        if(result !== null) notes = JSON.parse(result)

        const newNotes = notes.filter(n => n.id !== note.id)
        setNotes(newNotes)
        await AsyncStorage.setItem('notes', JSON.stringify(newNotes))
        props.navigation.goBack()
    }

    const displayDeleteAlert = () => {
        Alert.alert('Are you Sure!', 'This action will delete your note permanently!', [
            {
                text: 'Delete',
                onPress: deleteNote
            },
            {
                text: 'No Thanks',
                onPress: () => console.log('no thanks')
            }
        ], {
            cancelable: true
        })
    }

    const handleUpdate = async (title, desc, time) => {
        const result = await AsyncStorage.getItem('notes')
        let notes = []
        if(result !== null) notes = JSON.parse(result)

        const newNotes = notes.filter(n=>{
            if(n.id === note.id){
                n.title = title
                n.desc = desc
                n.isUpdated = true
                n.time = time
                setNote(n)
            }
            return n;
        })
        setNotes(newNotes)
        await AsyncStorage.setItem('notes', JSON.stringify(newNotes))
    }
    const handleOnClose = () => setShowModal(false)

    const openEditModal=()=>{
        setIsEdit(true)
        setShowModal(true)
    }


        const onShare = async () => {
          try {
            const result = await Share.share({
                message: note.title + " : " + note.desc
            });
            if (result.action === Share.sharedAction) {
              if (result.activityType) {
                // shared with activity type of result.activityType
              } else {
                // shared
              }
            } else if (result.action === Share.dismissedAction) {
              // dismissed
            }
          } catch (error) {
            alert(error.message);
          }
        };

    return( 
        <>
        <View style={{flex:1, backgroundColor: '#EADABC'}}>
        <ScrollView contentContainerStyle={[styles.container, {paddingTop: headerHeight}]}>
            <Text style={styles.time}>
            {note.isUpdated ? `Updated At ${formatDate(note.time)}` : `Created At ${formatDate(note.time)}`}
            </Text>
            <Text style={styles.title}>{note.title}</Text>
            <Text style={styles.desc}>{note.desc}</Text>
        </ScrollView>
        </View>
        <View style={styles.btnContainer}>
                <RoundIconBtn antIconName='delete' style={{backgroundColor: '#AE0000', marginBottom: 15}} onPress={displayDeleteAlert} />
                <RoundIconBtn antIconName='edit' onPress={openEditModal} style={{marginBottom: 15}} />
                <RoundIconBtn antIconName='sharealt' onPress={()=>onShare()} style={{backgroundColor: colors.PRIMARY}} />
        </View>
        <NoteInputModal isEdit={isEdit} note={note} onClose={handleOnClose} onSubmit={handleUpdate} visible={showModal} />
        </>
    );
}

const styles = StyleSheet.create({
    container:{
        paddingHorizontal: 15,
    },
    title:{
        fontSize: 30,
        color: colors.PRIMARY,
        fontWeight: 'bold'
    },
    desc:{
        fontSize: 20,
        opacity: 0.6,
    },
    time:{
        textAlign: 'right',
        fontSize: 12,
        opacity: 0.5
    },
    btnContainer: {
        position: 'absolute',
        right: 15,
        bottom: 50,
    },
    button:{
        backgroundColor: colors.PRIMARY,
        padding:15,
        borderRadius: 50,
        elevation: 5,
    }
})

export default NoteDetail;
import React, {useEffect, useState} from 'react';
import {View, StyleSheet, Modal, Text, StatusBar, TouchableWithoutFeedback, Keyboard, TextInput, Dimensions} from 'react-native';
import colors from '../misc/colors'
import RoundIconBtn from './RoundIconBtn'

const NoteInputModal = ({ visible, onClose, onSubmit, note, isEdit }) => { 
    const  [title, setTitle] = useState('')
    const  [desc, setDesc] = useState('')
    
    const handleModalClose=()=>{
        Keyboard.dismiss();
    }

    useEffect(()=>{
        if(isEdit){
            setTitle(note.title)
            setDesc(note.desc)
        }
    }, [isEdit])

    const handleOnChangeText = (text, valueFor) => {
        if(valueFor === 'title') setTitle(text);
        if(valueFor === 'desc') setDesc(text);
    }

    const handleSubmit = () => {
        if(!title.trim() && !desc.trim()) return onClose()

        if(isEdit){
            onSubmit(title, desc, Date.now())
        }else{
            onSubmit(title, desc)
            setTitle('')
            setDesc('')
        }   
        onClose()     
    }
    
    const closeModal = () => {
        if(!isEdit){
            setTitle('')
            setDesc('')
        }
        onClose()
    }

    return (
        <>
        <StatusBar hidden />
    <Modal visible={visible} animationType='fade'>
    <View style={styles.container}>

    <Text style={[styles.header, {marginTop: -15}]}>New Note</Text>
    
    <TextInput
            value={title}
            onChangeText={text => handleOnChangeText(text, 'title')}
            placeholder='Title'
            style={[styles.input, styles.title]}
          />
          <TextInput
            value={desc}
            multiline
            placeholder='Note'
            style={[styles.input, styles.desc]}
            onChangeText={text => handleOnChangeText(text, 'desc')}
          />

          <View style={styles.btnContainer}>
            <RoundIconBtn
                antIconName='check'
                size={15}
                onPress={handleSubmit}
            />
            { title.trim() || desc.trim() ? <RoundIconBtn
                antIconName='close'
                onPress={closeModal}
                size={15}
                style={{ marginLeft: 15 }}
            /> : null}
          </View>
            
    </View>

    <TouchableWithoutFeedback onPress={handleModalClose}>
          <View style={[styles.modalBG, StyleSheet.absoluteFillObject]} />
    </TouchableWithoutFeedback>
    </Modal>
    </>
    )
}

const styles = StyleSheet.create({
    input:{
        borderBottomWidth: 2,
        borderBottomColor: colors.PRIMARY,
        fontSize: 20,
        color: colors.DARK
    },
    container:{
        paddingHorizontal: 20,
        paddingTop: 15,
        backgroundColor: '#EADABC',
        flex: 1
    },
    title:{
        height: 40,
        marginBottom: 15,
        fontWeight: 'bold'
    },
    desc:{
        height: 200
    },
    modalBG:{
        flex:1,
        zIndex: -1,
    },
    btnContainer:{
        flexDirection: 'row',
        justifyContent: 'center',
        paddingVertical: 15
    },
    header:{
        fontSize: 25,
        fontWeight: 'bold',
        color: 'white',
        backgroundColor: '#6F4E3D',
        width: (Dimensions.get('window').width),
        height: 40,
        marginLeft: -20,
        textAlign: 'center',
        marginBottom: 20
    },
})

export default NoteInputModal;
import React from 'react';
import {Text, Title, Icon, Button } from 'native-base';
import { StyleSheet, Image, View, Modal } from 'react-native'; 

const SortModal = (props) => {
    return(
            <Modal
            transparent={true}
            style={styles.modal}
            visible={props.visible}
            animationType={'slide'}
            onRequestClose={() => props.closeModal()}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.innerContainer}>
                        <Text style={{fontWeight:'bold', marginBottom: 30, marginLeft: 10}}>Sort Events:</Text>
                        <Button transparent full onPress={()=>props.sortChange('recent')} style={styles.sortInnerButton}>
                            {props.sortBy === 'recent' ? 
                                <Icon name='ios-checkmark-circle' style={styles.sortIconEnabled} /> : <Icon name='ios-checkmark-circle-outline' style={styles.sortIconDisabled} />
                            }
                            <Text uppercase={false} style={{textAlign:'left'}}>Recent</Text>
                        </Button>
                        <Button transparent full onPress={()=>props.sortChange('popular')} style={styles.sortInnerButton}>
                            {props.sortBy === 'popular' ? 
                                <Icon name='ios-checkmark-circle' style={styles.sortIconEnabled} /> : <Icon name='ios-checkmark-circle-outline' style={styles.sortIconDisabled} />
                            }
                            <Text uppercase={false} style={{textAlign:'left'}}>Popular</Text>
                        </Button>
                    </View>
                </View>
            </Modal>
    );
}

const styles = StyleSheet.create({
    modalContainer:{
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
        //alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.4)'
    },
    innerContainer:{
        margin: 15,
        padding: 20,
        backgroundColor: '#fff',
        borderRadius: 5
    },
    sortInnerButton:{
        justifyContent: 'flex-start'
    },
    sortIconDisabled:{
        fontSize: 18,
        color: '#aaa'
    },
    sortIconEnabled:{
        fontSize: 18,
        color:'#e76d2a'
    },
});


export default SortModal;
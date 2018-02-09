import React from 'react';
import {Text, Title, Icon, Button } from 'native-base';
import { StyleSheet, Image, View, Modal } from 'react-native'; 

const DateModal = (props) => {
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
                        <Text style={{fontWeight:'bold', marginBottom: 30, marginLeft: 10}}>Select Date:</Text>
                        <Button transparent full onPress={()=>props.dateChange('today')} style={styles.sortInnerButton}>
                            {props.dateBy === 'today' ? 
                                <Icon name='ios-checkmark-circle' style={styles.sortIconEnabled} /> : <Icon name='ios-checkmark-circle-outline' style={styles.sortIconDisabled} />
                            }
                            <Text uppercase={false} style={{textAlign:'left'}}>Today</Text>
                        </Button>
                        <Button transparent full onPress={()=>props.dateChange('tomorrow')} style={styles.sortInnerButton}>
                            {props.dateBy === 'tomorrow' ? 
                                <Icon name='ios-checkmark-circle' style={styles.sortIconEnabled} /> : <Icon name='ios-checkmark-circle-outline' style={styles.sortIconDisabled} />
                            }
                            <Text uppercase={false} style={{textAlign:'left'}}>Tomorrow</Text>
                        </Button>


                        <Button transparent full onPress={()=>props.dateChange('this_week')} style={styles.sortInnerButton}>
                            {props.dateBy === 'this_week' ? 
                                <Icon name='ios-checkmark-circle' style={styles.sortIconEnabled} /> : <Icon name='ios-checkmark-circle-outline' style={styles.sortIconDisabled} />
                            }
                            <Text uppercase={false} style={{textAlign:'left'}}>This Week</Text>
                        </Button>
                        <Button transparent full onPress={()=>props.dateChange('this_month')} style={styles.sortInnerButton}>
                            {props.dateBy === 'this_month' ? 
                                <Icon name='ios-checkmark-circle' style={styles.sortIconEnabled} /> : <Icon name='ios-checkmark-circle-outline' style={styles.sortIconDisabled} />
                            }
                            <Text uppercase={false} style={{textAlign:'left'}}>This Month</Text>
                        </Button>
                        <Button transparent full onPress={()=>props.dateChange('next_month')} style={styles.sortInnerButton}>
                            {props.dateBy === 'next_month' ? 
                                <Icon name='ios-checkmark-circle' style={styles.sortIconEnabled} /> : <Icon name='ios-checkmark-circle-outline' style={styles.sortIconDisabled} />
                            }
                            <Text uppercase={false} style={{textAlign:'left'}}>Next Month</Text>
                        </Button>
                        <Button transparent full onPress={()=>props.dateChange('all_time')} style={styles.sortInnerButton}>
                            {props.dateBy === 'all_time' ? 
                                <Icon name='ios-checkmark-circle' style={styles.sortIconEnabled} /> : <Icon name='ios-checkmark-circle-outline' style={styles.sortIconDisabled} />
                            }
                            <Text uppercase={false} style={{textAlign:'left'}}>All Time (Next 90 Days)</Text>
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


export default DateModal;
import React, { PureComponent } from 'react';
import { Container, Content, Body, Title, Button, Icon  } from 'native-base';
import { StyleSheet,  Image, Text, View, TouchableOpacity, ImageBackground } from 'react-native'; 
import { dateDifference, getDateVerb, monthName, getHours, getAddress, getWeek } from '../../helpers/index';

class EventCardSmall extends PureComponent {

    constructor(props){
        super(props);
    }


    renderEventDate = (date) => {
        const thedate = <Text style={{fontSize: 13,fontWeight: 'bold'}}>{`${date.getDate()}${getDateVerb(date)}`}</Text>;
        return(
            <Text>
                {date &&  thedate} {date &&  `${monthName(date.getMonth()).slice(0, 3)}`}
            </Text>
        );
    }

    render(){
        //console.log('FlatList Event: ',event); //navigation, event, active cardPressed
        //console.log(this.props);
        const {name, id, start_time, end_time, place, cover, interested_count } = this.props.event;
        var address = getAddress(place.name && place.name, place.location && place.location.street !== undefined ? place.location.street : '' , place.location && place.location.city !== undefined ? place.location.city : '' );
        let startDate = start_time && new Date(start_time.iso);
        let endDate = end_time && new Date(end_time.iso);
        let eventRegion = {
            latitude: place.location && place.location.latitude,
            longitude: place.location && place.location.longitude,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
        }
        //console.log(this.props.active, id, this.props.active === id ? 'Matched Active Event' : 'Not Active Event');
        return(
            <TouchableOpacity activeOpacity={0.8} onPress={() =>this.props.cardPressed(id, eventRegion)}>
                <View key={id} style={this.props.active === id ? styles.eventCardAtive : styles.eventCard}>
                    <View style={styles.mapEventLeft}>
                        {this.props.active === id && <Button style={styles.eventButton} onPress={()=> this.props.navigation.navigate("Event", {event: this.props.event})}><Icon name="md-exit"/></Button>}
                        {cover ? <Image style={styles.mapEventImage} source={{uri: cover}} /> : <ImageBackground source={require('../../assets/splash.png')} style={styles.mapEventFakeImage} />}
                    </View>
                    <View style={styles.mapEventRight}>
                        <Text style={styles.mapEventTitle} numberOfLines={2}>{name}</Text>
                        <View style={{flex:1, flexDirection:'row'}}>
                            <Text style={styles.mapDateText}><Icon style={styles.mapDateIcon} name="ios-timer-outline" /> {this.renderEventDate(startDate)} - {this.renderEventDate(endDate)}</Text>
                            <Text style={styles.mapInterestedText}><Icon style={styles.mapInterestedIcon} name="ios-people-outline" /> {interested_count && interested_count}</Text>
                        </View>
                        <View>
                            <Text style={styles.mapAddrText} ><Icon style={styles.mapAddrIcon} name="ios-pin-outline" /> {address}</Text>
                        </View>
                    </View>
                </View>
            </TouchableOpacity>
        );
    }

}

const styles = StyleSheet.create({
    eventCard:{
        flex:1, 
        flexDirection:'row', 
        marginTop: 0,
        padding:15,
        paddingBottom: 20,
        borderBottomWidth: 1,
        borderColor: '#eee',
        width: '100%',
        height:null,
        minHeight: 120,
        overflow:'hidden'
    },
    eventCardAtive:{
        flex:1, 
        flexDirection:'row', 
        marginTop: 0,
        padding:15,
        paddingBottom: 20,
        borderColor: 'red',
        width: '100%',
        height:null,
        minHeight: 120,
        backgroundColor: '#f4f4f4',
        borderBottomWidth: 1,
        borderLeftWidth: 4,
        borderLeftColor:'#bbb',
        borderColor: '#eee',
    },
    mapEventLeft:{
        width: '30%',
        marginRight: '5%',
        position: 'relative'
    },
    mapEventRight:{
        width: '65%'
    },
    mapEventImage:{
        width: 100, 
        flex: 1,
        height: 50,
        maxHeight:100,
    },
    mapEventFakeImage:{
        width: 100, 
        flex: 1,
        height: 50,
        maxHeight:100,
        backgroundColor: '#eee'
    },
    eventButton:{
        position:'absolute',
        zIndex:2,
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        width:100,
        height:95,
        paddingLeft:25,
        paddingTop:10
    },
    mapEventTitle:{
        color: '#666',
        fontWeight: 'bold',
        marginTop: -3,
        marginBottom: 5,
        height:38
    },
    mapDateText:{
        fontSize: 13,
        marginRight: 10,
        color: '#999',
        marginBottom: 5
    },
    mapDateIcon:{
        fontSize: 13,
        color: '#999'
    },
    mapInterestedText:{
        fontSize: 13,
        color: '#999'
    },
    mapInterestedIcon:{
        fontSize: 15,
        color: '#999'
    },
    mapAddrText:{
        fontSize: 13,
        color: '#999'
    },
    mapAddrIcon:{
        fontSize: 13,
        color: '#999'
    }
});


export default EventCardSmall;
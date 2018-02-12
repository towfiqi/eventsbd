import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Container, Content, Button, Icon } from 'native-base';
import { StyleSheet, Image, Text, View, AsyncStorage, TouchableOpacity, ActivityIndicator, ImageBackground } from 'react-native'; 
import { LinearGradient, MapView } from 'expo';
import { dateDifference, getDateVerb, monthName, getHours, getAddress } from '../../helpers/index';
import UserEvents from '../UserEvents/UserEvents';
import { setUserEvents } from '../../actions/userActions';


class Event extends Component {

    constructor(props){
        super(props);
        this.state = {description:'', favorite: false, faving: false}
    }

    async componentWillMount(){
        const { id } = this.props.navigation.state.params.event || {};
        //Check if User Favorite
        var userEvents = this.props.userData.events;
        var favorite = userEvents && userEvents.includes(id) ? true : false;
        this.setState({favorite:favorite });
        //Get Event Description
        const token = await AsyncStorage.getItem('fbToken');
        const response = await fetch(`https://graph.facebook.com/${id}?access_token=${token}`);
        const fetchedDesc = await JSON.parse(response._bodyInit).description
        this.setState({description: fetchedDesc ? fetchedDesc : 'No Description Given'});
    }

    renderEventDate = (date) => {
        const thedate = <Text style={{fontSize: 14,fontWeight: 'bold'}}>{`${date.getDate()}${getDateVerb(date)}`}</Text>;
        return(
            <Text>
                {date &&  thedate} {date &&  `${monthName(date.getMonth()).slice(0, 3)} ${date.getFullYear().toString().slice(-2)}`}
            </Text>
        );
    }

     favEvent = async () => {
        this.setState({faving: true});
        const eventID = this.props.navigation.state.params.event.id;
        var newEvents = [...this.props.userData.events];
        //get current events from the store.
        if(this.props.userData.events.includes(eventID)){  
            newEvents.pop(eventID);
        }else{ 
            newEvents.push(eventID);
        }
        this.props.setUserEvents(newEvents);
    }

    componentWillReceiveProps(nextProps){
        //console.log(nextProps.favorite, this.props.favorite);
        const userEvents = nextProps.userData.events;
        var favorite = userEvents && userEvents.includes(this.props.navigation.state.params.event.id) ? true : false;
        this.setState({favorite:favorite, faving:false});
    }

    render(){
        const {name, id, start_time, end_time, place, cover, interested_count } = this.props.navigation.state.params.event  || {};
        var address = getAddress(place.name && place.name, place.location && place.location.street !== undefined ? place.location.street : '' , place.location && place.location.city !== undefined ? place.location.city : '' );
        let startDate = start_time && new Date(start_time.iso);
        let endDate = end_time && new Date(end_time.iso);
        var duration = start_time && parseInt((endDate - startDate) / (1000 * 60 * 60 * 24)) + 1;
        var dateDiff = '';
        if(endDate < new Date()){
            dateDiff = 'Event Ended!';
        }else{
            if(startDate > new Date()){
                //console.log(startDate, new Date());
                dateDiff = 'Starts '+ dateDifference(new Date(), new Date(startDate));
            }
            if(startDate < new Date()){
                dateDiff = 'Onging, Ends '+ dateDifference(new Date(), new Date(endDate));
            }
        }


        return(
            <Container>
                <Content style={styles.eventBody}>
                    <Content style={styles.coverPhoto}>
                    
                        <Button style={styles.backButton} transparent onPress={() => this.props.navigation.goBack(null)}>
                            <Icon style={styles.backButtonIcon} name='ios-arrow-round-back' />
                        </Button>

                        <Text style={styles.dateDiff}><Icon style={styles.dateDiffIcon}  name="ios-send" /> {dateDiff}</Text>
                        <LinearGradient colors={['transparent', '#000000']} style={styles.cardItemImageShadow} />
                        {cover ? <Image style={styles.cardItemImage} source={{uri: cover}} /> : <ImageBackground source={require('../../assets/splash.png')} style={styles.cardItemFakeImage} />}
                    </Content>


                    <TouchableOpacity onPress={this.favEvent} style={styles.interstButton}>
                        <View>
                        {this.state.faving === true ? <ActivityIndicator size="small" color="#cccccc" style={styles.favIndicator} />
                        :
                            this.state.favorite ? <Icon style={styles.interstButtonIcon} name="ios-checkmark-circle" />
                            :<Icon style={styles.interstButtonIcon} name="ios-heart-outline" /> 
                        }
                        </View>
                    </TouchableOpacity>
                

                    <View style={{flex: 1, marginTop: 190, padding: 30}}>
                        <Text style={styles.eventTitle}>{name}</Text>

                        <View style={styles.infoBlocks}>
                            <View style={styles.dateBlock}>
                                <View><Icon style={styles.dateblockIcon} name="ios-timer-outline" /></View>
                                <View>
                                    <Text style={styles.dateblockDate}>{this.renderEventDate(startDate)}  --  {this.renderEventDate(endDate)}</Text>
                                    <Text style={styles.dateblockTime}>{startDate.getUTCHours() === endDate.getUTCHours() ? 'Hrs Not Given' : getHours(startDate) +' - '+ getHours(endDate)} . {duration} day Event</Text>
                                </View>
                            </View>
                            <View style={styles.interestedBlock}>
                                <View><Icon style={styles.instblockIcon} name="ios-people-outline" /></View>
                                <View>
                                    <Text style={styles.instblockCount}>{interested_count && interested_count}</Text>
                                    <Text style={styles.instblockVerb}>Interested</Text>
                                </View>
                            </View>
                        </View>

                        <View style={styles.bodyContent}>
                        {this.state.description ? <Text selectable style={styles.bodyContentText}>{this.state.description}</Text>
                        :
                        <ActivityIndicator size="small" color="#cccccc" style={styles.favIndicator} />
                        }
                            
                        </View>
                        {/* <Text>{start_time.iso}</Text> */}

                        <View style={styles.bodyLocation}>
                            <Text style={styles.bodyLocationText}>
                                <Icon style={styles.bodyLocationIcon} name="ios-pin-outline" /> {address}
                            </Text>
                        </View>

                    </View>

                    <View>
                        {place.location && place.location.latitude && place.location.longitude &&
                        <MapView
                            style={{ flex: 1, width: '100%', height: 220 }}
                            initialRegion={{
                                latitude: place.location.latitude,
                                longitude: place.location.longitude,
                                latitudeDelta: 0.0222,
                                longitudeDelta: 0.0321,
                            }}
                        >
                            <MapView.Marker
                            coordinate={{latitude:place.location.latitude, longitude:place.location.longitude}}
                            title={place.name}
                            description={address}
                            />
                        </MapView>
                        }
                    </View>

                </Content>
            </Container>
        );
    }
}

const styles = StyleSheet.create({
    header:{
        backgroundColor: 'transparent',
        elevation: 0,
        width: '100%'
    },
    headerLeft:{

    },
    backButton:{
        position:'absolute',
        zIndex: 6,
        left:-5,
        top: 30,
        backgroundColor: 'rgba(255,255,255,0.8)',
        padding:0,
        borderRadius: 5
    },
    backButtonIcon:{
        color: '#333',
        fontSize: 30
    },
    coverPhoto:{
        position: 'absolute',
        //overflow: 'visible',
        zIndex: 1,
        height: 240,
        width: '100%'
    },
    cardItemImage:{
        width: null, 
        flex: 1,
        height: 200,
        backgroundColor: 'transparent',
    },
    cardItemFakeImage:{
        width: '100%', 
        flex: 1,
        height: 200,
        backgroundColor: 'transparent',
    },
    cardItemImageShadow:{
        backgroundColor: 'transparent',
        width:'100%',
        height:120,
        opacity: 0.5,
        position: 'absolute',
        zIndex: 2,
        bottom:0,
    },
    dateDiff:{
        position: 'absolute',
        zIndex: 3,
        color: '#fff',
        fontSize: 13,
        bottom : 7,
        left:20
    },
    dateDiffIcon:{
        color: '#fff',
        fontSize: 16
    },
    eventBody:{
        flex:1,
        //marginTop: 140,
        //padding: 25,
        backgroundColor: '#fff'
    },
    eventTitle:{
        textAlign: 'left',
        color: '#666',
        fontSize:15,
        lineHeight: 26,
        fontWeight: '600',
        marginTop: 5,
        marginBottom: 30,
    },
    infoBlocks:{
        flex:1,
        flexDirection: 'row'
    },
    dateBlock:{
        width: '60%',
        marginRight: '5%',
        flexDirection: 'row'
    },
    dateblockIcon:{
        fontSize: 26,
        paddingTop: 3,
        paddingRight: 10,
        color: '#ddd'
    },
    dateblockDate:{
        fontSize: 12,
        color: '#888'
    },
    dateblockTime:{
        fontSize: 13,
        color: '#bbb'
    },
    interestedBlock:{
        flex:1,
        flexDirection: 'row'
    },
    instblockIcon:{
        fontSize: 28,
        paddingTop: 3,
        paddingRight: 10,
        color: '#ddd'
    },
    favIndicator:{
        paddingTop: 3,
        paddingRight: 2,
    },
    instblockCount:{
        fontSize: 14,
        fontWeight: 'bold',
        color: '#888'
    },
    instblockVerb:{
        fontSize: 13,
        color: '#bbb'
    },
    bodyContent:{
        marginTop: 30
    },
    bodyContentText:{
        fontSize: 14,
        lineHeight: 26,
        color: '#777'
    },
    interstButton:{
        padding: 13,
        borderRadius: 100,
        elevation: 2,
        position: 'absolute',
        width:50,
        height:50,
        zIndex: 8,
        backgroundColor: '#fff',
        top: 175,
        right: 20
    },
    interstButtonIcon:{
        fontSize: 27,
        color: '#e75d37'
    },
    bodyLocation:{
        marginTop:30,
        paddingTop:10,
        borderTopWidth: 1,
        borderColor: '#eee'
    },
    bodyLocationText:{
        color: '#999',
        fontSize: 13,
        lineHeight: 26
    },
    bodyLocationIcon:{
        color: '#999',
        fontSize: 14
    }
});

const mapoStateToProps = (state) => {
    return {
        userData: state.user
    }
}

export default connect(mapoStateToProps, {setUserEvents})(Event);
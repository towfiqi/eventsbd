import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { Text, Title, Card, CardItem, Body, Icon } from 'native-base';
import { StyleSheet, Image, View, TouchableOpacity, ActivityIndicator } from 'react-native'; 
import {monthName, getAddress, dateDifference, getDateVerb} from '../../helpers/index'
import { setUserEvents } from '../../actions/userActions';

class EventCard extends PureComponent {
    constructor(props){
        super(props);
        this.state = {favorite: false}
    }

    componentDidMount(){
        //console.log('Event Props===========>',this.props);
        //console.log(this.props);
        this.setState({favorite: this.props.favorite, faving: false});
    }

    favEvent = async () => {
        this.setState({faving: true});
        const eventID = this.props.event.id;
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
        if (nextProps.favorite !== this.props.favorite) {
            //console.log('Event Fav Changed', this.props.event.name);
            return this.setState({favorite: !this.state.favorite, faving: false});
        }
    }

    render(){
        const {name, start_time, end_time, place, interested_count, cover, id} = this.props.event;
        let startDate = start_time && new Date(start_time.iso);
        let endDate = end_time && new Date(end_time.iso);
        var duration = start_time && parseInt((endDate - startDate) / (1000 * 60 * 60 * 24)) + 1;
        let day = duration > 1 ? 'Days' : 'Day';
        var dateDiff = ''; 
        if(startDate > new Date()){
            dateDiff = 'Starts '+ dateDifference(new Date(), new Date(startDate));
        }
        if(startDate < new Date()){
            dateDiff = 'Onging, Ends '+ dateDifference(new Date(), new Date(endDate));
        }
        

        return(
                <Card style={styles.card}>

                    <TouchableOpacity onPress={this.favEvent} style={styles.interstButton} activeOpacity={1}>
                        <View>
                            {this.state.faving === true ? <ActivityIndicator size="small" color="#cccccc" style={styles.favIndicator} />
                            :
                                this.props.favorite ? <Icon style={styles.interstButtonIcon} name="ios-checkmark-circle" />
                                :<Icon style={styles.interstButtonIcon} name="ios-heart-outline" /> 
                            }
                            <View style={styles.interstButtonShape} />
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity activeOpacity={0.9} onPress={() => this.props.navigation.navigate("Event", {event: this.props.event})}>
                        <CardItem style={styles.cardItemHead} cardBody>
                            
                                {/* <LinearGradient colors={['transparent', '#000000']} style={styles.cardItemImageShadow} /> */}
                                <Image style={styles.cardItemImage} source={{uri: cover}} />
                            
                        </CardItem>
                    </TouchableOpacity>
                    <CardItem style={styles.cardItemBody}>
                        <Body>
                            <Title style={styles.cardItemTitle}>{name}</Title>
                            <View style={styles.cardItemInfo}>
                                <Icon style={styles.Icon} name="ios-timer-outline" />
                                {/* <Text style={styles.cardItemDate}>{`${start_time && startDate.getDate()}th ${monthName(startDate.getMonth())}, ${startDate.getFullYear()} / ${dayname(startDate.getDay())}`}</Text> */}
                                <Text style={styles.cardItemDate}>{dateDiff}</Text>
                            </View>
                            <View style={styles.cardItemInfo}>
                                <Icon style={styles.Icon} name="ios-pin-outline" />
                                <Text style={styles.cardItemPlace} numberOfLines={1}> {getAddress(place.name && place.name, place.location && place.location.street !== undefined ? place.location.street : '' , place.location && place.location.city !== undefined ? place.location.city : '' )}</Text>
                            </View>
                        </Body>
                    </CardItem>
                    <CardItem footer style={styles.cardItemFooter}>
                        <View style={styles.infoStartDateBlock}>
                            <Text style={styles.infoBlockTop}>{`${startDate && startDate.getDate()}${getDateVerb(startDate)}`}</Text>
                            <Text style={styles.infoBlockBottom}>{startDate && monthName(startDate.getMonth())}</Text>
                            <Icon style={styles.dateDash} name="md-remove" />
                        </View>
                        <View style={styles.infoEndDateBlock}>
                            <Text style={styles.infoBlockTop}>{`${endDate && endDate.getDate()}${getDateVerb(endDate)}`}</Text>
                            <Text style={styles.infoBlockBottom}>{endDate && monthName(endDate.getMonth())}</Text>
                        </View>
                        <View style={styles.infoBlock}>
                            <Text style={styles.infoBlockTop}>{duration} {day}</Text>
                            <Text style={styles.infoBlockBottom}>Duration</Text>
                        </View>
                        <View style={styles.infoBlock}>
                            <Text style={styles.infoBlockTop}>{interested_count && interested_count}</Text>
                            <Text style={styles.infoBlockBottom}>Interested</Text>
                        </View>
                    </CardItem>
                </Card>
        );
        
    }
}


const styles= StyleSheet.create({
    card:{
        marginTop:10,
        marginBottom:10,
        borderRadius:5,
        //borderColor: '#000',
        //borderBottomWidth: 2,
        //shadowColor: '#000',
        //shadowOffset: { width: 2, height: 2 },
        //shadowOpacity: 0.2,
        //shadowRadius: 10,
        elevation: 0,
        flex:1,
        marginLeft: 5,
        marginRight: 5
    },
    cardItemHead:{
        borderTopLeftRadius: 5,
        borderTopRightRadius: 5,
        position: 'relative',
        backgroundColor: '#000',
        padding: 0
    },
    cardItemImage:{
        width: null, 
        flex: 1,
        height: 200,
        backgroundColor: 'transparent',
        borderTopLeftRadius: 5,
        borderTopRightRadius: 5,
        //marginTop: 5
    },
    cardItemImageShadow:{
        backgroundColor: 'transparent',
        width:'100%',
        height:180,
        opacity: 0.3,
        position: 'absolute',
        zIndex: 2,
        bottom:0,
        //marginLeft: 17
    },
    interstButton:{
        position: 'absolute',
        zIndex:1,
        width:70,
        height:70
    },
    interstButtonShape:{
        position: 'absolute',
        width: 0,
        height: 0,
        backgroundColor: 'transparent',
        borderStyle: 'solid',
        borderRightWidth: 70,
        borderTopWidth: 70,
        borderRightColor: 'transparent',
        borderTopColor: 'white'
    },
    interstButtonIcon:{
        position: 'absolute',
        marginTop: 12,
        paddingLeft: 12,
        color: '#e57623',
        fontSize: 20,
        zIndex: 2
    },
    favIndicator:{
        position:'absolute',
        zIndex:4, 
        marginTop:12, 
        marginLeft:10
    },
    cardItemBody:{

    },
    cardItemTitle:{
        color: '#333',
        fontSize: 15,
        marginBottom: 15
    },
    cardItemInfo:{
        flex:1,
        flexDirection: 'row'
    },
    cardItemDate:{
        color: '#888',
        marginBottom: 12,
        fontSize: 13
    },
    cardItemPlace:{
        color: '#888',
        marginBottom: 8,
        fontSize: 13
    },
    Icon:{
        fontSize: 18,
        color: '#888',
        marginRight: 7,
    },
    cardItemFooter:{
        flex: 1,
        justifyContent: 'center',
        borderTopWidth: 1,
        borderColor: '#eee',
        borderRadius:0,
        backgroundColor: 'transparent',
        //borderBottomLeftRadius:5,
        //borderBottomRightRadius:5,
    },
    infoBlock:{
        width: '22%',
        flex:1,
        //marginLeft: 15,
    },
    infoStartDateBlock:{
        width: '28%',
        marginLeft: -10,
        position:'relative',
        overflow: 'visible'
    },
    infoEndDateBlock:{
        flex:1,
        width: '28%',
        borderRightWidth: 1,
        marginLeft: 0,
        paddingRight: 5,
        borderColor: '#eee'
    },
    dateDash:{
        position:'absolute',
        marginLeft: '92%',
        color: '#ddd'
    },
    infoBlockTop:{
        textAlign: 'center',
        fontWeight: 'bold',
        color: '#a6a6a6',
        fontSize: 12
    },
    infoBlockBottom:{
        textAlign: 'center',
        color: '#a6a6a6',
        fontSize: 11
    }

});

const mapStateToProps = (state) => {
    return {
      userData: state.user
    }
  }

export default connect(mapStateToProps, {setUserEvents})(EventCard);
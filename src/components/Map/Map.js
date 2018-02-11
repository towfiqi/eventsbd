import React, { Component } from 'react';
import { Container, Content, Tab, Tabs, TabHeading } from 'native-base';
import { StyleSheet, FlatList, Text, View, ActivityIndicator } from 'react-native'; 
import { MapView } from 'expo';
import { getWeek } from '../../helpers/index';
import keys from '../../../keys';
import EventCardSmall from '../Events/EventCardSmall';


class Map extends Component {

    constructor(props){
        super(props);
        this.state = {
            routeLoaded: false, 
            mapLoaded: false,
            eventsLoaded: false,
            active:0,
            today: [], 
            tomorrow: [], 
            this_week:[], 
            date:'today',
            initialRegion:{
                latitude: 23.736633498771,
                longitude: 90.394569558888,
                latitudeDelta: 0.1122,
                longitudeDelta: 0.0621,
            }
        }
    }

    componentDidMount(){
        //console.log('Event Props===========>',this.props);
        // this._sub = this.props.navigation.addListener(
        //     'didFocus',
        //     console.log('This Should Only Show up when Map is focused!')
        //   );
        
        //if(this.props.navigation.state.key === 'Map'){
            //console.log('Map Mounted!!', this.props.navigation.state);
            this.setState({loaded:true});
            setTimeout( () => {
                this.fetchMapEvents();
            }, 5000);
            
        //}
    }


    fetchMapEvents = (date='today') => {
        this.setState({eventsLoaded:false});
        var order = '-interested_count'; var query;
        if(date === 'today'){
            var qToday = new Date(); var qTodayYear = qToday.getFullYear(); var qTodayMonth = ("0" + (qToday.getMonth() + 1)).slice(-2); var qTodayDate =  ("0" + (qToday.getDate())).slice(-2); 
            query = `&where={"end_time":{"$gte":{"__type":"Date","iso":"${qTodayYear}-${qTodayMonth}-${qTodayDate}T23:00:00.000Z"}}, "start_time":{"$lte":{"__type":"Date","iso":"${qTodayYear}-${qTodayMonth}-${qTodayDate}T00:00:00.000Z"}}}`
        }
        if(date === 'tomorrow'){
            var qTomorrow = new Date(); 
            qTomorrow.setDate(qTomorrow.getDate() + 1);
            var qTomorrowYear = qTomorrow.getFullYear(); 
            var qTomorrowMonth = ("0" + (qTomorrow.getMonth() + 1)).slice(-2); 
            var qTomorrowDate = ("0" + (qTomorrow.getDate())).slice(-2); 
            query = `&where={"end_time":{"$gte":{"__type":"Date","iso":"${qTomorrowYear}-${qTomorrowMonth}-${qTomorrowDate}T23:00:00.000Z"}}, "start_time":{"$lte":{"__type":"Date","iso":"${qTomorrowYear}-${qTomorrowMonth}-${qTomorrowDate}T00:00:00.000Z"}}}`
        }
        if(date === 'this_week'){
            query = `&where={"end_time":{"$gte":{"__type":"Date","iso":"${getWeek(new Date(), true)[0]}"}}, "start_time":{"$lte":{"__type":"Date","iso":"${getWeek(new Date(), true)[1]}"}}}`;
        }

        fetch(`https://parseapi.back4app.com/classes/Events?limit=200&count=1&order=`+order+query,{ 
            method:'get',
            headers : {
                'Content-Type': 'application/x-www-form-urlencoded',
                'X-Parse-REST-API-Key': keys.apiKey,
                'X-Parse-Application-Id': keys.appID
            }
            
        }).then((res)=> {
            const {results, count} =  JSON.parse(res._bodyInit);
            console.log('Map Events',count, date);
            const theEvents = results.filter( (event) => {
                if(!event.place.location){ return }
                if(!event.place.location.latitude || !event.place.location.longitude){ return }
                return event; 
            });
            this.setState({ [date]: theEvents, eventsLoaded: true});

            // var markers = []
            // if(date === 'today'){ markers = this.state.today.map((event)=> event.id.toString() )};
            // if(date === 'tomorrow'){ markers = this.state.tomorrow.map((event)=> event.id.toString() )};
            // if(date === 'this_week'){ markers = this.state.this_week.map((event)=> event.id.toString() )};
            // //console.log(markers);
            // this.refs.map.fitToSuppliedMarkers(markers, true);
        });
    }

    tabChange = (tab) => {
        var date;
        if(tab === 1){ date = 'tomorrow'}else if(tab === 2){date = 'this_week'}else{date = 'today'}
        //console.log('Tab Pressed',tab,date);
        //console.log(this.state[date].length);
        this.setState({date:date});
        if(this.state[date].length > 0) return;
        //this.setState({events:[]});
        return this.fetchMapEvents(date);
    }

    getItemLayout = (data, index) => (
        { length: 130, offset: 130 * index, index }
      );

    onMarkerPress = (id, index, latlng) => {
        var newlatlng = { latitude: latlng.latitude && latlng.latitude, longitude: latlng.longitude && latlng.longitude,latitudeDelta: 0.0922, longitudeDelta: 0.0421 }
        this.setState({active: id, initialRegion:newlatlng});
        this.flatListRef.scrollToIndex({animated: true, index: index});
    }

    renderMarkers = (events=this.state.today) => {
        if(this.state.date === 'today'){ events = this.state.today; }
        if(this.state.date === 'tomorrow'){ events = this.state.tomorrow; }
        if(this.state.date === 'this_week'){ events = this.state.this_week; }
        return (events.map((event, index) => {
            //console.log(event.id, event.place.location);
            var latlng ={latitude:event.place.location.latitude,longitude: event.place.location.longitude};

                if(event.id === this.state.active){
                    return <MapView.Marker identifier={event.id.toString()} onPress={()=>this.onMarkerPress(event.id, index, latlng)} key={event.id} coordinate={latlng} /> 
                }else{
                    return <MapView.Marker identifier={event.id.toString()} image={require('../../assets/pin.png')} onPress={()=>this.onMarkerPress(event.id, index, latlng)} key={event.id} coordinate={latlng} />
                }
            }
        ))
    }


    onEventPress = (id, eventRegion) => {
        this.setState({active: id}); 
        return this.refs.map.animateToRegion(eventRegion);
    }

    renderEvent = ({item}) => {
        //console.log('FlatList Event: ',event);
        return <EventCardSmall navigation={this.props.navigation} event={item} active={this.state.active} cardPressed={this.onEventPress} />;
    }

    render(){
        return(
            <Container>

                <Content>
                    {this.state.loaded && 
                        <MapView
                        ref="map"
                        style={{ flex: 1, width: '100%', height: 380 }}
                        onLayout={()=> this.setState({mapLoaded:true})}
                        initialRegion={this.state.initialRegion}
                        //region={this.state.initialRegion}
                        >   
                            { this.state.mapLoaded && this.renderMarkers() }
                        </MapView>
                    }

                </Content>
                <View style={{ flex: 1, width: '100%'}}>
                    <Tabs 
                    style={styles.tabs} 
                    initialPage={0} 
                    onChangeTab={({ i })=> this.tabChange(i)}
                    tabBarUnderlineStyle={ {backgroundColor: '#f65857'}}
                    tabBarBackgroundColor='#ffffff'
                    >
                        <Tab heading={ <TabHeading style= {{backgroundColor: 'white'}}><Text>Today</Text></TabHeading>}>
                            <View style={styles.tabInner}>
                            {this.state.today.length === 0 && this.state.eventsLoaded === false &&
                                <View style={{flex:1, justifyContent:'center'}}>
                                    <ActivityIndicator size="large" color="#ccc" style={{marginTop: 220}} />
                                </View>
                            }
                            {this.state.eventsLoaded === true &&
                                this.state.today.length === 0 ?
                                    <View style={styles.noEvents}><Text style={styles.noEventsText}>No Events Happening Tomorrow</Text></View>
                                :
                                    <FlatList
                                        ref={(ref) => { this.flatListRef = ref; }}
                                        extraData={this.state.active}
                                        data={this.state.today}
                                        renderItem={this.renderEvent}
                                        keyExtractor={(item) => item.id}
                                        getItemLayout={this.getItemLayout}
                                    />
                            }
                            </View>
                            
                        </Tab>
                        <Tab heading={ <TabHeading style= {{backgroundColor: 'white'}}><Text>Tomorrow</Text></TabHeading>}>
                            <View style={styles.tabInner}>
                                {this.state.tomorrow.length === 0 && this.state.eventsLoaded === false &&
                                    <View style={{flex:1, justifyContent:'center'}}>
                                        <ActivityIndicator size="large" color="#ccc" style={{marginTop: 220}} />
                                    </View>
                                }
                                {this.state.eventsLoaded === true &&
                                    this.state.tomorrow.length === 0 ?
                                        <View style={styles.noEvents}><Text style={styles.noEventsText}>No Events Happening Tomorrow</Text></View>
                                    :
                                        <FlatList
                                            ref={(ref) => { this.flatListRef = ref; }}
                                            data={this.state.tomorrow}
                                            extraData={this.state.active}
                                            renderItem={this.renderEvent}
                                            keyExtractor={(item) => item.id}
                                            getItemLayout={this.getItemLayout}
                                        />
                                }
                            </View>
                        </Tab>
                        <Tab heading={ <TabHeading style= {{backgroundColor: 'white'}}><Text>This Weekend</Text></TabHeading>}>
                            <View style={styles.tabInner}>

                                {this.state.this_week.length === 0 && this.state.eventsLoaded === false &&
                                    <View style={{flex:1, justifyContent:'center'}}>
                                        <ActivityIndicator size="large" color="#ccc" style={{marginTop: 220}} />
                                    </View>
                                }
                                {this.state.eventsLoaded === true &&
                                    this.state.this_week.length === 0 ?
                                        <View style={styles.noEvents}><Text style={styles.noEventsText}>No Events Happening This Week</Text></View>
                                    :
                                        <FlatList
                                            ref={(ref) => { this.flatListRef = ref; }}
                                            data={this.state.this_week}
                                            extraData={this.state.active}
                                            renderItem={this.renderEvent}
                                            keyExtractor={(item) => item.id}
                                            getItemLayout={this.getItemLayout}
                                        />
                                }
                            </View>
                        </Tab>
                    </Tabs>
                </View>

            </Container>
        );
    }
}

const styles = StyleSheet.create({
    tabs:{
        marginBottom:0
    },
    tabInner:{
        padding:0,
        paddingBottom:0
    },
    noEvents:{
        flex: 1,
        justifyContent: 'center',
        padding: 15,
        marginTop: 15
    },
    noEventsText:{
        color: '#999',
        textAlign:'center',
        fontSize: 14
    }
})

export default Map;
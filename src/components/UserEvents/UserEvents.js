import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Container, Tab, Tabs, TabHeading, Title } from 'native-base';
import { StyleSheet, FlatList, Text, View, ImageBackground } from 'react-native'; 
import EventCardSmall from '../Events/EventCardSmall';
import keys from '../../../keys';

class UserEvents extends Component {

    constructor(props){
        super(props);
        this.state = { events: [], pastEvents: []}
    }

    async componentWillMount(){
        var userEvents = this.props.userData.events;
        //console.log('User Events Root: ',userEvents);
        setTimeout(()=> {
            //console.log(userEvents);
            this.fetchEventDetails(JSON.stringify(userEvents));
        }, 3000);
    }

    componentWillReceiveProps(nextProps){
        const userEvents = nextProps.userData.events;
        if(nextProps.userData.events.length !== this.props.userData.events.length){
            this.fetchEventDetails(JSON.stringify(userEvents));
        }
    }


    fetchEventDetails = (userEvents) => {
        var query = `where={"id":{"$in":${userEvents}}}`
        fetch(`https://parseapi.back4app.com/classes/Events?${query}`,{ 
            method:'get',
            headers : {
                'Content-Type': 'application/x-www-form-urlencoded',
                'X-Parse-REST-API-Key': keys.apiKey,
                'X-Parse-Application-Id': keys.appID
            }
            
        }).then((res)=> {
            const {results} =  JSON.parse(res._bodyInit);
            if(results){
                const upcomingEvents = results.filter( (event)=> new Date(event.end_time.iso) > new Date() && event );
                const pastEvents = results.filter( (event)=> new Date(event.end_time.iso) < new Date() && event  );
                this.setState({ events: upcomingEvents, pastEvents:pastEvents, });
            }
            
            //console.log(this.state);
        });
    }

    getItemLayout = (data, index) => (
        { length: 130, offset: 130 * index, index }
    );

    renderEvent = ({item}) => {
        return <EventCardSmall navigation={this.props.navigation} event={item} active={false} 
        cardPressed={()=> this.props.navigation.navigate("Event", {event: item})} />;

    }

    _renderTabHeading = (text, count) => {
        return(
            <TabHeading style={styles.tab}>
                <View style={styles.tabInner}>
                    <Text style={styles.tabText}>{text} </Text>
                    <View style={styles.tabCount}><Text style={styles.tabTextCount}>{count}</Text></View>
                </View>
            </TabHeading>
        );
    }

    render(){
        return(
            <Container style={styles.userEventsContainer}>
                <ImageBackground source={require('../../assets/splash.png')} style={styles.userHeaderBg}>
                    <View style={styles.userHeader}>
                        <Title style={styles.pageTitle}>My Events </Title>
                    </View>
                </ImageBackground>

                <View style={styles.tabsWrap}>
                    <Tabs 
                    style={styles.tabs} 
                    initialPage={0} 
                    //onChangeTab={({ i, ref, from })=> this.tabChange(i)}
                    tabBarUnderlineStyle={ {backgroundColor: '#fff'}}
                    tabBarBackgroundColor='transparent'
                    >
                        <Tab heading={this._renderTabHeading('Upcomming', this.state.events.length)}>
                            <View style={styles.tabContentInner}>
                                <FlatList
                                    //extraData={this.state.events}
                                    data={this.state.events}
                                    renderItem={this.renderEvent}
                                    keyExtractor={(item) => item.id}
                                    getItemLayout={this.getItemLayout}
                                />
                            </View>
                        </Tab>
                    
                        <Tab heading={this._renderTabHeading('Past', this.state.pastEvents.length)}>
                            <View style={styles.tabContentInner}>
                                <FlatList
                                    //extraData={this.state.events}
                                    data={this.state.pastEvents}
                                    renderItem={this.renderEvent}
                                    keyExtractor={(item) => item.id}
                                    getItemLayout={this.getItemLayout}
                                />
                            </View>
                        </Tab>
                    </Tabs>
                </View>
            </Container>
        );
    }
}

const styles = StyleSheet.create({
    pageTitle:{
        backgroundColor: 'transparent',
        color: 'white'
    },
    tabsWrap:{
        flex:1,
        marginTop: -50
    },
    tabs:{
        
    },
    tab:{
        backgroundColor: 'transparent',
        elevation:0
    },
    tabContentInner:{
        flex:1,
        backgroundColor: '#fff'
    },
    tabInner:{
        flex:1,
        flexDirection: 'row',
        justifyContent: 'center'
    },
    tabText:{
        color: '#fff',
    },
    tabCount:{
        marginTop: 3,
        padding: 1,
        marginLeft: 3,
        width: 22,
        //height: 20,
        borderRadius: 7,
        backgroundColor: 'rgba(255, 255, 255, 0.3)'
    },
    tabTextCount:{
        color: '#fff',
        textAlign:'center',
        fontSize: 11
    },
    userEventsContainer:{
    },
    userHeader:{
        flex:1,
        flexDirection:'row',
        justifyContent: 'center',
        //backgroundColor:'#e85c39',
        paddingTop:70,
        paddingBottom: 80,
        maxHeight:170
    },
    userHeaderBg:{
        height: 170
    },
    userEventsCount:{
        marginTop: 3,
        padding: 1,
        width: 30,
        height: 20,
        borderRadius: 10,
        backgroundColor: 'rgba(255, 255, 255, 0.3)'
    },
    userEventsCountText:{
        textAlign: 'center',
        color: '#fff',
        fontSize: 13,
    }
});

const mapStateToProps = (state) => {
    return {
        userData: state.user
    }
}

export default connect(mapStateToProps, null)(UserEvents);
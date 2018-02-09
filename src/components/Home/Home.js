import React from "react";
import { TabNavigator, StackNavigator } from "react-navigation";
import { StyleSheet } from 'react-native';
import { Button, Icon, Footer, FooterTab } from "native-base";
import { LinearGradient } from 'expo';
import SingleEvent from '../Events/Event';
import Events from '../Events/Events';
import Maps from '../Map/Map';
import UserEvents from '../UserEvents/UserEvents.js';
import UserProfile from '../UserProfile/UserProfile.js';

const EventsTab = StackNavigator({
  Events: { screen: Events, navigationOptions: { header: null } },
  Event: { screen: SingleEvent,  navigationOptions: { header: null } }
});

const MapTab = StackNavigator({
  Map: { screen: Maps, navigationOptions: { header: null } },
  Event: { screen: SingleEvent, navigationOptions: { header: null } }
});

const UserEventsTab = StackNavigator({
  UserEvents: { screen: UserEvents,  navigationOptions: { header: null }},
  Event: { screen: SingleEvent, navigationOptions: { header: null }}
});

export default (MainScreenNavigator = TabNavigator(
  {
    Events: { screen: EventsTab },
    Map: { screen: MapTab },
    UserEvents: { screen: UserEventsTab },
    UserProfile: { screen: UserProfile },
  },
  {
    swipeEnabled: false,
    tabBarPosition: "bottom",
    lazy: true,
    tabBarComponent: props => {
      //console.log(props);
      return (
        <Footer>
          <FooterTab style={styles.footerTab}>
          <LinearGradient colors={['#e85c39', '#e67725']} style={styles.tabBackground} start={[0.5, 0.5]}
          end={[1, 1]} >
            
            <Button rounded vertical
              style={{ 
                    maxWidth: 55, paddingLeft: 0, paddingRight: 0, paddingTop: 10, paddingBottom: 10, marginRight:0,
                    backgroundColor: props.navigationState.index === 0 ? "rgba(0, 0, 0, 0.1)" : undefined 
                }}
              active={props.navigationState.index === 0}
              onPress={() => props.navigation.navigate("Events")}>
              <Icon style={styles.tabIcon}  name="ios-photos-outline" />
              {/* <Text>Events</Text> */}
            </Button>

            <Button rounded vertical
              style={{ 
                maxWidth: 55, paddingLeft: 0, paddingRight: 0, paddingTop: 10, paddingBottom: 10,margin:0,
                backgroundColor: props.navigationState.index === 1 ? "rgba(0, 0, 0, 0.1)" : undefined 
                }}
              active={props.navigationState.index === 1}
              onPress={() => props.navigation.navigate("Map")}>
              <Icon style={styles.tabIcon} name="ios-pin-outline" />
              {/* <Text>Map</Text> */}
            </Button>

            <Button rounded vertical
              style={{ 
                maxWidth: 55, paddingLeft: 0, paddingRight: 0, paddingTop: 10, paddingBottom: 10,margin:0,
                backgroundColor: props.navigationState.index === 2 ? "rgba(0, 0, 0, 0.1)" : undefined 
                }}
              active={props.navigationState.index === 2}
              onPress={() => props.navigation.navigate("UserEvents")}>
              <Icon style={styles.tabIcon} name="ios-heart-outline" />
              {/* <Text>Going</Text> */}
            </Button>

            <Button rounded vertical
              style={{ 
                maxWidth: 55, paddingLeft: 0, paddingRight: 0, paddingTop: 10, paddingBottom: 10,margin:0,
                backgroundColor: props.navigationState.index === 3 ? "rgba(0, 0, 0, 0.1)" : undefined 
                }}
              active={props.navigationState.index === 3}
              onPress={() => props.navigation.navigate("UserProfile")}>
              <Icon style={styles.tabIcon} name="ios-person-outline" />
              {/* <Text>Profile</Text> */}
            </Button>

            </LinearGradient>
          </FooterTab>
          
        </Footer>
      );
    }
  }
));

const styles = StyleSheet.create({
    footerTab:{
        // flex:1, 
        // flexDirection:'row', 
        // justifyContent:'center'
    },
    tabBackground:{
        width:'100%', 
        paddingLeft: 15,
        paddingRight: 15,
        flex:1, 
        flexDirection:'row', 
        justifyContent:'space-around'
    },
    tabButton:{
        width: 60,
        padding: 10
    },
    tabButtonOne:{
        
    },
    tabIcon:{
        color: '#fff',
        fontSize: 22,
        margin:0
    }
});
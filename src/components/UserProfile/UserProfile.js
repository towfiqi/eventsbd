import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Container, Title, Button, Icon } from 'native-base';
import { StyleSheet, Image, Text, View, AsyncStorage, ImageBackground } from 'react-native'; 
import { NavigationActions } from 'react-navigation';

class UserProfile extends Component {

    constructor(props){
        super(props);
        this.state = { user:{}, events:[]} 
    }

    async componentDidMount(){
        //console.log(this.props);
        if(this.props.navigation.state.key === 'UserProfile'){
            setTimeout( () => {
                this.fetchUser();
            },5000);
        }
    }

    fetchUser = async () => {
        const token = await AsyncStorage.getItem('fbToken');
        const currentUser = this.props.userData;

        const profilePic = await fetch(`https://graph.facebook.com/me/picture?width=250&height=250&access_token=${token}`);
        const user = {...currentUser, photo: profilePic.url};
        this.setState({user});
    }

    logoutUser = () => {
        //console.log('Clicked Logout!');
        AsyncStorage.setItem('currentUser', '');
        AsyncStorage.setItem('fbToken', '');
        const resetAction = NavigationActions.reset({
            index: 0,
            key: null,
            actions: [
              NavigationActions.navigate({
                routeName: "Splash"
              })
            ]
          });
          //return this.props.navigation.navigate('Home');
        return this.props.navigation.dispatch(resetAction);
    }


    render(){
        const { name, photo} = this.state.user;
        const eventMsg = `Attended ${this.props.userData.events && this.props.userData.events.length} ${this.props.userData.events && this.props.userData.events.length > 1 ? 'Events': 'Event'}`
        const dateMsg = `Member Since ${this.state.user.joined && new Date(this.state.user.joined).toDateString().substr(3)}`
        return(
            <Container style={styles.userContainer}>
                <ImageBackground source={require('../../assets/splash.png')} style={styles.userHeaderBg}>
                    <View style={styles.userHeader}>
                        <View style={styles.profileImageWrapper} >
                            <Image style={styles.profileImage} source={{uri: photo}} />
                        </View>
                        <Title style={styles.userName}>{name}</Title>
                    </View>
                </ImageBackground>

                    <View style={styles.userContent}>
                        <View style={styles.userContentWrapper}>
                            <Text style={styles.userContentText}>
                                <Icon style={styles.userEventIcon} name="ios-happy-outline" /> {eventMsg}
                            </Text>
                            <Text style={styles.userContentText}>
                                <Icon style={styles.userJoinedIcon} name="ios-flash-outline" /> {dateMsg}
                            </Text>
                        </View>
                        <Button style={styles.logoutButton} bordered rounded onPress={this.logoutUser}>
                            <Text style={styles.logoutText} uppercase={false}><Icon style={styles.logoutIcon} name='md-log-out' /> Log Out</Text>
                      </Button>
                    </View>

            </Container>
        );
    }
}

const styles = StyleSheet.create({
    userContainer:{
    },
    userHeader:{
        flex:1,
        //backgroundColor:'#e85c39',
        paddingTop:70,
        paddingBottom: 70,
        maxHeight:260
    },
    userHeaderBg:{
        height: 260
    },
    userName:{
        backgroundColor: 'transparent',
        color: 'white'
    },
    profileImageWrapper:{
        //flex:1,
        width: 120,
        height:120,
        borderRadius: 100,
        overflow: 'hidden',
        alignSelf:'center',
        marginBottom: 20,
        borderWidth: 4,
        borderColor: '#fff'
    },
    profileImage:{
        width: 120,
        height:120,
    },
    userContent:{
        flex:1,
        paddingTop: 30,
        paddingBottom: 30,
        //paddingLeft: 70,
        backgroundColor: '#fff',
    },
    userContentWrapper:{
        flex:1,
        paddingLeft:70,
        maxHeight: 100
    },
    userContentText:{
        fontSize: 14,
        color: '#999',
        marginBottom: 8
    },
    userEventIcon:{
        fontSize: 20,
        color: '#27e692'
    }, 
    userJoinedIcon:{
        fontSize: 22,
        color: '#f7c835'
    },
    logoutButton: {
      marginTop: 80,
      borderColor: '#e67127',
      borderWidth: 1,
      paddingLeft: 75,
      paddingRight: 75,
      paddingTop: 10,
      paddingBottom: 15,
      minWidth: 120,
      alignSelf:'center'
      //marginLeft: 10
    },
    logoutText:{
      fontSize: 14,
      color: '#e67127',
      //marginLeft: -15
    },
    logoutIcon:{
      paddingTop: 3,
      fontSize: 18,
      color: '#e67127',
    }

});

const mapStateToProps = (state) => {
    return {
        userData: state.user
    }
}

export default connect(mapStateToProps, null)(UserProfile);
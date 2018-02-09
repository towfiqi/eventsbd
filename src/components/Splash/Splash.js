import React, { Component } from 'react';
import { Container, Content, Text, Button, Icon } from 'native-base';
import { Image, ImageBackground, StyleSheet, AsyncStorage } from 'react-native';
import { NavigationActions } from 'react-navigation';
import { connect } from 'react-redux';
import Expo from "expo";
import { getLastDayOfMonth } from '../../helpers/index'
import {getUserData} from '../../actions/userActions';
import keys from '../../../keys';

const headers = {
  'Content-Type': 'application/json',
  'X-Parse-REST-API-Key': keys.apiKey,
  'X-Parse-Application-Id': keys.appID
};

class Splash extends Component {

  constructor(props) {
    super(props);
    this.state = { loading: true, count: 0 };
  }

  async componentWillMount() {
    //console.log('Splash Route Props: ', this.props);

    await Expo.Font.loadAsync({
      Roboto: require("native-base/Fonts/Roboto.ttf"),
      Roboto_medium: require("native-base/Fonts/Roboto_medium.ttf"),
      Ionicons: require("@expo/vector-icons/fonts/Ionicons.ttf"),
    });
    this.setState({ loading: false });

    this.fetchEventsCount();
    var currentUser =  await AsyncStorage.getItem('currentUser');
    currentUser = currentUser ? JSON.parse(currentUser) : '';

    //If User loggedin in last 7 days, skip login screen and only fetch the userEvents
    if(currentUser){
      var last_login = currentUser.last_login ? new Date(currentUser.last_login).valueOf() : '';
      var current_time  = new Date().valueOf() 
       if((last_login - current_time)  < 604800000 ){
        const userFetched = await fetch(`https://parseapi.back4app.com/classes/Users?where={"id":"${currentUser.id}"}`,{ method:'get', headers: headers });
        const {results} =  JSON.parse(userFetched._bodyText);
        currentUser.events = results[0].events && results[0].events;

        this.props.getUserData(currentUser); 
        return this.redirectAfterLogin();
       }      
    }

  }

  fetchEventsCount = () => {
    const query = `&where={"end_time":{"$gte":{"__type":"Date","iso":"${new Date().toISOString()}"}}, "start_time":{"$lte":{"__type":"Date","iso":"${getLastDayOfMonth(new Date())}"}}}`
    fetch(`https://parseapi.back4app.com/classes/Events?count=1`+query,{  method:'get', headers :headers
      }).then((res)=> {
        const {count} =  JSON.parse(res._bodyInit);
        //console.log('Events Fetched: ', count);
        this.setState({ count: Number(count)});
    });
  }

   handleUser = async (userID) => {
    //If userid doesnt exist in db, create a new user with Name, id, gender, joindate
    //console.log('Transfered User',JSON.stringify(userID));
    const userFetched = await fetch(`https://parseapi.back4app.com/classes/Users?where={"id":"${userID}"}`,{ method:'get', headers: headers });
    const {results} =  JSON.parse(userFetched._bodyText);
    //console.log(results.length, typeof results);

    //If user not found create new user and redirect to frontpage
    if(results.length === 0){
      const createdUser = await fetch(`https://parseapi.back4app.com/classes/Users`,{ 
        method:'post', headers: headers, body:JSON.stringify({"id":userID, "events":[]})
      });
      
      const {createdAt, objectId} = JSON.parse(createdUser._bodyText);
      var currentUser =  await AsyncStorage.getItem('currentUser');
      currentUser = JSON.parse(currentUser); currentUser.joined = createdAt; currentUser.objectId = objectId;
      AsyncStorage.setItem('currentUser', JSON.stringify(currentUser));
      this.props.getUserData(currentUser);

    }else{
      var currentUser =  await AsyncStorage.getItem('currentUser');
      currentUser = JSON.parse(currentUser);
      currentUser.objectId = results[0].objectId; currentUser.joined = results[0].createdAt;
      currentUser.events = results[0].events && results[0].events;

      AsyncStorage.setItem('currentUser', JSON.stringify(currentUser));
      this.props.getUserData(currentUser);
    }
    

  }

  async loginUser () {
    //console.log('Login Button Clicked!');
    //this.props.navigation.navigate('Home');

        const { type, token } = await Expo.Facebook.logInWithReadPermissionsAsync('325349167872243', {
            permissions: ['public_profile', 'user_events']
        });
        if (type === 'success') {
          // Get the user's name using Facebook's Graph API
          const response = await fetch(`https://graph.facebook.com/me?fields=gender,name&access_token=${token}`);
          //const profilePic = await fetch(`https://graph.facebook.com/me/picture?width=250&height=250&access_token=${token}`);
          
          let userData = JSON.parse(response._bodyInit);
          //const user = {...userData, photo: profilePic.url};
          AsyncStorage.setItem('currentUser', JSON.stringify({id: userData.id, name:userData.name, gender:userData.gender ? userData.gender :'', last_login: new Date()}));
          AsyncStorage.setItem('fbToken', token);
          //console.log('Logged in!',`Hi ${JSON.stringify(user)}`);
          this.handleUser(userData.id);
          this.redirectAfterLogin();
        }
    
  }

  redirectAfterLogin = ()=> {
    const resetAction = NavigationActions.reset({
      index: 0,
      actions: [
        NavigationActions.navigate({
          routeName: "Home"
        })
      ]
    });
    //return this.props.navigation.navigate('Home');
    return this.props.navigation.dispatch(resetAction);
    
  }
    render(){
      if (this.state.loading) {
        return <Expo.AppLoading />
      }
        return(
            <Container style={styles.container}>
              <ImageBackground source={require('../../assets/splash.png')} style={styles.backgroundImage}>
                  <Content padder style={styles.content}>
                      <Image style={styles.logo} source={require('../../assets/logo.png')} />
                      <Text style={styles.subtitle}>Enjoy {this.state.count} Events This Month</Text>

                      <Button style={styles.loginButton} bordered rounded onPress={this.loginUser.bind(this)}>
                        <Icon style={styles.fbIcon} name='logo-facebook' />
                        <Text style={styles.loginButtonText} uppercase={false}>Login With Facebook</Text>
                      </Button>
                  </Content>
              </ImageBackground>
            </Container>
        );
    }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#e3690f',
    alignItems: 'center'
  },
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: null
  },
  content: {
    marginTop:180,
  },
  subtitle: {
    marginTop: 5,
    textAlign: 'center',
    color: '#fff'
  },
  logo:{
    alignSelf: 'center',
    resizeMode:'contain',
    width: 270,
    height: 65
  },
  loginButton: {
    marginTop: 100,
    alignSelf: 'center',
    borderColor: '#fff',
    borderWidth: 2,
    paddingLeft: 15,
    paddingRight: 15,
    paddingTop: 10,
    paddingBottom: 15,
    marginLeft: 10
  },
  loginButtonText:{
    fontSize: 16,
    color: '#fff',
    marginLeft: -15
  },
  fbIcon:{
    paddingTop: 3,
    fontSize: 30,
    color: '#fff',
  }
});

const mapStateToProps = (state) => {
  return {
    userData: state.user
  }
}

export default connect(mapStateToProps, {getUserData})(Splash);
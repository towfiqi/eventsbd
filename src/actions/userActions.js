import { AsyncStorage } from 'react-native'; 
import keys from '../../keys';

export const getUserData = (userdata) => {
    return {
        type: 'USER_DATA',
        payload: userdata
    }
}

export const setUserEvents = (events)=> {
    return async (dispatch) => {
        //console.log('Fetch Started!');
        const headers = {'Content-Type': 'application/json', 'X-Parse-REST-API-Key': keys.apiKey, 'X-Parse-Application-Id': keys.appID };
        var currentUser =  await AsyncStorage.getItem('currentUser');
        currentUser = JSON.parse(currentUser);
        //console.log(currentUser);
        fetch(`https://parseapi.back4app.com/classes/Users/${currentUser.objectId}`,
        { method:'put', headers: headers, body:JSON.stringify({"events":events})  }).then( (faved)=> {
        const isEventsUpdated = JSON.parse(faved._bodyText).updatedAt ? true : false;
        //console.log(JSON.parse(faved._bodyText));
        if(isEventsUpdated){
            //AsyncStorage.setItem('userEvents', JSON.stringify(newEvents));
            dispatch({type:'USER_EVENTS', payload: events});
        }
        });
    }
}

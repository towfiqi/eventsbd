
const INITIAL_STATE = { id: '',objectId: '', name: '', gender: '', joined: '', last_login: '', events: []}

export default (state = INITIAL_STATE, action) => {
    switch(action.type){
        case 'USER_DATA':
            //console.log(action);
            return {...state, ...action.payload}
            //return state;
        case 'USER_EVENTS':
            //console.log('User Events: ', state.events, action.payload);
            return {...state, ...{events: action.payload}};
        default:
            return state;
    }
}
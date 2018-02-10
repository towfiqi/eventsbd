const INITIAL_STATE = {connection: false};

export default (state = INITIAL_STATE, action) => {
    switch(action.type){
        case 'APP_CONNECTION':
            console.log('Connection: ', action);
            return {...state, connection:action.payload};
        default:
            return state;
    }
}
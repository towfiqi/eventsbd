
export default (state = 'Home', action) => {
    switch(action.type){
        case 'CURRENT_TAB':
            console.log('Current Tab: ', action);
            return state;
        default:
            return state;
    }
}
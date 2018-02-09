import React from 'react';
import { StackNavigator } from 'react-navigation';
import {Provider} from 'react-redux';
import {createStore, applyMiddleware} from 'redux';
import ReduxThunk from 'redux-thunk';
//import CardStackStyleInterpolator from 'react-navigation/lib/views/CardStack/CardStackStyleInterpolator';
//import {addNavigationHelpers} from 'react-navigation';
import reducer from './src/reducers/index'
import Splash from './src/components/Splash/Splash';
import Home from './src/components/Home/Home';

const AppNavigator = StackNavigator({
  Splash:{
    screen: Splash,
    navigationOptions: {
      header: null
    }
  },
  Home:{
    screen: Home,
    navigationOptions: {
      header: null
  }
  },
},
  // {
  //   transitionConfig: () => ({
  //     screenInterpolator: sceneProps => {
  //       return CardStackStyleInterpolator.forHorizontal(sceneProps);
  //     }
  //   }),
  // }
);

const store = createStore(reducer, {}, applyMiddleware(ReduxThunk));
// const AppWithNavigationState = connect(state => ({ nav: state.nav,
// }))(({dispatch, nav}) => (
//   <AppNavigator navigation={addNavigationHelpers({ dispatch, state: nav })}/>
// ));


class App extends React.Component {
  constructor() {
      super();
  }

  render() {
      return (
          <Provider store={store}>
              <AppNavigator />
          </Provider>
      )
  }
}

export default App;
import * as React from 'react';

import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';

import {Provider} from 'react-redux';
import {Store} from './redux/store';

import TheListDisplayScreen from './src/mainScreenList';
import OpenPdf from './src/openPdf';
import SettingsPage from './src/settingsPage/settings';
import {ShabadScreen} from './src/shabadPage/shabadPage.js';
import ReadShabad from './src/shabadPage/readShabad.js';
import {folderToFileData} from './assets/longData';

const Stack = createStackNavigator();

function App() {
  return (
    <Provider store={Store}>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen
            name="Home"
            component={TheListDisplayScreen}
            initialParams={{
              dataObj: folderToFileData,
              title: 'Santhiya Pothi',
              fullPath: [], //
              addedPdfs: false,
            }}
          />
          <Stack.Screen name="Settings Page" component={SettingsPage} />
          <Stack.Screen
            name="OpenPdf"
            component={OpenPdf}
            options={{headerShown: false}}
          />
          <Stack.Screen name="ShabadScreen" component={ShabadScreen} />
          <Stack.Screen name="ReadShabad" component={ReadShabad} />
        </Stack.Navigator>
      </NavigationContainer>
    </Provider>
  );
}
export default App;

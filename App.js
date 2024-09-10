import * as React from 'react';

import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';

import {Provider} from 'react-redux';
import {Store} from './redux/store';

import HomeScreen from './src/HomeScreen.js';
import PdfListScreen from './src/PdfListScreen.js';
import {TextBanisListScreen} from './src/TextBanisListScreen.js';
import OpenPdfScreen from './src/OpenPdfScreen.js';
import SettingsPage from './src/settingsPage/settings';
import {ShabadScreen} from './src/shabadPage/shabadPage.js';
import ReadShabad from './src/shabadPage/readShabad.js';
import AddedPDFsScreen from './src/AddedPdfsScreen.js';
import OpenTxtBaniScreen from './src/OpenTxtBaniScreen.js';

const Stack = createStackNavigator();

function App() {
  return (
    <Provider store={Store}>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen
            name="Home"
            component={HomeScreen}
            initialParams={{title: 'Santhiya Pothi'}}
          />
          <Stack.Screen name="TextBanisListScreen" component={TextBanisListScreen} />
          <Stack.Screen name="PdfListScreen" component={PdfListScreen} />
          <Stack.Screen name="AddedPdfs" component={AddedPDFsScreen} />
          <Stack.Screen name="OpenTextBanis" component={OpenTxtBaniScreen} />
          <Stack.Screen
            name="OpenPdf"
            component={OpenPdfScreen}
            options={{headerShown: false}}
          />
          <Stack.Screen name="Settings Page" component={SettingsPage} />
          <Stack.Screen name="ShabadScreen" component={ShabadScreen} />
          <Stack.Screen name="ReadShabad" component={ReadShabad} />
        </Stack.Navigator>
      </NavigationContainer>
    </Provider>
  );
}
export default App;

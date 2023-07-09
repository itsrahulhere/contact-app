import React, {useState} from 'react';
import {StyleSheet} from 'react-native';
import ContactList from './src/ContactList';
import Favorite from './src/Favorite';
import {NavigationContainer} from '@react-navigation/native';
import {createDrawerNavigator} from '@react-navigation/drawer';
import {createStackNavigator} from '@react-navigation/stack';
import AddNewContact from './src/AddNewContact';
import UpdateContact from './src/UpdateContact';

const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();
var showHeader = true;

function App() {

  const DrawerTab = () => {
    return (
      <Drawer.Navigator>
        <Drawer.Screen
          name="Contact List"
          component={ContactList}
          options={{
            title: 'Contact List',
            headerTitleAlign: 'center',
            drawerLabelStyle: {
              marginLeft: 2,
              fontSize: 20,
            },
            headerTitleStyle: {
              fontWeight: 500,
              fontSize: 25,
            },
            headerStyle: {
              height: 75,
              //backgroundColor: "#c9b1ff",
              elevation: 0,
              shadowOpacity: 0,
            },
            headerShown: showHeader,
          }}
        />
        <Drawer.Screen
          name="Favorite"
          component={Favorite}
          options={{
            title: 'Favorite',
            headerTitleAlign: 'center',
            drawerLabelStyle: {
              marginLeft: 2,
              fontSize: 20,
            },
            headerTitleStyle: {
              fontWeight: 500,
              fontSize: 25,
            },
            headerStyle: {
              height: 75,
              //backgroundColor: "#c9b1ff",
              elevation: 0,
              shadowOpacity: 0,
            },
          }}
        />
      </Drawer.Navigator>
    );
  };

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Tabs"
        screenOptions={{
          headerShown: false,
        }}>
        <Stack.Screen
          name="Tabs"
          component={DrawerTab}
          options={{
            headerStyle: {
              height: 0,
            },
          }}
        />
        <Stack.Screen
          name="ContactList"
          component={ContactList}
          options={{
            headerStyle: {
              height: 0,
            },
          }}
        />
        <Stack.Screen
          name="AddNewContact"
          component={AddNewContact}
          options={{
            title: 'Add New Contact',
            headerTitleAlign: 'center',
            headerTitleStyle: {
              fontWeight: 500,
              fontSize: 23,
            },
            headerShown: true,
            headerStyle: {
              height: 75,
              elevation: 0,
              shadowOpacity: 0,
            },
          }}
        />
        <Stack.Screen
          name="UpdateContact"
          component={UpdateContact}
          options={{
            title: 'Update Contact',
            headerTitleAlign: 'center',
            headerTitleStyle: {
              fontWeight: 500,
              fontSize: 23,
            },
            headerShown: true,
            headerStyle: {
              height: 75, // Specify the height of your custom header
              // backgroundColor: "lightgray",
              elevation: 0,
              shadowOpacity: 0,
            },
            // headerRight: () => (
            //   <View style={{marginRight: 10}}>
            //     <View style={styles.fav}>
            //       <TouchableOpacity>
            //         {true ? (
            //           <FontAwesomeIcon
            //             icon={faStar}
            //             size={25}
            //             style={{color: '#FFD700'}}
            //           />
            //         ) : (
            //           <FontAwesomeIcon
            //             icon={faStar}
            //             size={25}
            //             style={{color: '#e7e7e7'}}
            //           />
            //         )}
            //       </TouchableOpacity>
            //     </View>
            //   </View>
            // ),
          }}
        />
        {/* ...other stack screens */}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
const styles = StyleSheet.create({
  fav: {
    paddingRight: 20,
  },
});
//npx react-native start --reset-cache
export default App;

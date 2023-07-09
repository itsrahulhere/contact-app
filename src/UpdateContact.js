import React, {useState, useEffect, useLayoutEffect} from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  Pressable,
  Image,
  Text,
  TouchableOpacity,
} from 'react-native';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {faCamera} from '@fortawesome/free-solid-svg-icons/faCamera';
import {faStar} from '@fortawesome/free-solid-svg-icons/faStar';
import {useNavigation, useRoute} from '@react-navigation/native';
import {launchImageLibrary} from 'react-native-image-picker';
import {openDatabase} from 'react-native-sqlite-storage';
let db = openDatabase({name: 'ContactListDatabase.db'});

const AddNewContact = () => {
  const [name, setName] = useState('');
  const [image, setImage] = useState('');
  const [mobileno, setMobileno] = useState('');
  const [landlineno, setLandlineno] = useState('');
  const [favourite, setFavourite] = useState();
  const navigation = useNavigation();
  const route = useRoute();

  useEffect(() => {
    setName(route.params.data.name);
    setImage(route.params.data.image);
    setMobileno(route.params.data.mobileno.toString());
    setLandlineno(route.params.data.landlineno.toString());
    setFavourite(route.params.data.favourite);
  }, []);

  const updateData = () => {
    db.transaction(txn => {
      txn.executeSql(
        'UPDATE table_user set name=?, mobileno=?, landlineno=?, favourite=?, image=? WHERE id=?',
        [name, mobileno, landlineno, favourite, image, route.params.data.id],
        (tex, res) => {
          if (res.rowsAffected == 1) {
            navigation.goBack();
          } else {
            console.log('Update Data:', res);
          }
        },
        error => {
          console.log(error);
        },
      );
    });
  };

  const openImagePicker = () => {
    const options = {
      mediaType: 'photo',
      quality: 0.8,
    };
    launchImageLibrary(options, response => {
      console.log('Response = ', response.assets);
      if (response.assets != undefined) {
        setImage(response.assets[0].uri);
        console.log(response.assets[0].uri);
      }
    });
  };

  return (
    <View style={styles.container}>
      {image == '' || image == null ? (
        <View style={styles.cameraview}>
          <TouchableOpacity
            style={styles.cameracontainer}
            onPress={() => {
              openImagePicker();
            }}>
            <View style={styles.camerabutton}>
              <FontAwesomeIcon
                icon={faCamera}
                size={25}
                style={{color: '#fafafa'}}
              />
            </View>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.cameraview}>
          <TouchableOpacity
            onPress={() => {
              openImagePicker();
            }}>
            <Image source={{uri: image}} style={styles.camerabutton} />
          </TouchableOpacity>
        </View>
      )}

      <View style={styles.fav}>
        <TouchableOpacity
          onPress={() => {
            setFavourite(!favourite);
          }}>
          {favourite ? (
            <FontAwesomeIcon
              icon={faStar}
              size={25}
              style={{color: '#FFD700'}}
            />
          ) : (
            <FontAwesomeIcon
              icon={faStar}
              size={25}
              style={{color: '#e7e7e7'}}
            />
          )}
        </TouchableOpacity>
      </View>

      <TextInput
        style={styles.input}
        placeholder="Name"
        value={name}
        onChangeText={text => setName(text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Mobile Number"
        value={mobileno}
        onChangeText={text => setMobileno(text)}
        keyboardType="phone-pad"
      />
      <TextInput
        style={styles.input}
        placeholder="Landline Number"
        value={landlineno}
        onChangeText={text => setLandlineno(text)}
        keyboardType="phone-pad"
      />

      <Pressable
        style={styles.button}
        onPress={() => {
          updateData();
        }}>
        <Text style={styles.text}>Update Contact</Text>
      </Pressable>
      {/* <Button title="Submit" style={styles.button} onPress={handleSubmit} /> */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 25,
  },
  cameraview: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: -70,
    marginBottom: 15,
  },
  cameracontainer: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: 'lightgray',
  },
  camerabutton: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 63,
    height: 63,
    borderRadius: 30,
    backgroundColor: 'gray',
  },
  fav: {
    marginBottom: 20,
    alignItems: 'center',
  },
  input: {
    height: 50,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 16,
    paddingHorizontal: 8,
  },
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 4,
    elevation: 3,
    backgroundColor: '#2196F3',
  },
  text: {
    fontSize: 16,
    lineHeight: 21,
    fontWeight: 'bold',
    letterSpacing: 0.25,
    color: 'white',
  },
});

export default AddNewContact;

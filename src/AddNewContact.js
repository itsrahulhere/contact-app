import React, {useState, useEffect, useRef} from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  Pressable,
  Text,
  Image,
  TouchableOpacity,
} from 'react-native';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {faCamera} from '@fortawesome/free-solid-svg-icons/faCamera';
import {useNavigation} from '@react-navigation/native';
import {faStar} from '@fortawesome/free-solid-svg-icons/faStar';
import {launchImageLibrary} from 'react-native-image-picker';
import {openDatabase} from 'react-native-sqlite-storage';

let db = openDatabase({name: 'ContactListDatabase.db'});

const AddNewContact = () => {
  const [name, setName] = useState('');
  const [imageUri, setImageUri] = useState('');
  const [mobileno, setMobileno] = useState('');
  const [landlineno, setLandlineno] = useState('');
  const [favourite, setFavourite] = useState(false);
  const navigation = useNavigation();

  useEffect(() => {
    db.transaction(txn => {
      txn.executeSql(
        "SELECT name FROM sqlite_master WHERE type='table' AND name='table_user'",
        [],
        (tx, res) => {
          console.log('item:', res.rows.length);
          if (res.rows.length == 0) {
            txn.executeSql('DROP TABLE IF EXISTS table_user', []);
            txn.executeSql(
              'CREATE TABLE IF NOT EXISTS table_user(id INTEGER PRIMARY KEY AUTOINCREMENT, name VARCHAR(20), mobileno INT(10), landlineno INT(12), favourite BOOLEAN, image TEXT)',
              [],
            );
          } else {
            console.log('Already created table');
          }
        },
      );
    });
  }, []);

  const openImagePicker = () => {
    const options = {
      mediaType: 'photo',
      quality: 0.8,
    };
    launchImageLibrary(options, response => {
      console.log('Response = ', response.assets);
      if (response.assets != undefined) {
        setImageUri(response.assets[0].uri);
        console.log(response.assets[0].uri);
      }
    });
    console.log(imageUri);
  };

  const saveData = () => {
    console.log('Name:', name);
    console.log('Contact:', mobileno);

    db.transaction(txn => {
      txn.executeSql(
        'INSERT INTO table_user(name,mobileno,landlineno,favourite,image) VALUES (?,?,?,?,?)',
        [name, mobileno, landlineno, favourite, imageUri],
        (tex, res) => {
          if (res.rowsAffected == 1) {
            navigation.goBack();
          } else {
            console.log('Save Data:', res);
          }
        },
        error => {
          console.log(error);
        },
      );
    });
  };

  return (
    <View style={styles.container}>
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
      {imageUri == '' ? null : (
        <View style={styles.cameraview}>
          <TouchableOpacity
            onPress={() => {
              openImagePicker();
            }}>
            <Image source={{uri: imageUri}} style={styles.camerabutton} />
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
          saveData();
        }}>
        <Text style={styles.text}>Save</Text>
      </Pressable>
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
    marginTop: -80,
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

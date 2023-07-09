import React, {useState, useEffect, useRef} from 'react';
import {
  View,
  TextInput,
  Image,
  TouchableOpacity,
  StyleSheet,
  Text,
  ScrollView,
} from 'react-native';

import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {faEdit} from '@fortawesome/free-solid-svg-icons/faEdit';
import {faTrashCan} from '@fortawesome/free-solid-svg-icons/faTrashCan';
import {faStar} from '@fortawesome/free-solid-svg-icons/faStar';
import {faSearch} from '@fortawesome/free-solid-svg-icons';
import {useIsFocused, useNavigation} from '@react-navigation/native';
import {openDatabase} from 'react-native-sqlite-storage';
let db = openDatabase({name: 'ContactListDatabase.db'});

function ContactList() {
  const contactsData = [
    {
      id: 1,
      image:
        'https://th.bing.com/th/id/OIP.UGlKxiZQylR3CnJIXSbFIAHaLL?pid=ImgDet&rs=1',
      name: 'John Doe',
      phone: '123-456-7890',
      email: 'john.doe@example.com',
    },
    {
      id: 2,
      image:
        'https://amentaemma.com/wp-content/uploads/2020/08/Randy-_sq-2048x2048.jpg',
      name: 'Jane Smith',
      phone: '987-654-3210',
      email: 'jane.smith@example.com',
    },

    // Add more contact objects as needed
  ];
  const [contactList, setContactList] = useState([]);
  const [search, setSearch] = useState('');
  const isFocused = useIsFocused();
  const navigation = useNavigation();
  const inputRef = useRef(null);

  const handleAddButtonPress = () => {
    navigation.navigate('AddNewContact'); // Replace 'NextScreen' with the actual screen name you want to navigate to
  };

  const deleteContact = id => {
    db.transaction(txn => {
      txn.executeSql('DELETE FROM table_user WHERE id=?', [id], (tx, res) => {
        getData();
      });
    });
  };

  const searchContact = () => {
    inputRef.current.blur();
    db.transaction(txn => {
      txn.executeSql(
        `SELECT * FROM table_user WHERE name LIKE '%${search}%' ORDER BY name ASC`,
        [],
        (tx, res) => {
          var temp = [];
          for (let i = 0; i < res.rows.length; i++) {
            console.log('searched items: ', res.rows.item(i));
            temp.push(res.rows.item(i));
          }
          setContactList(temp);
        },
      );
    });
  };

  const favContact = (id, fav) => {
    db.transaction(txn => {
      txn.executeSql(
        'UPDATE table_user SET favourite=? WHERE id=?',
        [!fav, id],
        (tex, res) => {
          if (res.rowsAffected == 1) {
            getData();
            // navigation.goBack();
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

  const getData = () => {
    db.transaction(txn => {
      txn.executeSql(
        'SELECT * FROM table_user ORDER BY name ASC',
        [],
        (tx, res) => {
          var temp = [];
          for (let i = 0; i < res.rows.length; i++) {
            console.log(res.rows.item(i));
            temp.push(res.rows.item(i));
          }
          setContactList(temp);
        },
      );
    });
  };

  useEffect(() => {
    getData();
  }, [isFocused]);

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search"
          value={search}
          onChangeText={text => setSearch(text)}
          ref={inputRef}
        />
        <TouchableOpacity
          onPress={() => {
            searchContact();
          }}>
          <FontAwesomeIcon icon={faSearch} style={styles.searchIcon} />
        </TouchableOpacity>
      </View>
      <ScrollView contentContainerStyle={styles.scrollcontainer}>
        {/* {contactsData.map(contact => (
          <View style={styles.card} key={contact.id}>
            <Image source={{uri: contact.image}} style={styles.image} />
            <View style={styles.details}>
              <Text style={styles.name}>{contact.name}</Text>
              <Text style={styles.phone}>{contact.phone}</Text>
            </View>
            <View style={styles.fav}>
              <FontAwesomeIcon
                icon={faStar}
                size={25}
                style={{color: '#FFD700'}}
              />
              <FontAwesomeIcon
                icon={faStar}
                size={25}
                style={{color: '#e7e7e7'}}
              />
            </View>
          </View>
        ))} */}
        {contactList.map(contact => (
          <View style={styles.card} key={contact.id}>
            <TouchableOpacity
              style={styles.tile}
              onPress={() => {
                navigation.navigate('UpdateContact', {
                  data: {
                    id: contact.id,
                    name: contact.name,
                    mobileno: contact.mobileno,
                    landlineno: contact.landlineno,
                    favourite: contact.favourite,
                    image: contact.image,
                  },
                });
              }}>
              {contact.image == '' ||
              contact.image == null ? (
                <Image
                  source={{
                    uri: 'https://icon-library.com/images/blank-person-icon/blank-person-icon-9.jpg',
                  }}
                  style={styles.image}
                />
              ) : (
                <Image source={{uri: contact.image}} style={styles.image} />
              )}

              <View style={styles.details}>
                <Text style={styles.name}>{contact.name}</Text>
                <Text style={styles.mobileno}>{contact.mobileno}</Text>
              </View>
            </TouchableOpacity>
            <View style={styles.fav}>
              <TouchableOpacity
                onPress={() => {
                  favContact(contact.id, contact.favourite);
                }}>
                {contact.favourite == true ? (
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

            <TouchableOpacity
              onPress={() => {
                navigation.navigate('UpdateContact', {
                  data: {
                    id: contact.id,
                    name: contact.name,
                    mobileno: contact.mobileno,
                    landlineno: contact.landlineno,
                    image: contact.image,
                    favourite: contact.favourite
                  },
                });
              }}>
              <FontAwesomeIcon
                icon={faEdit}
                size={25}
                style={{color: 'gray', marginRight: 10}}
              />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                deleteContact(contact.id);
              }}>
              <FontAwesomeIcon
                icon={faTrashCan}
                size={25}
                style={{color: 'red'}}
              />
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>

      <View style={styles.addContainer}>
        <TouchableOpacity
          style={styles.addButton}
          onPress={handleAddButtonPress}>
          <Text style={styles.addButtonText}>+</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 25,
    paddingVertical: 20,
  },
  fav: {
    paddingRight: 20,
  },
  scrollcontainer: {
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
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.5,
  },
  text: {
    fontSize: 16,
    lineHeight: 21,
    fontWeight: 'bold',
    letterSpacing: 0.25,
    color: 'white',
  },
  addContainer: {
    position: 'absolute',
    right: 30,
    bottom: 30,
  },
  addButton: {
    zIndex: 9,
    backgroundColor: '#2196F3',
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.5,
    shadowRadius: 4,
    elevation: 5,
  },
  addButtonText: {
    color: '#FFF',
    fontSize: 24,
    fontWeight: 'bold',
  },

  card: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    marginLeft: 5,
  },
  tile: {
    flexDirection: 'row',
    flex: 1,
  },

  image: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 12,
  },
  details: {
    flex: 5,
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  phone: {
    fontSize: 14,
    marginBottom: 4,
  },
  email: {
    fontSize: 14,
    color: 'gray',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.25,
    borderColor: '#ccc',
    borderRadius: 5,
    marginBottom: 20,
  },
  searchIcon: {
    marginRight: 15,
    color: '#888',
  },
  searchInput: {
    flex: 1,
    fontSize: 18,
    height: 50,
    marginLeft: 10,
  },
});

export default ContactList;

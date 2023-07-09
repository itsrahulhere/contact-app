import React, {useState, useEffect} from 'react';
import {
  View,
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
import {useIsFocused, useNavigation} from '@react-navigation/native';
import {openDatabase} from 'react-native-sqlite-storage';
let db = openDatabase({name: 'ContactListDatabase.db'});

function Favorite() {
  const [contactList, setContactList] = useState([]);
  const isFocused = useIsFocused();
  const navigation = useNavigation();
  const [isAnyFav, SetIsAnyFav] = useState(false);

  const getData = () => {
    SetIsAnyFav(false);
    db.transaction(txn => {
      txn.executeSql(
        'SELECT * FROM table_user WHERE favourite = true ORDER BY name ASC',
        [],
        (tx, res) => {
          var temp = [];
          if (res.rows.length >= 1) {
            SetIsAnyFav(true);
          }
          for (let i = 0; i < res.rows.length; i++) {
            console.log(res.rows.item(i));
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

  useEffect(() => {
    getData();
  }, [isFocused]);

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollcontainer}>
        {isAnyFav ? null : (
          <Text style={styles.noFavText}>No Favorite Contacts</Text>
        )}

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
                  },
                });
              }}>
              {contact.image == '' || contact.image == null ? (
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
                  },
                });
              }}>
              <FontAwesomeIcon
                icon={faEdit}
                size={25}
                style={{color: 'gray'}}
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 25,
  },
  fav: {
    paddingRight: 20,
  },
  scrollcontainer: {
    alignItems: 'center',
    marginTop: 20,
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
  noFavText: {
    marginTop: 30,
    fontSize: 20,
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
});

export default Favorite;

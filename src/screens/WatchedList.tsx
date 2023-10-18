import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  StatusBar,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {appColors} from '../dummyData/appColors';
import {GoogleSignin} from '@react-native-google-signin/google-signin';
import auth from '@react-native-firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/Ionicons';
import {useNavigation} from '@react-navigation/native';
import AddMoviesForm from './AddMoviesForm';
import InfiniteScroll from '../components/InfiniteScrollList';

const WatchedList = () => {
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState();
  const [userData, setUserData] = useState();
  const [AddMovies, setAddMovies] = useState(false);
  const getData = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem('userData');
      // console.log(jsonValue, 'json v');
      setUserData(JSON.parse(jsonValue));
    } catch (e) {
      // error reading value
    }
  };
  useEffect(() => {
    GoogleSignin.configure({
      webClientId:
        '370017541857-irqbjusmpcarlm2cbdu09khhfe3838mv.apps.googleusercontent.com',
    });
    getData();
  }, [user]);

  async function onGoogleButtonPress() {
    // Check if your device supports Google Play
    await GoogleSignin.hasPlayServices({showPlayServicesUpdateDialog: true});
    // Get the users ID token
    const {idToken, user} = await GoogleSignin.signIn();

    console.log(user, 'this is user');
    const jsonValue = JSON.stringify(user);
    await AsyncStorage.setItem('userData', jsonValue);

    // Create a Google credential with the token
    const googleCredential = auth.GoogleAuthProvider.credential(idToken);
    // Sign-in the user with the credential
    return auth().signInWithCredential(googleCredential);
  }

  // Handle user state changes
  function onAuthStateChanged(user) {
    setUser(user);
    if (initializing) setInitializing(false);
  }

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);

    return subscriber; // unsubscribe on unmount
  }, []);

  if (initializing) return null;

  const logout = async () => {
    await GoogleSignin.signOut().then(() => {
      auth()
        .signOut()
        .then(async () => {
          console.log('User signed out!');
          await AsyncStorage.removeItem('userData');
        });
    });
  };

  console.log(userData, 'this is data');

  const navigation = useNavigation();

  return (
    <View style={styles.screen}>
      {!user ? (
        <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
          <Text style={styles.text}>Login and Acesss Your Watched List</Text>
          <TouchableOpacity
            onPress={() =>
              onGoogleButtonPress().then(() =>
                console.log('Signed in with Google!'),
              )
            }
            style={styles.button}>
            <Image
              source={require('../assets/google.png')}
              alt="dfgd"
              style={{height: 30, width: 30}}
            />
            <Text style={styles.buttonText}>Login with Google</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={{flex: 2}}>
          <View style={styles.header}>
            <View style={{flexDirection: 'row'}}>
              {userData !== null && (
                <Image
                  source={{uri: userData?.photo}}
                  style={{height: 50, width: 50, borderRadius: 50}}
                />
              )}
              <View style={{paddingStart: 6}}>
                <Text style={styles.name}>{userData?.name}</Text>
                <Text style={styles.subtext}>Your watched list</Text>
              </View>
            </View>
            <TouchableOpacity
              onPress={() => {
                logout();
              }}>
              <Icon
                name="log-out-outline"
                size={35}
                color={appColors.secoundry}
              />
            </TouchableOpacity>
          </View>
          {!AddMovies && (
            <TouchableOpacity
              onPress={() => {
                setAddMovies(true);
              }}
              activeOpacity={0.6}
              style={styles.add}>
              <Icon
                name="add-circle-outline"
                size={35}
                color={appColors.secoundry}
              />
            </TouchableOpacity>
          )}
          {AddMovies ? (
            <AddMoviesForm
              setNavigate={setAddMovies}
              goBack={() => setAddMovies(false)}
            />
          ) : (
            <View style={{height: '95%'}}>
              <InfiniteScroll />
            </View>
          )}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: 'white',
  },
  text: {
    fontSize: 25,
    color: appColors.primary,
    textAlign: 'center',
    fontWeight: 'bold',
    marginHorizontal: 50,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: appColors.primary,
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 30,
    paddingVertical: 5,
    marginTop: '5%',
  },
  buttonText: {
    color: appColors.primary,
    textAlign: 'center',
    marginHorizontal: 10,
    fontSize: 15,
  },
  header: {
    backgroundColor: appColors.primary,
    padding: 7,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  name: {
    color: appColors.secoundry,
    fontSize: 18,
  },
  subtext: {
    color: appColors.secoundry,
  },
  add: {
    backgroundColor: appColors.primary,
    position: 'absolute',
    bottom: '10%',
    right: '10%',
    padding: 10,
    borderRadius: 40,
    zIndex: 20,
  },
});

export default WatchedList;

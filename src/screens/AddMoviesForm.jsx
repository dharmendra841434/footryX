import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  ToastAndroid,
} from 'react-native';
import React, {useState} from 'react';
import {appColors} from '../dummyData/appColors';
import CustomInput from '../components/CustomInput';
import Icon from 'react-native-vector-icons/Ionicons';
import ImagePicker from 'react-native-image-crop-picker';
import storage from '@react-native-firebase/storage';
import firestore from '@react-native-firebase/firestore';

const AddMoviesForm = ({goBack, setNavigate}) => {
  const [imageUrl, setImageUrl] = useState();
  const [imgLoader, setImgLoader] = useState(false);
  const [name, setName] = useState('');
  const [director, setDirector] = useState('');
  const [loader, setLoader] = useState('');

  const AddGalleryImage = () => {
    setImgLoader(true);
    ImagePicker.openPicker({
      mediaType: 'photo',
    })
      .then(image => {
        try {
          const url = image.path;
          const fileUrl = url.substring(url.lastIndexOf('/') + 1);
          storage()
            .ref('Images/' + fileUrl)
            .putFile(url)
            .then(async () => {
              var imgURL = await storage()
                .ref('Images/' + fileUrl)
                .getDownloadURL();
              setImageUrl(imgURL);
              console.log(imgURL);
              setImgLoader(false);
            })
            .catch(e => {
              setImgLoader(false);
              console.log('error not selected file');
            });
        } catch (error) {
          alert('Cancel');
          setImgLoader(false);
        }
      })
      .catch(e => {
        console.log('error not selected file');
        setImgLoader(false);
      });
  };

  const storeData = () => {
    setLoader(true);
    firestore()
      .collection('watched')
      .add({
        name: name,
        director: director,
        poster: imageUrl,
        createdAt: new Date(),
      })
      .then(() => {
        setLoader(false);
        setNavigate(false);
        console.log('User added!');
        ToastAndroid.showWithGravity(
          'Data saved',
          ToastAndroid.SHORT,
          ToastAndroid.CENTER,
        );
      });
  };
  return (
    <View style={styles.screen}>
      <TouchableOpacity
        onPress={goBack}
        activeOpacity={0.5}
        style={{marginTop: '2%'}}>
        <Icon name="chevron-back-outline" size={25} color={appColors.primary} />
      </TouchableOpacity>
      <Text style={styles.heading}>Add Your Favourite Movies</Text>
      <View style={{paddingHorizontal: '4%', marginTop: '4%'}}>
        <CustomInput
          onChangeText={n => {
            setName(n);
          }}
          title="Movie Name"
        />
        <CustomInput
          onChangeText={n => {
            setDirector(n);
          }}
          title="Director Name"
        />
        <TouchableOpacity
          onPress={() => {
            AddGalleryImage();
          }}
          activeOpacity={0.6}
          style={styles.selectButton}>
          <Icon name="image-outline" size={35} color={appColors.primary} />
          <Text
            style={{
              color: appColors.primary,
              marginHorizontal: '2%',
            }}>
            Select Movie Poster
          </Text>
        </TouchableOpacity>
        {imgLoader ? (
          <ActivityIndicator
            style={{marginTop: 20}}
            size={50}
            color={appColors.primary}
          />
        ) : (
          <View
            style={{
              alignItems: 'center',
              justifyContent: 'center',
              marginTop: '3%',
            }}>
            <Image
              source={{uri: imageUrl}}
              style={{width: '50%', height: 250}}
            />
          </View>
        )}
      </View>
      <TouchableOpacity
        onPress={() => {
          storeData();
        }}
        activeOpacity={0.7}
        style={styles.button}>
        {loader ? (
          <ActivityIndicator color={appColors.secoundry} />
        ) : (
          <Text style={{color: appColors.secoundry, fontSize: 17}}>
            Store Data
          </Text>
        )}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  heading: {
    fontSize: 20,
    fontWeight: '600',
    color: appColors.primary,
    textAlign: 'center',
    marginTop: '3%',
  },
  selectButton: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: appColors.primary,
    borderRadius: 10,
    justifyContent: 'center',
  },
  button: {
    backgroundColor: appColors.primary,
    position: 'absolute',
    bottom: 5,
    left: 15,
    right: 15,
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
});

export default AddMoviesForm;

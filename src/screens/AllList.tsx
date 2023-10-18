import {View, Text, StyleSheet, FlatList, Image} from 'react-native';
import React, {useEffect, useState} from 'react';
import Icon from 'react-native-vector-icons/FontAwesome';
import firestore from '@react-native-firebase/firestore';
import {appColors} from '../dummyData/appColors';

const AllList = () => {
  const [moviesList, setMoviesList] = useState([]);
  const getall = async () => {
    firestore()
      .collection('movies')
      .get()
      .then(querySnapshot => {
        // console.log('Total users: ', querySnapshot.size);
        let list = [];
        querySnapshot.forEach(documentSnapshot => {
          //  console.log(documentSnapshot.data());
          list.push(documentSnapshot.data());
          // setMoviesList([...moviesList, documentSnapshot.data()]);
        });
        setMoviesList(list);
      });
  };
  useEffect(() => {
    getall();
  }, []);

  console.log(moviesList, 'list');

  return (
    <View style={styles.screen}>
      <FlatList
        data={moviesList}
        renderItem={({item, index}) => (
          <View
            key={index}
            style={{alignItems: 'center', marginVertical: '5%'}}>
            <Image
              source={{uri: item?.poster}}
              style={{width: '90%', height: 600}}
            />
            <View style={{width: '90%'}}>
              <Text style={styles.text}>Movie : {item?.name}</Text>
              <Text style={styles.text}>Director : {item?.director}</Text>
            </View>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: 'white',
  },
  text: {
    color: appColors.primary,
    fontSize: 18,
  },
});

export default AllList;

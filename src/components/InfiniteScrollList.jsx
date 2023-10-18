import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  Image,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import {appColors} from '../dummyData/appColors';
import Icon from 'react-native-vector-icons/Ionicons';

const InfiniteScroll = () => {
  const [data, setData] = useState([]);
  const [lastVisible, setLastVisible] = useState(null);
  const [loading, setLoading] = useState(false);
  const [deleteLoader, setDeleteLoader] = useState(false);

  const fetchMore = async () => {
    if (lastVisible) {
      setLoading(true);
      const querySnapshot = await firestore()
        .collection('watched')
        .orderBy('createdAt', 'desc')
        .startAfter(lastVisible)
        .limit(10)
        .get();

      const newItems = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));

      setData([...data, ...newItems]);
      setLastVisible(querySnapshot.docs[querySnapshot.docs.length - 1]);
      setLoading(false);
    }
  };

  const fetchInitialData = async () => {
    setLoading(true);
    const querySnapshot = await firestore()
      .collection('watched')
      .orderBy('createdAt', 'desc')
      .limit(10)
      .get();

    const initialItems = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));

    setData(initialItems);
    setLastVisible(querySnapshot.docs[querySnapshot.docs.length - 1]);
    setLoading(false);
  };

  useEffect(() => {
    fetchInitialData();
  }, []);

  // console.log(data);

  const deleteData = async id => {
    console.log(id);
    setDeleteLoader(true);
    await firestore()
      .collection('watched')
      .doc(id)
      .delete()
      .then(() => {
        console.log('data deleted!');
        fetchInitialData().then(() => {
          setDeleteLoader(false);
        });
      });
  };

  return (
    <View style={{paddingBottom: '5%'}}>
      <FlatList
        data={data}
        keyExtractor={item => item.id}
        renderItem={({item}) => (
          <View style={styles.container}>
            <View style={{flexDirection: 'row'}}>
              <Image source={{uri: item.poster}} style={styles.poster} />
              <View style={{padding: 5}}>
                <Text style={styles.title}>{item.name}</Text>
                <Text style={styles.title}>Dir-{item.director}</Text>
              </View>
            </View>
            <TouchableOpacity
              onPress={() => {
                deleteData(item.id);
              }}
              style={{marginTop: '10%', marginRight: '5%'}}>
              <Icon name="trash-outline" size={35} color="red" />
            </TouchableOpacity>
          </View>
        )}
        onEndReached={fetchMore}
        onEndReachedThreshold={0.1}
        ListFooterComponent={loading && <ActivityIndicator size="large" />}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  poster: {
    width: 100,
    height: 100,
  },
  container: {
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: appColors.primary,
    borderRadius: 10,
    marginVertical: 5,
    marginHorizontal: 5,
    overflow: 'hidden',
    justifyContent: 'space-between',
  },
  title: {
    fontSize: 17,
    color: appColors.primary,
  },
});

export default InfiniteScroll;

import ImagePicker from 'react-native-image-crop-picker';
import storage from '@react-native-firebase/storage';

export const AddGalleryImage = setfileUrl => {
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
            setfileUrl(imgURL);
            console.log(imgURL);
          })
          .catch(e => {
            setLoader(false);
            console.log('error not selected file');
          });
      } catch (error) {
        alert('Cancel');
      }
    })
    .catch(e => {
      console.log('error not selected file');
    });
};

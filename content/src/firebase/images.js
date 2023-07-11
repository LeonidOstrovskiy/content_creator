import { storage } from './config';

import { ref, getDownloadURL, uploadBytesResumable } from 'firebase/storage';
import { firestore } from './config';
import {
  collection,
  addDoc,
  onSnapshot,
  doc,
  getDoc,
} from 'firebase/firestore';

const dbRef = collection(firestore, 'images');

export function getAllImageTopics(setTopics, setSearchedTopics) {
  onSnapshot(dbRef, (response) => {
    setTopics(
      response.docs.map((doc) => {
        return { ...doc.data(), id: doc.id };
      })
    );
    setSearchedTopics(
      response.docs.map((doc) => {
        return { ...doc.data(), id: doc.id };
      })
    );
  });
}

const addImageToDb = (data) => {
  addDoc(dbRef, data)
    .then(() => {
      console.log('added');
    })
    .catch((err) => console.log(err));
};

export const uploadImage = (file, topic) => {
  if (!file.name || file.name === undefined) {
    return;
  }
  const picRef = ref(storage, `pictures/${file.name}`);
  const uploadTask = uploadBytesResumable(picRef, file);

  uploadTask.on(
    'state_changed',
    (snapshot) => {
      console.log(
        Math.round(snapshot.bytesTransferred / snapshot.totalBytes) * 100
      );
    },
    (error) => {
      console.log(error);
    },
    () => {
      getDownloadURL(uploadTask.snapshot.ref).then((response) => {
        console.log(response);
        addImageToDb({ topic: topic, imageUrl: response });
      });
    }
  );
};

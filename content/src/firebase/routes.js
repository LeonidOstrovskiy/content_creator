import {
  collection,
  addDoc,
  onSnapshot,
  doc,
  getDoc,
} from 'firebase/firestore';
import { firestore } from './config';

const textDb = collection(firestore, 'texts');

export function addToDB(data) {
  addDoc(textDb, data)
    .then(() => console.log('added!'))
    .catch((error) => console.log(error));
}

export function getTopics(setTopics, setSearchedTopics) {
  onSnapshot(textDb, (response) => {
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

export async function getDocById(id, setText, setTopic, editor) {
  // console.log(id);
  const docRef = doc(textDb, id);
  try {
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      return;
    }

    editor.chain().focus().setContent(docSnap.data().text).run();
    setText(docSnap.data().text);
    setTopic(docSnap.data().topic);
  } catch (error) {
    console.log(error);
  }
}

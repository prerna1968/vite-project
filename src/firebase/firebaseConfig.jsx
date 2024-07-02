
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBhOK2vxrY1Nuz2PAUIKP2_8sXeDbFjWQI",
  authDomain: "myblog-52a1a.firebaseapp.com",
  projectId: "myblog-52a1a",
  storageBucket: "myblog-52a1a.appspot.com",
  messagingSenderId: "757677924529",
  appId: "1:757677924529:web:2b31b0fc19d5fcdb68c290"
};

const app = initializeApp(firebaseConfig);
const fireDB = getFirestore(app);
const auth = getAuth(app)
const storage = getStorage(app);
export { fireDB, auth, storage };
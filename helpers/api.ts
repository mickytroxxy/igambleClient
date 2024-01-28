import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs, doc, setDoc, query, where, updateDoc, GeoPoint, orderBy, limit, deleteDoc, onSnapshot } from 'firebase/firestore';
import { getStorage, ref, getDownloadURL, uploadBytesResumable } from "firebase/storage";
import { initializeFirestore } from 'firebase/firestore'
import { geohashForLocation, geohashQueryBounds,Geohash} from 'geofire-common';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { UserProfile } from "../constants/Types";
// @ts-ignore
import geohash from "ngeohash";

interface FirebaseConfig {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
}

const firebaseConfig: FirebaseConfig = {
  apiKey: "AIzaSyDP35ucGZVns4LZhKBonIR7HZJV94w6yU0",
  authDomain: "igamble-f05bc.firebaseapp.com",
  projectId: "igamble-f05bc",
  storageBucket: "igamble-f05bc.appspot.com",
  messagingSenderId: "91491448952",
  appId: "1:91491448952:web:13a2ebb628650fb79d158d"
};

const app = initializeApp(firebaseConfig);
const db = initializeFirestore(app, { experimentalForceLongPolling: true })
const auth = getAuth(app);
//const db = getFirestore();
export const getGeoPoint = (latitude: number, longitude: number) => geohashForLocation([latitude, longitude]);
export const createData = async (tableName: string, docId: string, data: any): Promise<boolean> => {
  try {
    await setDoc(doc(db, tableName, docId), data);
    return true;
  } catch (e) {
    console.error(e);
    return false;
  }
};

export const loginApi = async (phoneNumber: string, password: string): Promise<any[]> => {
  try {
    const querySnapshot = await getDocs(query(collection(db, "users"), where("phoneNumber", "==", phoneNumber), where("password", "==", password), where("deleted", "==", false)));
    //await signInWithEmailAndPassword(auth, phoneNumber, password);
    const data = querySnapshot.docs.map((doc) => doc.data());
    return data;
  } catch (e) {
    console.error(e);
    return [];
  }
};
export const getPlayedMusic = async (id: any): Promise<any[]> => {
  try {
    const querySnapshot = await getDocs(query(collection(db, "playedMusic"), where("id", "==", id)));
    const data = querySnapshot.docs.map((doc) => doc.data());
    return data;
  } catch (e) {
    console.error(e);
    return [];
  }
};
export const getUsers = async (latitude: number, longitude: number, radius: number): Promise<any[]> => {
  try {
    const range = getGeohashRange(latitude, longitude, radius);
    const querySnapshot = await getDocs(
      query(
        collection(db, 'users'),
        limit(300),
        where('type', '==', "SERVICE PROVIDER"),
        where("deleted", "==", false),
        where('geoHash', '>=', range.lower),
        where('geoHash', '<=', range.upper)
      )
    );

    const data = querySnapshot.docs.map((doc) => doc.data());
    return data;
  } catch (e) {
    console.error(e);
    return [];
  }
};

export const getRequestData = async (user1: string, user2: string, setRequestData?:any): Promise<any[]> => {
  try {
    const connectionIds = [user1 + user2, user2 + user1];
    const q = query(collection(db, "requests"),where("connectionId", "in", connectionIds),where("status", "!=", "COMPLETED"));
    return new Promise<any[]>((resolve, reject) => {
      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const data = querySnapshot.docs.map((doc) => doc.data());
        resolve(data);
        setRequestData(data)
      }, (error) => {
        reject(error);
      });
      return () => unsubscribe();
    });
  } catch (e) {
    console.error(e);
    return [];
  }
};
export const getMessagesData = async (user1: string,user2: string,appendMessages?: any): Promise<any[]> => {
  try {
    const connectionIds = [user1 + user2, user2 + user1];
    const q = query(collection(db, "chats"), where("connectionId", "in", connectionIds));
    return new Promise<any[]>((resolve, reject) => {
      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const messagesFireStore = querySnapshot.docChanges().filter(({ type }) => type === 'added').map(({ doc }) => {
          const message = doc.data();
          return { ...message, createdAt: message.createdAt.toDate() };
        }).sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
        if (messagesFireStore.length > 0) {
          if (appendMessages) {
            appendMessages(messagesFireStore);
          }
          resolve(messagesFireStore);
        }
      }, (error) => {
        reject(error);
      });
      return () => unsubscribe();
    });
  } catch (error) {
    console.error(error);
    return [];
  }
};
export const getAllMessages = async (user1: string,appendAllMessages?: any): Promise<any[]> => {
  try {
    const q = query(collection(db, "chats"), where("fromToArray", "array-contains-any", [user1]));
    return new Promise<any[]>((resolve, reject) => {
      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const messagesFireStore = querySnapshot.docChanges().filter(({ type }) => (type=='added' || type=='modified')).map(({ doc }) => {
          const message = doc.data();
          return { ...message, createdAt: message.createdAt.toDate() };
        });
        if (messagesFireStore.length > 0) {
          if (appendAllMessages) {
            appendAllMessages(messagesFireStore); 
          }
          resolve(messagesFireStore);
          
        }
      }, (error) => {
        reject(error);
      });
      return () => unsubscribe();
    });
  } catch (error) {
    console.error(error);
    return [];
  }
};
export const getTransactions= async (clientId: string): Promise<any[]> => {
  try {
    const querySnapshot = await getDocs(query(collection(db, "transactions"), where("fromToArray", "array-contains-any", [clientId])));
    const data = querySnapshot.docs.map((doc) => doc.data());
    return data;
  } catch (e) {
    console.error(e);
    return [];
  }
};
export const getTokens = async (accountId: string): Promise<any[]> => {
  try {
    const querySnapshot = await getDocs(query(collection(db, "tokens"), where("accountId", "==", accountId)));
    const data = querySnapshot.docs.map((doc) => doc.data());
    return data;
  } catch (e) {
    console.error(e);
    return [];
  }
};
export const getTokenById = async (accountId: string, token:any): Promise<any[]> => {
  try {
    const querySnapshot = await getDocs(query(collection(db, "tokens"), where("accountId", "==", accountId), where("token", "==", token)));
    const data = querySnapshot.docs.map((doc) => doc.data());
    return data;
  } catch (e) {
    console.error(e);
    return [];
  }
};
export const getMyGamblingItems = async (accountId: string): Promise<any[]> => {
  try {
    const querySnapshot = await getDocs(query(collection(db, "users"), where("clientId", "==", accountId)));
    const data = querySnapshot.docs.map((doc) => doc.data());
    return data;
  } catch (e) {
    console.error(e);
    return [];
  }
};
export const getMyWins= async (clientId: string,token:string): Promise<any[]> => {
  try {
    const querySnapshot = await getDocs(query(collection(db, "bettings"), where("clientId", "==", clientId), where("token", "==", token), where("success", "==", true)));
    const data = querySnapshot.docs.map((doc) => doc.data());
    return data;
  } catch (e) {
    console.error(e);
    return [];
  }
};
export const getWithdrawals= async (clientId: string): Promise<any[]> => {
  try {
    const querySnapshot = await getDocs(query(collection(db, "withdrawals"), where("clientId", "==", clientId)));
    const data = querySnapshot.docs.map((doc) => doc.data());
    return data;
  } catch (e) {
    console.error(e);
    return [];
  }
};
export const getUserById = async (clientId: string): Promise<any[]> => {
  try {
    const querySnapshot = await getDocs(query(collection(db, "users"), where("clientId", "==", clientId)));
    const data = querySnapshot.docs.map((doc) => doc.data());
    return data;
  } catch (e) {
    console.error(e);
    return [];
  }
};
export const getUserDetailsByPhone = async (phoneNumber: string): Promise<any[]> => {
    try {
      const querySnapshot = await getDocs(query(collection(db, "users"), where("phoneNumber", "==", phoneNumber)));
      const data = querySnapshot.docs.map((doc) => doc.data());
      return data;
    } catch (e) {
      console.error(e);
      return [];
    }
};

export const getUserDetails = async (accountId: string): Promise<any[]> => {
  try {
    const querySnapshot = await getDocs(query(collection(db, "users"), where("id", "==", accountId)));
    const data = querySnapshot.docs.map((doc) => doc.data());
    return data;
  } catch (e) {
    console.error(e);
    return [];
  }
};

export const updateData = async (tableName: string, docId: string, obj: { field: string; value: any }): Promise<boolean> => {
  try {
    const docRef = doc(db, tableName, docId);
    await updateDoc(docRef, { [obj.field]: obj.value });
    return true;
  } catch (e) {
    console.error(e);
    return false;
  }
};
export const deleteData = async (tableName: string, docId: string): Promise<boolean> => {
  try {
    await deleteDoc(doc(db, tableName, docId));
    return true;
  } catch (e) {
    return false;
  }
};

export const updateUser = async (tableName: string, docId: string, obj:any): Promise<boolean> => {
    try {
      const docRef = doc(db, tableName, docId);
      await updateDoc(docRef, obj);
      return true;
    } catch (e) {
      console.error(e);
      return false;
    }
  };

export const uploadFile = async (file: string, path: string): Promise<string> => {
  const storage = getStorage(app);
  const fileRef = ref(storage, path);
  const response = await fetch(file);
  const blob = await response.blob();
  const uploadTask = await uploadBytesResumable(fileRef, blob);
  const url = await getDownloadURL(uploadTask.ref);
  return url;
};

const getGeohashRange = (latitude:number,longitude:number,distance:number) => {
  const lat = 0.0144927536231884;
  const lon = 0.0181818181818182;
  const lowerLat = latitude - lat * distance;
  const lowerLon = longitude - lon * distance;
  const upperLat = latitude + lat * distance;
  const upperLon = longitude + lon * distance;
  const lower = geohash.encode(lowerLat, lowerLon);
  const upper = geohash.encode(upperLat, upperLon);
  return {
    lower,
    upper
  };
};
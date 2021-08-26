import React, { useRef, useState } from 'react';
import './App.css';

import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';
import 'firebase/analytics';

import { useAuthState } from 'react-firebase-hooks/auth';
import { useCollectionData } from 'react-firebase-hooks/firestore';
 
 firebase.initializeApp({
   apiKey: "AIzaSyBDWk0I3dpzDhJfTNAzuT2TIZp6NWKb2xg",
   authDomain: "superchat-d89af.firebaseapp.com",
   projectId: "superchat-d89af",
   storageBucket: "superchat-d89af.appspot.com",
   messagingSenderId: "530437138596",
   appId: "1:530437138596:web:0f9ead402fa051344d5e31"
 })




const auth = firebase.auth();
const firestore = firebase.firestore();
const analytics = firebase.analytics();

function App() {
  const [user] = useAuthState(auth);
  return (
    <div className="App">
      <header>
        <h1>⚛️👨‍💻  DevChat</h1>
        <SignOut />
      </header>

      <section>
        {user ? <ChatRoom /> : <SignIn />}
      </section>
    </div>
  );
}

  function SignIn(){
    const signInWithGoogle = () => {
      const provider = new firebase.auth.GoogleAuthProvider();
      auth.signInWithPopup(provider);
    }

    return(
      <>
      <button className="sign-in" onClick={signInWithGoogle}>Login com o Google </button>
      <p>Não viole as diretrizes da comunidade ou você será banido para sempre!</p>
      </>
    )
  }

  function SignOut() {
    return auth.currentUser && (
      <button className="sign-out" onClick={() => auth.signOut()}>Sign Out</button>
    )
  }
  

  function ChatRoom(){
    const dummy = useRef();
    const messagesRef = firestore.collection('messages');
    const query = messagesRef.orderBy('createdAt').limit(25);
    
    const [messages] = useCollectionData(query, {idField: 'id'});
    const [formValue, setFormValue] = useState('');

    const sendMessage = async (e) => {
      e.preventDefault();

    const { uid, photoURL } = auth.currentUser;

    await messagesRef.add({
      text: formValue,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      uid, 
      photoURL
    })

    setFormValue('');
    dummy.current.scrollIntoView({ behavior: 'smooth' });
  }
    return (<>
        <main>
          {messages && messages.map(msg => <ChatMessage key={msg.id} message={msg}/>)}
          <span ref={dummy}></span>
        </main>

        <form onSubmit={sendMessage}>
            <input value={formValue} onChange={(e) => setFormValue(e.target.value)} placeholder="diga algo interessante" />
            <button type="submit" disabled={!formValue}>🚀</button>
        </form>
      </>)
    }
   function ChatMessage(props){
      const { text, uid, photoURL } = props.message;

      const messageClass = uid === auth.currentUser.uid ? 'sent' : 'received';

      return (<> 
          <div className={`message ${messageClass}`}>
            <img src={photoURL || 'https://findicons.com/files/icons/1293/the_batman_vol_1/256/batman.png'}/>
            <p1>{text}</p1>
          </div>
      </>)
   }
export default App;

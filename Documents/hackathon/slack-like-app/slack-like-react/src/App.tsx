
import React, { useState, useEffect } from 'react';
import './App.css';
import LoginWithGoogleForm from "./components/LogInWithFirsbase.tsx/LoginWithGoogleForm";
import Contents  from "./components/UserPage/Contents";
import { onAuthStateChanged } from "firebase/auth";
import { fireAuth } from "./firebase";
import SignUp from "./components/LogInWithFirsbase.tsx/SignUpWithMail"
import DefaultPage from "./DefaultPage"
import SignIn from './components/LogInWithFirsbase.tsx/LogInWithMail';
import logo from './logo.svg';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { Link } from 'react-router-dom';





function App() {
  // stateとしてログイン状態を管理する。ログインしていないときはnullになる。
  const [loginUser, setLoginUser] = useState(fireAuth.currentUser);

  // ログイン状態を監視して、stateをリアルタイムで更新する
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(fireAuth, (user) => {
      setLoginUser(user);
    });

    // 最初にログイン状態をuserに入れる。
    return () => {
      unsubscribe();
    };
  }, []);

  // const [currentPage, setCurrentPage] = useState("defaultPage");

  let pageContent;

  // switch (currentPage) {
  //   case "SignUp":
  //     pageContent = <SignUp setCurrentPage={setCurrentPage} />;
  //     break;

  //   case "LoginWithGoogleForm":
  //     pageContent = <LoginWithGoogleForm setCurrentPage={setCurrentPage}/>;
  //     break;

  //   case "SignIn":
  //     pageContent = <SignIn setCurrentPage={setCurrentPage}/>;
  //   break;

  //   case "Contents":
  //     pageContent = <Contents setCurrentPage={setCurrentPage}/>;
  //     break;

  //   default:
  //     pageContent = <DefaultPage setCurrentPage={setCurrentPage}/>;
  //     break;
  // }





  return (
    <div>
      <div className="App">
      <header className="App-header">
      <h1>
        SLACK-LIKE-APP
      </h1>
        <img src={logo} className="App-logo" alt="logo" />

      <div>
        <Link to="/LoginWithGoogle">
          <button>Googleアカウントでサインイン</button>
        </Link>


        <Link to="/LogInWithMail">
          <button>メールアドレスでログイン</button>
        </Link>

        <Link to="/SignUpWithMail">
          <button>メールアドレスで登録する</button>
        </Link>
      </div>
      
      </header>
    </div>
  </div>
    
  );
}


export default App;



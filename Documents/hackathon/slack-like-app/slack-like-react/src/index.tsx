import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import LoginWithGoogleForm from './components/LoginWithGoogleForm';
import SignUpWithMail from './components/SignUpWithMail';
import LogInWithMail from './components/LogInWithMail';
import reportWebVitals from './reportWebVitals';
import { Route, BrowserRouter } from 'react-router-dom';
import IsThereAccount from './components/IsThereAccount';
import RegisterAccount from './components/RegisterAccount';




ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
      <div>
        <Route exact path="/" component={App} />
        {/* <Route exact path="/Login" component={LogInPage} /> */}
        <Route exact path="/LoginWithGoogle" component={LoginWithGoogleForm} />
        <Route exact path="/SignUpWithMail" component={SignUpWithMail} />
        <Route exact path="/LoginWithMail" component={LogInWithMail} />
        {/* <Route exact path="/UserPage" component={UserPage} /> */}
        <Route path="/IsThereAccount" component={IsThereAccount} />
        <Route path="/RegisterAccount" component={RegisterAccount} />

        


        
        
      </div>
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById("root")
);


// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

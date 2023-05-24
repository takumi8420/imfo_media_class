import { useState } from "react";
import RegisterForm from "./RegisterForm"


function RegisterAccount(){

  const url = window.location.href;
  const uid = url.substring(url.lastIndexOf("/") + 1);


  const onSubmit = async (name: string, age: number) => {
    try {
      const result = await fetch(`https://hackthon1-rzmhhbabrq-uc.a.run.app/register_user/${uid}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Request-Methods": "POST",
          "Access-Control-Request-Headers": "Content-Type"
          },
        body: JSON.stringify({
          name: name,
          age: age
        }),
      });
      if (!result.ok) {
        throw Error(`Failed to create user: ${result.status}`);
      }

    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div style={{ display: "flex", flexDirection:  "column"}}>
      <div className="App">
        <header className="App-header">
          <div>
            <h1>User Register</h1>
          </div>
        </header>
        <RegisterForm
        onSubmit={onSubmit} 
        />
      </div>
      </div>
  );
};



export default RegisterAccount;
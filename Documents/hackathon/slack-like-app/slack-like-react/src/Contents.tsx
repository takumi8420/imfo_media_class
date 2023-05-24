import React from "react";
import './Contents.css';
import { useState } from "react";




const Contents: React.FC = () => {
  const [data, setData] = useState([]);
  const url = window.location.href;
  const uid = url.substring(url.lastIndexOf("/") + 1);
  console.log(uid);


  type data ={
    messageId: string;
    channalId: string; 
    userId:    string;   
    contents:  string;    
    createdAt: Date;
    userName: string;
  }



  const fetchData = async () => {
    const getResponse = await fetch(`https://hackthon1-rzmhhbabrq-uc.a.run.app/get_messages/${uid}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const data = await getResponse.json();
    console.log("get response is...", data);
    setData(data);
  };

  return (
      <div className="slack-page">
        <div className="sidebar">
          {/* サイドバーのコンテンツ */}
          <p>aaa</p>
        </div>

        <div className="main-content">
          <header className="header">
            <p>aaa</p>
              {/* ヘッダーのコンテンツ */}
          </header>
          <div className="chat-area">
              {/* チャットエリアのコンテンツ */}
              <div style={{ display: "flex", flexDirection:  "column"}}>
                <div className = "table">
                  {data.map((data: data) => (
                    <div key={data.messageId}>
                    <p className="element">Name: {data.userName}  {data.contents}</p>
                    </div>
                  ))}
                </div>
              </div>   
          </div>
          <div className="user-list">
            {/* ユーザーリストのコンテンツ */}
            <p>入力欄</p>
          </div>
        </div>
      </div>
  );
};

export default Contents;

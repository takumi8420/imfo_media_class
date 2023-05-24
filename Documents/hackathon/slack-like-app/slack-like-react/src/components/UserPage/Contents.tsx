import React from "react";
import './Contents.css';
import { useState } from "react";




const Contents: React.FC = () => {
  const [messageDatas, setMessageDatas] = useState<messageData[]>([]);
  const [channelData, setChannelData] = useState<channlData[]>([]);
  const [workspaceData, setWorkspaceData] = useState<workspaceData[]>([]);
  const url = window.location.href;
  const uid = url.substring(url.lastIndexOf("/") + 1);
  // console.log(uid);


  type messageData ={
    messageId: string;
    channalId: string; 
    userId:    string;   
    contents:  string;    
    createdAt: Date;
    userName: string;
  }

  type channlData ={
    channalName: string; 
  }

  type workspaceData ={
    workspaceName: string; 
  }

  const fetchMessageData = async () => {
    const getResponse = await fetch(`https://hackthon1-rzmhhbabrq-uc.a.run.app/get_messages/${uid}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const data = await getResponse.json();
    console.log("get response is...", data);
    setMessageDatas(data);
  };

  const fetchChannelData = async () => {
    const getResponse = await fetch(`https://hackthon1-rzmhhbabrq-uc.a.run.app/get_channel/${uid}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const data = await getResponse.json();
    console.log("get response is...", data);
    setChannelData(data);
  };

  const fetchWorkspaceData = async () => {
    const getResponse = await fetch(`https://hackthon1-rzmhhbabrq-uc.a.run.app/get_workspace/${uid}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const data = await getResponse.json();
    console.log("get response is...", data);
    setWorkspaceData(data);
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
            <div style={{ display: "flex", flexDirection: "column" }}>
              <div className="table">
                {messageDatas.map((data: messageData) => (
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

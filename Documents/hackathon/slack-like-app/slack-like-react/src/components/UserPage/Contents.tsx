import React from "react";
import './Contents.css';
import { useState, useEffect } from "react";
import Form from "./Form";




const Contents: React.FC = () => {
  const [messageDatas, setMessageDatas] = useState<messageData[]>([]);
  const [channelData, setChannelData] = useState<channelData[]>([]);
  const [currentChannelData, setCurrentChannelData] = useState<channelData>();
  const [workspaceData, setWorkspaceData] = useState<workspaceData[]>([]);
  const [currentWorkspaceData, setCurrentWorkspaceData] = useState<workspaceData>();
  const url = window.location.href;
  const uid = url.substring(url.lastIndexOf("/") + 1);
  // console.log(uid);

  type messageData ={
    user_name: string;
    message_id: string;
    channel_id: string; 
    user_id:    string;   // user_id が同じ人に限り編集が可能になるようにしたい。（バックエンドでそのことを航路したくない。）
    contents:  string;    
    created_at: string;
    is_edited: boolean;
    isMenuOpen: boolean;
  }

  type workspaceData ={
    workspace_user_name: string;
    workspace_id: string;
    workspace_name: string; 
  }

  type channelData ={
    channel_id: string;
    channel_name: string; 
  }

  const fetchMessageData = async () => {
    const getResponse = await fetch(`https://hackthon1-rzmhhbabrq-uc.a.run.app/get_messages_with_channel_id/${currentChannelData?.channel_id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    console.log("ここまでおk");
    const data = await getResponse.json();
    console.log("get response is...", data);

    if (JSON.stringify(data) !== JSON.stringify(messageDatas)) {
      setMessageDatas(data);
    }
    // console.log(messageDatas[0].contents)
  };

  const initialfetchMessageData = async () => {
    const getResponse = await fetch(`https://hackthon1-rzmhhbabrq-uc.a.run.app/get_messages_with_channel_id/${currentChannelData?.channel_id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    console.log("ここまでおk");
    const data = await getResponse.json();
    console.log("get response is...", data);
    setMessageDatas(data);
    // console.log(messageDatas[0].contents)
  };


  const onSendMessage = async (channelId: string, userId: string, message: string) => {
    try{
      const result = await fetch("https://hackthon1-rzmhhbabrq-uc.a.run.app/send_messages/${uid}",{
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          channel_id: channelId,
          user_id: userId, 
          contents: message,
        }),
      });
        if (!result.ok) {
          throw Error(`Failed to create user: ${result.status}`);
        }
      } catch (err) {
        console.error(err);
      }
      fetchMessageData();
    }

  // const fetchWorkspaceData = async () => {
  //   const getResponse = await fetch(`https://hackthon1-rzmhhbabrq-uc.a.run.app/get_workspace_with_user_id/${uid}`, {
  //     method: "GET",
  //     headers: {
  //       "Content-Type": "application/json",
  //     },
  //   });
  //   const data = await getResponse.json();
  //   console.log("get workspace response is...", data);
  //   setWorkspaceData(data);
  // };

  // const fetchChannelData = async () => {
  //   console.log("currentworkspaceは：", currentWorkspaceData?.workspace_id);
  //   const getResponse = await fetch(`https://hackthon1-rzmhhbabrq-uc.a.run.app/get_channel_with_workspace_id/${currentWorkspaceData?.workspace_id}`, {
  //     method: "GET",
  //     headers: {
  //       "Content-Type": "application/json",
  //     },
  //   });
  //   const data = await getResponse.json();
  //   console.log("get channel response is...", data);
  //   setChannelData(data);
  // };

  const initialFetchChannelData = async () => {
    console.log("currentworkspaceは:", currentWorkspaceData?.workspace_id);
    const getResponse = await fetch(`https://hackthon1-rzmhhbabrq-uc.a.run.app/get_channel_with_workspace_id/${currentWorkspaceData?.workspace_id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const data = await getResponse.json();
    console.log("get channel response is...", data);
    setChannelData(data);
    setCurrentChannelData(data[0]);
    // console.log(currentChannelData);
  };

  const initialFetchWorkspaceData = async () => {
    const getResponse = await fetch(`https://hackthon1-rzmhhbabrq-uc.a.run.app/get_workspace_with_user_id/${uid}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const data = await getResponse.json();
    console.log("get workspace response is...", data);
    setWorkspaceData(data);
    setCurrentWorkspaceData(data[0]);
    console.log(currentWorkspaceData);
  };

  const handleMenuOpen = (messageId: string) => {
    const updatedMessageDatas = messageDatas.map((data) => {
      if (data.message_id === messageId) {
        return { ...data, isMenuOpen: true };
      }
      return data;
    });
    setMessageDatas(updatedMessageDatas);
  };

  const handleMenuClose = (messageId: string) => {
    const updatedMessageDatas = messageDatas.map((data) => {
      if (data.message_id === messageId) {
        return { ...data, isMenuOpen: false };
      }
      return data;
    });
    setMessageDatas(updatedMessageDatas);
  };



  useEffect(() => {
    initialFetchChannelData();
    console.log("get workspace response is...", currentWorkspaceData?.workspace_id);
  }, [currentWorkspaceData])

  useEffect(() => {
    initialfetchMessageData();
    console.log("get workspace response is...", currentWorkspaceData?.workspace_id);
  }, [currentChannelData])

  useEffect(() => {
   initialFetchWorkspaceData();
  }, []);

  useEffect(() => {
    const intervalId = setInterval(fetchMessageData, 5000);

    return () => clearInterval(intervalId);
  }, [messageDatas]);

  

  return (
      <div className="slack-page">

        <div className="top-bar" style={{ position: "fixed" }}>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div className="workspace_table">
              {workspaceData.map((data: workspaceData) => (
                <div key={data.workspace_id} className="workspace-contents">
                  <p className="workspace_element">
                      {data.workspace_name} </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="body-contents">
          <div className="sidebar1" style={{ position: "fixed" }}>
            {/* サイドバーのコンテンツ */}
            <p>aaa</p>
          </div>
          
          <div className="main-content">

            <header className="header" style={{ position: "fixed"}}>
              <p>現在のチャンネル</p>
                {/* ヘッダーのコンテンツ */}
            </header>


            <div className="chat-area" style={{ overflowY: "scroll" }}>
              {/* チャットエリアのコンテンツ */}
              <div style={{ display: "flex", flexDirection: "column" }}>
                <div className="chat_table" >
                  {messageDatas.map((data: messageData) => (
                    <div key={data.message_id} className="chat-contents">

                      <p className="chat_element"                  
                        onMouseEnter={() => handleMenuOpen(data.message_id)} // handleMenuOpenを呼び出すように修正
                        onMouseLeave={() => handleMenuClose(data.message_id)} // handleMenuCloseを呼び出すように修正
                        >
                        {data.user_name} <span className="date">{data.created_at}</span> <br />
                        {data.contents}

                        {data.isMenuOpen && (
                          <div className="menu">
                            {/* メニューのコンテンツ */}
                              <p>menu</p>
                            {/* ... */}
                          </div>
                    )}
                      </p>

                    
                    </div>
                  ))}
                </div>
              </div>   
            </div>
            {/* <div className="user-list">
              <Form 
                onSubmit={onSendMessage}
                channelId={currentChannelData.channel_id}
                userId={uid}
              />
              <p>入力欄</p>
            </div> */}



            <div className="user-list" style={{ position: "fixed" }}>
                {currentChannelData !== undefined ? (
                  <Form
                    onSubmit={onSendMessage}
                    channelId={currentChannelData.channel_id}
                    userId={uid}
                  />
                ) : null}
            </div>



          </div>

        </div>
      </div>
  );
};

export default Contents;

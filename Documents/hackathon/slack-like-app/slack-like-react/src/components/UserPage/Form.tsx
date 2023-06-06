import { useState } from "react";
import './Form.css';

type Props = {
   onSubmit: (channelId: string, userId: string, message: string) => void;
   channelId: string;
   userId: string;
};

// type Props = {
//   onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
// };

const Form = (props: Props) => {
  const [currentChannelId, setCurrentChannelId] = useState(props.channelId);
  const [messageToSendData, setMessageToSendData] = useState("")
  const uid = props.userId



  const submit = async(e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // props.onSubmit(e);
    props.onSubmit(currentChannelId, uid, messageToSendData);
      if (!messageToSendData) {
        alert("Please enter name");
      return;
    }


    setMessageToSendData("");

  };

  return (

    <form style={{ display: "flex", flexDirection:  "column", height: "100%", width: "100%", backgroundColor: "#2f0364"}} className ="message" onSubmit={submit}>
            <div style={{ flex: "1", backgroundColor: "#148168"}}></div>

      <div style={{ display: "flex", flexDirection: "row", width: "100%"}} >
        {/* <label className = "labelMessage" style={{width: "200px", height: "30px", fontSize: "20px", marginLeft: "20%"}}>
        </label> */}
        {/* <p style={{ width: "100vw", height: "30px", margin: "0px"}}>入力欄</p> */}

        <input style ={{ width: "calc(100vw - 200px)", height: "30px", marginBottom: "20px", backgroundColor: "rgba(47, 3, 100, 0.5)", padding: "0px"}}
          type={"text"}
          // style={{ marginBottom: 20 }}
          value={messageToSendData}
          onChange={(e) => {
            setMessageToSendData(e.target.value)
          }}
          ></input>

        <button type={"submit"}  style ={{width: "auto", height: "30px", backgroundColor: "black", marginLeft: "10px", color: "white"}}>POST</button>
      </div>

      {/* <div style={{ flex: "1", backgroundColor: "#148168"}}></div> */}

      {/* <div>
        <button type={"submit"}  style ={{width: "100vw", height: " 30px", paddingTop: "0px", marginBottom: "0px"}}>POST</button>
      </div> */}

    </form>
  );
};

export default Form;


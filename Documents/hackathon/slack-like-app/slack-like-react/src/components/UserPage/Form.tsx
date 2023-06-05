import { useState } from "react";

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
    <form style={{ display: "flex", flexDirection:  "column"}} onSubmit={submit}>

    
    <div style={{ display: "flex", width: "70%", margin: "10px 20%"}} >
      <label className = "labelMessage" style={{width: "200px", height: "30px", fontSize: "20px", marginLeft: "20%"}}>

      </label>
      <input
        type={"text"}
        // style={{ marginBottom: 20 }}
        value={messageToSendData}
        onChange={(e) => {
          setMessageToSendData(e.target.value)
        }}
        style={{marginRight: "20%",width: "200px"}}
        ></input>
    </div>
    <div>
      <button type={"submit"}  style ={{width: "30vh", height: " 40px"}}>POST</button>
    </div>

    </form>
  );
};

export default Form;
import { useState } from "react";
import { Button } from "@mui/material";
import { Send as SendIcon } from '@mui/icons-material';

type Props = {
   onSubmit: (channelId: string, userId: string, message: string) => void;
   channelId: string;
   userId: string;
};

// type Props = {
//   onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
// };

const Form = (props: Props) => {
  const [messageToSendData, setMessageToSendData] = useState("")
  const uid = props.userId



  const submit = async(e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // props.onSubmit(e);
    props.onSubmit(props.channelId, uid, messageToSendData);
      if (!messageToSendData) {
        alert("Please enter name");
      return;
    }
    setMessageToSendData("");
  };

  return (

    <form style={{ display: "flex", flexDirection:  "column", height: "100%", width: "100%", backgroundColor: "#2f0364"}} className ="message" onSubmit={submit}>
            <div style={{ flex: "1", backgroundColor: "#2f0364"}}></div>

      <div style={{ display: "flex", flexDirection: "row", width: "100%"}} >
        {/* <label className = "labelMessage" style={{width: "200px", height: "30px", fontSize: "20px", marginLeft: "20%"}}>
        </label> */}
        {/* <p style={{ width: "100vw", height: "30px", margin: "0px"}}>入力欄</p> */}

        <input style ={{ width: "calc(100vw - 200px)", height: "30px", marginBottom: "20px", backgroundColor: "black", padding: "0px", color: "white",}}
          type={"text"}
          // style={{ marginBottom: 20 }}
          value={messageToSendData}
          onChange={(e) => {
            setMessageToSendData(e.target.value)
          }}
          ></input>

      </div>
      <Button type={"submit"} variant="contained" endIcon={<SendIcon />}>
        Send
      </Button>


    </form>
  );
};

export default Form;


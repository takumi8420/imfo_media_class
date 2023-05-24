import React, { useState, useEffect } from "react";
import { useHistory } from 'react-router-dom';

interface User {
  user_id: string;
  user_name: string;
  age: number;
  // 他のユーザープロパティを追加する場合はここに追記
}

const IsThereAccount: React.FC = () => {
  const [userData, setUserData] = useState<User>();
  const history = useHistory();

  useEffect(() => {
    const fetchData = async () => {
      try {
        // URLからuidを取得
        const url = window.location.href;
        const uid = url.substring(url.lastIndexOf("/") + 1);
        console.log(uid);

        // uidが存在する場合のみGETリクエストを送る
        if (uid) {
          const getResponse = await fetch(`https://hackthon1-rzmhhbabrq-uc.a.run.app/search_user/${uid}`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              "Access-Control-Request-Methods": "GET",
              "Access-Control-Request-Headers": "Content-Type"
            },
          });

          if (getResponse.ok) {
            // const data: User[] = await getResponse.json();
            // const filteredData = data.filter((user) => user.user_id === uid);
            // setUserData(filteredData);
            // console.log("Filtered data is:", filteredData);
            // // 取得したデータを使って処理を行う
              const data: User = await getResponse.json();
              // const filteredData = [data].filter((user) => user.user_id === uid);
              setUserData(data);
              // console.log("Filtered data is:", filteredData);
              // 取得したデータを使って処理を行う
              history.push(`/IsThereAccount/${data.user_id}`);
          }
           else {
            console.error("Failed to fetch data:", getResponse.statusText);
          }
        } else {
          console.error("No uid found in the URL");
        }
      } catch (error) {
        console.error("can not catch :", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div>
          <p>UID:</p>
        
    </div>


  );
};

export default IsThereAccount;

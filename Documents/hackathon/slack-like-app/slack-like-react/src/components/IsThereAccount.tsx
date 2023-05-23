import React, { useState, useEffect } from "react";

interface User {
  uid: string;
  user_name: string;
  age: number;
  registered_at: Date;
  // 他のユーザープロパティを追加する場合はここに追記
}

const IsThereAccount: React.FC = () => {
  const [userData, setUserData] = useState<User[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // URLからuidを取得
        const url = window.location.href;
        const uid = url.substring(url.lastIndexOf("/") + 1);

        // uidが存在する場合のみGETリクエストを送る
        if (uid) {
          const getResponse = await fetch("https://hackthon1-rzmhhbabrq-uc.a.run.app/search_user/${uid}", {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          });

          if (getResponse.ok) {
            const data: User[] = await getResponse.json();
            const filteredData = data.filter((user) => user.uid === uid);
            setUserData(filteredData);
            console.log("Filtered data is:", filteredData);
            // 取得したデータを使って処理を行う
          } else {
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
      {userData.map((user) => (
        <div key={user.uid}>
          <p>UID: {user.uid}</p>
          <p>User Name: {user.user_name}</p>
          <p>Age: {user.age}</p>
          <p>Registered At: {user.registered_at.toLocaleString()}</p>
        </div>
      ))}
    </div>
  );
};

export default IsThereAccount;

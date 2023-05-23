import { useState } from "react";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { useHistory } from 'react-router-dom';

const SignIn: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const auth = getAuth();
  const history = useHistory();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();


    signInWithEmailAndPassword(getAuth(), email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        const uid = user.uid;

        history.push(`/IsThereAccount/${uid}`);
      })
      .catch((error) => {
        ResetEmail();
        ResetPassword();
        const errorMessage = error.message;
        alert("メールアドレスかパスワードが違います。もう一度試してください。");
      });
  };

  const handleChangeEmail = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const handleChangePassword = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  const ResetEmail = () => {
    setEmail("");
  };
  const ResetPassword = () => {
    setPassword("");
  };

  return (
    <div>
      <h1>サインイン</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>メールアドレス</label>
          <input
            name="email"
            type="email"
            placeholder="email"
            value={email}
            onChange={handleChangeEmail}
          />
        </div>
        <div>
          <label>パスワード</label>
          <input
            name="password"
            type="password"
            value={password}
            onChange={handleChangePassword}
          />
        </div>
        <div>
          <button type="submit">サインイン</button>
        </div>
      </form>
    </div>
  );
};

export default SignIn;
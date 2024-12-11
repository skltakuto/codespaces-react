import { useEffect, useState } from "react";
import liff from "@line/liff";
import "./App.css";
//import ShootingGame from "./ShootingGame";
//import ShoppingListApp from "./Shopping";
import ShoppingListApp from "./Shopping";


function App() {
  const [name, setName] = useState("");

  useEffect(() => {
    liff
      .init({
        liffId: import.meta.env.VITE_LIFF_ID
      })
      .then(() => {
        liff.getProfile()
          .then((profile) => {
            setName(profile.displayName);
          })
      })
  }, []);
  
  return (
    <div className="App">
      {name && <p>こんにちは、{name}さん</p>}
      <ShoppingListApp />
    </div>
  );
}

export default App;
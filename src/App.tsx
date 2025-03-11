import "./App.css";
import BoxPage from "./BoxPage";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "@emran-alhaddad/saudi-riyal-font/index.css";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route index path="/" element={<BoxPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

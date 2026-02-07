import { Routes, Route } from "react-router-dom";
import Loader from "./pages/Loader";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Tbr from "./pages/Tbr";
import Info from "./pages/Info";
import Suggest from "./components/Suggest";
import Cursor from "./components/Cursor";
import Cards from "./components/Cards.jsx";
import Quotes from "./pages/Quotes.jsx";

function App() {
  return (
    <>
      <Loader />
      <Cursor />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/mytbr" element={<Tbr />} />
        <Route path="/explore" element={<Info />} />
        <Route path='/profile' element={<Cards />} />
        <Route path='/quotes' element={<Quotes />} />
      </Routes>
    </>
  );
}

export default App;
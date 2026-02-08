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
import CreateQuotes from "./components/CreateQuotes.jsx";

function App() {
  return (
    <>
      <Loader />
      <Cursor />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/home" element={<Home />} />

        <Route path="/login" element={<Login />} />
        <Route path="/mytbr" element={<Cards />} />
        <Route path="/explore" element={<Info />} />
        <Route path='/mytbr' element={<Cards />} />
        <Route path='/library' element={<Tbr />} />
        <Route path='/quotes' element={<Quotes />} />
        <Route path='/createquote' element={<CreateQuotes />} /> 
        {/* <Route path='/myquotes' element={< />} />  */}
      </Routes>
    </>
  );
}

export default App;
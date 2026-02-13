import { Routes, Route } from "react-router-dom";
import Loader from "./pages/Loader";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Tbr from "./pages/Tbr";
import Info from "./pages/Info";
import Cursor from "./components/Cursor";
import Quotes from "./pages/Quotes.jsx";
import CreateQuotes from "./components/CreateQuotes.jsx";
import Library from "./pages/Library.jsx";
import Explore from "./pages/Explore.jsx";
import Profile from "./pages/Profile.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";

function App() {
  return (
    <>
      <Loader />
      <Cursor />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/home" element={<Home />} />

        <Route path="/login" element={<Login />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/explore" element={<Explore />} />
          <Route path='/mytbr' element={<Tbr />} />
          <Route path='/quotes' element={<Quotes />} />
          <Route path='/createquote' element={<CreateQuotes />} /> 
          <Route path="/library" element={<Library />} />
          <Route path="/info" element={<Info />} />
          <Route path='/profile' element={<Profile />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
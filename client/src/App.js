import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Login from './Components/Login';
import Home from './Components/Home';
import NavBar from './Components/Navbar';
import Settings from './Components/Settings'
import PrivateRoutes from './Tools/Routes/PrivateRoutes';
import Package from './Components/Package';
import Packages from './Components/Packages'
import Signup from './Components/Signup';
import NoMatchedPath from './Tools/Routes/NoMatchedPath';
import ChatPage from './Components/Settings/Communication/View/ChatPage';
import About from './Components/About';
import { Routes, Route } from 'react-router-dom';
import './Tools/sComponents/SmallComponents.css'
import './Components/ComponentsStyle.css'
import './Responsive.css'

import ReactDOM from "react-dom/client";
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import Results from './Components/Results';
import { Container } from 'react-bootstrap';
import Messages from './Components/Settings/Communication/Messages';
import BookingPage from './Components/Settings/Communication/View/BookingPage';


function App() {

  return (
    <div className="App">
      <NavBar />

      <div className='containing'>

      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/login' element={<Login />} />
        <Route path='/signup' element={<Signup />} />

        <Route element={<PrivateRoutes allowedRoles={[ 2000 ]}/>}>
          <Route path='/settings' element={<Settings />} />
          <Route path='/booking/:id' element={<BookingPage />} />
        </Route>

        <Route path='/packages' element={<Packages />} />
        <Route path='/results/:search' element={<Results />} />
        <Route path='/package/:id' element={<Package />} />

        <Route path='/about' element={<About />} />
        <Route path='/chat/:chatId' element={<ChatPage />} />


        <Route path='/*' element={<NoMatchedPath />} />
      </Routes>

      

      </div>
    </div>
  );
}

export default App;

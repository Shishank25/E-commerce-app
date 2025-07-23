import { BrowserRouter as Router, Routes, Route, BrowserRouter} from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import './App.css'

import Home from './pages/Home/Home';
import UtilityBar from './components/UtilityBar/UtilityBar';
import ProductPage from './pages/ProductPage/ProductPage';
import SignIn from './pages/SignIn/SignIn';
import SearchResults from './pages/Searching/SearchResults';
import Wishlist from './pages/Wishlist/Wishlist';
import ProfilePage from './pages/Profile/ProfilePage';
import OrderHistory from './pages/Profile/OrderHistory';
import Cart from './pages/Cart/Cart';
import Settings from './pages/Settings/Settings';
import Reset from './pages/ResetPassword/Reset';
import ResetPassword from './pages/ResetPassword/ResetPassword';

function App() {

  return (

    <div className='font-inter relative'>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={ <Home /> } />
          <Route path='/products/:prodId' element={ <ProductPage /> } /> 
          <Route path='/Sign-in' element={ <SignIn /> } />
          <Route path='/search-results/:query' element={ <SearchResults /> } />
          <Route path='/wishlist' element={ <Wishlist /> } />
          <Route path='/your-profile' element={ <ProfilePage /> } />
          <Route path='/cart' element={ <Cart /> } />
          <Route path='/your-profile/orders-history' element={ <OrderHistory /> } />
          <Route path='/your-profile/settings' element={ <Settings /> } />
          <Route path='/forgot-password' element={ <Reset /> }/>
          <Route path='/reset-password/:token' element={ <ResetPassword /> } />
        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App

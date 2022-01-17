import React, { lazy, Suspense} from 'react';
import {BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { ToastContainer } from 'react-toastify';
import './App.css';
import store from './redux/store'
import { Provider } from 'react-redux'




// Lazy Loading Components
const LazyLogin = lazy(()=> import('./components/Login'))
const LazyRegister = lazy(()=> import('./components/Register'))
const LazyDashboard = lazy(()=> import('./components/Dashboard'))
const LazyProfile = lazy(()=> import('./components/Profile'))
const LazyAddress = lazy(()=> import('./components/Address'))
const LazyProducts = lazy(()=> import('./components/Products'))
const LazyCart = lazy(()=> import('./components/Cart'))
const LazyCheckout = lazy(()=> import('./components/Checkout'))
const LazyPrivacyPolicy = lazy(()=> import('./components/PrivacyPolicy'))
const LazyOrder = lazy(()=> import('./components/Order'))
const LazyMaps = lazy(()=> import('./components/GoogleMaps'))


function App() { 
  return (
    <div className="App">
      <Suspense fallback={ <img style={{width:'100%'}} src='https://freefrontend.com/assets/img/css-loaders/loading.gif' alt='loading' />}>
      <Provider store={store}>
      <ToastContainer position="top-right" theme='dark' autoClose={5000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover/>
        <Router>
          <Routes>
            <Route path='/' exact element={<LazyDashboard/>} />
            <Route path='/login' exact element={<LazyLogin/>} />
            <Route path='/register' exact element={<LazyRegister/>} />
            <Route path='/profile' exact element={<LazyProfile/>} />
            <Route path='/address' exact element={<LazyAddress/>} />   
            <Route path='/products' exact element={<LazyProducts />} />
            <Route path='/cart' exact element={<LazyCart/>} />
            <Route path ='/checkout' exact element={<LazyCheckout/>} />
            <Route path='/privacypolicy' exact element={<LazyPrivacyPolicy/>} />
            <Route path='/order' exact element={<LazyOrder/>} />
            <Route path='/maps' exact element={<LazyMaps/>} />
          </Routes>
        </Router>
      </Provider>
      </Suspense>
    </div>
  );
}

export default App;

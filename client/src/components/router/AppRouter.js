import React from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import Header from '../Header';
import ChatPage from '../ChatPage';
import LoginPage from '../LoginPage';
import SignupPage from '../SignupPage';

const AppRouter = () => (
  <BrowserRouter>
    <Header />
    <Switch>
      {/* <main className='container'> */}
      <Route path='/' component={SignupPage} exact={true} />
      <Route path='/chat' component={ChatPage} />
      <Route path='/login' component={LoginPage} />
      {/* </main> */}
    </Switch>
  </BrowserRouter>
);

export default AppRouter;

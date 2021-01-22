import React, { Suspense } from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import Header from '../Header';
// import ChatPage from '../ChatPage';
// import LoginPage from '../LoginPage';
// import SignupPage from '../SignupPage';
const ChatPage = React.lazy(() => import('../ChatPage'));
const LoginPage = React.lazy(() => import('../LoginPage'));
const SignupPage = React.lazy(() => import('../SignupPage'));

const AppRouter = () => (
  // <Suspense fallback={<p>Loading...</p>}>
  <BrowserRouter>
    <Header />
    <Suspense fallback={<p>Loading...</p>}>
      <Switch>
        <Route path='/' component={SignupPage} exact={true} />
        <Route path='/chat' component={ChatPage} />
        <Route path='/login' component={LoginPage} />
      </Switch>
    </Suspense>
  </BrowserRouter>
  // </Suspense>
);

export default AppRouter;

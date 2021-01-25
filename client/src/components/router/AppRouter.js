import React, { Suspense, useState } from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import { StateContext } from '../context/StateContext';
import Header from '../Header';
const ChatPage = React.lazy(() => import('../ChatPage'));
const LoginPage = React.lazy(() => import('../LoginPage'));
const SignupPage = React.lazy(() => import('../SignupPage'));
const VideoChatPage = React.lazy(() => import('../VideoChatPage'));

const AppRouter = () => {
  const [state, setState] = useState(null);

  return (
    <BrowserRouter>
      <StateContext.Provider value={{ state, setState }}>
        <Header />
        <Suspense fallback={<p>Loading...</p>}>
          <Switch>
            <Route path='/' component={SignupPage} exact={true} />
            <Route path='/chat' component={ChatPage} />
            <Route path='/video-chat/:room' component={VideoChatPage} />
            <Route path='/video-chat' component={VideoChatPage} />
            <Route path='/login' component={LoginPage} />
          </Switch>
        </Suspense>
      </StateContext.Provider>
    </BrowserRouter>
  );
};

export default AppRouter;

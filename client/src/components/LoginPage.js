import React, { useEffect, useState, useContext } from 'react';
import { SOCKET_URL, API_HOST } from '../config/config';

const LoginPage = props => {
  const [email, setEmail] = useState(
    props?.location?.state?.user?.email || 'her@gmail.com'
  );
  const [password, setPassword] = useState('1111111');

  useEffect(() => {
    document.getElementById('email').focus();
  }, []);

  const handleEmailChange = e => setEmail(e.target.value);
  const handlePasswordChange = e => setPassword(e.target.value);

  const handleFormSubmit = async e => {
    e.preventDefault();

    const response = await fetch(`/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        password,
      }),
    });

    if (response.status === 201) {
      const user = await response.json();
      props.history.push({
        pathname: '/chat',
        state: { user },
      });
    } else {
      const responseMsg = await response.json();
      alert(`${responseMsg.message} ${responseMsg.statusCode}`);
    }
  };

  return (
    <section className='container' style={{ marginTop: 10 + 'vh' }}>
      <div className='row'>
        <div className='col s6 offset-s3'>
          <h3 className='teal-text center-align'>SIGN IN</h3>
        </div>
        <div className='col s6 offset-s3'>
          <form onSubmit={handleFormSubmit}>
            <div className='input-field'>
              <i className='material-icons prefix'>email</i>
              <input
                type='email'
                id='email'
                value={email}
                onChange={handleEmailChange}
              />
              <label htmlFor='email'>Your Email</label>
              <span
                className='helper-text'
                data-error='wrong'
                data-success='right'
              >
                Helper text
              </span>
            </div>
            <div className='input-field'>
              <i className='material-icons prefix'>lock</i>
              <input
                type='password'
                id='password'
                value={password}
                onChange={handlePasswordChange}
              />
              <label htmlFor='password'>Your Password</label>
            </div>
            <button
              className='btn btn-large waves-effect waves-light'
              type='submit'
              name='action'
            >
              Login
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default LoginPage;

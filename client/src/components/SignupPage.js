import React, { useState } from 'react';

const SignupPage = props => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleNameChange = e => setName(e.target.value);
  const handleEmailChange = e => setEmail(e.target.value);
  const handlePasswordChange = e => setPassword(e.target.value);

  const handleFormSubmit = async e => {
    e.preventDefault();

    const response = await fetch('/users', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name,
        email,
        password,
      }),
    });

    if (response.status === 201) {
      const user = await response.json();
      props.history.push({
        pathname: '/login',
        state: { user },
      });
    } else {
      const responseMsg = await response.json();
      console.log(responseMsg);
    }
  };

  return (
    <section className='container' style={{ marginTop: 10 + 'vh' }}>
      <div className='row'>
        <div className='col s6 offset-s3'>
          <h3 className='teal-text center-align'>SIGN UP</h3>
        </div>
        <div className='col s6 offset-s3'>
          <form onSubmit={handleFormSubmit}>
            <div className='input-field'>
              <i className='material-icons prefix'>person</i>
              <input
                type='text'
                id='name'
                value={name}
                onChange={handleNameChange}
              />
              <label htmlFor='name'>Your Name</label>
            </div>
            <div className='input-field'>
              <i className='material-icons prefix'>email</i>
              <input
                type='email'
                id='email'
                value={email}
                onChange={handleEmailChange}
              />
              <label htmlFor='email'>Your Email</label>
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
              Join
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default SignupPage;

import React from 'react';

const LoginPage = props => {
  return (
    <section className='section' style={{ marginTop: 10 + 'vh' }}>
      <div className='row'>
        <div className='col s6 offset-s3'>
          <h3 className='teal-text center-align'>SIGN IN</h3>
        </div>
        <div className='col s6 offset-s3'>
          <form>
            <div className='input-field'>
              <i class='material-icons prefix'>email</i>
              <input type='email' id='email' />
              <label htmlFor='email'>Your Email</label>
              <span class='helper-text' data-error='wrong' data-success='right'>
                Helper text
              </span>
            </div>
            <div className='input-field'>
              <i class='material-icons prefix'>lock</i>
              <input type='password' id='password' />
              <label htmlFor='password'>Your Password</label>
            </div>
            <button
              class='btn btn-large waves-effect waves-light'
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

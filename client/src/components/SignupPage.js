import React from 'react';

const SignupPage = props => {
  return (
    <section className='section' style={{ marginTop: 10 + 'vh' }}>
      <div className='row'>
        <div className='col s6 offset-s3'>
          <h3 className='teal-text center-align'>SIGN UP</h3>
        </div>
        <div className='col s6 offset-s3'>
          <form>
            <div className='input-field'>
              <i class='material-icons prefix'>person</i>
              <input type='text' id='name' />
              <label htmlFor='name'>Your Name</label>
            </div>
            <div className='input-field'>
              <i class='material-icons prefix'>email</i>
              <input type='email' id='email' />
              <label htmlFor='email'>Your Email</label>
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
              Sign UP
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default SignupPage;

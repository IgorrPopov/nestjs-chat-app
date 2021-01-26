import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import M from 'materialize-css/dist/js/materialize.min.js';

const Header = props => {
  useEffect(() => {
    // sidebar
    const sidenav = document.querySelector('#slide-out');
    M.Sidenav.init(sidenav, {});
  }, []);

  return (
    <>
      <nav className='teal lighten-2'>
        <div className='container'>
          <a href='#' data-target='slide-out' className='sidenav-trigger'>
            <i className='material-icons'>menu</i>
          </a>
          <ul id='nav-mobile' className='right hide-on-med-and-down'>
            <li>
              <Link to='/chat'>Chat</Link>
            </li>
            <li>
              <Link to='/'>Join</Link>
            </li>
            <li>
              <Link to='/login'>Login</Link>
            </li>
          </ul>
        </div>
      </nav>
      <ul id='slide-out' className='sidenav sidenav-close'>
        <li>
          <Link to='/chat'>Chat</Link>
        </li>
        <li>
          <Link to='/'>Join</Link>
        </li>
        <li>
          <Link to='/login'>Login</Link>
        </li>
      </ul>
    </>
  );
};

export default Header;

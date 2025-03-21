import React from 'react';
import { NavLink } from 'react-router-dom';
import './Header.css';

const Header: React.FC = () => {
  return (
    <header className="header">
      <nav>
        <ul>
          <li><NavLink to="/">Главная</NavLink></li>
          <li><NavLink to="/profile">Профиль</NavLink></li>
          <li><NavLink to="/login">Войти</NavLink></li>
          <li><NavLink to="/register">Регистрация</NavLink></li>
        </ul>
      </nav>
    </header>
  );
};

export default Header; 
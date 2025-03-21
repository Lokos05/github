import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    login: '',
    password: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log(formData);
  };

  return (
    <div className="login-container">
      <div className="login-form">
        <div className="corporation-logo">
          CORPORATION
        </div>
        <div className="form-title">
          <span className="title-text">А</span>вторизация
        </div>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Логин</label>
            <input
              type="text"
              name="login"
              placeholder="Эл. почта или телефон без +7"
              value={formData.login}
              onChange={handleInputChange}
            />
          </div>
          <div className="form-group">
            <label>Пароль</label>
            <input
              type="password"
              name="password"
              placeholder="Введите пароль"
              value={formData.password}
              onChange={handleInputChange}
            />
          </div>
          <button type="submit" className="submit-button">
            Войти
          </button>
        </form>
      </div>

      <div className="login-sidebar">
        <div className="sidebar-content">
          <h3 className="sidebar-title">Впервые у нас?</h3>
          <button 
            className="register-button"
            onClick={() => navigate('/register')}
          >
            Зарегистрироваться
          </button>
        </div>
        <div className="company-info">
          <div className="company-logo">CP</div>
          <div className="forgot-password">
            Забыли пароль?
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login; 
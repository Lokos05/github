import React, { useState } from 'react';
import './Register.css';

const Register: React.FC = () => {
  const [formData, setFormData] = useState({
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
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
    <div className="register-container">
      <div className="register-form">
        <div className="corporation-logo">
          CORPORATION
        </div>
        <div className="form-title">
          <span className="title-text">Р</span>егистрация
        </div>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Введите электронную почту</label>
            <input
              type="email"
              name="email"
              placeholder="Эл. почта"
              value={formData.email}
              onChange={handleInputChange}
            />
          </div>
          <div className="form-group">
            <label>Введите мобильный телефон</label>
            <input
              type="tel"
              name="phone"
              placeholder="с +7"
              value={formData.phone}
              onChange={handleInputChange}
            />
          </div>
          <div className="form-group">
            <label>Придумайте пароль</label>
            <input
              type="password"
              name="password"
              placeholder="Введите пароль"
              value={formData.password}
              onChange={handleInputChange}
            />
          </div>
          <div className="form-group">
            <label>Повторите пароль</label>
            <input
              type="password"
              name="confirmPassword"
              placeholder="Введите пароль"
              value={formData.confirmPassword}
              onChange={handleInputChange}
            />
          </div>
          <button type="submit" className="submit-button">
            Войти
          </button>
        </form>
      </div>

      <div className="register-sidebar">
        <div className="sidebar-content">
          <h3 className="sidebar-title">Решение для твоего бизнеса</h3>
          <p className="sidebar-description">подробнее {'>>'}</p>
        </div>
        <div className="company-info">
          <div className="company-logo">CP</div>
          <div className="company-name">ООО КОРПОРАЦИЯ</div>
          <div className="company-contact">+7 999 999 99 99</div>
          <div className="company-hours">С 9:00 ДО 18:00</div>
        </div>
      </div>
    </div>
  );
};

export default Register; 
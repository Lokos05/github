import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Register.css';

interface RegisterFormData {
  name: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
}

interface VerificationData {
  code: string;
}

const Register: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<RegisterFormData>({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState<Partial<RegisterFormData>>({});
  const [isVerificationStep, setIsVerificationStep] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');
  const [timeLeft, setTimeLeft] = useState<number>(600); // 10 минут в секундах

  const validateForm = (): boolean => {
    const newErrors: Partial<RegisterFormData> = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Имя обязательно';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email обязателен';
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(formData.email)) {
      newErrors.email = 'Неверный формат email';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Телефон обязателен';
    } else if (!/^\+?[1-9]\d{10,11}$/.test(formData.phone.replace(/\D/g, ''))) {
      newErrors.phone = 'Неверный формат телефона';
    }

    if (!formData.password) {
      newErrors.password = 'Пароль обязателен';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Пароль должен быть не менее 8 символов';
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Пароли не совпадают';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isVerificationStep) {
      if (validateForm()) {
        try {
          // Здесь будет вызов API для регистрации
          setIsVerificationStep(true);
          // Запускаем таймер
          const timer = setInterval(() => {
            setTimeLeft(prev => {
              if (prev <= 1) {
                clearInterval(timer);
                // Если время вышло, возвращаемся к форме регистрации
                setIsVerificationStep(false);
                return 600;
              }
              return prev - 1;
            });
          }, 1000);
        } catch (error) {
          console.error('Ошибка регистрации:', error);
        }
      }
    } else {
      try {
        // Здесь будет вызов API для проверки кода
        if (verificationCode.length === 6) {
          // После успешной верификации
          navigate('/login');
        }
      } catch (error) {
        console.error('Ошибка верификации:', error);
      }
    }
  };

  const handleResendCode = async () => {
    try {
      // Здесь будет вызов API для повторной отправки кода
      setTimeLeft(600); // Сбрасываем таймер
    } catch (error) {
      console.error('Ошибка отправки кода:', error);
    }
  };

  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="register-container">
      <h2>{isVerificationStep ? 'Подтверждение email' : 'Регистрация'}</h2>
      <form onSubmit={handleSubmit}>
        {!isVerificationStep ? (
          <>
            <div className="form-group">
              <label htmlFor="name">Имя</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className={errors.name ? 'error' : ''}
              />
              {errors.name && <span className="error-message">{errors.name}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className={errors.email ? 'error' : ''}
              />
              {errors.email && <span className="error-message">{errors.email}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="phone">Телефон</label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                className={errors.phone ? 'error' : ''}
              />
              {errors.phone && <span className="error-message">{errors.phone}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="password">Пароль</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                className={errors.password ? 'error' : ''}
              />
              {errors.password && <span className="error-message">{errors.password}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="confirmPassword">Подтверждение пароля</label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                className={errors.confirmPassword ? 'error' : ''}
              />
              {errors.confirmPassword && (
                <span className="error-message">{errors.confirmPassword}</span>
              )}
            </div>
          </>
        ) : (
          <div className="verification-container">
            <p>Введите код подтверждения, отправленный на {formData.email}</p>
            <div className="form-group">
              <input
                type="text"
                maxLength={6}
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
                placeholder="Введите код"
              />
            </div>
            <div className="timer">
              Оставшееся время: {formatTime(timeLeft)}
            </div>
            {timeLeft === 0 && (
              <button type="button" onClick={handleResendCode} className="resend-button">
                Отправить код повторно
              </button>
            )}
          </div>
        )}

        <button type="submit" className="submit-button">
          {isVerificationStep ? 'Подтвердить' : 'Зарегистрироваться'}
        </button>
      </form>
    </div>
  );
};

export default Register; 
import React, { useState } from 'react';
import { useFormik } from 'formik';
import * as yup from 'yup';
import {
  Box,
  Button,
  TextField,
  Typography,
  Container,
  Alert,
} from '@mui/material';
import { useWebSocket } from '../contexts/WebSocketContext';
import { LoginData } from '../types/auth';

const validationSchema = yup.object({
  email: yup.string().email('Enter a valid email'),
  phone: yup.string().matches(/^\+?[1-9]\d{1,14}$/, 'Phone number must be in international format'),
  password: yup.string().required('Password is required'),
}).test('emailOrPhone', 'Either email or phone is required', (values) => {
  return Boolean(values.email || values.phone);
});

const LoginForm: React.FC = () => {
  const { sendMessage } = useWebSocket();
  const [error, setError] = useState<string | null>(null);

  const formik = useFormik({
    initialValues: {
      email: '',
      phone: '',
      password: '',
    },
    validationSchema: validationSchema,
    onSubmit: (values: LoginData) => {
      setError(null);
      sendMessage('login', values);
    },
  });

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Вход
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <form onSubmit={formik.handleSubmit}>
          <TextField
            fullWidth
            id="email"
            name="email"
            label="Email"
            margin="normal"
            value={formik.values.email}
            onChange={formik.handleChange}
            error={formik.touched.email && Boolean(formik.errors.email)}
            helperText={formik.touched.email && formik.errors.email}
          />

          <TextField
            fullWidth
            id="phone"
            name="phone"
            label="Телефон"
            margin="normal"
            value={formik.values.phone}
            onChange={formik.handleChange}
            error={formik.touched.phone && Boolean(formik.errors.phone)}
            helperText={formik.touched.phone && formik.errors.phone}
          />

          <TextField
            fullWidth
            id="password"
            name="password"
            label="Пароль"
            type="password"
            margin="normal"
            value={formik.values.password}
            onChange={formik.handleChange}
            error={formik.touched.password && Boolean(formik.errors.password)}
            helperText={formik.touched.password && formik.errors.password}
          />

          <Button
            color="primary"
            variant="contained"
            fullWidth
            type="submit"
            sx={{ mt: 3, mb: 2 }}
          >
            Войти
          </Button>
        </form>
      </Box>
    </Container>
  );
};

export default LoginForm; 
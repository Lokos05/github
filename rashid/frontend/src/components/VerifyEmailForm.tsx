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
import { VerifyEmailData } from '../types/auth';

const validationSchema = yup.object({
  email: yup.string().email('Enter a valid email').required('Email is required'),
  code: yup.string().required('Verification code is required'),
});

const VerifyEmailForm: React.FC = () => {
  const { sendMessage } = useWebSocket();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const formik = useFormik({
    initialValues: {
      email: '',
      code: '',
    },
    validationSchema: validationSchema,
    onSubmit: (values: VerifyEmailData) => {
      setError(null);
      setSuccess(null);
      sendMessage('verifyEmail', values);
    },
  });

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Подтверждение Email
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {success && (
          <Alert severity="success" sx={{ mb: 2 }}>
            {success}
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
            id="code"
            name="code"
            label="Код подтверждения"
            margin="normal"
            value={formik.values.code}
            onChange={formik.handleChange}
            error={formik.touched.code && Boolean(formik.errors.code)}
            helperText={formik.touched.code && formik.errors.code}
          />

          <Button
            color="primary"
            variant="contained"
            fullWidth
            type="submit"
            sx={{ mt: 3, mb: 2 }}
          >
            Подтвердить
          </Button>
        </form>
      </Box>
    </Container>
  );
};

export default VerifyEmailForm; 
import React, { useState } from 'react';
import { Container, Box, Tabs, Tab } from '@mui/material';
import { WebSocketProvider } from './contexts/WebSocketContext';
import RegisterForm from './components/RegisterForm';
import LoginForm from './components/LoginForm';
import VerifyEmailForm from './components/VerifyEmailForm';

function App() {
  const [activeTab, setActiveTab] = useState(0);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  return (
    <WebSocketProvider>
      <Container>
        <Box sx={{ width: '100%', mt: 4 }}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
            <Tabs value={activeTab} onChange={handleTabChange} centered>
              <Tab label="Вход" />
              <Tab label="Регистрация" />
              <Tab label="Подтверждение Email" />
            </Tabs>
          </Box>

          {activeTab === 0 && <LoginForm />}
          {activeTab === 1 && <RegisterForm />}
          {activeTab === 2 && <VerifyEmailForm />}
        </Box>
      </Container>
    </WebSocketProvider>
  );
}

export default App;

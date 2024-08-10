import { Box, Button, PasswordInput, TextInput } from '@mantine/core';
import React, { useEffect, useState } from 'react';
import { authUser } from '../../api/api';
import { ConfirmComponent } from '../confirm/Confirm';
import { useNavigate, useLocation } from 'react-router-dom';
import { Notification } from '../notification/Notificate';
import { emailValidate, passwordValidate } from '../../utils/functions';

const boxStyle = {
  maxWidth: 300,
  margin: 'auto',
  borderRadius: '16px',
  border: 'solid gray 1px',
  padding: '40px',
  boxShadow: '0px 8px 16px rgba(0, 0, 0, 0.2)',
  transition: 'all ease 0.3s',
};

const leftAlignment = {
  style: { textAlign: 'left', width: '100%' },
};

interface ValidateResponse {
  errStatus: boolean;
  errMessage?: string;
}

export const AuthComponent: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordError, setPasswordError] = useState<string>('');
  const [emailError, setEmailError] = useState<string>('');
  const [showConfirm, setShowConfirm] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [showNotification, setShowNotification] = useState<boolean>(false);
  const [timer, setTimer] = useState<number | null>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const data = location.state || {};

  useEffect(() => {
    if (data.email && data.password) {
      setShowNotification(true);
      setEmail(data.email);
      setPassword(data.password);
      const timer = setTimeout(() => {
        setShowNotification(false);
      }, 4000);
      setTimer(timer);
    }
    return () => {
      timer && clearTimeout(timer);
    };
  }, [data]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const emailResponse = emailValidate(email);
    const passResponse = passwordValidate(password);
    if (!emailResponse.errStatus && !passResponse.errStatus) {
      // Валидация пароля и логина
      setLoading(true);
      const response = await authUser({
        email,
        password,
      });

      if (response?.auth_token) {
        navigate('/', { state: { name: `${email}` } });
      } //Успешная авторизация

      if (!response?.success) {
        //отображение ошибок
        if (response?.message === 'Account not verified') {
          setShowConfirm(true);
        } else {
          setEmail('');
          setPassword('');
        }
        setErrors({ errStatus: true, errMessage: response?.message }, { errStatus: false });
      }
    } else {
      setErrors(emailResponse, passResponse);
    }
    setLoading(false);
  };

  const setErrors = (emailResponse: ValidateResponse, passResponse: ValidateResponse) => {
    setEmailError(emailResponse.errStatus ? (emailResponse.errMessage as string) : '');
    setPasswordError(passResponse.errStatus ? (passResponse.errMessage as string) : '');
  };

  const changePassword = (value: string) => {
    setPassword(value.trim());
    setPasswordError('');
  };

  const changeEmail = (value: string) => {
    setEmail(value);
    setEmailError('');
  };

  return (
    <Box style={boxStyle}>
      <h2>Authorization form</h2>
      {showNotification && <Notification title="Success" message={data.message} />}
      <ConfirmComponent currentEmail={email} close={setShowConfirm} showState={showConfirm} />
      <form noValidate onSubmit={handleSubmit}>
        <TextInput
          type="email"
          label="e-mail"
          placeholder="Enter your username"
          value={email}
          onChange={(e) => changeEmail(e.target.value)}
          required
          mb="sm"
          errorProps={leftAlignment}
          labelProps={leftAlignment}
          error={emailError}
        />
        <PasswordInput
          radius="md"
          label="password"
          placeholder="Enter your password"
          value={password}
          onChange={(e) => changePassword(e.target.value)}
          required
          mb="md"
          labelProps={leftAlignment}
          errorProps={leftAlignment}
          error={passwordError}
        />
        <Button loading={loading} type="submit">
          Login
        </Button>
      </form>
      <Button
        onClick={() => navigate('/registration')}
        variant="subtle"
        style={{ marginTop: '10px' }}>
        No account? Register now
      </Button>
    </Box>
  );
};

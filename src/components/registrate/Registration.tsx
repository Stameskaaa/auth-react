import { Box, Button, PasswordInput, TextInput } from '@mantine/core';
import React, { useState } from 'react';
import { registrateUser } from '../../api/api';
import { ConfirmComponent } from '../confirm/Confirm';
import { useNavigate } from 'react-router-dom';
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

export const RegistrationComponent: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordError, setPasswordError] = useState<string>('');
  const [emailError, setEmailError] = useState<string>('');
  const [showConfirm, setShowConfirm] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const navigate = useNavigate();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const emailResponse = emailValidate(email);
    const passResponse = passwordValidate(password);
    if (!emailResponse.errStatus && !passResponse.errStatus) {
      setLoading(true);
      const response = await registrateUser({
        email,
        password,
        repeat_password: password,
      });

      if (!response?.success) {
        setEmail('');
        setPassword('');
        setErrors({ errStatus: true, errMessage: response.message }, { errStatus: false });
      } else {
        navigate('/login', { state: { message: response.message, email, password } });
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
      <h2>Registration form</h2>
      <ConfirmComponent close={setShowConfirm} showState={showConfirm} />
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
          Registrate
        </Button>
      </form>
      <Button onClick={() => navigate('/login')} variant="subtle" style={{ marginTop: '10px' }}>
        Already have an account?
      </Button>
    </Box>
  );
};

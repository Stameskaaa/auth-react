import { TextInput, Box, Button, CloseButton } from '@mantine/core';
import './index.css';
import React, { useEffect, useState } from 'react';
import { cofirmUser, resendConirmCode } from '../../api/api';
import { Notification } from '../notification/Notificate';
import { useNavigate } from 'react-router-dom';

const boxStyle: React.CSSProperties = {
  maxWidth: 300,
  margin: 'auto',
  borderRadius: '16px',
  border: 'solid gray 1px',
  padding: '40px',
  boxShadow: '0px 8px 16px rgba(0, 0, 0, 0.2)',
  transition: 'all ease 0.3s',
  backgroundColor: '#ffffff',
  display: 'flex',
  gap: '10px',
  flexDirection: 'column',
  position: 'relative',
};

const closeButtonStyle: React.CSSProperties = {
  position: 'absolute',
  top: '10px',
  right: '10px',
  background: 'transparent',
  border: 'none',
  padding: '0',
  cursor: 'pointer',
};

interface Props {
  close: React.Dispatch<React.SetStateAction<boolean>>;
  showState: boolean;
  currentEmail?: string;
}

interface Notification {
  state: boolean;
  message: string;
  title: string;
}

export const ConfirmComponent: React.FC<Props> = ({ close, showState, currentEmail }) => {
  const [confirmationCode, setConfirmationCode] = useState<string>('');
  const [errorConfirm, setErrorConfirm] = useState<string>('');
  const [notificationData, setNotificationData] = useState<Notification>({
    state: false,
    message: '',
    title: '',
  });
  const [sendLoading, setSendLoading] = useState<boolean>(false);
  const [resendLoading, setResendLoading] = useState<boolean>(false);
  const [timer, setTimer] = useState<number | null>(null);

  const navigate = useNavigate();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setSendLoading(true);
    const response = await cofirmUser(confirmationCode);

    if (!response?.success) {
      setErrorConfirm(response.message);
    } else {
      setNotificationData({ state: true, message: response.message, title: 'Success' });
      closeModal();
      navigate('/', { state: { name: `${currentEmail}`, message: response.message } });
    }
    setSendLoading(false);
    // Логика подтверждения
  };

  const handleResendCode = async () => {
    if (currentEmail) {
      setResendLoading(true);
      const response = await resendConirmCode(currentEmail);
      if (response?.success) {
        setErrorConfirm('');
        setNotificationData({ state: true, message: response.message, title: 'Success' });
        // response.message
      }
    } else {
      setErrorConfirm('Try auth again');
    }
    setResendLoading(false);
  };

  const changeConfirm = (value: string) => {
    setConfirmationCode(value);
    setErrorConfirm('');
  };

  const closeModal = () => {
    close(false);
    setConfirmationCode('');
    setErrorConfirm('');
  };

  useEffect(() => {
    if (notificationData.state) {
      if (timer) {
        clearTimeout(timer);
      }
      const newTimer = setTimeout(() => {
        setNotificationData({
          state: false,
          message: '',
          title: '',
        });
      }, 5000);

      setTimer(newTimer);
    }
    return () => {
      if (timer) {
        clearTimeout(timer);
      }
    };
  }, [notificationData]);

  return (
    showState && (
      <div onClick={() => closeModal()} className="confirm_modal">
        {notificationData.state && (
          <Notification title={notificationData.title} message={notificationData.message} />
        )}
        <Box onClick={(e) => e.stopPropagation()} style={boxStyle}>
          <CloseButton onClick={() => closeModal()} style={closeButtonStyle} />
          <form noValidate onSubmit={handleSubmit}>
            <TextInput
              placeholder="Enter confirmation code"
              error={errorConfirm}
              label="Confirm your email"
              value={confirmationCode}
              onChange={(e) => changeConfirm(e.target.value)}
              required
              mb="md"
            />
            <div className="modal_button_container">
              <Button loading={sendLoading} type="submit">
                Confirm
              </Button>
              <Button loading={resendLoading} type="button" onClick={handleResendCode}>
                Resend code
              </Button>
            </div>
          </form>
        </Box>
      </div>
    )
  );
};

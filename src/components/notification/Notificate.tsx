import { Alert } from '@mantine/core';
import { IconInfoCircle } from '@tabler/icons-react';

interface Props {
  title: string;
  message: string;
}

export const Notification: React.FC<Props> = ({ title, message }) => {
  return (
    <Alert
      style={{ position: 'absolute', bottom: 0, left: 0, margin: '10px', zIndex: 1000 }}
      variant="light"
      color="green"
      title={title}
      icon={<IconInfoCircle />}>
      {message}
    </Alert>
  );
};

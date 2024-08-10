import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

export const Home: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { name } = location.state || {};

  useEffect(() => {
    if (!name) {
      navigate('/registration');
    }
  }, []); //Импровизированная проверка наличия авторизации без редакса

  return (
    <div>
      {name && 'Вы авторизованы'} {name}
    </div>
  );
};

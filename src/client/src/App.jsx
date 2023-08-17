import { Box } from '@chakra-ui/layout';
import { useState } from 'react';
import './App.css';
import Login from './pages/Login';
import MainApp from './pages/MainApp';

function App() {
  const [content, setContent] = useState('login');

  const onSuccessLogin = () => {
    setContent('app');
  };

  return (
    <Box
      backgroundPosition='center'
      backgroundSize='cover'
      backgroundRepeat='no-repeat'
      backgroundImage='url(/images/slide2.jpg)'
    >
      {content === 'login' ? (
        <Login onSuccessLogin={onSuccessLogin} />
      ) : (
        <MainApp />
      )}
    </Box>
  );
}

export default App;

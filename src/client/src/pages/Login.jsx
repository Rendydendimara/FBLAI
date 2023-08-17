import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  IconButton,
  Input,
  InputGroup,
  InputRightElement,
  Stack,
  useColorModeValue,
} from '@chakra-ui/react';
import { createStandaloneToast } from '@chakra-ui/toast';
import React, { useState } from 'react';
import { BsFillEyeFill, BsFillEyeSlashFill } from 'react-icons/bs';

export default function Login({ onSuccessLogin }) {
  const { toast } = createStandaloneToast();
  const [isShowPassword, setIsShowPassword] = useState(true);
  const [loading, setLoading] = useState(false);
  const [loginForm, setLoginForm] = useState({
    username: '',
    password: '',
  });

  const disabledButtonLogin = () => {
    if (!loginForm.username || !loginForm.password) return true;
    return false;
  };

  const handleSubmitLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    if (
      loginForm.password === 'Password' &&
      loginForm.username === 'Jesus4ever'
    ) {
      onSuccessLogin();
    } else {
      toast({
        position: 'bottom',
        title: 'Error',
        description: 'Password atau username salah',
        status: 'error',
        duration: 8000,
        isClosable: true,
      });
    }
    setLoading(false);
  };

  const onChangeLoginForm = (e) => {
    setLoginForm({
      ...loginForm,
      [e.target.name]: e.target.value,
    });
  };

  const handleTogglePasswordShow = () => {
    setIsShowPassword(!isShowPassword);
  };

  return (
    <Flex minH={'100vh'} align={'center'} justify={'center'}>
      <Stack
        borderRadius='10px'
        boxShadow='lg'
        bg='white'
        spacing={8}
        mx={'auto'}
        h='90vh'
        w='40%'
        py={12}
        px={6}
        justifyContent='center'
      >
        <Stack align={'center'}>
          <Heading fontSize={'4xl'}> Login | FBLAI</Heading>
        </Stack>
        <Box
          rounded={'lg'}
          bg={useColorModeValue('white', 'gray.700')}
          boxShadow={'lg'}
          p={8}
        >
          <Stack spacing={4}>
            <FormControl id='username'>
              <FormLabel>Username</FormLabel>
              <Input
                value={loginForm.username}
                onChange={onChangeLoginForm}
                type='text'
                name='username'
              />
            </FormControl>
            <FormControl id='password'>
              <FormLabel>Password</FormLabel>
              <InputGroup
                size='md'
                bgColor='white'
                border='1px solid #C8C8C8'
                borderRadius='8px'
              >
                <Input
                  name='password'
                  value={loginForm.password}
                  onChange={onChangeLoginForm}
                  placeholder='Password'
                  type={isShowPassword ? 'password' : 'text'}
                  autoComplete='off'
                  autoSave='off'
                  required
                />
                <InputRightElement>
                  <IconButton
                    _hover={{}}
                    _focus={{}}
                    borderColor='transparent'
                    backgroundColor='transparent'
                    aria-label='Call Segun'
                    size='sm'
                    onClick={handleTogglePasswordShow}
                    icon={
                      isShowPassword ? (
                        <BsFillEyeFill width={22} height={29} />
                      ) : (
                        <BsFillEyeSlashFill width={22} height={29} />
                      )
                    }
                  />
                </InputRightElement>
              </InputGroup>
            </FormControl>
            <Stack spacing={10}>
              <Button
                isLoading={loading}
                isDisabled={disabledButtonLogin()}
                onClick={handleSubmitLogin}
                bg={'blue.400'}
                color={'white'}
                _hover={{
                  bg: 'blue.500',
                }}
              >
                Login
              </Button>
            </Stack>
          </Stack>
        </Box>
      </Stack>
    </Flex>
  );
}

import { Input } from '@chakra-ui/input';
import {
  Box,
  Button,
  createStandaloneToast,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Select,
  Text,
} from '@chakra-ui/react';
import React, { useState } from 'react';
import { ApiPost } from '../api';
import { FaCloudDownloadAlt } from 'react-icons/fa';
import { BiReset } from 'react-icons/bi';

export default function MainApp() {
  const { toast } = createStandaloneToast();
  const [loading, setLoading] = useState(false);
  const [linkDownload, setLinkDownload] = useState('');
  const [form, setForm] = useState({
    subject: '',
    file: undefined,
  });

  const onChangeSubject = (e) => {
    setForm({
      ...form,
      subject: e.target.value,
    });
  };

  const onChangeFile = (e) => {
    setLinkDownload('');
    setForm({
      ...form,
      file: e.target.files[0],
    });
  };

  const disableForm = () => {
    if (!form.subject || !form.file) return true;
    return false;
  };

  const onSubmitAdd = async (e) => {
    e.preventDefault();
    setLoading(true);
    setLinkDownload('');
    const res = await ApiPost({ ...form });
    if (res.status === 200) {
      setLinkDownload(res.data.data);
      toast({
        position: 'bottom',
        title: 'Success',
        description: 'Berhasil',
        status: 'success',
        duration: 8000,
        isClosable: true,
      });
    } else {
      toast({
        position: 'bottom',
        title: 'Error',
        description: 'Terjadi kesalahan',
        status: 'error',
        duration: 8000,
        isClosable: true,
      });
    }
    setLoading(false);
  };

  const onReset = () => {
    setLinkDownload('');
    setForm({
      subject: '',
      file: undefined,
    });
  };

  return (
    <Flex minH={'100vh'} align={'center'} justify={'center'}>
      <Box w='50%' p='20' borderRadius='10px' boxShadow='lg' bg='white'>
        <Heading textAlign='center' as='h1'>
          Find Books LAI Tools
        </Heading>
        <form method='POST'>
          <FormControl my='5' isRequired>
            <FormLabel>Subject</FormLabel>
            <Select
              value={form.subject}
              onChange={onChangeSubject}
              name='subject'
            >
              <option></option>
              <option value={1}>Alkitab & PB LAI</option>
              <option value={2}>Alkitab & PB Non LAI</option>
              <option value={3}>Majalah & Buletin</option>
              <option value={4}>Porsion</option>
              <option value={5}>Seleksion</option>
              <option value={6}>Koleksi Anak</option>
              <option value={7}>Umum</option>
              <option value={8}>Jurnal</option>
              <option value={9}>Konkordansi</option>
              <option value={10}>Altutang</option>
              <option value={11}>Encyclopedia</option>
              <option value={12}>Kamus</option>
              <option value={13}>Teologi dan Tafsiran</option>
            </Select>
          </FormControl>
          <FormControl my='5' isRequired>
            <FormLabel>File</FormLabel>
            <Input
              name='file'
              // value={form.file}
              onChange={onChangeFile}
              type='file'
              // accept='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
              required
            />
          </FormControl>
          <Button
            w='full'
            colorScheme='blue'
            onClick={onSubmitAdd}
            isDisabled={disableForm()}
            isLoading={loading}
          >
            Upload
          </Button>
        </form>
        {linkDownload && (
          <Box my='4' borderWidth='1px' p='5' borderRadius='6px'>
            <Text mb='2' fontSize='15px' color='green'>
              Berhasil mencari data buku, silakan klik tombol dibawah ini untuk
              mengunduh hasil{' '}
            </Text>
            <a href={linkDownload} target='_blank'>
              <Button
                w='full'
                rightIcon={<FaCloudDownloadAlt />}
                colorScheme='green'
              >
                Download File
              </Button>
            </a>
            <Button
              w='full'
              onClick={onReset}
              mt='4'
              rightIcon={<BiReset color='white' />}
              colorScheme='yellow'
            >
              Reset
            </Button>
          </Box>
        )}
      </Box>
    </Flex>
  );
}

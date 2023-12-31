import { Flex, Stack, Box, Button, useColorModeValue, Heading, FormControl, FormLabel, Input, InputRightElement, InputGroup } from '@chakra-ui/react';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@chakra-ui/react';



export default function Loign() {
    const navigate = useNavigate();
    const toast = useToast();
    const [show, setShow] = useState(false)
    const handleClick = () => setShow(!show)


    const [inputFields, setInputFields] = useState({ email: '', password: '' });

    const handleInputChange = (e) => {
        setInputFields({ ...inputFields, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (inputFields.email === '' || inputFields.password === '') {
            return toast({
                title: "Invalid Credentials",
                description: "Please check your email and password",
                status: "error",
                duration: 5000,
                isClosable: true,
                position: 'top-center'
            })
        }

        try {
            const res = await fetch(`${process.env.REACT_APP_BASE_URL}/api/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(inputFields),
            });
            const data = await res.json();
            if (res.status === 200) {
                document.cookie = `token=${data.token}`;
                navigate('/upload');
            }
            else {
                setInputFields({ email: '', password: '' });
                return toast({
                    title: "Invalid Credentials",
                    description: "Please check your email and password",
                    status: "error",
                    duration: 5000,
                    isClosable: true,
                    position: 'top-center'
                })
            }

        } catch (error) {
            console.log(error.message)
            setInputFields({ email: '', password: '' });
            return toast({
                title: "Server Error",
                description: "Please try again later",
                status: "error",
                duration: 5000,
                isClosable: true,
                position: 'top-center'
            })
        }
    };
    useEffect(() => {
        if (document.cookie.includes('token')) {
            navigate('/upload');
        }
    }, []);



    return (
        <Flex
            minH={'100vh'}
            align={'center'}
            justify={'center'}
            bg={useColorModeValue('gray.50', 'gray.800')}>
            <Stack spacing={8} mx={'auto'} maxW={'lg'} py={12} px={6}>
                <Stack align={'center'}>
                    <Heading fontSize={'4xl'}>Sign In to your account</Heading>
                </Stack>
                <Box
                    rounded={'lg'}
                    bg={useColorModeValue('white', 'gray.700')}
                    boxShadow={'lg'}
                    p={8}>
                    <Stack spacing={4}>
                        <FormControl id="email">
                            <FormLabel>Email address</FormLabel>
                            <Input type="email"
                                value={inputFields.email}
                                onChange={handleInputChange}
                                name="email"
                                placeholder="Enter email"
                                required
                            />
                        </FormControl>
                        <FormControl id="password">
                            <FormLabel>Password</FormLabel>
                            <InputGroup size='md'>
                                <Input
                                    pr='4.5rem'
                                    onChange={handleInputChange}
                                    type={show ? 'text' : 'password'}
                                    placeholder='Enter password'
                                    name='password'
                                    value={inputFields.password}
                                />
                                <InputRightElement width='4.5rem'>
                                    <Button h='1.75rem' size='sm' onClick={handleClick}>
                                        {show ? 'Hide' : 'Show'}
                                    </Button>
                                </InputRightElement>
                            </InputGroup>

                            {/* <Input type="password"
                                value={inputFields.password}
                                onChange={handleInputChange}
                                name="password"
                                required
                            /> */}
                        </FormControl>
                        <Stack spacing={10}>
                            <Button

                                type='submit'
                                onClick={e => handleSubmit(e)}
                                bg={'blue.400'}
                                color={'white'}
                                _hover={{
                                    bg: 'blue.500',
                                }}>
                                Sign in
                            </Button>
                        </Stack>
                    </Stack>
                </Box>
            </Stack>
        </Flex>
    );
}
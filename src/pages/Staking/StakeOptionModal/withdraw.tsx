import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalBody,
  Box,
  Heading,
  Text,
  Button,
  Flex,
  Stack,
  useTheme,
  useColorMode,
} from '@chakra-ui/react';

import React, {useCallback, useState} from 'react';
import {useWeb3React} from '@web3-react/core';
import {useAppDispatch, useAppSelector} from 'hooks/useRedux';
import {closeModal, selectModalType} from 'store/modal.reducer';
import {withdraw} from '../staking.reducer';

export const WithdrawalOptionModal = () => {
  const {data} = useAppSelector(selectModalType);
  const dispatch = useAppDispatch();
  const {account, library} = useWeb3React();
  const theme = useTheme();
  const {colorMode} = useColorMode();

  let balance = data?.data?.totalPendingUnstakedAmountL2;
  /*eslint-disable */
  const [value, setValue] = useState<number>(balance);
  // console.log(data?.data)
  // const handleChange = useCallback((e) => setValue(e.target.value), []);
  // const withdrawalDelay = data?.data?.globalWithdrawalDelay;
  const withdrawableBalance = data?.data?.withdrawableAmount;

  const handleCloseModal = useCallback(() => {
    dispatch(closeModal());
    setValue(0);
  }, [dispatch]);

  return (
    <Modal
      isOpen={data.modal === 'withdraw' ? true : false}
      isCentered
      onClose={() => dispatch(closeModal())}>
      <ModalOverlay />
      <ModalContent
        fontFamily={theme.fonts.roboto}
        bg={colorMode === 'light' ? 'white.100' : 'black.200'}
        w="350px"
        pt="25px"
        pb="25px">
        <ModalBody p={0}>
          <Box
            my={2}
            pb={'1.050em'}
            borderBottom={
              colorMode === 'light' ? '1px solid #f4f6f8' : '1px solid #373737'
            }>
            <Heading
              fontSize={'1.250em'}
              fontWeight={'bold'}
              fontFamily={theme.fonts.titil}
              color={colorMode === 'light' ? 'gray.250' : 'white.100'}
              textAlign={'center'}>
              Withdraw
            </Heading>
            <Text color="gray.175" fontSize={'0.750em'} textAlign={'center'}>
              Do You really want to withdraw your TON now?
            </Text>
          </Box>
          <Stack
            as={Flex}
            pt={'1.875em'}
            pl={'1.875em'}
            pr={'1.875em'}
            justifyContent={'center'}
            alignItems={'center'}
            mb={'25px'}>
            <Box
              display={'flex'}
              justifyContent="center"
              flexDir="column"
              w={'100%'}
            >
              <Flex justifyContent="space-between" alignItems="center" h="15px">
                <Text color={'gray.400'} fontSize="13px" fontWeight={500}>
                  Withdrawable amount
                </Text>
                <Text
                  color={colorMode === 'light' ? 'gray.250' : 'white.100'}
                  fontWeight={500}
                  fontSize={'18px'}>
                  {withdrawableBalance?withdrawableBalance:'0.00'} TON
                </Text>
              </Flex>
            </Box>
          </Stack>
          <Box 
            py={4} 
            as={Flex} 
            justifyContent={'center'}
            borderTop={
              colorMode === 'light'
                ? '1px solid #f4f6f8'
                : '1px solid #373737'
            }>
            <Button
              w={'150px'}
              bg={'blue.500'}
              color="white.100"
              fontSize="14px"
              onClick={() =>
                withdraw({
                  userAddress:account, 
                  contractAddress: data.data.contractAddress,
                  miningEndTime: data?.data?.miningEndTime,
                  library: library,
                  handleCloseModal: dispatch(closeModal()),
                })
              }
              disabled={+withdrawableBalance <= 0}>
              Withdraw
            </Button>
          </Box>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

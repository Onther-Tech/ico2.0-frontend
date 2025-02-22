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
  useTheme,
  useColorMode,
  Link,
} from '@chakra-ui/react';
import React, {useEffect, useState} from 'react';
import {useAppDispatch, useAppSelector} from 'hooks/useRedux';
import {selectModalType} from 'store/modal.reducer';
import {useModal} from 'hooks/useModal';
import {CloseButton} from 'components/Modal';
import Line from '../common/Line';
import {LoadingComponent} from 'components/Loading';
import {useFormikContext} from 'formik';
import {Projects, VaultCommon} from '@Launch/types';
import {shortenAddress} from 'utils';
import {selectApp} from 'store/app/app.reducer';
import {selectLaunch, setTempHash} from '@Launch/launch.reducer';

const StosInfoList = (props: {
  stosInfoList: {tier: number; requiredTos: number; allocationToken: number}[];
}) => {
  const {stosInfoList} = props;
  const {colorMode} = useColorMode();
  const {values} = useFormikContext<Projects['CreateProject']>();

  return (
    <Flex flexDir={'column'} textAlign="center">
      <Text
        color={'#304156'}
        fontSize={13}
        textAlign="center"
        mt={'30px'}
        mb={'10px'}
        fontWeight={600}>
        sTOS Tier
      </Text>
      <Flex
        h={'35px'}
        lineHeight={'35px'}
        borderBottom={'1px solid #f4f6f8'}
        fontSize={12}>
        <Text
          w={'70px'}
          color={colorMode === 'light' ? 'gray.400' : 'white.100'}>
          Tier
        </Text>
        <Text
          w={'120px'}
          color={colorMode === 'light' ? 'gray.400' : 'white.100'}>
          Required sTOS
        </Text>
        <Text
          w={'160px'}
          color={colorMode === 'light' ? 'gray.400' : 'white.100'}>
          Allocated Token
        </Text>
      </Flex>
      {stosInfoList.map(
        (stosInfo: {
          tier: number;
          requiredTos: number;
          allocationToken: number;
        }) => (
          <Flex
            borderBottom={'1px solid #f4f6f8'}
            h={'35px'}
            lineHeight={'35px'}
            fontSize={13}>
            <Text
              w={'70px'}
              color={colorMode === 'light' ? 'gray.250' : 'white.100'}>
              0{stosInfo.tier}
            </Text>
            <Text
              w={'120px'}
              color={colorMode === 'light' ? 'gray.250' : 'white.100'}>
              {stosInfo.requiredTos} TOS
            </Text>
            <Text
              w={'160px'}
              color={colorMode === 'light' ? 'gray.250' : 'white.100'}>
              {stosInfo.allocationToken} {values.tokenName}
            </Text>
          </Flex>
        ),
      )}
    </Flex>
  );
};

const InfoList = (props: {
  title: string;
  content: string;
  isHref?: boolean;
}) => {
  const {title, content, isHref} = props;
  const {colorMode} = useColorMode();
  // @ts-ignore
  const {data: appConfig} = useAppSelector(selectApp);
  return (
    <Box
      d="flex"
      h={'45px'}
      justifyContent={'space-between'}
      w={'100%'}
      lineHeight={'45px'}>
      <Text
        fontSize={13}
        color={colorMode === 'light' ? 'gray.400' : 'white.100'}>
        {title}
      </Text>
      {isHref && content !== '-' ? (
        <Link
          isExternal={true}
          href={`${appConfig.explorerLink}${content}`}
          color={'blue.300'}
          fontSize={14}
          fontWeight={600}
          outline={'none'}
          _focus={{
            outline: 'none',
          }}>
          {shortenAddress(content)}
        </Link>
      ) : (
        <Text
          color={colorMode === 'light' ? 'gray.250' : 'white.100'}
          fontSize={14}>
          {content}
        </Text>
      )}
    </Box>
  );
};

const ConfirmTokenModal = () => {
  const {data} = useAppSelector(selectModalType);
  const {colorMode} = useColorMode();
  const theme = useTheme();
  const {handleCloseModal} = useModal();
  const {btnStyle} = theme;
  const [deployStep, setDeployStep] = useState<
    'Ready' | 'Deploying' | 'Done' | 'Error'
  >('Ready');
  const [tab, setTab] = useState<1 | 2>(1);
  const {values} = useFormikContext<Projects['CreateProject']>();
  const {vaults} = values;
  const {
    vaultType,
    vaultName,
    vaultIndex,
    func,
    infoList,
    secondInfoList,
    stosTierList,
    close,
  } = data.data;

  const selectedVault = vaults.filter(
    (vault: VaultCommon) => vault.index === vaultIndex,
  )[0];

  const {data: appConfig} = useAppSelector(selectApp);
  const {
    data: {tempHash},
  } = useAppSelector(selectLaunch);
  const dispatch = useAppDispatch();

  useEffect(() => {
    try {
      if (data.data.isSetStep === true) {
        if (selectedVault?.isSet === true) {
          return setDeployStep('Done');
        }
        // return setDeployStep('Ready');
      } else {
        if (selectedVault?.isDeployed === true) {
          return setDeployStep('Done');
        }
      }
      if (selectedVault?.isDeployedErr === true) {
        return setDeployStep('Error');
      }
    } finally {
    }
  }, [deployStep, values, selectedVault, data]);

  function closeModal() {
    try {
      setDeployStep('Ready');
      handleCloseModal();
      dispatch(
        setTempHash({
          data: undefined,
        }),
      );
      setTab(1);
      close();
    } catch (e) {
      console.log('--closeModal error--');
      console.log(e);
    }
  }

  if (deployStep === 'Ready') {
    return (
      <Modal
        isOpen={data.modal === 'Launch_ConfirmVault' ? true : false}
        isCentered
        onClose={() => {
          closeModal();
        }}>
        <ModalOverlay />
        <ModalContent
          fontFamily={theme.fonts.roboto}
          bg={colorMode === 'light' ? 'white.100' : 'black.200'}
          w="350px"
          pt="20px"
          pb="25px">
          <CloseButton closeFunc={() => closeModal()}></CloseButton>
          <ModalBody p={0}>
            <Box
              pb={'1.250em'}
              borderBottom={
                colorMode === 'light'
                  ? '1px solid #f4f6f8'
                  : '1px solid #373737'
              }>
              <Heading
                fontSize={'1.250em'}
                fontWeight={'bold'}
                fontFamily={theme.fonts.titil}
                color={colorMode === 'light' ? 'gray.250' : 'white.100'}
                textAlign={'center'}>
                General | {vaultName}
              </Heading>
            </Box>

            {vaultType === 'Public' && (
              <Flex
                h={'26px'}
                alignItems={'center'}
                justifyContent={'center'}
                mt={'15px'}>
                <Box
                  w={'126px'}
                  h={'100%'}
                  border={tab === 1 ? '1px solid #2a72e5' : '1px solid #d7d9df'}
                  borderRightWidth={tab === 2 ? 0 : 1}
                  borderLeftRadius={4}
                  cursor={'pointer'}
                  fontSize={12}
                  color={tab === 1 ? '#2a72e5' : '#3d495d'}
                  textAlign="center"
                  lineHeight={'26px'}
                  onClick={() => setTab(1)}>
                  Vault & Claim
                </Box>
                <Box
                  w={'126px'}
                  h={'100%'}
                  border={tab === 2 ? '1px solid #2a72e5' : '1px solid #d7d9df'}
                  borderLeftWidth={tab === 1 ? 0 : 1}
                  borderRightRadius={4}
                  cursor={'pointer'}
                  fontSize={12}
                  color={tab === 2 ? '#2a72e5' : '#3d495d'}
                  textAlign="center"
                  lineHeight={'26px'}
                  onClick={() => setTab(2)}>
                  Sale
                </Box>
              </Flex>
            )}

            <Flex
              flexDir="column"
              alignItems="center"
              mt={'30px'}
              px={'20px'}
              fontSize={15}
              color={colorMode === 'light' ? 'gray.250' : 'white.100'}
              h={'297px'}
              overflow={'auto'}>
              {tab === 1 &&
                infoList &&
                Object.keys(infoList).map((key, i) => {
                  return (
                    <Flex flexDir={'column'} w={'100%'}>
                      <Text
                        color={'#304156'}
                        fontSize={13}
                        textAlign="center"
                        mt={i !== 0 ? '30px' : 0}
                        mb={'10px'}
                        fontWeight={600}>
                        {key}
                      </Text>
                      {infoList[key].map(
                        (info: {
                          title: string;
                          content: string;
                          isHref: boolean;
                        }) => {
                          if (info === undefined) {
                            return null;
                          }
                          return (
                            <InfoList
                              title={info.title}
                              content={info.content}
                              isHref={info.isHref}></InfoList>
                          );
                        },
                      )}
                    </Flex>
                  );
                })}
              {tab === 2 &&
                secondInfoList &&
                Object.keys(secondInfoList).map((key, i) => {
                  return (
                    <Flex flexDir={'column'} w={'100%'}>
                      <Text
                        color={'#304156'}
                        fontSize={13}
                        textAlign="center"
                        mt={i !== 0 ? '30px' : 0}
                        mb={'10px'}
                        fontWeight={600}>
                        {key}
                      </Text>
                      {secondInfoList[key].map(
                        (info: {
                          title: string;
                          content: string;
                          isHref: boolean;
                        }) => {
                          if (info === undefined) {
                            return null;
                          }
                          return (
                            <InfoList
                              title={info.title}
                              content={info.content}
                              isHref={info.isHref}></InfoList>
                          );
                        },
                      )}
                    </Flex>
                  );
                })}
              {tab === 2 && stosTierList && (
                <StosInfoList stosInfoList={stosTierList}></StosInfoList>
              )}
              <Flex
                mt={'35px'}
                flexDir={'column'}
                justifyContent="center"
                textAlign={'center'}>
                <Text
                  fontSize={13}
                  color={'#ff3b3b'}
                  fontWeight={600}
                  mb={'10px'}>
                  Warning
                </Text>
                <Text fontSize={12} color={'gray.225'}>
                  You won't be able to edit your project after it has been
                  deployed or initialized. Double-check the content before you
                  click the {data.data.isSetStep ? `"Initialize"` : `“Deploy”`}{' '}
                  button.
                </Text>
              </Flex>
            </Flex>

            <Box w={'100%'} my={'25px'} px={'15px'}>
              <Line></Line>
            </Box>

            <Box as={Flex} flexDir="column" alignItems="center">
              <Button
                {...btnStyle.btnAble()}
                w={'150px'}
                fontSize="14px"
                _hover={{}}
                onClick={() =>
                  func() && data.data.isSetStep
                    ? closeModal()
                    : setDeployStep('Deploying')
                }>
                {data.data.isSetStep ? 'Initialize' : 'Deploy'}
              </Button>
            </Box>
          </ModalBody>
        </ModalContent>
      </Modal>
    );
  }

  if (deployStep === 'Deploying') {
    return (
      <Modal
        isOpen={data.modal === 'Launch_ConfirmVault' ? true : false}
        isCentered
        closeOnOverlayClick={false}
        onClose={() => {
          closeModal();
        }}>
        <ModalOverlay />
        <ModalContent
          fontFamily={theme.fonts.roboto}
          bg={colorMode === 'light' ? 'white.100' : 'black.200'}
          w="350px"
          maxH={'334px'}
          pt="40px"
          pb="25px">
          {/* <CloseButton closeFunc={() => closeModal()}></CloseButton> */}
          <ModalBody p={0}>
            <Flex
              flexDir={'column'}
              alignItems="center"
              justifyContent={'center'}
              textAlign={'center'}>
              <Box mb={'40px'}>
                <LoadingComponent w={'80px'} h={'80px'}></LoadingComponent>
              </Box>
              <Text
                w={'100%'}
                fontSize={16}
                color={'black.300'}
                fontWeight={600}
                textAlign={'center'}>
                Waiting to complete deploying <br />
                your {vaultName} vault
              </Text>
              <Box w={'100%'} px={'15px'} mt={'40px'} mb={'25px'}>
                <Line></Line>
              </Box>
              <Link
                isExternal={true}
                textDecoration={'none'}
                href={`${appConfig.explorerTxnLink}${tempHash}`}
                style={{textDecoration: 'none'}}>
                <Box as={Flex} flexDir="column" alignItems="center">
                  <Button
                    {...btnStyle.btnAble()}
                    w={'150px'}
                    fontSize="14px"
                    _hover={{}}
                    isDisabled={!tempHash}>
                    View on Etherscan
                  </Button>
                </Box>
              </Link>
            </Flex>
          </ModalBody>
        </ModalContent>
      </Modal>
    );
  }

  if (deployStep === 'Done') {
    return (
      <Modal
        isOpen={data.modal === 'Launch_ConfirmVault' ? true : false}
        isCentered
        onClose={() => {
          closeModal();
        }}>
        <ModalOverlay />
        <ModalContent
          fontFamily={theme.fonts.roboto}
          bg={colorMode === 'light' ? 'white.100' : 'black.200'}
          w="350px"
          pt="20px"
          pb="25px">
          <CloseButton closeFunc={closeModal}></CloseButton>
          <ModalBody p={0}>
            <Flex
              pt={'56px'}
              flexDir={'column'}
              alignItems="center"
              justifyContent={'center'}>
              <Text
                w={'186px'}
                fontSize={16}
                color={'black.300'}
                fontWeight={600}
                textAlign={'center'}>
                Completed to deploy
              </Text>
              <Text
                w={'186px'}
                mb={'20px'}
                fontSize={16}
                color={'black.300'}
                fontWeight={600}
                textAlign={'center'}>
                your {vaultName} vault
              </Text>
              <Box w={'100%'} px={'15px'} mb={'25px'}>
                <Line></Line>
              </Box>
              <Box as={Flex} flexDir="column" alignItems="center">
                <Button
                  {...btnStyle.btnAble()}
                  w={'150px'}
                  fontSize="14px"
                  _hover={{}}
                  onClick={() => closeModal()}>
                  Confirm
                </Button>
              </Box>
            </Flex>
          </ModalBody>
        </ModalContent>
      </Modal>
    );
  }

  //deployStep === 'Error'
  return (
    <Modal
      isOpen={data.modal === 'Launch_ConfirmVault' ? true : false}
      isCentered
      onClose={() => {
        closeModal();
      }}>
      <ModalOverlay />
      <ModalContent
        fontFamily={theme.fonts.roboto}
        bg={colorMode === 'light' ? 'white.100' : 'black.200'}
        w="350px"
        pt="20px"
        pb="25px">
        <CloseButton closeFunc={closeModal}></CloseButton>
        <ModalBody p={0}>
          <Flex
            pt={'56px'}
            flexDir={'column'}
            alignItems="center"
            justifyContent={'center'}>
            <Text
              w={'186px'}
              mb={'55px'}
              fontSize={16}
              color={'black.300'}
              fontWeight={600}
              textAlign={'center'}>
              It has been failed to deploy your {vaultName} vault :(
            </Text>
            <Box w={'100%'} px={'15px'} mb={'25px'}>
              <Line></Line>
            </Box>
            <Box as={Flex} flexDir="column" alignItems="center">
              <Button
                {...btnStyle.btnAble()}
                w={'150px'}
                fontSize="14px"
                _hover={{}}
                bg={{}}
                border={'1px solid #2a72e5'}
                color={'blue.300'}
                onClick={() => closeModal()}>
                Go back to deploy
              </Button>
            </Box>
          </Flex>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default ConfirmTokenModal;

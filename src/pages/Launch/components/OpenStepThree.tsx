import {Flex, Box, useColorMode} from '@chakra-ui/react';
import StepTitle from '@Launch/components/common/StepTitle';
import Line from '@Launch/components/common/Line';
import DeployContainer from '@Launch/components/stepThree/DeployContainer';
import ConfirmTokenModal from './modals/ConfirmToken';
import ConfirmVaultModal from './modals/ConfirmVault';
import {useEffect} from 'react';
import {useAppDispatch, useAppSelector} from 'hooks/useRedux';
import {setProjectStep} from '@Launch/launch.reducer';
const OpenStepThree = () => {
  const {colorMode} = useColorMode();
  const dispatch: any = useAppDispatch();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    dispatch(setProjectStep({data:3}))
  },[dispatch])

  return (
    <Flex
      pt={'24px'}
      pb={'35px'}
      w={'1110px'}
      bg={colorMode === 'light' ? 'white.100' : 'none'}
      flexDir="column">
      <Box mb={'23px'} pl={'35px'}>
        <StepTitle title={'Deploy'}></StepTitle>
      </Box>
      <Box mb={'40px'}>
        <Line></Line>
      </Box>
      <DeployContainer></DeployContainer>
      <ConfirmTokenModal></ConfirmTokenModal>
      <ConfirmVaultModal></ConfirmVaultModal>
    </Flex>
  );
};

export default OpenStepThree;

import {
  Container,
  Box,
  Text,
  Flex,
  Link,
  useColorMode,
  useTheme,
  Switch,
  Image,
} from '@chakra-ui/react';
import {IconClose} from 'components/Icons/IconClose';
import {IconOpen} from 'components/Icons/IconOpen';
import {Head} from 'components/SEO';
import {useAppDispatch, useAppSelector} from 'hooks/useRedux';
import React, {Fragment, useCallback, useMemo} from 'react';
import {shortenAddress} from 'utils';
import {StakingTable} from './StakingTable';
import {fetchStakes, selectStakes} from './staking.reducer';
import {selectApp} from 'store/app/app.reducer';
import {PageHeader} from 'components/PageHeader';
import {
  ClaimOptionModal,
  StakeOptionModal,
  UnstakeOptionModal,
  StakeInLayer2Modal,
  UnStakeFromLayer2Modal,
  WithdrawalOptionModal,
  SwapModal,
  PowerTonSwap,
} from './StakeOptionModal';
import {WalletInformation} from './components/WalletInformation';
import {ManageModal} from './StakeOptionModal/Manage/index';
import {formatStartTime} from 'utils/timeStamp';
import {useState} from 'react';
import {getTotalStakers, getUserBalance} from 'client/getUserBalance';
//@ts-ignore
import {useEffect} from 'react';
import {LoadingDots} from 'components/Loader/LoadingDots';
import {useActiveWeb3React} from 'hooks/useWeb3';
import {getEarnedTon} from './utils/getEarnedTon';
import {fetchVaults} from './vault.reducer';
import TOKAMAK_SYMBOL from 'assets/title_tokamak.svg';
import TOS_SYMBOL from 'assets/title_TOS.svg';

type GetDateTimeType =
  | 'sale-start'
  | 'sale-end'
  | 'mining-start'
  | 'mining-end';

type GetDateProp = {
  time: string | undefined;
  currentBlock: number;
  contractAddress: string;
  type: GetDateTimeType;
  title: string;
};

const GetDate = ({
  time,
  currentBlock,
  contractAddress,
  type,
  title,
}: GetDateProp) => {
  const {colorMode} = useColorMode();
  const [date, setDate] = useState('');

  const fetchDate = async () => {
    try {
      const result = await formatStartTime(time, currentBlock);
      setDate(result);
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    fetchDate();
    return () => {
      setDate('');
    };
    /*eslint-disable*/
  }, [time, currentBlock]);

  return (
    <Flex flexDir={'column'}>
      <Text fontSize={15} color={'#808992'} mb={'10px'} fontWeight={'bold'}>
        {title}
      </Text>
      {date === '' ? (
        <LoadingDots />
      ) : (
        <Flex flexDir={'column'}>
          <Text
            fontSize={'20px'}
            color={colorMode === 'light' ? 'black.300' : 'white.200'}
            fontWeight={'bold'}
            w="100%"
            mb={'5px'}>
            {type === 'mining-end' && '~ '} {date}
          </Text>
          <Text fontSize={13} color={'#808992'}>
            <span style={{marginRight: '5px'}}>{time}</span>
            <span>{'Block'}</span>
          </Text>
        </Flex>
      )}
    </Flex>
  );
};

export const Staking = () => {
  const theme = useTheme();
  const dispatch = useAppDispatch();
  // @ts-ignore
  const {data, loading} = useAppSelector(selectStakes);
  // @ts-ignore
  const {data: appConfig} = useAppSelector(selectApp);
  const columns = useMemo(
    () => [
      {
        Header: 'name',
        accessor: 'name',
      },
      {
        Header: 'period',
        accessor: 'period',
      },
      {
        Header: 'total staked',
        accessor: 'stakeBalanceTON',
      },
      {
        Header: 'Earning Per TON',
        accessor: 'earning_per_ton',
      },
      {
        // Make an expander cell
        Header: () => null, // No header
        id: 'expander', // It needs an ID
        Cell: ({row}: {row: any}) => (
          // Use Cell to render an expander for each row.
          // We can use the getToggleRowExpandedProps prop-getter
          // to build the expander.
          <span {...row.getToggleRowExpandedProps()}>
            {row.isExpanded ? <IconClose /> : <IconOpen />}
          </span>
        ),
      },
    ],
    [],
  );

  const GetTotalStaker = ({contractAddress, totalStakers}: any) => {
    const {colorMode} = useColorMode();
    const [totalStaker, setTotalStaker] = useState('-');
    const {account, library} = useActiveWeb3React();
    const getlInfo = async () => {
      const res = await getTotalStakers(contractAddress, library);
      if (res === undefined) {
        return setTotalStaker('0');
      }
      setTotalStaker(res);
    };

    useEffect(() => {
      if (account !== undefined) {
        getlInfo();
      } else {
        setTotalStaker(totalStakers);
      }
    }, []);

    return (
      <Flex flexDir={'column'} alignItems={'space-between'}>
        <Text fontSize={'15px'} color="gray.400">
          Total Stakers
        </Text>
        <Text
          fontSize={'20px'}
          color={colorMode === 'light' ? 'black.300' : 'white.200'}
          fontWeight={'bold'}>
          {totalStaker === '-' ? <LoadingDots></LoadingDots> : totalStaker}
        </Text>
      </Flex>
    );
  };

  const GetBalance = ({
    title,
    contractAddress,
    setStakeValance,
    status,
  }: any) => {
    const {colorMode} = useColorMode();
    const [balance, SetBalance] = useState('-');
    const {account, library} = useActiveWeb3React();
    const [toggle, setToggle] = useState('Earned TOS');

    useEffect(() => {
      getEarnedTon({contractAddress, library});
    }, []);

    useEffect(() => {
      const getBalance = async () => {
        if (!account || !library) {
          return;
        }
        try {
          const result = await getUserBalance(
            account,
            library,
            contractAddress,
          );
          if (title === 'My Staked') {
            //@ts-ignore
            return SetBalance(result?.totalStakedBalance);
          }

          const totalClaimedAmount =
            Number(result?.rewardTosBalance) + Number(result?.claimedBalance);
          //@ts-ignore
          SetBalance(totalClaimedAmount.toFixed(2));
        } catch (e) {}
      };

      if (account !== undefined) {
        getBalance();
      }
      return () => {
        SetBalance('-');
      };
      /*eslint-disable*/
    }, [account]);

    if (account === undefined) {
      return (
        <Flex flexDir={'column'} alignItems={'space-between'}>
          <Text fontSize={'15px'} color="gray.400">
            {title}
          </Text>
          <Text
            fontSize={'20px'}
            color={colorMode === 'light' ? 'black.300' : 'white.200'}
            fontWeight={'bold'}
            h="30px">
            {balance}
          </Text>
        </Flex>
      );
    }

    if (title === 'My Staked' || title === 'Earned TOS') {
      return (
        <Flex flexDir={'column'} alignItems={'space-between'}>
          <Flex>
            <Image
              w={'20px'}
              h={'20px'}
              mr={'6px'}
              src={title === 'My Staked' ? TOKAMAK_SYMBOL : TOS_SYMBOL}
              alt={'TOKAMAK_SYMBOL'}
            />
            <Text fontSize={'15px'} color="#2a72e5" fontWeight={'bold'}>
              {title}
            </Text>
          </Flex>
          <Text
            fontSize={'28px'}
            color={colorMode === 'light' ? 'black.300' : 'white.200'}
            fontWeight={'bold'}
            h="30px">
            {balance === '-' ? <LoadingDots></LoadingDots> : balance}
            {balance !== '-' ? (
              title === 'My Staked' ? (
                <span style={{fontSize: 13, marginLeft: '4px'}}> TON</span>
              ) : (
                <span style={{fontSize: 13, marginLeft: '4px'}}> TOS</span>
              )
            ) : null}
          </Text>
        </Flex>
      );
    }

    if (status !== 'end') {
      return (
        <Flex flexDir={'column'} alignItems={'space-between'}>
          <Flex>
            <Text fontSize={'15px'} color="gray.400" mr={2} _hover={{}}>
              {toggle}
            </Text>
          </Flex>
          <Text
            fontSize={'20px'}
            color={colorMode === 'light' ? 'black.300' : 'white.200'}
            fontWeight={'bold'}
            h="30px">
            {balance === '-' ? <LoadingDots></LoadingDots> : balance}
            {balance !== '-' ? (
              title === 'My staked' ? (
                <span> TON</span>
              ) : (
                <span> TOS</span>
              )
            ) : null}
          </Text>
        </Flex>
      );
    }

    return (
      <Flex flexDir={'column'} alignItems={'space-between'}>
        <Flex>
          <Text fontSize={'15px'} color="gray.400" mr={2} _hover={{}}>
            {toggle}
          </Text>
          <Switch
            onChange={() =>
              setToggle(toggle === 'Earned TOS' ? 'Earned TON' : 'Earned TOS')
            }
            // defaultChecked={true}
            value={0}></Switch>
        </Flex>
        <Text
          fontSize={'20px'}
          color={colorMode === 'light' ? 'black.300' : 'white.200'}
          fontWeight={'bold'}
          h="30px">
          {balance === '-' ? <LoadingDots></LoadingDots> : balance}
          {balance !== '-' ? (
            toggle === 'Earned TOS' ? (
              <span> TOS</span>
            ) : (
              <span> TON</span>
            )
          ) : null}
        </Text>
      </Flex>
    );
  };

  const renderRowSubComponent = useCallback(
    ({row}) => {
      const {account, contractAddress, fetchBlock, library, status} =
        row.original;

      return (
        <Flex
          w="100%"
          m={0}
          border={'none'}
          pt={'45px'}
          px={'172px'}
          gridRowGap={'45px'}
          flexDir={'column'}>
          <Flex>
            <Flex w={'308px'}>
              <GetBalance
                title={'My Staked'}
                contractAddress={contractAddress}></GetBalance>
            </Flex>
            <GetBalance
              title={'Earned TOS'}
              contractAddress={contractAddress}
              status={data[row.id]?.status}
            />
          </Flex>
          <Flex>
            <Flex w={'308px'}>
              <GetDate
                time={
                  data[row.id]?.status === 'sale'
                    ? data[row.id]?.saleStartTime
                    : data[row.id]?.miningStartTime
                }
                currentBlock={fetchBlock}
                contractAddress={contractAddress}
                type={'mining-start'}
                title={'Mining Starting Day'}></GetDate>
            </Flex>
            <GetDate
              time={
                data[row.id]?.status === 'sale'
                  ? data[row.id]?.saleEndTime
                  : data[row.id]?.miningEndTime
              }
              currentBlock={fetchBlock}
              contractAddress={contractAddress}
              type={data[row.id]?.status === 'sale' ? 'sale-end' : 'mining-end'}
              title={'Mining Closing Day'}></GetDate>
            <Flex flexDir={'column'} mt={'20px'} ml={'auto'}>
              <Text fontSize={'15px'} color="gray.400" fontWeight={'bold'}>
                Contract
              </Text>
              <Link
                fontSize={'20px'}
                fontWeight={'bold'}
                // color={GetColor() === 'light' ? 'black.300' : 'white.200'}
                isExternal={true}
                outline={'none'}
                _focus={{
                  outline: 'none',
                }}
                href={`${appConfig.explorerLink}${
                  data[row.id]?.contractAddress
                }`}>
                {shortenAddress(data[row.id]?.contractAddress)}
              </Link>
            </Flex>
          </Flex>

          <Box p={0} w={'450px'} borderRadius={'10px'} alignSelf={'flex-start'}>
            <WalletInformation dispatch={dispatch} data={data[row.id]} />
          </Box>

          {/* <Flex flexDir={'column'} h={'100%'} justifyContent={'space-between'}>
            <Flex flexDir={'column'} alignItems={'space-between'}>
              <Text fontSize={'15px'} color="gray.400">
                {data[row.id]?.status === 'sale'
                  ? 'Sale Closing Day'
                  : 'Mining Closing Day'}
              </Text>
              <Text w="220px">
                <GetDate
                  time={
                    data[row.id]?.status === 'sale'
                      ? data[row.id]?.saleEndTime
                      : data[row.id]?.miningEndTime
                  }
                  currentBlock={fetchBlock}
                  contractAddress={contractAddress}
                  type={
                    data[row.id]?.status === 'sale' ? 'sale-end' : 'mining-end'
                  }></GetDate>
              </Text>
              <Text w="210px" color="gray.400" fontSize={'0.813em'}>
                Block Num.{' '}
                {data[row.id]?.status === 'sale'
                  ? data[row.id]?.saleEndTime
                  : data[row.id]?.miningEndTime}
              </Text>
            </Flex>

            <Flex flexDir={'column'} alignItems={'space-between'}>
              <Text fontSize={'15px'} color="gray.400">
                Contract
              </Text>
              <Link
                fontSize={'20px'}
                fontWeight={'bold'}
                // color={GetColor() === 'light' ? 'black.300' : 'white.200'}
                isExternal={true}
                outline={'none'}
                _focus={{
                  outline: 'none',
                }}
                href={`${appConfig.explorerLink}${
                  data[row.id]?.contractAddress
                }`}>
                {shortenAddress(data[row.id]?.contractAddress)}
              </Link>
            </Flex>
            <GetBalance
              title={'Earned TOS'}
              contractAddress={contractAddress}
              status={data[row.id]?.status}
            />
          </Flex> */}
        </Flex>
      );
    },
    /* eslint-disable */
    [data, dispatch, appConfig.explorerLink],
  );

  const {chainId, library} = useActiveWeb3React();
  const [tableLoading, setTableLoading] = useState<boolean>(true);

  useEffect(() => {
    async function fetchStakeDatas() {
      await dispatch(
        fetchVaults({
          chainId,
        }) as any,
      );
      await dispatch(
        fetchStakes({
          library,
        }) as any,
      );
      setTableLoading(false);
    }
    fetchStakeDatas();
  }, [library]);

  return (
    <Fragment>
      <Head title={'TOS Mining'} />
      <Container maxW={'6xl'}>
        <Box pb={20}>
          <PageHeader
            title={'TOS Mining'}
            subtitle={
              'TOS Mining lets you stake TON & swap the TON seigniorage to TOS via Uniswap v3.'
            }
            secondSubTitle={'(Originally known as TON Staking)'}
          />
        </Box>
        <Box fontFamily={theme.fonts.roboto}>
          <StakingTable
            renderDetail={renderRowSubComponent}
            columns={columns}
            data={data}
            isLoading={tableLoading}
          />
        </Box>
      </Container>
      <StakeOptionModal />
      <UnstakeOptionModal />
      <ClaimOptionModal />
      <ManageModal />
      <StakeInLayer2Modal />
      <UnStakeFromLayer2Modal />
      <WithdrawalOptionModal />
      <SwapModal />
      <PowerTonSwap />
    </Fragment>
  );
};

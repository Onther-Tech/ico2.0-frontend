import {
  Flex,
  Text,
  Button,
  Box,
  useColorMode,
  useTheme,
  Container,
  Select,
  Image,
  Input,
} from '@chakra-ui/react';

import {FC, useState, useEffect} from 'react';
import {useAppSelector} from 'hooks/useRedux';
import {useActiveWeb3React} from 'hooks/useWeb3';
import {CustomInput} from 'components/Basic';
import {createReward, getRandomKey} from './api';
import Web3 from 'web3';
import BigNumber from 'bignumber.js';
import store from '../../../store';
import moment from 'moment';
import {DEPLOYED} from 'constants/index';
import {getSigner} from 'utils/contract';
import {Contract} from '@ethersproject/contracts';
import * as STAKERABI from 'services/abis/UniswapV3Staker.json';
import * as TOSABI from 'services/abis/TOS.json';
import {setTxPending} from '../../../store/tx.reducer';
import {toastWithReceipt} from 'utils';
import {openToast} from 'store/app/toast.reducer';
import DayPickerInput from 'react-day-picker/DayPickerInput';
import '../css/calendarStyles.css';
// import 'react-day-picker/lib/style.css';
import clock from 'assets/svgs/poll_time_active_icon.svg';
import MomentLocaleUtils from 'react-day-picker/moment';
import {values} from 'lodash';
import {approve, create} from '../actions';

const {TOS_ADDRESS, UniswapStaker_Address} = DEPLOYED;

const themeDesign = {
  border: {
    light: 'solid 1px #dfe4ee',
    dark: 'solid 1px #535353',
  },
  font: {
    light: 'black.300',
    dark: 'gray.475',
  },
  tosFont: {
    light: 'gray.250',
    dark: 'black.100',
  },
};
type CreateRewardProps = {
  pools: any[];
};
type CreateReward = {
  poolName: string;
  poolAddress: string;
  rewardToken: string;
  incentiveKey: object;
  startTime: number;
  endTime: number;
  allocatedReward: string;
  numStakers: number;
  status: string;
  account: string;
  verified: boolean;
  tx: string;
  sig: string;
};

export const CreateReward: FC<CreateRewardProps> = ({pools}) => {
  // const {data} = useAppSelector(selectModalType);
  const {colorMode} = useColorMode();
  const theme = useTheme();
  const {account, library} = useActiveWeb3React();
  const [claimableAmount, setClaimableAmount] = useState<Number>(100000.0);
  const [amount, setAmount] = useState<number>(0);
  const [name, setName] = useState<string>('');
  const [reward, setReward] = useState<Number>(0);
  const [startTime, setStartTime] = useState<number>(0);
  const [endTime, setEndTime] = useState<number>(0);
  const [poolsArr, setPoolsArr] = useState([]);

  useEffect(() => {
    let poolArr: any = [];
    poolArr = pools.map((pool) => {
      return pool.name;
    });
    setPoolsArr(poolArr);
  }, []);

  // useEffect(() => {
  //   const allowAmount = await tosContract
  //   .connect(signer)
  //   .allowance(account, UniswapStaker_Address);
  //   console.log('allowAmount', Number(allowAmount));
  // },[])

  const setStart = (date: any) => {
    const dateSelected = Number(new Date(date));
    setStartTime(dateSelected / 1000);
  };
  const setEnd = (date: any) => {
    const dateSelected = Number(new Date(date));
    setEndTime(dateSelected / 1000);
  };

  const onChangeSelectBoxPools = (e: any) => {
    const filterValue = e.target.value;
    setName(filterValue);
  };

  const dayStyle =
    colorMode === 'light'
      ? `.DayPicker-Day--outside {
  font-size: 13px;
  font-family: Roboto;
  color: #c7d1d8
}
.DayPickerInput-Overlay {
  background: white;
  box-shadow: 0 2px 4px 0 rgba(96, 97, 112, 0.14);
}
.DayPicker-Caption > div {
  color: #354052;
}
.DayPicker-Weekday {
  color: #84919e;
}
input {
  color: #3e495c;
}`
      : `.DayPicker-Day--outside {
  font-size: 13px;
  font-family: Roboto;
  color: #3c3c3c
}
.DayPickerInput-Overlay {
  background: #222222;
  border: solid 1px #535353;
}
.DayPicker-Caption > div {
  color: #dee4ef
}
.DayPicker-Weekday {
  color: #777;
}
input {
  color: #f3f4f1
}`;

  return (
    <Box display={'flex'} justifyContent={'flex-end'}>
      <Box
       boxShadow={'0 2px 5px 0 rgba(61, 73, 93, 0.1)'}
       border={colorMode === 'light'
         ? ''
         : '1px solid #535353'}
        h={'920px'}
        w={'284px'}
        p={'20px 15px'}
        borderRadius={'15px'}
        bg={colorMode === 'light' ? '#FFFFFF' : ''}>
        <Text
          fontWeight={'bold'}
          fontFamily={theme.fonts.titil}
          fontSize={'20px'}
          mb={'18px'}>
          Create a Reward Program
        </Text>
        <Flex alignItems={'center'} h={'45px'}>
          <Text
            color={colorMode === 'light' ? '#808992' : '#949494'}
            fontWeight={'bold'}
            fontSize={'13px'}
            w={'64px'}>
            Pool
          </Text>
          <Select
            h={'30px'}
            color={colorMode=== 'light'? '#3e495c': '#f3f4f1'}
            fontSize={'12px'}
            w={'190px'}
            onChange={onChangeSelectBoxPools}>
            {poolsArr.map((item, index) => (
              <option value={item} key={index}>
                {item}
              </option>
            ))}
          </Select>
        </Flex>
        <Flex alignItems={'center'} h={'45px'}>
          <Text
           color={colorMode === 'light' ? '#808992' : '#949494'}
            fontWeight={'bold'}
            fontSize={'13px'}
            w={'64px'}>
            Start
          </Text>
          <Flex
            alignItems={'center'}
            border={themeDesign.border[colorMode]}
            borderRadius={'4px'}
            w={'100px'}
            h={'30px'}>
            {' '}
            <style>{dayStyle}</style>
            <DayPickerInput
              placeholder={'MM/DD/YYYY'}
              keepFocus={false}
              formatDate={MomentLocaleUtils.formatDate}
              format="MM/DD/YYYY"
              onDayChange={setStart}
              dayPickerProps={{
                showOutsideDays: true,
              }}
            />
          </Flex>
          <Text ml={'10px'} fontSize={'10px'} color={colorMode === 'light' ? '#808992' : '#949494'}>
            Time setting
          </Text>
          <Image ml={'5px'} src={clock} alt="clock" />
        </Flex>
        <Flex alignItems={'center'} h={'45px'}>
          <Text
            color={colorMode === 'light' ? '#808992' : '#949494'}
            fontWeight={'bold'}
            fontSize={'13px'}
            w={'64px'}>
            End
          </Text>
          <Flex
            alignItems={'center'}
            border={themeDesign.border[colorMode]}
            borderRadius={'4px'}
            w={'100px'}
            h={'30px'}>
            {' '}
            <style>{dayStyle}</style>
            <DayPickerInput
              placeholder={'MM/DD/YYYY'}
              keepFocus={false}
              formatDate={MomentLocaleUtils.formatDate}
              format="MM/DD/YYYY"
              onDayChange={setEnd}
              dayPickerProps={{
                showOutsideDays: true,
              }}
            />
          </Flex>
          <Text ml={'10px'} fontSize={'10px'} color={colorMode === 'light' ? '#808992' : '#949494'}>
            Time setting
          </Text>
          <Image ml={'5px'} src={clock} alt="clock" />
        </Flex>
        <Flex alignItems={'center'} h={'45px'}>
          <Text
            color={colorMode === 'light' ? '#808992' : '#949494'}
            fontWeight={'bold'}
            fontSize={'13px'}
            w={'64px'}>
            Reward
          </Text>

          <Input
            h={'30px'}
            w={'110px'}
            border={themeDesign.border[colorMode]}
            fontSize={'13px'}
            placeholder={'Search'}
            _focus={{
              border: themeDesign.border[colorMode],
            }}
            color={themeDesign.font[colorMode]}
          />
          <Button
            w={'70px'}
            h={'30px'}
            bg={'blue.500'}
            color="white.100"
            ml={'10px'}
            fontSize="14px"
            _hover={{backgroundColor: 'blue.100'}}
            // onClick={() => createRewardFunc(account ? account.toString() : '')}
            >
            Search
          </Button>
        </Flex>
        <Flex justifyContent={'space-between'} alignItems={'center'} h={'45px'}>
          <Text
           color={colorMode === 'light' ? '#808992' : '#949494'}
            fontWeight={'bold'}
            fontSize={'13px'}
            w={'64px'}>
            Amount
          </Text>
          <Input
            h={'30px'}
            w={'190px'}
            border={themeDesign.border[colorMode]}
            fontSize={'13px'}
            value={Number(amount)}
            onChange={(e) => {
              const {value} = e.target;
              setAmount(Number(value));
            }}
            _focus={{
              border: themeDesign.border[colorMode],
            }}
            color={themeDesign.font[colorMode]}
          />
        </Flex>
        <Flex mt={'27px'} justifyContent={'center'}>
          <Button
            w={'100px'}
            h={'38px'}
            bg={'blue.500'}
            mr={'10px'}
            color="white.100"
            fontSize="14px"
            disabled={amount === 0}
            _hover={{backgroundColor: 'blue.100'}}
            onClick={() => approve({library: library, amount:amount, userAddress: account})}>
            Approve
          </Button>
          <Button
            w={'100px'}
            h={'38px'}
            bg={'blue.500'}
            color="white.100"
            fontSize="14px"
            disabled={amount === 0}
            _hover={{backgroundColor: 'blue.100'}}
            onClick={() => create({
              library: library,
              amount: amount, 
              userAddress: account,
              startTime: startTime,
               endTime: endTime, 
               name: name
            })}>
            Create
          </Button>
        </Flex>
      </Box>
    </Box>
  );
};

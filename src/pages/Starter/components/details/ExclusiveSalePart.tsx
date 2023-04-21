import {
  Box,
  useColorMode,
  useTheme,
  Flex,
  Text,
  FormControl,
  FormLabel,
  Switch,
} from '@chakra-ui/react';
import {CustomInput} from 'components/Basic';
import {CustomButton} from 'components/Basic/CustomButton';
import {useEffect, useState} from 'react';
import {DetailCounter} from './Detail_Counter';
import ArrowIcon from 'assets/svgs/arrow_icon.svg';
import {useActiveWeb3React} from 'hooks/useWeb3';
import {convertTimeStamp} from 'utils/convertTIme';
import {DetailInfo, SaleInfo} from '@Starter/types';
import {useCallContract} from 'hooks/useCallContract';
import {convertNumber} from 'utils/number';
import starterActions from '../../actions';
import {useCheckBalance} from 'hooks/useCheckBalance';
import {BigNumber} from 'ethers';
import {useERC20} from '@Starter/hooks/useERC20';
import useMaxValue from '@Starter/hooks/useMaxValue';
import useMaxWTONVaule from '@Starter/hooks/useMaxWTONVaule';
import {addToken} from '@Starter/actions/actions';

type DepositContainerProp = {
  amountAvailable: string;
  inputTonBalance: string;
  saleContractAddress: string;
  wtonMode: boolean;
  btnDisabled: boolean;
  saleInfo: SaleInfo;
};

const DepositContainer: React.FC<DepositContainerProp> = (prop) => {
  const {
    amountAvailable,
    inputTonBalance,
    saleContractAddress,
    wtonMode,
    btnDisabled,
    saleInfo,
  } = prop;

  const {account, library} = useActiveWeb3React();
  const {checkBalance} = useCheckBalance();
  const {
    tonBalance,
    wtonBalance,
    // tonAllowance,
    // wtonAllowance,
    // originTonAllowance,
    // originWtonAllowance,
    // callTonDecreaseAllowance,
  } = useERC20(saleContractAddress);
  // const dispatch = useDispatch();
  // const {colorMode} = useColorMode();

  const [depositBtnDisabled, setDepositBtnDisabled] = useState<boolean>(true);

  useEffect(() => {
    // zena
    // const isBtnAble =
    //   btnDisabled || Number(amountAvailable.replaceAll(',', '')) <= 0;

    //zena
    setDepositBtnDisabled(btnDisabled);
    // setDepositBtnDisabled(isBtnAble);
  }, [btnDisabled, amountAvailable]);

  // let inputTonBalanceWei = ethers.utils
  //   .parseUnits(inputTonBalanceStr, 18)
  //   .toString();

  // let tonApproveSameInput = false;
  // if (originTonAllowance === inputTonBalanceWei) tonApproveSameInput = true;

  if (wtonMode === false) {
    return (
      <Flex alignItems="center" justifyContent="space-between">
        <CustomButton
          text={'Acquire'}
          isDisabled={depositBtnDisabled}
          func={() => {
            account &&
              checkBalance(
                Number(inputTonBalance),
                Number(tonBalance.replaceAll(',', '')),
              ) &&
              starterActions.deposit({
                account,
                library,
                address: saleContractAddress,
                amount: inputTonBalance,
                tokenType: 'TON',
              });
          }}></CustomButton>
        <CustomButton
          text={'Import Token'}
          tooltip={
            'This button will add the current project token to your MetaMask wallet.'
          }
          bgBlue={false}
          style={{
            marginLeft: '12px',
            border: '1px solid #2a72e5',
            bg: 'transparent',
            color: '#2a72e5',
          }}
          func={() => {
            account &&
              library &&
              addToken(
                saleInfo.tokenAddress,
                library,
                saleInfo.tokenSymbolImage ? saleInfo.tokenSymbolImage : '',
              );
          }}></CustomButton>
        {/* <Box
          d="flex"
          flexDir="column"
          justifyContent="center"
          ml={'15px'}
          fontSize={13}>
          <Text color={colorMode === 'light' ? 'gray.400' : 'gray.425'}>
            The Approved Amount
          </Text>
          <Text color={colorMode === 'light' ? 'gray.250' : 'white.200'}>
            {' '}
            {tonAllowance} TON{' '}
          </Text>
        </Box> */}
      </Flex>
    );
  }

  return (
    <Flex alignItems="center" justifyContent="space-between">
      <CustomButton
        text={'Acquire (WTON)'}
        isDisabled={depositBtnDisabled}
        style={{marginRight: '12px'}}
        func={() =>
          account &&
          checkBalance(
            Number(inputTonBalance),
            Number(wtonBalance.replaceAll(',', '')),
          ) &&
          starterActions.deposit({
            account,
            library,
            address: saleContractAddress,
            amount: inputTonBalance,
            tokenType: 'WTON',
          })
        }></CustomButton>
      <CustomButton
        text={'Import Token'}
        tooltip={
          'This button will add the current project token to your MetaMask wallet.'
        }
        bgBlue={false}
        func={() => {
          account &&
            library &&
            addToken(
              saleInfo.tokenAddress,
              library,
              saleInfo.tokenSymbolImage ? saleInfo.tokenSymbolImage : '',
            );
        }}></CustomButton>
      {/* <Box
        d="flex"
        flexDir="column"
        justifyContent="center"
        ml={'15px'}
        fontSize={13}>
        <Text color={colorMode === 'light' ? 'gray.400' : 'gray.425'}>
          The Approved Amount
        </Text>
        <Text color={colorMode === 'light' ? 'gray.250' : 'white.200'}>
          {' '}
          {wtonAllowance} WTON{' '}
        </Text>
      </Box> */}
    </Flex>
  );
};

type ExclusiveSalePartProps = {
  saleInfo: SaleInfo;
  detailInfo: DetailInfo | undefined;
};

export const ExclusiveSalePart: React.FC<ExclusiveSalePartProps> = (prop) => {
  const {saleInfo, detailInfo} = prop;
  const {
    tokenExRatio,
    saleContractAddress,
    fundingTokenType,
    tokenName,
    tokenSymbol,
    startAddWhiteTime,
    endExclusiveTime,
  } = saleInfo;
  const {colorMode} = useColorMode();
  const theme = useTheme();
  const {account, library} = useActiveWeb3React();

  const [inputTonBalance, setInputTonBalance] = useState<string>('0');
  const [convertedTokenBalance, setConvertedTokenBalance] =
    useState<string>('0');

  const [amountAvailable, setAmountAvailable] = useState<string>('-');
  const [userAllocation] = useState<string>(
    detailInfo
      ? detailInfo.tierAllocation[
          detailInfo.userTier !== 0 ? detailInfo.userTier : 1
        ]
      : '0',
  );
  const [userTierAllocation, setUserTierAllocation] = useState<string>('-');
  const [payAmount, setPayAmount] = useState<string>('-');
  const [saleAmount, setSaleAmount] = useState<string>('-');
  const [btnDisabled, setBtnDisabled] = useState<boolean>(true);

  const [wtonMode, setWtonMode] = useState<boolean>(false);

  const PUBLICSALE_CONTRACT = useCallContract(
    saleContractAddress,
    'PUBLIC_SALE',
  );

  const {tonBalance, wtonBalance} = useERC20(saleContractAddress);

  const {maxValue} = useMaxValue({
    tonBalance,
    amountAvailable,
    tokenExRatio,
  });

  const {maxWTONValue} = useMaxWTONVaule({
    wtonBalance,
    amountAvailable,
    tokenExRatio,
  });

  const {STATER_STYLE} = theme;

  const detailSubTextStyle = {
    color: colorMode === 'light' ? 'gray.250' : 'white.100',
  };

  useEffect(() => {
    async function getTierAllowcation() {
      if (PUBLICSALE_CONTRACT && detailInfo) {
        const payAmount = await PUBLICSALE_CONTRACT.usersEx(account);
        const availableAmounT = await PUBLICSALE_CONTRACT.calculTierAmount(
          account,
        );

        const pay = convertNumber({
          amount: payAmount.saleAmount,
          localeString: true,
        });
        const sale = convertNumber({
          amount: payAmount.payAmount,
          localeString: true,
        });

        // setIsAlreadyBuy(Number(sale?.replaceAll(',', '')) > 0);

        const res =
          detailInfo.totalExpectSaleAmount[
            detailInfo.userTier !== 0 ? detailInfo.userTier : 1
          ];
        const availalbleSubPay = BigNumber.from(availableAmounT).sub(
          payAmount.saleAmount,
        );
        const convertedAvailableAmount = convertNumber({
          amount: availalbleSubPay.toString(),
          localeString: true,
        });
        setUserTierAllocation(detailInfo.userTier === 0 ? '-' : res);

        //temp
        setAmountAvailable(
          convertedAvailableAmount &&
            Number(convertedAvailableAmount.replaceAll(',', '')) > tokenExRatio
            ? convertedAvailableAmount
            : '0.00',
        );
        setSaleAmount(sale || '0.00');
        setPayAmount(pay || '0.00');
      }
    }
    if (account && library && PUBLICSALE_CONTRACT && saleInfo) {
      getTierAllowcation();
    }
  }, [
    account,
    library,
    PUBLICSALE_CONTRACT,
    detailInfo,
    saleInfo,
    tokenExRatio,
  ]);

  useEffect(() => {
    if (saleInfo) {
      const result = Number(inputTonBalance) * tokenExRatio;
      if (String(result).split('.')[1]?.length > 2) {
        return setConvertedTokenBalance(
          `${String(result).split('.')[0]}.${String(result)
            .split('.')[1]
            .slice(0, 2)}`,
        );
      }
      setConvertedTokenBalance(String(result));
    }
  }, [inputTonBalance, saleInfo, convertedTokenBalance, tokenExRatio]);

  useEffect(() => {
    async function getInfo() {
      if (account && library && saleContractAddress) {
        const whiteListInfo = await starterActions.isWhiteList({
          account,
          library,
          address: saleContractAddress,
        });

        //zena
        setBtnDisabled(
          !whiteListInfo[0] ||
            Number(amountAvailable.replaceAll(',', '')) < tokenExRatio ||
            (wtonMode &&
              Number(inputTonBalance.replaceAll(',', '')) > maxWTONValue) ||
            (!wtonMode &&
              Number(inputTonBalance.replaceAll(',', '')) > maxValue),
        );
        // setBtnDisabled(false);
        // setAmountAvailable();
      }
    }
    if (account && library && saleContractAddress) {
      getInfo();
    }
  }, [
    account,
    library,
    saleContractAddress,
    amountAvailable,
    tokenExRatio,
    wtonMode,
    inputTonBalance,
    maxWTONValue,
  ]);

  return (
    <Flex flexDir="column" pl={'45px'}>
      <Box
        d="flex"
        textAlign="center"
        alignItems="center"
        justifyContent="space-between"
        mb={'20px'}>
        <Flex alignItems="center">
          <Text
            {...STATER_STYLE.mainText({colorMode, fontSize: 25})}
            mr={'20px'}>
            Public Round 1
          </Text>
          <DetailCounter
            numberFontSize={'18px'}
            stringFontSize={'14px'}
            date={endExclusiveTime * 1000}></DetailCounter>
        </Flex>
        <Flex pr={2.5}>
          <FormControl display="flex" alignItems="center">
            <FormLabel htmlFor="email-alerts" mb="0">
              WTON
            </FormLabel>
            <Switch
              onChange={() => {
                setWtonMode(!wtonMode);
                setInputTonBalance('0');
              }}
              // defaultChecked={true}
              value={0}></Switch>
          </FormControl>
        </Flex>
      </Box>
      <Box d="flex">
        <Text
          color={colorMode === 'light' ? 'gray.375' : 'white.100'}
          fontSize={14}
          letterSpacing={'1.4px'}
          mb={'10px'}>
          Acquire Amount
        </Text>
        <Text
          {...STATER_STYLE.subText({colorMode: 'light'})}
          letterSpacing={'1.4px'}
          mb={'10px'}>
          (Your balance :{' '}
          {wtonMode === false ? `${tonBalance} TON` : `${wtonBalance} WTON`})
        </Text>
      </Box>
      <Box d="flex" alignItems="center" mb={'30px'}>
        <Box d="flex" mr={'10px'} alignItems="center" pos="relative">
          <CustomInput
            w={'220px'}
            h={'32px'}
            numberOnly={true}
            style={{
              border: wtonMode
                ? Number(inputTonBalance) > maxWTONValue
                  ? '1px solid #ff3b3b'
                  : colorMode === 'light'
                  ? '1px solid #dfe4ee'
                  : '1px solid #424242'
                : Number(inputTonBalance) > maxValue
                ? '1px solid #ff3b3b'
                : colorMode === 'light'
                ? '1px solid #dfe4ee'
                : '1px solid #424242',
            }}
            value={inputTonBalance}
            setValue={setInputTonBalance}
            color={
              Number(inputTonBalance) > 0
                ? colorMode === 'light'
                  ? 'gray.225'
                  : 'white.100'
                : 'gray.175'
            }
            tokenName={wtonMode ? 'WTON' : 'TON'}
            maxBtn={true}
            maxValue={wtonMode ? maxWTONValue : maxValue}></CustomInput>
          <Flex pos="absolute" left={0} top={10} fontSize={'13px'}>
            <Text color={'gray.400'} mr={'3px'}>
              Your investment (max) :{' '}
            </Text>
            <Text mr={'3px'} color={colorMode==='dark'? '#f3f4f1':'#3d495d'}> {saleAmount} TON </Text>
          </Flex>
          <img
            src={ArrowIcon}
            alt={'icon_arrow'}
            style={{
              width: '20px',
              height: '20px',
              marginLeft: '20px',
              marginRight: '20px',
            }}></img>
          <CustomInput
            w={'220px'}
            h={'32px'}
            numberOnly={true}
            value={convertedTokenBalance}
            setValue={setConvertedTokenBalance}
            color={
              Number(inputTonBalance) > 0
                ? colorMode === 'light'
                  ? 'gray.225'
                  : 'white.100'
                : 'gray.175'
            }
            tokenName={tokenSymbol}></CustomInput>
          <Flex pos="absolute" right={0} top={10} fontSize={'13px'}>
            <Text color={'gray.400'} mr={'3px'}>
              Your Allocation (max) :{' '}
            </Text>
            {/* <Text mr={'3px'}> {amountAvailable} </Text> */}
            <Text>{payAmount}</Text>
            <Text>{tokenSymbol}</Text>
          </Flex>
        </Box>
      </Box>
      <Box d="flex" flexDir="column" w={'495px'} mt="10px">
        <Text {...STATER_STYLE.mainText({colorMode, fontSize: 14})}>
          Details
        </Text>
        <Box d="flex" fontSize={'13px'} justifyContent="space-between">
          <Flex w={'235px'}>
            <Text color={'gray.400'} mr={'3px'}>
              Public Round 1 Period :{' '}
            </Text>
            <Text {...detailSubTextStyle}>
              {convertTimeStamp(startAddWhiteTime, 'YYYY-MM-D')} ~{' '}
              {convertTimeStamp(endExclusiveTime, 'MM-D')}
            </Text>
          </Flex>
          <Flex w={'235px'}>
            <Text color={'gray.400'} mr={'3px'}>
              Your Allocation :{' '}
            </Text>
            <Text mr={'3px'}>
              {' '}
              {btnDisabled === true ? '-' : userAllocation}{' '}
            </Text>
            <Text>{tokenSymbol}</Text>
          </Flex>
        </Box>
        <Box d="flex" fontSize={'13px'} justifyContent="space-between">
          <Flex w={'235px'}>
            <Text color={'gray.400'} mr={'3px'}>
              {`Tier Allocation(Tier: ${detailInfo?.userTier || '-'})`} :{' '}
            </Text>
            <Text {...detailSubTextStyle} mr={'3px'}>
              {userTierAllocation}
            </Text>
            <Text>{tokenSymbol}</Text>
          </Flex>
          <Flex w={'235px'}>
            <Text color={'gray.400'} mr={'3px'}>
              Ratio :{' '}
            </Text>
            <Text {...detailSubTextStyle}>
              1 {fundingTokenType} = {tokenExRatio} {tokenSymbol}
            </Text>
          </Flex>
        </Box>
        <Box d="flex" fontSize={'13px'} justifyContent="space-between">
          <Flex>
            <Text color={'gray.400'} mr={'3px'}>
              Public Round 1 :{' '}
            </Text>
            <Text {...detailSubTextStyle} mr={'3px'}>
              {payAmount}
            </Text>
            <Text color={'gray.400'}>({saleAmount} TON)</Text>
          </Flex>
        </Box>
      </Box>
      <Box mt={'27px'} h={'38px'} d="flex" alignItems="center">
        <DepositContainer
          amountAvailable={amountAvailable}
          btnDisabled={btnDisabled}
          inputTonBalance={inputTonBalance}
          saleContractAddress={saleContractAddress}
          saleInfo={saleInfo}
          wtonMode={wtonMode}></DepositContainer>
        {/* <CustomButton
          w={'100px'}
          text="ton initialize"
          style={{marginLeft: '5px', marginRight: '5px'}}
          func={() => callTonDecreaseAllowance()}></CustomButton>
        <CustomButton
          w={'100px'}
          text="wton initialize"
          func={() => callWtonDecreaseAllowance()}></CustomButton> */}
      </Box>
    </Flex>
  );
};

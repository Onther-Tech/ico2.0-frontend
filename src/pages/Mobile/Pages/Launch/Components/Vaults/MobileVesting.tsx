//MobileWtonTosLpReward
import {FC, useState, Dispatch, SetStateAction, useEffect} from 'react';
import {
  Flex,
  Box,
  Text,
  useColorMode,
  useTheme,
  Link,
  GridItem,
  Grid,
  Button,
} from '@chakra-ui/react';
import {BASE_PROVIDER} from 'constants/index';
import {shortenAddress} from 'utils';
import {MobileVaultTable} from './MobileVaultTable';
import momentTZ from 'moment-timezone';
import moment from 'moment';
import {useActiveWeb3React} from 'hooks/useWeb3';
import {getSigner} from 'utils/contract';
import {Contract} from '@ethersproject/contracts';
import {ethers} from 'ethers';
import store from 'store';
import {toastWithReceipt} from 'utils';
import {setTxPending} from 'store/tx.reducer';
import {openToast} from 'store/app/toast.reducer';
import {useAppSelector} from 'hooks/useRedux';
import {selectTransactionType} from 'store/refetch.reducer';
import * as VaultCLogicAbi from 'services/abis/VaultCLogicAbi.json';
import {DEPLOYED} from 'constants/index';
import * as ERC20 from 'services/abis/erc20ABI(SYMBOL).json';

const provider = BASE_PROVIDER;
const {TOS_ADDRESS, UniswapV3Factory, NPM_Address} = DEPLOYED;

type Vesting = {vault: any; project: any; setVaultInfo: Function};

type TokenCompProps = {
  vault: any;
  project: any;
};

type ClaimCompProps = {
  vault: any;
  project: any;
  distributable: number;
  claimTime: number;
  showDate: boolean;
  distributeDisable: boolean;
  claim: Dispatch<SetStateAction<any>>;
  setVaultInfo: Function;
};

export const MobileVesting: FC<Vesting> = ({vault, project, setVaultInfo}) => {
  const {colorMode} = useColorMode();
  const theme = useTheme();
  const [buttonState, setButtonState] = useState('Token');
  const {account, library} = useActiveWeb3React();
  const [distributable, setDistributable] = useState<number>(0);
  const [claimTime, setClaimTime] = useState<number>(0);
  const {transactionType, blockNumber} = useAppSelector(selectTransactionType);
  const [distributeDisable, setDistributeDisable] = useState<boolean>(true);
  const vaultC = new Contract(vault.vaultAddress, VaultCLogicAbi.abi, library);
  const [claimAddress, setClaimAddress] = useState<string>('');
  const [showDate, setShowDate] = useState<boolean>(false);
  const [tosBalance, setTosBalance] = useState<string>('');
  const [completedRounds, setCompletedRounds] = useState<string>('2');
  const [accTotal, setAccTotal] = useState(0);
  const [accRound, setAccRound] = useState(0);

  const TOS = new Contract(TOS_ADDRESS, ERC20.abi, library);

  async function claim() {}

  useEffect(() => {
    async function getLPToken() {
      if (account === null || account === undefined || library === undefined) {
        return;
      }

      const signer = getSigner(library, account);
      const tosBal = await TOS.balanceOf(vault.vaultAddress);
      const TOSBal = ethers.utils.formatEther(tosBal);
      setTosBalance(TOSBal);
    }
    getLPToken();
  }, [account, library, transactionType, blockNumber, vault.vaultAddress]);

  useEffect(() => {
    const initialAmount = 0;
    const reducer = (amount: any, claim: any) =>
      amount + claim.claimTokenAllocation;
    const total = vault.claim.reduce(reducer, initialAmount);
    setAccTotal(total);

    const claimsCurrentRound = vault.claim.slice(
      0,
      Number(completedRounds) + 1,
    );
    const roundAccTotal = claimsCurrentRound.reduce(reducer, initialAmount);
    setAccRound(roundAccTotal);
  }, [account, project, vault]);

  return (
    <Flex mt={'35px'} flexDir={'column'} px={'20px'}>
      <Flex
        mx={'auto'}
        mb={'20px'}
        fontFamily={theme.fonts.fld}
        fontSize="13px"
        alignItems={'center'}>
        <Text
          px={'12px'}
          _active={{color: colorMode === 'light' ? '#304156' : '#ffffff'}}
          onClick={() => setButtonState('Token')}
          fontWeight={buttonState === 'Token' ? 'bold' : 'normal'}
          color={
            buttonState === 'Token'
              ? colorMode === 'light'
                ? '#304156'
                : '#ffffff'
              : '#9d9ea5'
          }>
          Token
        </Text>
        <Box
          h={'9px'}
          w={'1px'}
          border={
            colorMode === 'light'
              ? '0.5px solid #d7d9df'
              : '0.5px solid #373737'
          }></Box>
        <Text
          px={'12px'}
          fontWeight={buttonState === 'Claim' ? 'bold' : 'normal'}
          color={
            buttonState === 'Claim'
              ? colorMode === 'light'
                ? '#304156'
                : '#ffffff'
              : '#9d9ea5'
          }
          onClick={() => setButtonState('Claim')}>
          Claim
        </Text>
      </Flex>
      {buttonState === 'Token' ? (
        <TokenComp vault={vault} project={project} />
      ) : (
        <ClaimComp
          project={project}
          vault={vault}
          claimTime={claimTime}
          showDate={showDate}
          distributeDisable={distributeDisable}
          distributable={distributable}
          claim={claim}
          setVaultInfo={setVaultInfo}
        />
      )}
      <MobileVaultTable claim={vault.claim} />
    </Flex>
  );
};
const ClaimComp: React.FC<ClaimCompProps> = ({
  project,
  vault,
  claimTime,
  showDate,
  distributeDisable,
  distributable,
  claim,
  setVaultInfo,
}) => {
  const {colorMode} = useColorMode();
  const theme = useTheme();

  const network = BASE_PROVIDER._network.name;
  const gridItemStyle = {
    display: 'flex',
    flexDire: 'row',
    justifyContent: 'space-between',
    paddingLeft: '20px',
    paddingRight: '20px',
    height: '60px',
    alignItems: 'center',
  };
  const leftText = {
    fontFamily: theme.fonts.fld,
    fontSize: '14px',
    color: colorMode === 'light' ? '#7e8993' : '#9d9ea5',
  };
  const rightText = {
    fontFamily: theme.fonts.fld,
    fontSize: '14px',
    fontWeight: 'bold',
    color: colorMode === 'light' ? '#353c48' : '#fff',
  };
  return (
    <Grid
      h={'100%'}
      bg={colorMode === 'light' ? '#fff' : 'transparent'}
      boxShadow={
        colorMode === 'light' ? '0 1px 1px 0 rgba(61, 73, 93, 0.1)' : 'none'
      }
      border={colorMode === 'light' ? 'none' : 'solid 1px #373737'}
      borderRadius="15px">
      <GridItem
        style={gridItemStyle}
        h="87px !important"
        borderBottom={
          colorMode === 'light' ? '1px solid #e6eaee' : '1px solid #373737'
        }
        pt="20px"
        pb="13px"
        flexDir={'column'}
        alignItems="flex-start !important">
        <Text
          fontSize={'14px'}
          lineHeight={1.14}
          style={rightText}
          fontWeight={600}>
          Progress
        </Text>
        <Text fontSize={'12px'} mt="6px" lineHeight={1.17}>
          To initiate a vesting round, please go to{' '}
          <span
            style={{
              color: '#257eee',
              textDecoration: 'underline',
            }}
            onClick={() => setVaultInfo(project.vaults[0], 0)}>
            Public Vault
          </span>{' '}
          and send funds to the initial liquidity vault
        </Text>
      </GridItem>
      <GridItem
        style={gridItemStyle}
        borderBottom={
          colorMode === 'light' ? '1px solid #e6eaee' : '1px solid #373737'
        }>
        {/* <Flex alignItems={'center'}>
          <Text style={rightText} mr="3px">
            {distributable.toLocaleString()}
          </Text>
          <Text
            fontFamily={theme.fonts.fld}
            fontSize={'12px'}
            color={colorMode === 'light' ? '#7e8993' : '#9d9ea5'}>
            {project.tokenSymbol}
          </Text>
        </Flex>
        <Button
          fontSize={'13px'}
          w={'100px'}
          h={'32px'}
          bg={'#257eee'}
          color={'#ffffff'}
          isDisabled={distributeDisable}
          _disabled={{
            color: colorMode === 'light' ? '#86929d' : '#838383',
            bg: colorMode === 'light' ? '#e9edf1' : '#353535',
            cursor: 'not-allowed',
          }}
          _hover={
            distributeDisable
              ? {}
              : {
                  cursor: 'pointer',
                }
          }
          _active={
            distributeDisable
              ? {}
              : {
                  background: '#2a72e5',
                  border: 'solid 1px #2a72e5',
                  color: '#fff',
                }
          }
          onClick={claim}>
          Claim
        </Button> */}
      </GridItem>
      <GridItem style={gridItemStyle}>
        <Flex alignItems={'center'}>
          <Text style={leftText} w='174px'>Address for Receiving Funds from the Vesting Vault</Text>
          <Link
              isExternal
              href={
               project.vaults[0].addressForReceiving && network === 'rinkeby'
                  ? `https://rinkeby.etherscan.io/address/${project.vaults[0].addressForReceiving}`
                  : vault.adminAddress && network !== 'rinkeby'
                  ? `https://etherscan.io/address/${project.vaults[0].addressForReceiving}`
                  : ''
              }
              color={colorMode === 'light' ? '#353c48' : '#ffffff'}
              _hover={{color: '#2a72e5'}}
              textDecor='underline'
              fontSize='14px'
              fontFamily={theme.fonts.fld}>
              {project.vaults[0].addressForReceiving? shortenAddress(project.vaults[0].addressForReceiving) : 'NA'}
            </Link>
        </Flex>
      </GridItem>
    </Grid>
  );
};

const TokenComp: React.FC<TokenCompProps> = ({vault, project}) => {
  const {colorMode} = useColorMode();
  const theme = useTheme();

  const network = BASE_PROVIDER._network.name;
  const gridItemStyle = {
    display: 'flex',
    flexDire: 'row',
    justifyContent: 'space-between',
    paddingLeft: '20px',
    paddingRight: '20px',
    height: '60px',
    alignItems: 'center',
  };
  const leftText = {
    fontFamily: theme.fonts.fld,
    fontSize: '14px',
    color: colorMode === 'light' ? '#7e8993' : '#9d9ea5',
  };
  const rightText = {
    fontFamily: theme.fonts.fld,
    fontSize: '14px',
    fontWeight: 'bold',
    color: colorMode === 'light' ? '#353c48' : '#fff',
  };
  return (
    <Grid
      h={'100%'}
      bg={colorMode === 'light' ? '#fff' : 'transparent'}
      boxShadow={
        colorMode === 'light' ? '0 1px 1px 0 rgba(61, 73, 93, 0.1)' : 'none'
      }
      border={colorMode === 'light' ? 'none' : 'solid 1px #373737'}
      borderRadius="15px">
      <GridItem
        style={gridItemStyle}
        borderBottom={
          colorMode === 'light' ? '1px solid #e6eaee' : '1px solid #373737'
        }>
        {' '}
        <Text
          fontFamily={theme.fonts.fld}
          fontSize="14px"
          color={colorMode === 'light' ? '#353c48' : '#fff'}
          fontWeight={600}>
          Token
        </Text>
        {vault.isDeployed ? (
          <Flex>
            <Text letterSpacing={'1.3px'} style={rightText} mr={'5px'}>
              {Number(vault.vaultTokenAllocation).toLocaleString()}{' '}
              {project.tokenSymbol}
            </Text>
            <Text
              fontFamily={theme.fonts.fld}
              letterSpacing={'1.3px'}
              fontSize={'14px'}
              color={colorMode === 'light' ? '#7e8993' : '#9d9ea5'}>
              {'('}
              {(
                (vault.vaultTokenAllocation / project.totalTokenAllocation) *
                100
              )
                .toString()
                .match(/^\d+(?:\.\d{0,2})?/)}
              {'%)'}
            </Text>
          </Flex>
        ) : (
          <></>
        )}
      </GridItem>
      <GridItem
        style={gridItemStyle}
        borderBottom={
          colorMode === 'light' ? '1px solid #e6eaee' : '1px solid #373737'
        }>
        <Text style={leftText} w={'103px'}>
          Vault Admin Address
        </Text>
        <Link
          isExternal
          href={
            vault.adminAddress && network === 'rinkeby'
              ? `https://rinkeby.etherscan.io/address/${vault.adminAddress}`
              : vault.adminAddress && network !== 'rinkeby'
              ? `https://etherscan.io/address/${vault.adminAddress}`
              : ''
          }
          style={rightText}
          textDecor={'underline'}>
          {vault.adminAddress ? shortenAddress(vault.adminAddress) : 'NA'}
        </Link>
      </GridItem>
      <GridItem style={gridItemStyle}>
        <Text style={leftText} w={'103px'}>
          Vault Contract Address
        </Text>
        <Link
          isExternal
          href={
            vault.vaultAddress && network === 'rinkeby'
              ? `https://rinkeby.etherscan.io/address/${vault.vaultAddress}`
              : vault.vaultAddress && network !== 'rinkeby'
              ? `https://etherscan.io/address/${vault.vaultAddress}`
              : ''
          }
          style={rightText}
          textDecor={'underline'}>
          {vault.vaultAddress ? shortenAddress(vault.vaultAddress) : 'NA'}
        </Link>
      </GridItem>
    </Grid>
  );
};

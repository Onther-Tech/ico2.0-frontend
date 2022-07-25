import {injected, trazorConnector} from 'connectors';
import {WalletInfo} from 'types';
import {DEPLOYED_TYPE} from './type';
import {ethers} from 'ethers';
import {tokens} from './token';

export const REACT_APP_MODE = process.env.REACT_APP_MODE as string;
export const REACT_APP_MAINNET_INFURA_API = process.env
  .REACT_APP_MAINNET_INFURA_API as string;
export const REACT_APP_RINKEBY_INFURA_API = process.env
  .REACT_APP_RINKEBY_INFURA_API as string;
export const REACT_APP_MAINNET_API = process.env
  .REACT_APP_MAINNET_API as string;
export const REACT_APP_DEV_API = process.env.REACT_APP_DEV_API as string;
export const REACT_APP_LOCAL = process.env.REACT_APP_LOCAL as string;
export const REACT_APP_MAINNET_OPENCAMPAGIN_API = process.env
  .REACT_APP_MAINNET_OPENCAMPAGIN_API as string;
export const REACT_APP_RINKEBY_OPENCAMPAGIN_API = process.env
  .REACT_APP_RINKEBY_OPENCAMPAGIN_API as string;
export const REACT_APP_TOS_PRICE = process.env.REACT_APP_TOS_PRICE as string;
export const REACT_APP_ETH_PRICE = process.env.REACT_APP_ETH_PRICE as string;
export const NetworkContextName = `${new Date().getTime()}-NETWORK`;
export const DEFAULT_NETWORK = REACT_APP_MODE === 'DEV' ? 4 : 1;
export const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000';

export const API_SERVER =
  REACT_APP_MODE === 'DEV' ? REACT_APP_DEV_API : REACT_APP_MAINNET_API;
export const API_SERVER_LAUNCH =
  REACT_APP_MODE === 'DEV'
    ? REACT_APP_RINKEBY_OPENCAMPAGIN_API
    : REACT_APP_MAINNET_OPENCAMPAGIN_API;

export const BASE_PROVIDER =
  REACT_APP_MODE === 'DEV'
    ? ethers.getDefaultProvider('rinkeby')
    : ethers.getDefaultProvider('mainnet');

export const OPENSEA =
  REACT_APP_MODE === 'DEV'
    ? 'https://testnets.opensea.io/assets/rinkeby/0x48683ac8ab065a113323bdb5738a267d7ff7f0d6/'
    : 'https://opensea.io/assets/ethereum/';
export const fetchStakeURL = `${API_SERVER}/stakecontracts?chainId=${DEFAULT_NETWORK}`;
export const fetchValutURL = `${API_SERVER}/vaults?chainId=${DEFAULT_NETWORK}`;
export const fetchRewardsURL = `${API_SERVER}/reward?chainId=${DEFAULT_NETWORK}&pagesize=200`;
export const fetchStarterURL = `${API_SERVER}/starter?chainId=${DEFAULT_NETWORK}`;
export const fetchPoolsURL = `${API_SERVER}/pool?chainId=${DEFAULT_NETWORK}`;
export const fetchTokensURL = `${API_SERVER}/tokens?chainId=${DEFAULT_NETWORK}`;
export const fetchCampaginURL = `${API_SERVER_LAUNCH}/projects?chainId=${DEFAULT_NETWORK}`;
export const fetchTosPriceURL = REACT_APP_TOS_PRICE;
export const fetchEthPriceURL = REACT_APP_ETH_PRICE;
export const permitTOSAddress =
  REACT_APP_MODE === 'DEV' ? '0x865264b30eb29A2978b9503B8AfE2A2DDa33eD7E' : '';

export const TOKENS = tokens;

const MAINNET_DEPLOYED = {
  Stake1Proxy_ADDRESS: '0x8e539e29D80fd4cB3167409A82787f3B80bf9113',
  TON_ADDRESS: '0x2be5e8c109e2197D077D13A82dAead6a9b3433C5',
  TOS_ADDRESS: '0x409c4D8cd5d2924b9bc5509230d16a61289c8153',
  AURA_ADDRESS: '0xaEC59E5b4f8DbF513e260500eA96EbA173F74149',
  WTON_ADDRESS: '0xc4A11aaf6ea915Ed7Ac194161d2fC9384F15bff2',
  DOC_ADDRESS: '0x0e498afce58dE8651B983F136256fA3b8d9703bc',
  ETH_ADDRESS: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
  DepositManager_ADDRESS: '0x56E465f654393fa48f007Ed7346105c7195CEe43',
  SeigManager_ADDRESS: '0x710936500aC59e8551331871Cbad3D33d5e0D909',
  SwapProxy_ADDRESS: '0x30e65B3A6e6868F044944Aa0e9C5d52F8dcb138d',
  TokamakLayer2_ADDRESS: '0x42ccf0769e87cb2952634f607df1c7d62e0bbc52',
  Airdrop_ADDRESS: '0x0620492BAbe0a2cE13688025F8b783B8d6c28955',
  LockTOS_ADDRESS: '0x69b4A202Fa4039B42ab23ADB725aA7b1e9EEBD79',
  UniswapStaking_Address: '0xC1349A9a33A0682804c390a3968e26E5a2366153',
  UniswapStaker_Address: '0x1f98407aaB862CdDeF78Ed252D6f557aA5b0f00d',
  UniswapStakerV3_address: '0xe34139463bA50bD61336E0c446Bd8C0867c6fE65',
  NPM_Address: '0xC36442b4a4522E871399CD717aBDD847Ab11FE88',
  BasePool_Address: '0x1c0ce9aaa0c12f53df3b4d8d77b82d6ad343b4e4',
  DOCPool_Address: '0x369bca127b8858108536b71528ab3befa1deb6fc',
  StakeTonControl_ADDRESS: '0xacdded49ac67ba9c87b1bbc5cb248b1bd7dc0f19',
  LockTOSDividend_ADDRESS: '0x17332F84Cc0bbaD551Cd16675F406A0a2c55E28C',
  LockTOSProxy_ADDRESS: '',
  DividendPool_ADDRESS: '',
  DividendPoolProxy_ADDRESS: '',
  PublicSale_ADDRESS: '',
  unstakeLayer2All: '0xf9381fB7167FC3e81849aE82960144274D1553C2',
  PowerTONSwapper_ADDRESS: '0xDE200f091a5CD840cD52Ece7406865607a25dF69',
  DoMsaleContractAddress: '0x3B75d3f628C29d357b484EA7d091faEd63419267',
  ERC20AFACTORY_ADDRESS: '0x230539fB72e7eeA8Bb037cA0556Fa9b0060A5d10',
  AutoCoinageSnapshot2_ADDRESS: '0x85Ca9f611C363065252EA9462c90743922767b55',
  TokenDividendProxyPool_ADDRESS: '0x06245F89576536E9cF844C5804a8ad1CCeDb2642',
  InitialLiquidityVault: '0xcf9A97F0CBBc2eB588E3e4301773d13267616F10',
  LiquidityIncentiveVault: '0x793A17A27E298071b918D40556Ed2efC6dE4E00E',
  PublicSaleVault: '0xD9822E155c36Fc4E8CB396444096FffE1560769C',
  TonStakerVault: '0x607b67214818f2acc8eEAE8b60E6579dad210298',
  TosStakerVault: '0x0744905Fe3D6b56026AE9b21458c98A5B6397904',
  LPrewardVault: '0x793A17A27E298071b918D40556Ed2efC6dE4E00E',
  TypeCVault: '0x00065b639A3Fcc65db399a8CeF8c33327CcfE158',
  DAOVault: '0xA93f236E939E01Ff33563F9879D9A99b60D7788B',
  pools: {
    TOS_WTON_POOL: '0x1c0ce9aaa0c12f53df3b4d8d77b82d6ad343b4e4',
    ETH_WTON_Address: '0xC29271E3a68A7647Fd1399298Ef18FeCA3879F59',
    TOS_WTON_Address: '0x1c0cE9aAA0c12f53Df3B4d8d77B82D6Ad343b4E4',
    TOS_ETH_Address: '0x2AD99c938471770DA0cD60E08eaf29EbfF67a92A',
    DOC_TOS_Address: '0x369Bca127B8858108536B71528AB3bEfa1DEb6Fc',
    TOS_AURA_Address: '0xBdDD3a50Bd2AFd27aED05Cc9FE1c8D67fCAA3218',
    DOC_ETH_Address: '0xDA3CC73170aA5Bb7C0a9588e7690299df568d53D',
  },
  UniswapV3Factory: '0x1F98431c8aD98523631AE4a59f267346ea31F984',
  ProjectTokenProxy: '0x96D366bBE6B83D895D2AFd0BC0139b9089486055',
  tokens: {
    LYDA_ADDRESS: '0xE1B0630D7649CdF503eABc2b6423227Be9605247',
    AURA_ADDRESS: '0xaEC59E5b4f8DbF513e260500eA96EbA173F74149',
  },
};

const RINKEBY_DEPLOYED = {
  Stake1Proxy_ADDRESS: '0xd53e6EaA528840a3625eb93DF2FA63F37Bd1EB7f',
  TON_ADDRESS: '0x44d4F5d89E9296337b8c48a332B3b2fb2C190CD0',
  TOS_ADDRESS: '0x73a54e5C054aA64C1AE7373C2B5474d8AFEa08bd',
  DOC_ADDRESS: '0xb109f4c20BDb494A63E32aA035257fBA0a4610A4',
  WTON_ADDRESS: '0x709bef48982Bbfd6F2D4Be24660832665F53406C',
  AURA_ADDRESS: '0x14f9C438dD5008b1c269659AA3234cBcB431a844',
  ETH_ADDRESS: '',
  DepositManager_ADDRESS: '0x57F5CD759A5652A697D539F1D9333ba38C615FC2',
  SeigManager_ADDRESS: '0x957DaC3D3C4B82088A4939BE9A8063e20cB2efBE',
  SwapProxy_ADDRESS: '0x8032d21F59CDB42C9c94a3A41524D4CCF0Cae96c',
  TokamakLayer2_ADDRESS: '0x1fa621d238f30f6651ddc8bd5f4be21c6b894426',
  Airdrop_ADDRESS: '0xD958cD2d03aaEe169953780234848445504571E8',
  UniswapStaking_Address: '0x99b09c6CfF45C778a4F5fBF7a4EAD6c3DEBfdcBb',
  UniswapStaker_Address: '0x1f98407aaB862CdDeF78Ed252D6f557aA5b0f00d',
  UniswapStakerV3_address: '0xe34139463bA50bD61336E0c446Bd8C0867c6fE65',
  NPM_Address: '0xC36442b4a4522E871399CD717aBDD847Ab11FE88',
  LockTOS_ADDRESS: '0x5adc7de3a0B4A4797f02C3E99265cd7391437568',
  DOCPool_Address: '0x831a1f01ce17b6123a7d1ea65c26783539747d6d',
  BasePool_Address: '0x516e1af7303a94f81e91e4ac29e20f4319d4ecaf',
  LockTOSProxy_ADDRESS: '0x5adc7de3a0B4A4797f02C3E99265cd7391437568',
  DividendPool_ADDRESS: '',
  DividendPoolProxy_ADDRESS: '',
  StakeTonControl_ADDRESS: '0xF049030A9D6faCbD6C76E08794CC751b1Dbaa072',
  LockTOSDividend_ADDRESS: '0xA1E633C746DA99dceB42D65A59D3e4B5672a6bA1',
  PublicSale_ADDRESS: '0x230f12eb4A37055dC0E11B3f7405c9EE94E71ee9',
  unstakeLayer2All: '0xeeEa9CA7a496651577ff1FD353570F8B70580955',
  PowerTONSwapper_ADDRESS: '',
  DoMsaleContractAddress: '0xEb492922afa05D0D7704AD5c202f2ddCc386DA75',
  ERC20AFACTORY_ADDRESS: '0x58e6815aBEa00Ef6fc823899625F1D8ae98a5348',
  InitialLiquidityVault: '0x98B792CEF9a23b4CB7530E06c8fD821FdB2fBF44',
  LiquidityIncentiveVault: '0xF934A22aCF2E7169793DD1B565E5A5Ea3FDE515D',
  AutoCoinageSnapshot2_ADDRESS: '0xa441fc0670be48284e1d2f3b2a72c017b5dbaade',
  TokenDividendProxyPool_ADDRESS: '0x9aCb022B3A8a334618f5cea15A046C10FEE1352f',
  // proxy pool direct address: '0x9d88de4c13081855d880c36fe5fa6d11effa5528',
  PublicSaleVault: '0xA5441241993c7046Af28a07ffc2577FCC6c0Dc8b',
  TonStakerVault: '0x05e48ecC9540494055c518bBf25e282Fd08589Fd',
  TosStakerVault: '0xdbf25065Ac597a4e914959439FE6cBD60A2563Ca',
  LPrewardVault: '0xF934A22aCF2E7169793DD1B565E5A5Ea3FDE515D',
  TypeCVault: '0x3D1493A0a9035d4d9d8411412Bdab4505D44f91f',
  DAOVault: '0x4f64Edc76ae0D39CBc1c6F778a7fd3496A97DAdf',
  pools: {
    TOS_WTON_POOL: '0x516e1af7303a94f81e91e4ac29e20f4319d4ecaf',
    ETH_WTON_Address: '',
    TOS_WTON_Address: '',
    TOS_ETH_Address: '',
    DOC_TOS_Address: '',
    TOS_AURA_Address: '',
    DOC_ETH_Address: '',
  },
  UniswapV3Factory: '0x1F98431c8aD98523631AE4a59f267346ea31F984',
  ProjectTokenProxy: '0x48683aC8ab065A113323BdB5738a267D7FF7F0d6',
  tokens: {
    LYDA_ADDRESS: '',
    AURA_ADDRESS: '',
  },
};

export const DEPLOYED: DEPLOYED_TYPE =
  REACT_APP_MODE === 'PRODUCTION' ? MAINNET_DEPLOYED : RINKEBY_DEPLOYED;

export const SUPPORTED_WALLETS: {[key: string]: WalletInfo} = {
  INJECTED: {
    connector: injected,
    name: 'Injected',
    iconName: 'metamask.svg',
    description: 'Injected web3 provider.',
    href: null,
    color: '#010101',
    primary: true,
    type: 'INJECTED',
  },
  METAMASK: {
    connector: injected,
    name: 'MetaMask',
    iconName: 'metamask.svg',
    description: 'Easy-to-use browser extension.',
    href: null,
    color: '#E8831D',
    type: 'METAMASK',
  },
  TREZOR: {
    connector: trazorConnector,
    name: 'TREZOR',
    iconName: 'metamask.svg',
    description: 'Easy-to-use browser extension.',
    href: null,
    color: '#E8831D',
    type: 'TREZOR',
  },
};

import {Contract} from '@ethersproject/contracts';
import * as StakeUniswapABI from 'services/abis/StakeUniswapV3.json';
import * as NPMABI from 'services/abis/NonfungiblePositionManager.json';
import {DEPLOYED} from 'constants/index';

const {UniswapStaking_Address, NPM_Address} = DEPLOYED;

export const fetchPositionRangePayload = async (
  library: any,
  id: string,
  account: string,
) => {
  if (library && account && id) {
    const res = await getPositionRange(library, account, id);
    const {tick, tickLower, tickUpper} = res
    const result = (tick > tickLower && tick < tickUpper)
    
    return result;
  }
}

const getPositionRange = async (
  library: any,
  account: string,
  id: string,
) => {
  if (library && id) {
    const StakeUniswap = new Contract(UniswapStaking_Address, StakeUniswapABI.abi, library);
    const NPM = new Contract(NPM_Address, NPMABI.abi, library);
    const positions = await NPM.positions(id)
    const poolSlot0 = await StakeUniswap.poolSlot0()
    return {
      ...positions,
      ...poolSlot0,
    }
  }

}
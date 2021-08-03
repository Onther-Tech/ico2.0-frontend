import {Contract} from '@ethersproject/contracts';
import * as StakeUniswapABI from 'services/abis/StakeUniswapV3.json';
import {DEPLOYED} from 'constants/index';

const {UniswapStaking_Address} = DEPLOYED;

export const fetchPositionPayload = async (
  library: any,
  account: string,
) => {
  const res = await getPositionInfo(library, account);
  return res;
}

const getPositionInfo = async (
  library: any,
  account: string,
) => {
  if (library) {
    const StakeUniswap = new Contract(UniswapStaking_Address, StakeUniswapABI.abi, library);
    const positionIds = await StakeUniswap.getUserStakedTokenIds(account);
    const startTime = await StakeUniswap.saleStartTime()
    let result: any = [];
    for (let positionid of positionIds) {
      const miningId = await StakeUniswap.getMiningTokenId(positionid);
      const valueById = {
        positionid,
        ...miningId,
      }
      result.push(valueById)
    }
    return {
      positionData: result,
      saleStartTime: startTime,
    }
  }
}
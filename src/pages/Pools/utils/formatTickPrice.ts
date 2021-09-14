import {Bound} from '../components/LiquidityChartRangeInput/Bound';
import {Price, Token} from '@uniswap/sdk-core';
import {formatPrice} from './formatPrice';

export function formatTickPrice(
  price: Price<Token, Token> | undefined,
  atLimit: {[bound in Bound]?: boolean | undefined},
  direction: Bound,
  placeholder?: string,
) {
  if (atLimit[direction]) {
    return direction === Bound.LOWER ? '0' : '∞';
  }

  if (!price && placeholder !== undefined) {
    return placeholder;
  }

  return formatPrice(price, 5);
}

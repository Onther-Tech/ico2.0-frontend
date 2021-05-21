import * as React from 'react';

export const IconClose = (props: React.SVGProps<SVGSVGElement>) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={14}
      height={14}
      viewBox="0 0 14 14"
      {...props}>
      <path fill="none" d="M0 0h14v14H0z" />
      <path
        data-name="arrow_close_icon"
        d="M12 9.999H2a1 1 0 01-.848-1.53l5-4.306a1 1 0 011.7 0l5 4.306A1 1 0 0112 9.999z"
        fill="#2a72e5"
      />
    </svg>
  );
};

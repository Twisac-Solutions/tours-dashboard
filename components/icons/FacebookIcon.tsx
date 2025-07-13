import React from "react";

function FacebookIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      width={24}
      height={24}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <g clipPath="url(#clip0_2072_3168)">
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M12 0c2.235.026 4.254.575 6.057 1.648a12.094 12.094 0 014.305 4.33c1.067 1.815 1.613 3.846 1.638 6.095-.063 3.077-1.034 5.704-2.911 7.883-1.878 2.18-4.282 3.527-6.771 4.044v-8.626h2.353l.532-3.39H13.64v-2.22a1.93 1.93 0 01.41-1.275c.285-.363.787-.554 1.505-.573h2.152V4.947c-.03-.01-.324-.05-.879-.118a17.468 17.468 0 00-1.896-.118c-1.434.007-2.569.411-3.403 1.214-.835.803-1.261 1.964-1.28 3.483v2.576H7.539v3.39h2.712V24c-3.057-.517-5.461-1.865-7.339-4.044C1.034 17.778.063 15.15 0 12.073c.025-2.249.571-4.28 1.638-6.094a12.094 12.094 0 014.305-4.331C7.746.575 9.765.026 12 0z"
          fill="#3771C8"
        />
      </g>
      <defs>
        <clipPath id="clip0_2072_3168">
          <path fill="#fff" d="M0 0H24V24H0z" />
        </clipPath>
      </defs>
    </svg>
  );
}

export default FacebookIcon;

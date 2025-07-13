import React from "react";

function CalendarHeart(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      width={24}
      height={24}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M7.5 3.563a.563.563 0 10-1.125 0v.562H5.25A2.25 2.25 0 003 6.375V7.5h18V6.375a2.25 2.25 0 00-2.25-2.25h-1.125v-.563a.563.563 0 00-1.125 0v.563h-9v-.563zM21 18.75V8.625H3V18.75A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75zm-9-6.758c1.872-1.925 6.553 1.443 0 5.774-6.553-4.332-1.872-7.699 0-5.774z"
        fill="currentColor"
      />
    </svg>
  );
}

export default CalendarHeart;

import {ICustomIconProps} from '@core/interfaces/icon';

export default function IconNoteOutline({
  color = '#50575E',
  size = 24,
}: Readonly<ICustomIconProps>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none">
      <path
        d="M9 9H15"
        stroke={color}
        strokeWidth="1.56522"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M9 12H15"
        stroke={color}
        strokeWidth="1.56522"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M9 15H12"
        stroke={color}
        strokeWidth="1.56522"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M14.6897 20.25H4.5C4.30109 20.25 4.11032 20.171 3.96967 20.0303C3.82902 19.8897 3.75 19.6989 3.75 19.5V4.5C3.75 4.30109 3.82902 4.11032 3.96967 3.96967C4.11032 3.82902 4.30109 3.75 4.5 3.75H19.5C19.6989 3.75 19.8897 3.82902 20.0303 3.96967C20.171 4.11032 20.25 4.30109 20.25 4.5V14.6897C20.2499 14.8883 20.171 15.0788 20.0306 15.2194L15.2194 20.0306C15.0788 20.171 14.8883 20.2499 14.6897 20.25Z"
        stroke={color}
        strokeWidth="1.56522"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M20.1825 15H15V20.1825"
        stroke={color}
        strokeWidth="1.56522"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

import {ICustomIconProps} from '@core/interfaces/icon.interface';

export default function IconClose({
  color = '#F4F5F7',
  size = 24,
}: Readonly<ICustomIconProps>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill={color}>
      <path
        d="M18.75 5.25L5.25 18.75"
        stroke="#3D4248"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M18.75 18.75L5.25 5.25"
        stroke="#3D4248"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

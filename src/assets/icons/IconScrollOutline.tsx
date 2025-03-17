import {ICustomIconProps} from '@core/interfaces/icon.interface';

export default function IconScrollOutline({
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
        d="M18.75 16.5V6C18.75 5.40326 18.5129 4.83097 18.091 4.40901C17.669 3.98705 17.0967 3.75 16.5 3.75H3.75"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M9.75 9.75H15.75"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M9.75 12.75H15.75"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M2.25 7.5C2.25 7.5 1.5 6.9375 1.5 6C1.5 5.40326 1.73705 4.83097 2.15901 4.40901C2.58097 3.98705 3.15326 3.75 3.75 3.75C4.34674 3.75 4.91903 3.98705 5.34099 4.40901C5.76295 4.83097 6 5.40326 6 6V18C6 18.5967 6.23705 19.169 6.65901 19.591C7.08097 20.0129 7.65326 20.25 8.25 20.25M8.25 20.25C8.84674 20.25 9.41903 20.0129 9.84099 19.591C10.2629 19.169 10.5 18.5967 10.5 18C10.5 17.0625 9.75 16.5 9.75 16.5H20.25C20.25 16.5 21 17.0625 21 18C21 18.5967 20.7629 19.169 20.341 19.591C19.919 20.0129 19.3467 20.25 18.75 20.25H8.25Z"
        stroke="#50575E"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

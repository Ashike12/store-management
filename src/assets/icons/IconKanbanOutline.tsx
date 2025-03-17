import {ICustomIconProps} from '@core/interfaces/icon';

export default function IconKanbanOutline({
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
        d="M3.75 5.25H20.25V16.5C20.25 16.6989 20.171 16.8897 20.0303 17.0303C19.8897 17.171 19.6989 17.25 19.5 17.25H15.75C15.5511 17.25 15.3603 17.171 15.2197 17.0303C15.079 16.8897 15 16.6989 15 16.5V14.25H9V19.5C9 19.6989 8.92098 19.8897 8.78033 20.0303C8.63968 20.171 8.44891 20.25 8.25 20.25H4.5C4.30109 20.25 4.11032 20.171 3.96967 20.0303C3.82902 19.8897 3.75 19.6989 3.75 19.5V5.25Z"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M9 11.25H3.75"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M9 5.25V14.25"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M15 11.25H20.25"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M15 5.25V14.25"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

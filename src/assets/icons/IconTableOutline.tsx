import {ICustomIconProps} from '@core/interfaces/icon.interface';

export default function IconTableOutline({
  color = '#2E65CE',
  size = 20,
}: Readonly<ICustomIconProps>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 20 20"
      fill="none">
      <path
        d="M17.5 3.75H2.5C2.33424 3.75 2.17527 3.81585 2.05806 3.93306C1.94085 4.05027 1.875 4.20924 1.875 4.375V15C1.875 15.3315 2.0067 15.6495 2.24112 15.8839C2.47554 16.1183 2.79348 16.25 3.125 16.25H16.875C17.2065 16.25 17.5245 16.1183 17.7589 15.8839C17.9933 15.6495 18.125 15.3315 18.125 15V4.375C18.125 4.20924 18.0592 4.05027 17.9419 3.93306C17.8247 3.81585 17.6658 3.75 17.5 3.75ZM3.125 8.75H6.25V11.25H3.125V8.75ZM7.5 8.75H16.875V11.25H7.5V8.75ZM16.875 5V7.5H3.125V5H16.875ZM3.125 12.5H6.25V15H3.125V12.5ZM16.875 15H7.5V12.5H16.875V15Z"
        fill={color}
      />
    </svg>
  );
}

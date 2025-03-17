import TextWrapper from '../text/TextWrapper';

interface IFormErrorTextProps {
  errorMessage: string;
}
export default function FormErrorText({errorMessage}: IFormErrorTextProps) {
  return (
    <div className="relative">
      <TextWrapper
        className="text-error-dark text-[12px]"
        content={`${errorMessage}`}
      />
    </div>
  );
}

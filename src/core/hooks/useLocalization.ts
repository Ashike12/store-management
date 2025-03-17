import {useTranslation} from 'react-i18next';

interface IUseLocalizationProps {
  content: string | number;
}

export default function useLocalization({content}: IUseLocalizationProps) {
  const {t} = useTranslation();

  if (typeof content === 'number') return content;
  return t(content);
}

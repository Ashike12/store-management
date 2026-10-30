import {ListItemText, MenuItem, Select, Stack, Typography} from '@mui/material';
import {IconLanguage} from '@tabler/icons-react';
import {useEffect} from 'react';
import {useTranslation} from 'react-i18next';
import {useAppDispatch, useAppSelector} from '@core/store/hooks';
import {selectAppLanguage, updateLanguage} from '@core/store/slices/language.slice';

const languages = [
  {code: 'en', shortLabel: 'EN', label: 'English', nativeLabel: 'English'},
  {code: 'bn', shortLabel: 'BN', label: 'Bengali', nativeLabel: 'বাংলা'},
  {code: 'zh', shortLabel: '中文', label: 'Chinese', nativeLabel: '中文'},
] as const;

type LanguageCode = (typeof languages)[number]['code'];

const isLanguageCode = (value: string): value is LanguageCode =>
  languages.some(language => language.code === value);

export default function LanguageSwitcher() {
  const dispatch = useAppDispatch();
  const {i18n} = useTranslation();
  const storedLanguage = useAppSelector(selectAppLanguage).selection;
  const language = isLanguageCode(storedLanguage) ? storedLanguage : 'en';

  useEffect(() => {
    if (i18n.resolvedLanguage !== language) {
      void i18n.changeLanguage(language);
    }
    document.documentElement.lang = language;
  }, [i18n, language]);

  const handleLanguageChange = (nextLanguage: string) => {
    if (!isLanguageCode(nextLanguage)) return;
    dispatch(updateLanguage(nextLanguage));
    void i18n.changeLanguage(nextLanguage);
    document.documentElement.lang = nextLanguage;
  };

  return (
    <Select
      inputProps={{'aria-label': 'Portal language'}}
      size="small"
      value={language}
      onChange={event => handleLanguageChange(event.target.value)}
      renderValue={selected => {
        const selectedLanguage = languages.find(item => item.code === selected) ?? languages[0];
        return (
          <Stack direction="row" alignItems="center" gap="8px">
            <IconLanguage size={18} aria-hidden="true" />
            <Typography component="span" variant="body2" fontWeight={700}>
              <span className="hidden sm:inline">{selectedLanguage.label}</span>
              <span className="sm:hidden">{selectedLanguage.shortLabel}</span>
            </Typography>
          </Stack>
        );
      }}
      sx={theme => ({
        minWidth: {xs: 82, sm: 132},
        bgcolor: theme.vars.palette.background.neutral,
        color: theme.vars.palette.text.primary,
        '& .MuiSelect-select': {py: '8px'},
      })}>
      {languages.map(option => (
        <MenuItem key={option.code} value={option.code}>
          <ListItemText
            primary={option.nativeLabel}
            secondary={option.nativeLabel === option.label ? undefined : option.label}
          />
        </MenuItem>
      ))}
    </Select>
  );
}

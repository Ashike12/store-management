import type {Theme, Components} from '@mui/material/styles';
import type {} from '@mui/material/themeCssVarsAugmentation';
import SvgIcon from '@mui/material/SvgIcon';
import {varAlpha} from '../styles';
import {outlinedInputClasses} from '@mui/material';
import {themeColors} from '@core/config/themeColor';

const MuiBackdrop: Components<Theme>['MuiBackdrop'] = {
  styleOverrides: {
    root: ({theme}) => ({
      backgroundColor: varAlpha(theme.vars.palette.grey['900Channel'], 0.8),
    }),
    invisible: {
      background: 'transparent',
    },
  },
};

const MuiButton: Components<Theme>['MuiButton'] = {
  defaultProps: {
    disableElevation: true,
  },
  styleOverrides: {
    containedInherit: ({theme}) => ({
      color: theme.vars.palette.common.white,
      backgroundColor: theme.vars.palette.grey[800],
      '&:hover': {
        color: theme.vars.palette.common.white,
        backgroundColor: theme.vars.palette.grey[800],
      },
    }),
    sizeLarge: {
      minHeight: 48,
    },
  },
};

const MuiCard: Components<Theme>['MuiCard'] = {
  styleOverrides: {
    root: ({theme}) => ({
      zIndex: 0,
      position: 'relative',
      boxShadow: theme.customShadows.card,
      borderRadius: theme.shape.borderRadius * 2,
    }),
  },
};

const MuiCardHeader: Components<Theme>['MuiCardHeader'] = {
  defaultProps: {
    titleTypographyProps: {variant: 'h6'},
    subheaderTypographyProps: {variant: 'body2'},
  },
};

const MuiOutlinedInput: Components<Theme>['MuiOutlinedInput'] = {
  styleOverrides: {
    notchedOutline: ({theme}) => ({
      borderColor: varAlpha(theme.vars.palette.grey['200Channel'], 1),
    }),
    root: ({theme}) => ({
      color: themeColors.colorTextPrimary,
      [`&:hover .${outlinedInputClasses.notchedOutline}`]: {
        borderColor: varAlpha(theme.vars.palette.grey['200Channel'], 1),
      },
      [`&.Mui-focused .${outlinedInputClasses.notchedOutline}`]: {
        borderColor: varAlpha(theme.vars.palette.grey['200Channel'], 1),
      },
      [`& input:-webkit-autofill`]: {
        WebkitBoxShadow: '0 0 0px 1000px transparent inset',
        WebkitTextFillColor: 'var(--color-text-primary) !important',
        transition: 'background-color 5000s ease-in-out 0s',
      },
    }),
  },
};

const MuiInputLabel: Components<Theme>['MuiInputLabel'] = {
  styleOverrides: {
    root: ({theme}) => ({
      color: varAlpha(theme.vars.palette.grey['700Channel'], 1),
      [`&.Mui-focused`]: {
        color: varAlpha(theme.vars.palette.grey['700Channel'], 1),
      },
    }),
  },
};

const MuiPaper: Components<Theme>['MuiPaper'] = {
  defaultProps: {
    elevation: 0,
  },
  styleOverrides: {
    root: {backgroundImage: 'none'},
    outlined: ({theme}) => ({
      borderColor: varAlpha(theme.vars.palette.grey['500Channel'], 0.16),
    }),
  },
};

const MuiTableCell: Components<Theme>['MuiTableCell'] = {
  styleOverrides: {
    head: ({theme}) => ({
      fontSize: theme.typography.pxToRem(14),
      color: theme.vars.palette.text.secondary,
      fontWeight: theme.typography.fontWeightSemiBold,
      backgroundColor: theme.vars.palette.background.neutral,
    }),
  },
};

const MuiMenuItem: Components<Theme>['MuiMenuItem'] = {
  styleOverrides: {
    root: ({theme}) => ({
      ...theme.typography.body2,
      ['&.Mui-selected']: {
        backgroundColor: 'var(--color-transparent-grey-24)',
        '&:hover': {
          backgroundColor: 'var(--color-transparent-grey-24)',
        },
      },
      ['&.Mui-hovered']: {
        backgroundColor: 'var(--color-transparent-grey-8)',
      },
    }),
  },
};

const MuiLink: Components<Theme>['MuiLink'] = {
  defaultProps: {underline: 'hover'},
};

const MuiFormControlLabel: Components<Theme>['MuiFormControlLabel'] = {
  styleOverrides: {
    label: ({theme}) => ({
      ...theme.typography.body2,
    }),
  },
};

const MuiCheckbox: Components<Theme>['MuiCheckbox'] = {
  defaultProps: {
    size: 'small',
    icon: (
      <SvgIcon>
        <path
          d="M19.5 3.75H4.5C4.08579 3.75 3.75 4.08579 3.75 4.5V19.5C3.75 19.9142 4.08579 20.25 4.5 20.25H19.5C19.9142 20.25 20.25 19.9142 20.25 19.5V4.5C20.25 4.08579 19.9142 3.75 19.5 3.75Z"
          stroke="#84909C"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
      </SvgIcon>
    ),
    checkedIcon: (
      <SvgIcon>
        <path d="M19.5 3H4.5C4.10218 3 3.72064 3.15804 3.43934 3.43934C3.15804 3.72064 3 4.10218 3 4.5V19.5C3 19.8978 3.15804 20.2794 3.43934 20.5607C3.72064 20.842 4.10218 21 4.5 21H19.5C19.8978 21 20.2794 20.842 20.5607 20.5607C20.842 20.2794 21 19.8978 21 19.5V4.5C21 4.10218 20.842 3.72064 20.5607 3.43934C20.2794 3.15804 19.8978 3 19.5 3ZM16.2806 10.2806L11.0306 15.5306C10.961 15.6004 10.8783 15.6557 10.7872 15.6934C10.6962 15.7312 10.5986 15.7506 10.5 15.7506C10.4014 15.7506 10.3038 15.7312 10.2128 15.6934C10.1217 15.6557 10.039 15.6004 9.96937 15.5306L7.71937 13.2806C7.57864 13.1399 7.49958 12.949 7.49958 12.75C7.49958 12.551 7.57864 12.3601 7.71937 12.2194C7.86011 12.0786 8.05098 11.9996 8.25 11.9996C8.44902 11.9996 8.63989 12.0786 8.78063 12.2194L10.5 13.9397L15.2194 9.21937C15.2891 9.14969 15.3718 9.09442 15.4628 9.0567C15.5539 9.01899 15.6515 8.99958 15.75 8.99958C15.8485 8.99958 15.9461 9.01899 16.0372 9.0567C16.1282 9.09442 16.2109 9.14969 16.2806 9.21937C16.3503 9.28906 16.4056 9.37178 16.4433 9.46283C16.481 9.55387 16.5004 9.65145 16.5004 9.75C16.5004 9.84855 16.481 9.94613 16.4433 10.0372C16.4056 10.1282 16.3503 10.2109 16.2806 10.2806Z" />
      </SvgIcon>
    ),
    // indeterminateIcon: (
    //   <SvgIcon>
    //     <path d="M17,2 C19.7614,2 22,4.23858 22,7 L22,7 L22,17 C22,19.7614 19.7614,22 17,22 L17,22 L7,22 C4.23858,22 2,19.7614 2,17 L2,17 L2,7 C2,4.23858 4.23858,2 7,2 L7,2 Z M15,11 L9,11 C8.44772,11 8,11.4477 8,12 C8,12.5523 8.44772,13 9,13 L15,13 C15.5523,13 16,12.5523 16,12 C16,11.4477 15.5523,11 15,11 Z" />
    //   </SvgIcon>
    // ),
  },
};

const MuiRadio: Components<Theme>['MuiRadio'] = {
  defaultProps: {
    size: 'small',
    icon: (
      <SvgIcon>
        <path
          d="M12 2C13.9778 2 15.9112 2.58649 17.5557 3.6853C19.2002 4.78412 20.4819 6.3459 21.2388 8.17317C21.9957 10.0004 22.1937 12.0111 21.8079 13.9509C21.422 15.8907 20.4696 17.6725 19.0711 19.0711C17.6725 20.4696 15.8907 21.422 13.9509 21.8079C12.0111 22.1937 10.0004 21.9957 8.17317 21.2388C6.3459 20.4819 4.78412 19.2002 3.6853 17.5557C2.58649 15.9112 2 13.9778 2 12C2 6.477 6.477 2 12 2ZM12 3.5C9.74566 3.5 7.58365 4.39553 5.98959 5.98959C4.39553 7.58365 3.5 9.74566 3.5 12C3.5 14.2543 4.39553 16.4163 5.98959 18.0104C7.58365 19.6045 9.74566 20.5 12 20.5C14.2543 20.5 16.4163 19.6045 18.0104 18.0104C19.6045 16.4163 20.5 14.2543 20.5 12C20.5 9.74566 19.6045 7.58365 18.0104 5.98959C16.4163 4.39553 14.2543 3.5 12 3.5Z"
          fill="currentColor"
        />
      </SvgIcon>
    ),
    checkedIcon: (
      <SvgIcon>
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M12 2C6.477 2 2 6.477 2 12C2 17.523 6.477 22 12 22C17.523 22 22 17.523 22 12C22 6.477 17.523 2 12 2ZM12 8C10.9391 8 9.92172 8.42143 9.17157 9.17157C8.42143 9.92172 8 10.9391 8 12C8 13.0609 8.42143 14.0783 9.17157 14.8284C9.92172 15.5786 10.9391 16 12 16C13.0609 16 14.0783 15.5786 14.8284 14.8284C15.5786 14.0783 16 13.0609 16 12C16 10.9391 15.5786 9.92172 14.8284 9.17157C14.0783 8.42143 13.0609 8 12 8Z"
          fill="currentColor"
        />
      </SvgIcon>
    ),
  },
};
// ----------------------------------------------------------------------

export const components = {
  MuiCard,
  MuiLink,
  MuiPaper,
  MuiRadio,
  MuiButton,
  MuiBackdrop,
  MuiMenuItem,
  MuiCheckbox,
  MuiTableCell,
  MuiCardHeader,
  MuiOutlinedInput,
  MuiInputLabel,
  MuiFormControlLabel,
};

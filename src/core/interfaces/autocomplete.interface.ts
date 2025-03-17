import {
  AutocompleteClasses,
  IconButtonProps,
  PaperProps,
  PopperProps,
  useAutocomplete,
  SxProps,
  AutocompleteRenderGroupParams,
  Theme,
} from '@mui/material';

export interface IAutocompletePropsFromMui {
  /**
   * Override or extend the styles applied to the component.
   */
  classes?: Partial<AutocompleteClasses>;

  clearIcon?: React.ReactNode;
  /**
   * Override the default text for the *clear* icon button.
   *
   * For localization purposes, you can use the provided [translations](https://mui.com/material-ui/guides/localization/).
   * @default 'Clear'
   */
  clearText?: string;
  /**
   * Override the default text for the *close popup* icon button.
   *
   * For localization purposes, you can use the provided [translations](https://mui.com/material-ui/guides/localization/).
   * @default 'Close'
   */
  closeText?: string;
  /**
   * The props used for each slot inside.
   * @deprecated Use the `slotProps` prop instead. This prop will be removed in v7. See [Migrating from deprecated APIs](https://mui.com/material-ui/migration/migrating-from-deprecated-apis/) for more details.
   */
  componentsProps?: {
    clearIndicator?: Partial<IconButtonProps>;
    paper?: PaperProps;
    popper?: Partial<PopperProps>;
    popupIndicator?: Partial<IconButtonProps>;
  };
  /**
   * If `true`, the component is disabled.
   * @default false
   */
  disabled?: boolean;
  /**
   * If `true`, the `Popper` content will be under the DOM hierarchy of the parent component.
   * @default false
   */
  disablePortal?: boolean;
  /**
   * Force the visibility display of the popup icon.
   * @default 'auto'
   */
  forcePopupIcon?: true | false | 'auto';
  /**
   * If `true`, the input will take up the full width of its container.
   * @default false
   */
  fullWidth?: boolean;
  /**
   * The label to display when the tags are truncated (`limitTags`).
   *
   * @param {number} more The number of truncated tags.
   * @returns {ReactNode}
   * @default (more) => `+${more}`
   */
  getLimitTagsText?: (more: number) => React.ReactNode;
  /**
   * The component used to render the listbox.
   * @default 'ul'
   * @deprecated Use `slotProps.listbox.component` instead. This prop will be removed in v7. See [Migrating from deprecated APIs](/material-ui/migration/migrating-from-deprecated-apis/) for more details.
   */
  ListboxComponent?: React.JSXElementConstructor<
    React.HTMLAttributes<HTMLElement>
  >;

  ListboxProps?: ReturnType<
    ReturnType<typeof useAutocomplete>['getListboxProps']
  > & {
    sx?: SxProps<Theme>;
    ref?: React.Ref<Element>;
  };

  loading?: boolean;
  /**
   * Text to display when in a loading state.
   *
   * For localization purposes, you can use the provided [translations](https://mui.com/material-ui/guides/localization/).
   * @default 'Loading…'
   */
  loadingText?: React.ReactNode;

  limitTags?: number;

  noOptionsText?: React.ReactNode;
  onKeyDown?: (
    event: React.KeyboardEvent<HTMLDivElement> & {
      defaultMuiPrevented?: boolean;
    },
  ) => void;

  openText?: string;

  PaperComponent?: React.JSXElementConstructor<
    React.HTMLAttributes<HTMLElement>
  >;

  PopperComponent?: React.JSXElementConstructor<PopperProps>;

  popupIcon?: React.ReactNode;

  readOnly?: boolean;

  renderGroup?: (params: AutocompleteRenderGroupParams) => React.ReactNode;

  sx?: SxProps<Theme>;
}

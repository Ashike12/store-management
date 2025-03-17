export interface ITabItem {
  id: string;
  label: string | React.ReactNode;
  content: React.ReactNode;
  icon?: React.ReactNode;
  disabled?: boolean;
}

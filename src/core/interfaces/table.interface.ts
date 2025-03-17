export type Order = 'asc' | 'desc';

export interface ITableHeadCell<T> {
  disablePadding: boolean;
  id: keyof T;
  label: string;
  numeric: boolean;
  alignCell: 'left' | 'right';
  renderCell?: (value: T[keyof T], row: T) => React.ReactNode;
}

export interface ICustomTableHeadProps<T> {
  numSelected: number;
  onRequestSort: (event: React.MouseEvent<unknown>, property: keyof T) => void;
  onSelectAllClick: (event: React.ChangeEvent<HTMLInputElement>) => void;
  order: Order;
  orderBy: string;
  rowCount: number;
  tableHeadCells: ITableHeadCell<T>[];
}

export interface ICustomTableProps<T> {
  rows: T[];
  columns: ITableHeadCell<T>[];
  idField: keyof T;
  initialSort?: {
    field: keyof T;
    order: Order;
  };
  rowsPerPage?: number;
  enableSelection?: boolean;
  onSelectionChange?: (selectedIds: Array<T[keyof T]>) => void;
  onSortChange?: (field: keyof T, order: Order) => void;
  onPageChange?: (page: number) => void;
  customRowRenderer?: (
    row: T,
    isSelected: boolean,
    labelId: string,
  ) => React.ReactNode;
  className?: string;
}

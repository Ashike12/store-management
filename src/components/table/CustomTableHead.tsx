import {
  Box,
  Checkbox,
  TableHead,
  TableRow,
  TableSortLabel,
} from '@mui/material';
import React from 'react';
import {visuallyHidden} from '@mui/utils';
import {StyledTableHeaderCell} from './table-styles';
import {ICustomTableHeadProps} from '@core/interfaces/table.interface';
import TextWrapper from '@components/text/TextWrapper';

export default function CustomTableHead<T>(
  props: Readonly<ICustomTableHeadProps<T>>,
) {
  const {
    onSelectAllClick,
    order,
    orderBy,
    numSelected,
    rowCount,
    onRequestSort,
    tableHeadCells,
  } = props;
  const createSortHandler =
    (property: keyof T) => (event: React.MouseEvent<unknown>) => {
      onRequestSort(event, property);
    };
  return (
    <TableHead className="border-transparent-grey-12 border">
      <TableRow>
        <StyledTableHeaderCell padding="checkbox">
          <Checkbox
            color="primary"
            size="small"
            disableRipple
            disableTouchRipple
            disableFocusRipple
            indeterminate={numSelected > 0 && numSelected < rowCount}
            checked={rowCount > 0 && numSelected === rowCount}
            onChange={onSelectAllClick}
            inputProps={{
              'aria-label': 'select all desserts',
            }}
          />
        </StyledTableHeaderCell>
        {tableHeadCells.map(headCell => (
          <StyledTableHeaderCell
            key={headCell.id as string}
            align={headCell.alignCell}
            padding={headCell.disablePadding ? 'none' : 'normal'}
            sortDirection={orderBy === headCell.id ? order : false}>
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : 'asc'}
              onClick={createSortHandler(headCell.id)}>
              <TextWrapper
                content={headCell.label}
                variant={'Overline'}
                className="text-text-secondary"
              />
              {orderBy === headCell.id ? (
                <Box component="span" sx={visuallyHidden}>
                  {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                </Box>
              ) : null}
            </TableSortLabel>
          </StyledTableHeaderCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

import {styled, TableCell, tableCellClasses, TableRow} from '@mui/material';

export const StyledTableCell = styled(TableCell)(() => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: '#919EAB14',
    color: '#212B36',
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 13,
    fontWeight: 400,
  },
}));

export const StyledTableHeaderCell = styled(TableCell)(() => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: '#919EAB14',
    color: '#637381',
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 12,
    fontWeight: 700,
  },
}));

export const StyledTableRow = styled(TableRow)(() => ({
  backgroundColor: '#FFFFFF',
  color: '#212B36',
  '&:last-child td, &:last-child th': {
    border: 0,
  },
}));

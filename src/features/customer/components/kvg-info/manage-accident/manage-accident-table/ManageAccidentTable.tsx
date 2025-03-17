import TextWrapper from '@components/text/TextWrapper';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import './styles.css';
import CustomSelect from '@components/select/CustomSelect';

export default function ManageAccidentTable() {
  return (
    <TableContainer className="border-grey-grey-200 table-override rounded-md border">
      <Table>
        <TableHead>
          <TableRow className="table-header-override border-grey-grey-200 border-b">
            <TableCell className="w-1/2 p-2">
              <TextWrapper
                content={'Name'}
                variant={'Subtitle2'}
                className="text-text-primary"
              />
            </TableCell>
            <TableCell className="w-[30%]">
              <TextWrapper
                content={'Unfalleischluss'}
                variant={'Subtitle2'}
                className="text-text-primary"
              />
            </TableCell>
            <TableCell align="right" className="w-[20%]">
              <TextWrapper
                content={'Total Prämie'}
                variant={'Subtitle2'}
                className="text-text-primary"
              />
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          <TableRow className="border-grey-grey-200 border-b">
            <TableCell>
              <TextWrapper content={'Lukas Habegger'} variant={'Body1'} />
            </TableCell>
            <TableCell>
              <CustomSelect
                id="unfall"
                defaultValue="0"
                options={[
                  {title: 'Eingeschlossen', value: '0'},
                  {title: 'Ausgeschlossen', value: '1'},
                ]}
                className="bg-grey-grey-50 h-11"
              />
            </TableCell>
            <TableCell align="right">
              <TextWrapper content={'CHF 100.00'} variant={'Body1'} />
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>
              <TextWrapper content={''} />
            </TableCell>
            <TableCell align="right">
              <TextWrapper
                content={'Total Prämie'}
                variant={'Subtitle2Bold'}
                className="text-text-primary"
              />
            </TableCell>
            <TableCell align="right">
              <TextWrapper
                content={'CHF 100.00'}
                variant={'Subtitle2Bold'}
                className="text-text-primary"
              />
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </TableContainer>
  );
}

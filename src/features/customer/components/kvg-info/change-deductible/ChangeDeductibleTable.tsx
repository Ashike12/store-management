import TextWrapper from '@components/text/TextWrapper';
import './ChangeDeductibleTable.css';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import CustomSelect from '@components/select/CustomSelect';
import {AntSwitch} from '@components/switch/antSwitch';
import CustomCheckbox from '@components/checkbox/CustomCheckbox';

const MOCK_PARTNER_DATA = {
  partnerName: 'Lukas Habegger',
  relatedPersons: [
    {name: 'Marianne Schuster Habegger'},
    {name: 'Sofia Habegger'},
    {name: 'Kevin Habegger'},
  ],
};

export default function ChangeDeductibleTable() {
  return (
    <TableContainer className="border-transparent-grey-12 table-override rounded-md border">
      <Table>
        <TableHead>
          <TableRow className="table-header-override border-transparent-grey-12 border-b">
            <TableCell className="w-1/2 p-2">
              <TextWrapper
                content={'NAME'}
                variant={'Subtitle2'}
                className="text-text-primary"
              />
            </TableCell>
            <TableCell className="w-[30%]">
              <TextWrapper
                content={'FRANCHISE'}
                variant={'Subtitle2'}
                className="text-text-primary"
              />
            </TableCell>
            <TableCell align="right" className="w-[20%]">
              <TextWrapper
                content={'TOTAL_PREMIUM'}
                variant={'Subtitle2'}
                className="text-text-primary"
              />
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          <TableRow className="border-transparent-grey-12 border-b">
            <TableCell>
              <div className="flex w-full flex-row items-center">
                <CustomCheckbox />
                <TextWrapper
                  content={MOCK_PARTNER_DATA.partnerName}
                  variant={'Body1'}
                  className="text-text-secondary"
                />
              </div>
            </TableCell>
            <TableCell>
              <CustomSelect
                defaultValue="0"
                options={[
                  {title: 'CHF 100.00', value: '0'},
                  {title: 'CHF 200.00', value: '1'},
                  {title: 'CHF 300.00', value: '2'},
                  {title: 'CHF 400.00', value: '3'},
                  {title: 'CHF 500.00', value: '4'},
                ]}
                className="bg-grey-grey-50 h-11 w-full"
              />
            </TableCell>
            <TableCell align="right">
              <TextWrapper
                content={'CHF 100.00'}
                variant={'Body1'}
                className="text-text-secondary"
              />
            </TableCell>
          </TableRow>
          <TableRow className="border-transparent-grey-12 border-b">
            <TableCell className="bg-transparent-grey-4">
              <div className="flex w-full flex-row items-center gap-2">
                <AntSwitch />
                <TextWrapper
                  content={'FUR_ALLE_UBERNEHMEN'}
                  variant={'Body2'}
                  className="text-light-primary"
                />
              </div>
            </TableCell>
            <TableCell className="bg-transparent-grey-4"></TableCell>
            <TableCell className="bg-transparent-grey-4"></TableCell>
          </TableRow>

          {MOCK_PARTNER_DATA.relatedPersons.map((person, index) => (
            <TableRow
              className="border-transparent-grey-12 border-b"
              key={index}>
              <TableCell>
                <div className="flex w-full flex-row items-center">
                  <CustomCheckbox />
                  <TextWrapper
                    content={person.name}
                    variant={'Body1'}
                    className="text-text-secondary"
                  />
                </div>
              </TableCell>
              <TableCell>
                <CustomSelect
                  defaultValue="0"
                  options={[
                    {title: 'CHF 100.00', value: '0'},
                    {title: 'CHF 200.00', value: '1'},
                    {title: 'CHF 300.00', value: '2'},
                    {title: 'CHF 400.00', value: '3'},
                    {title: 'CHF 500.00', value: '4'},
                  ]}
                  className="bg-grey-grey-50 h-11 w-full"
                />
              </TableCell>
              <TableCell align="right">
                <TextWrapper
                  content={'CHF 100.00'}
                  variant={'Body1'}
                  className="text-text-secondary"
                />
              </TableCell>
            </TableRow>
          ))}
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

import CustomTable from '@components/table/CustomTable';
import TableChip from '@components/table/TableChip';
import {ITableHeadCell} from '@core/interfaces/table.interface';
import cn from '@core/utils/cn';
import {IconDotsVertical} from '@tabler/icons-react';

interface ITaskTableData {
  id: string;
  inbox: string;
  taskType: string;
  priority: string;
  dueDate: string;
  assignedTo: string;
}

function createData(
  id: string,
  inbox: string,
  taskType: string,
  priority: string,
  dueDate: string,
  assignedTo: string,
): ITaskTableData {
  return {
    id,
    inbox,
    taskType,
    priority,
    dueDate,
    assignedTo,
  };
}

const rows: ITaskTableData[] = [
  createData(
    '1',
    'SCD Service Center DE',
    'Infos aktualisieren',
    'Medium',
    '24.09.2024',
    'N/A',
  ),
  createData(
    '2',
    'SCD Service Center AT',
    'Dokumentprüfung',
    'High',
    '15.08.2024',
    'Maria Schmidt',
  ),
  createData(
    '3',
    'SCD Service Center CH',
    'Datenvalidierung',
    'Low',
    '30.07.2024',
    'Thomas Weber',
  ),
  createData(
    '4',
    'SCD Service Center DE',
    'Kundenanfrage bearbeiten',
    'High',
    '05.08.2024',
    'N/A',
  ),
  createData(
    '5',
    'SCD Service Center AT',
    'Systempflege',
    'Medium',
    '12.08.2024',
    'Laura Müller',
  ),
  createData(
    '6',
    'SCD Service Center CH',
    'Qualitätskontrolle',
    'High',
    '18.08.2024',
    'Michael Berg',
  ),
  createData(
    '7',
    'SCD Service Center DE',
    'Berichtserstellung',
    'Medium',
    '22.08.2024',
    'Stefan Klein',
  ),
  createData(
    '8',
    'SCD Service Center AT',
    'Datenmigration',
    'Low',
    '28.08.2024',
    'N/A',
  ),
  createData(
    '9',
    'SCD Service Center CH',
    'Systemupdate',
    'High',
    '01.09.2024',
    'Anna Wagner',
  ),
  createData(
    '10',
    'SCD Service Center DE',
    'Kundenberatung',
    'Medium',
    '05.09.2024',
    'Felix Bauer',
  ),
  createData(
    '11',
    'SCD Service Center AT',
    'Prozessoptimierung',
    'High',
    '10.09.2024',
    'N/A',
  ),
  createData(
    '12',
    'SCD Service Center CH',
    'Dokumentation erstellen',
    'Low',
    '15.09.2024',
    'Lisa Schwarz',
  ),
  createData(
    '13',
    'SCD Service Center DE',
    'Schulung vorbereiten',
    'Medium',
    '20.09.2024',
    'Martin Wolf',
  ),
  createData(
    '14',
    'SCD Service Center AT',
    'Datenanalyse',
    'High',
    '25.09.2024',
    'Sophie Kraus',
  ),
  createData(
    '15',
    'SCD Service Center CH',
    'Testdurchführung',
    'Medium',
    '30.09.2024',
    'N/A',
  ),
  createData(
    '16',
    'SCD Service Center DE',
    'Fehlerbehebung',
    'High',
    '05.10.2024',
    'David Fischer',
  ),
  createData(
    '17',
    'SCD Service Center AT',
    'Reporting',
    'Low',
    '10.10.2024',
    'Julia Hoffmann',
  ),
  createData(
    '18',
    'SCD Service Center CH',
    'Systemintegration',
    'Medium',
    '15.10.2024',
    'N/A',
  ),
  createData(
    '19',
    'SCD Service Center DE',
    'Kundenbetreuung',
    'High',
    '20.10.2024',
    'Christian Meyer',
  ),
  createData(
    '20',
    'SCD Service Center AT',
    'Datenpflege',
    'Medium',
    '25.10.2024',
    'Sarah Werner',
  ),
  createData(
    '21',
    'SCD Service Center CH',
    'Qualitätssicherung',
    'Low',
    '30.10.2024',
    'N/A',
  ),
  createData(
    '22',
    'SCD Service Center DE',
    'Prozessanalyse',
    'High',
    '05.11.2024',
    'Andreas Koch',
  ),
  createData(
    '23',
    'SCD Service Center AT',
    'Systemwartung',
    'Medium',
    '10.11.2024',
    'Nina Lange',
  ),
  createData(
    '24',
    'SCD Service Center CH',
    'Dokumentenprüfung',
    'High',
    '15.11.2024',
    'N/A',
  ),
  createData(
    '25',
    'SCD Service Center DE',
    'Projektkoordination',
    'Low',
    '20.11.2024',
    'Robert Schäfer',
  ),
  createData(
    '26',
    'SCD Service Center AT',
    'Datenauswertung',
    'Medium',
    '25.11.2024',
    'Eva Richter',
  ),
  createData(
    '27',
    'SCD Service Center CH',
    'Systemoptimierung',
    'High',
    '30.11.2024',
    'N/A',
  ),
  createData(
    '28',
    'SCD Service Center DE',
    'Kundenservice',
    'Medium',
    '05.12.2024',
    'Paul Weber',
  ),
  createData(
    '29',
    'SCD Service Center AT',
    'Berichtswesen',
    'Low',
    '10.12.2024',
    'Lena Schmitz',
  ),
  createData(
    '30',
    'SCD Service Center CH',
    'Prozessmanagement',
    'High',
    '15.12.2024',
    'N/A',
  ),
];

const columns: ITableHeadCell<ITaskTableData>[] = [
  {
    id: 'inbox',
    numeric: false,
    disablePadding: true,
    label: 'Postkorb',
    alignCell: 'left',
  },
  {
    id: 'taskType',
    numeric: false,
    disablePadding: false,
    label: 'Aufgabentyp',
    alignCell: 'left',
  },
  {
    id: 'priority',
    numeric: false,
    disablePadding: false,
    label: 'Priorität',
    alignCell: 'left',
    renderCell: value => (
      <TableChip
        value={value}
        className={cn(
          value === 'Low' && 'bg-transparent-success-16 text-success-main',
          value === 'High' && 'bg-transparent-primary-16 text-primary-dark',
        )}
      />
    ),
  },
  {
    id: 'dueDate',
    numeric: false,
    disablePadding: false,
    label: 'Fälligkeit',
    alignCell: 'left',
  },
  {
    id: 'assignedTo',
    numeric: false,
    disablePadding: false,
    label: 'Zugewiesen an',
    alignCell: 'left',
  },
  {
    id: 'id',
    numeric: false,
    disablePadding: true,
    label: '',
    alignCell: 'right',
    renderCell: () => (
      <button className="text-text-secondary cursor-pointer text-base">
        <IconDotsVertical />
      </button>
    ),
  },
];
export default function TaskTable() {
  return (
    <CustomTable
      rows={rows}
      columns={columns}
      idField="id"
      enableSelection={true}
      onSelectionChange={selectedIds => console.log('Selected:', selectedIds)}
      onSortChange={(field, order) => console.log('Sort:', field, order)}
    />
  );
}

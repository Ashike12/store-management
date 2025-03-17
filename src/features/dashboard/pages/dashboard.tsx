import {ITabItem} from '@core/interfaces/tabs.interface';
import {IconClipboard, IconInbox, IconListCheck} from '@tabler/icons-react';
import TaskTable from '../components/TaskTable';
import CustomTabs from '@components/tabs/CustomTabs';

const tabsWithIcons: ITabItem[] = [
  {
    id: 'allTasks',
    label: 'Alle Aufgaben',
    icon: <IconListCheck fontSize="small" />,
    content: <TaskTable />,
  },
  {
    id: 'myTask',
    label: 'Meine Aufgaben',
    icon: <IconClipboard fontSize="small" />,
    content: <div>My task content is not ready</div>,
  },
  {
    id: 'myInbox',
    label: 'Meine Postkörbe',
    icon: <IconInbox fontSize="small" />,
    content: <div>Inbox content is not ready</div>,
  },
];

export default function Dashboard() {
  return (
    <div className="flex w-full flex-col gap-5">
      <CustomTabs
        tabs={tabsWithIcons}
        defaultValue="allTasks"
        variant="fullWidth"
        onChange={value => console.log('Selected tab:', value)}
        className=""
      />
    </div>
  );
}

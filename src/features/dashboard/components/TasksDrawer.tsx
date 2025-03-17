import TextWrapper from '@components/text/TextWrapper';

interface INotesDrawerProps {
  isDrawerOpen: boolean;
}

export default function TasksDrawer({
  isDrawerOpen,
}: Readonly<INotesDrawerProps>) {
  if (!isDrawerOpen) {
    return null;
  }
  return (
    <TextWrapper
      content={'LAST_TASKS'}
      variant={'H5'}
      className="text-text-primary font-[510]"
    />
  );
}

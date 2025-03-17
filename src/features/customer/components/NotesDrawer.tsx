import TextWrapper from '@components/text/TextWrapper';

interface INotesDrawerProps {
  isDrawerOpen: boolean;
}

export default function NotesDrawer({
  isDrawerOpen,
}: Readonly<INotesDrawerProps>) {
  if (!isDrawerOpen) {
    return null;
  }
  return (
    <TextWrapper
      content={'NOTES'}
      variant={'H5'}
      className="text-text-primary font-[510]"
    />
  );
}

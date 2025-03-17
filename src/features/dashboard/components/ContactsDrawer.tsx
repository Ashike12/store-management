import TextWrapper from '@components/text/TextWrapper';

interface INotesDrawerProps {
  isDrawerOpen: boolean;
}

export default function ContactsDrawer({
  isDrawerOpen,
}: Readonly<INotesDrawerProps>) {
  if (!isDrawerOpen) {
    return null;
  }
  return (
    <TextWrapper
      content={'LAST_CONTACTS'}
      variant={'H5'}
      className="text-text-primary font-[510]"
    />
  );
}

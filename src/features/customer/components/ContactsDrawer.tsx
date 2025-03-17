import IconPlus from '@assets/icons/IconPlus';
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
    <div className="flex items-center justify-between">
      <TextWrapper
        content={'Offene Aufgaben'}
        variant={'H5'}
        className="text-text-primary font-[510]"
      />

      <IconPlus size={16} />
    </div>
  );
}

import TextWrapper from '@components/text/TextWrapper';

interface ITimeLineDrawerProps {
  isDrawerOpen: boolean;
}

export default function TimeLineDrawer({
  isDrawerOpen,
}: Readonly<ITimeLineDrawerProps>) {
  if (!isDrawerOpen) {
    return null;
  }
  return (
    <>
      <TextWrapper
        content={'TIMELINE'}
        variant={'H5'}
        className="text-text-primary font-[510]"
      />
    </>
  );
}

import IconLock from '@assets/icons/IconLock';

interface LeftSidebarHeaderProps {
  open: boolean;
  expandedLogo: string;
  isLocked: boolean;
  lockLeftSidebar: () => void;
  logo: string;
}

export default function LeftSidebarHeader({
  open,
  expandedLogo,
  isLocked,
  lockLeftSidebar,
  logo,
}: Readonly<LeftSidebarHeaderProps>) {
  return (
    <div className="flex items-center justify-center">
      {open ? (
        <div className="flex w-full items-center justify-between pb-6">
          <img src={expandedLogo} alt="expanded logo" />
          {!isLocked && (
            <button
              className="bg-transparent-grey-16 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full p-[10px]"
              onClick={lockLeftSidebar}>
              <IconLock />
            </button>
          )}
        </div>
      ) : (
        <div className="pb-4">
          <img src={logo} alt="asensis" />
        </div>
      )}
    </div>
  );
}

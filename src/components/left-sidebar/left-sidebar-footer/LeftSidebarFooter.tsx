import IconCaretDoubleLeft from '@assets/icons/IconCaretDoubleLeft';
import TextWrapper from '@components/text/TextWrapper';

interface ILeftSidebarFooterProps {
  open: boolean;
  SkywalkLogoExpanded: string;
  SkywalkLogo: string;
  drawerOpen: () => void;
  drawerClose: () => void;
}

export default function LeftSidebarFooter({
  open,
  SkywalkLogoExpanded,
  SkywalkLogo,
  drawerOpen,
  drawerClose,
}: Readonly<ILeftSidebarFooterProps>) {
  return (
    <>
      {open ? (
        <>
          <div className="flex flex-row items-center justify-start">
            <TextWrapper
              className="text-text-disabled pr-1"
              content={'POWERED_BY'}
              variant={'Caption'}
            />
            <img src={SkywalkLogoExpanded} alt="expanded skywalk logo" />
          </div>
          <div className="pl-2">
            <button
              className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-[#919EAB29]"
              onClick={drawerClose}>
              <IconCaretDoubleLeft />
            </button>
          </div>
        </>
      ) : (
        <div className="flex w-full flex-row items-center justify-center">
          <img
            className="pl-[7px]"
            src={SkywalkLogo}
            alt="skywalk logo"
            onPointerEnter={drawerOpen}
          />
        </div>
      )}
    </>
  );
}

import React, {useEffect} from 'react';
import {Drawer, IconButton} from '@mui/material';
import TextWrapper from '@components/text/TextWrapper';
import IconClose from '@assets/icons/IconClose';
import IconArrowUUpLeft from '@assets/icons/IconArrowUUpLeft';
import IconArrowUUpRight from '@assets/icons/IconArrowUUpRight';
import {CustomButton} from '@components/button/CustomButton';

export interface DrawerButtonAction {
  actionType: 'undo' | 'redo' | 'primary' | 'secondary';
}
export interface SideDrawerProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children?: React.ReactNode;
  width?: string; // Accept width as a prop
  enableUndoRedo?: boolean;
  primryButtonTextKey?: string;
  secondaryButtonTextKey?: string;
  buttonAction?: (action: DrawerButtonAction) => void;
  footerRightContent?: React.ReactNode;
  primarySecondaryButtonGapClass?:
    | 'gap-1'
    | 'gap-2'
    | 'gap-3'
    | 'gap-4'
    | 'gap-5'
    | 'gap-6';
}

const SideDrawer: React.FC<SideDrawerProps> = ({
  open,
  onClose,
  title,
  width = '500px', // Default width
  children,
  enableUndoRedo = false,
  primryButtonTextKey = 'SAVE',
  secondaryButtonTextKey = 'CANCEL',
  buttonAction,
  primarySecondaryButtonGapClass = 'gap-4',
  footerRightContent,
}) => {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose(); // Close on Escape key press
      }
    };
    document.addEventListener('keydown', handleKeyDown, {capture: true});
    return () =>
      document.removeEventListener('keydown', handleKeyDown, {capture: true});
  }, [onClose]);

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={() => {}} // Prevent auto-close on outside click
      disableEscapeKeyDown={false}
      variant="temporary"
      ModalProps={{keepMounted: true}}
      BackdropProps={{
        style: {backgroundColor: 'rgba(0, 0, 0, 0.25)'}, // Change color here
      }}
      PaperProps={{
        className: '',
        style: {width}, // Set width dynamically
      }}>
      {/* Header */}
      <div className="bg-grey-grey-50 flex items-center justify-between gap-4 py-2 pr-3 pl-5">
        <TextWrapper
          content={title}
          variant={'H6'}
          className="text-text-primary basis-9/10"
        />
        <IconButton className="basis-1/10" onClick={onClose}>
          <IconClose />
        </IconButton>
      </div>

      {/* Content */}
      <div className="flex-grow">{children}</div>

      {/* Footer */}
      <div className="border-grey-grey-100 flex justify-between border-t p-5">
        {enableUndoRedo && (
          <div className={`flex gap-4 ${enableUndoRedo ? 'basis-2/5' : ''}`}>
            <div
              className="hover:bg-transparent-interaction-16 cursor-pointer px-4 py-[10px] hover:rounded-[4px]"
              onClick={() =>
                buttonAction && buttonAction({actionType: 'undo'})
              }>
              <div className="pt-1">
                <IconArrowUUpLeft />
              </div>
            </div>
            <div
              className="hover:bg-transparent-interaction-16 cursor-pointer px-4 py-[10px] hover:rounded-[4px]"
              onClick={() =>
                buttonAction && buttonAction({actionType: 'redo'})
              }>
              <div className="pt-1">
                <IconArrowUUpRight />
              </div>
            </div>
          </div>
        )}
        <div
          className={`flex ${primarySecondaryButtonGapClass} ${enableUndoRedo ? 'basis-3/5' : 'w-full'}`}>
          {(footerRightContent && footerRightContent) || (
            <>
              <CustomButton
                className="w-[50%] cursor-pointer"
                text={secondaryButtonTextKey}
                variant={'outline'}
                onClick={() =>
                  buttonAction && buttonAction({actionType: 'secondary'})
                }
              />
              <CustomButton
                className="w-[50%] cursor-pointer"
                text={primryButtonTextKey}
                variant={'primary'}
                type="submit"
                onClick={() =>
                  buttonAction && buttonAction({actionType: 'primary'})
                }
              />
            </>
          )}
        </div>
      </div>
    </Drawer>
  );
};

export default SideDrawer;

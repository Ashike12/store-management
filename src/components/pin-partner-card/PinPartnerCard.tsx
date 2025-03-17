import IconCaretDown from '@assets/icons/IconCaretDown';
import IconX from '@assets/icons/IconX';
import TextWrapper from '@components/text/TextWrapper';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  List,
  ListItem,
  ListItemButton,
} from '@mui/material';
import {JSX, useEffect, useState} from 'react';
import {useLocation, useMatch, useNavigate, useParams} from 'react-router-dom';
import {pinnedPartnerMenuItems as menuItems} from '@core/constants/pin-partner-menu-item';
import {useAppDispatch} from '@core/store/hooks';
import {removePinnedPartner} from '@core/store/slices/pinned-partner.slice';
import cn from '@core/utils/cn';

interface IPinPartnerCardProps {
  PartnerId: string;
  PartnerName: string;
  InsuranceNumber: string;
  open: boolean;
}

export default function PinPartnerCard({
  PartnerName,
  InsuranceNumber,
  PartnerId,
  open,
}: Readonly<IPinPartnerCardProps>) {
  const dispatch = useAppDispatch();
  const [expanded, setExpanded] = useState<string | false>(false);
  const [selectedIcon, setSelectedIcon] = useState<JSX.Element>(<></>);
  const {id: routeCustomerId} = useParams(); // Extracts customerId from the route
  const location = useLocation();
  const pathName = location?.pathname;

  const match = useMatch(`:path/:path/${PartnerId}`);
  const navigateTo = useNavigate();

  const getRootPathName = (path: string) => path.split('/')[1];

  const isActiveItem = (path: string) => {
    const rootPathName = getRootPathName(path);
    return match?.params.path === rootPathName;
  };

  const handleChange =
    (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
      const menuItem = menuItems.find(item => item.type === panel);
      if (menuItem?.path) {
        navigateTo(menuItem.path);
      }
      setExpanded(isExpanded ? panel : false);
      setSelectedIcon(
        menuItem?.filledIcon({color: '#212B36', size: 20}) || <></>,
      );
    };

  const handleRemovePinnedPartner = () => {
    dispatch(removePinnedPartner(PartnerId));
    if (PartnerId === routeCustomerId) navigateTo('/dashboard');
  };

  useEffect(() => {
    if (PartnerId !== routeCustomerId) {
      setExpanded(false);
    }
  }, [routeCustomerId, pathName]);

  return open ? (
    <div className="pin-partner-card bg-background-default flex w-full flex-col items-start gap-[6px] rounded-sm px-2 pt-1 pb-2">
      <div className="flex w-full max-w-full flex-col items-start justify-between py-2 pl-2">
        <div className="flex w-full items-center justify-between">
          <TextWrapper
            content={PartnerName}
            variant={'Subtitle2'}
            className="text-text-secondary"
          />
          <button
            className="border-transparent-grey-16 flex h-6 w-6 cursor-pointer flex-row items-center justify-center rounded-full border"
            onClick={handleRemovePinnedPartner}>
            <IconX />
          </button>
        </div>
        <div className="flex flex-row gap-1">
          <TextWrapper
            content={'INSURANCE_NUMBER'}
            variant={'Body2'}
            className="text-text-secondary text-xs"
          />
          <TextWrapper
            content={InsuranceNumber}
            variant={'Body2'}
            className="text-text-secondary text-xs"
          />
        </div>
      </div>

      <div className="bg-transparent-grey-8 w-full px-1 pt-1 pb-2">
        {menuItems.map(item => (
          <div
            key={item.type}
            className={cn(
              'border-b-transparent-grey-16 border-b last:border-b-0',
            )}>
            <Accordion
              disableGutters
              expanded={expanded === item.type}
              onChange={handleChange(item.type)}
              sx={[
                {
                  backgroundColor: 'transparent',
                },
                {
                  '&:before': {
                    display: 'none',
                  },
                },
              ]}>
              <AccordionSummary
                sx={{
                  borderRadius: '2px',
                  minHeight: '30px',
                  maxHeight: '30px',
                  paddingInline: '12px',
                  '&:hover': {
                    backgroundColor: 'var(--color-transparent-grey-8)',
                  },
                }}
                expandIcon={item.subItems.length ? <IconCaretDown /> : <></>}>
                <div className="flex flex-row items-center gap-2">
                  {item.path && isActiveItem(item.path) ? (
                    <item.filledIcon
                      color="var(--color-text-primary)"
                      size={16}
                    />
                  ) : (
                    <item.icon />
                  )}
                  <TextWrapper
                    content={item.text}
                    variant={'Caption'}
                    className="text-text-primary"
                  />
                </div>
              </AccordionSummary>
              {item.subItems.length ? (
                <AccordionDetails sx={{padding: '0px'}}>
                  <List sx={{padding: '0px !important'}} disablePadding>
                    {item.subItems.map(subItem => (
                      <ListItem
                        key={subItem.text}
                        disableGutters
                        disablePadding>
                        <ListItemButton
                          onClick={() =>
                            navigateTo(`${subItem.path}${PartnerId}`)
                          }
                          disableGutters
                          sx={{
                            padding: '6px 34px',

                            backgroundColor: isActiveItem(subItem.path)
                              ? 'var(--color-transparent-grey-16)'
                              : 'transparent',
                            '&:hover': {
                              backgroundColor:
                                'var(--color-transparent-grey-8)',
                            },
                          }}>
                          <TextWrapper
                            content={subItem.text}
                            variant={'Caption'}
                            className="text-text-primary"
                          />
                        </ListItemButton>
                      </ListItem>
                    ))}
                  </List>
                </AccordionDetails>
              ) : (
                <></>
              )}
            </Accordion>
          </div>
        ))}
      </div>
    </div>
  ) : (
    expanded && (
      <>
        <div className="my-4 w-full border-t border-[#CCD2D8]"></div>
        <div className="bg-transparent-grey-24 flex h-11 w-12 flex-row items-center justify-center rounded-sm">
          {selectedIcon}
        </div>
      </>
    )
  );
}

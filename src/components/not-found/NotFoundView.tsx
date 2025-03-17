import {Box} from '@mui/material';
import NotFoundImage from '@assets/svg/illustration-404.svg';
import {CustomButton} from '@components/button/CustomButton';
import {useNavigate} from 'react-router-dom';
import TextWrapper from '@components/text/TextWrapper';

export default function NotFoundView() {
  const navigate = useNavigate();

  const handleNavigationIndexRoute = () => {
    navigate('/');
  };

  return (
    <section className="flex min-h-screen flex-col items-center justify-center">
      <TextWrapper content={'PAGE_NOT_FOUND_TITLE'} variant={'H3'} />

      <TextWrapper content={'PAGE_NOT_FOUND_SUBTITLE'} variant={'Body1'} />

      <Box
        component="img"
        src={NotFoundImage}
        sx={{
          width: 320,
          height: 'auto',
          my: {xs: 5, sm: 10},
        }}
      />

      <CustomButton
        variant={'primary'}
        text={'GO_BACK'}
        onClick={handleNavigationIndexRoute}
      />
    </section>
  );
}

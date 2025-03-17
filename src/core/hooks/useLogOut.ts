import {KeyclockHttpService} from '@core/services/kyelock.service';
import {useAppDispatch, useAppSelector} from '@core/store/hooks';
import {fetchAllLogout, tokenInfo} from '@core/store/slices/auth.slice';

export default function useLogOut() {
  const dispatch = useAppDispatch();
  const token = useAppSelector(tokenInfo);
  const handleLogout = async () => {
    await KeyclockHttpService.logout(token);
    dispatch(fetchAllLogout());
  };
  return handleLogout;
}

import { CustomButton } from "@components/button/CustomButton";
import { IToken } from "@core/interfaces/auth.model";
import { useAppDispatch } from "@core/store/hooks";
import { addLogin } from "@core/store/slices/auth.slice";

export default function Login() {
  const dispatch = useAppDispatch();
  const handleLogin = () => {
    const token:IToken = {
      accessToken: 'wrwerrwer',
      refreshToken: 'fsdfsdf',
      idToken: 'sdfsdf',
    }
    dispatch(addLogin(token));
  };

  return (
    <div className="flex min-h-[100vh] w-full items-center justify-center">
      <CustomButton onClick={() => handleLogin()} text={'Login'} variant={'primary'} />
    </div>
  );
}

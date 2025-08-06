import { loginUser } from '../api/userApi';

const handleLogin = async () => {
  try {
    const user = await loginUser({ email, password });
    console.log('Login success', user);
    // store token, navigate, etc.
  } catch (err) {
    console.error('Login failed', err);
  }
};

import axios from 'axios';

export async function getCurrentUser() {
  const res = await axios.get('http://localhost:5000/api/current_user', { withCredentials: true });
  return res.data;
}

export async function logout() {
  await axios.get('http://localhost:5000/auth/logout', { withCredentials: true });
}

import { redirect } from 'react-router-dom';

export function loginLoader() {
    const token = localStorage.getItem('token');
  
    if (token) {
        return redirect('/lobby');
    }

    return null;
}
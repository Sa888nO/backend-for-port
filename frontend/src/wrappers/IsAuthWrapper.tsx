import { Navigate, Outlet } from 'react-router-dom';
import Cookies from 'universal-cookie';

const cookies = new Cookies();

export const IsAuthWrapper = () => {
    const token = cookies.get('token');
    if (token) return <Outlet />;
    return <Navigate to={'/auth'} />;
};

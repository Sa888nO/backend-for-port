import { Spin } from 'antd';
import { jwtDecode } from 'jwt-decode';
import { useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import Cookies from 'universal-cookie';
import { useUser as useUserApi } from '../api/user';
import { useUser } from '../common/UserContext';

const Loading = () => (
    <div className="tw-flex tw-flex-1 tw-w-full tw-items-center tw-justify-center tw-gap-4 tw-flex-col">
        <Spin></Spin>
        <span>Загрузка пользователя</span>
    </div>
);

type Token = {
    exp: number;
    iat: number;
    role: 'admin' | 'client';
    user_id: number;
};

const cookies = new Cookies();

export const GetCurrentUser = () => {
    const { setUser } = useUser();
    const token = cookies.get('token');
    const { user_id } = jwtDecode(token) as Token;
    const navigate = useNavigate();
    const { data, isLoading, isError } = useUserApi(user_id);
    // const { data, isLoading, isError } = useQuery({
    //     queryKey: ['currentUser'],
    //     queryFn: () => UserApi(user_id),
    // });

    useEffect(() => {
        if (isError) {
            cookies.remove('token', { path: '/' });
            navigate('/');
        }
    }, [isError]);

    useEffect(() => {
        if (!user_id || !data) return;
        setUser({
            id: data.id,
            name: data.role === 'admin' ? 'Admin' : `${data.name} ${data.surname}`,
            role: data.role,
            email: data.email,
        });
    }, [data]);

    if (isLoading) return <Loading />;
    return <Outlet />;
};

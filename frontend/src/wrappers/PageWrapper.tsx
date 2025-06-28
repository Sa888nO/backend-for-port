import { FileAddOutlined, IdcardOutlined, LogoutOutlined, QrcodeOutlined, SolutionOutlined, TeamOutlined } from '@ant-design/icons';
import { Breadcrumb, Button, Tag, Tooltip } from 'antd';
import { Header } from 'antd/es/layout/layout';
import { Link, NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import Cookies from 'universal-cookie';
import { useUser } from '../common/UserContext';

const cookies = new Cookies();

const getRusPaths = (path: string) => {
    console.log(path);
    if (path === 'main') return ['Главная'];
    if (path === 'profile') return ['Профиль'];
    if (path === 'users/new') return ['Пользователи', 'Новый пользователь'];
    if (path.includes('users/')) return ['Пользователи', path.split('/').pop()];
    if (path === 'users') return ['Пользователи'];
    if (path === 'requests/new') return ['Заявки', 'Новая заявка'];
    if (path.includes('requests/')) return ['Заявки', path.split('/').pop()];
    if (path === 'requests') return ['Заявки'];
    // if (path === 'qrs/new') return ['Пропуска', 'Новый пропуск'];
    // if (path.includes('qrs/')) return ['Пропуска', path.split('/').pop()];
    // if (path === 'qrs') return ['Пропуска'];
    if (path === 'templates/new') return ['Шаблоны документов', 'Новый шаблон'];
    if (path.includes('templates/')) return ['Шаблоны документов', path.split('/').pop()];
    if (path === 'templates') return ['Шаблоны документов'];
    return [];
};

export const PageWrapper = () => {
    const { user } = useUser();
    const location = useLocation();
    const parts = location.pathname.split('/').filter(Boolean).slice(1).join('/');
    console.log(parts);
    const navigate = useNavigate();
    const logout = () => {
        cookies.remove('token', { path: '/' });
        navigate('/');
    };
    const pathsArray = getRusPaths(parts);
    return (
        <div className="tw-w-full tw-flex tw-flex-col">
            <Header className="tw-flex-shrink-0 tw-bg-inherit tw-border-b tw-h-10 tw-flex tw-justify-between tw-items-center tw-px-10">
                <Breadcrumb separator="/">
                    {pathsArray.map((path, index) => {
                        if (pathsArray.length > 1 && index === 0)
                            return (
                                <Breadcrumb.Item>
                                    <Link to={parts.split('/')[0]}>{path}</Link>
                                </Breadcrumb.Item>
                            );
                        return <Breadcrumb.Item>{path}</Breadcrumb.Item>;
                    })}
                </Breadcrumb>
                <Tag className="tw-m-0">
                    {user?.role === 'admin' ? 'Администратор: ' : 'Пользователь: '}
                    {user?.email}
                </Tag>
            </Header>
            <div className="tw-flex tw-flex-1 tw-overflow-hidden">
                <div className="tw-w-10 tw-py-2 tw-border-r tw-flex tw-justify-between tw-items-center tw-flex-col tw-flex-shrink-0">
                    <nav className="tw-flex tw-flex-col tw-gap-2">
                        <Tooltip overlay="Профиль" placement="right">
                            <NavLink to={'/lk/profile'}>
                                <Button icon={<IdcardOutlined />} />
                            </NavLink>
                        </Tooltip>
                        {user?.role === 'admin' ? (
                            <Tooltip overlay="Пользователи" placement="right">
                                <NavLink to={'/lk/users'}>
                                    <Button icon={<TeamOutlined />} />
                                </NavLink>
                            </Tooltip>
                        ) : null}
                        <Tooltip overlay="Заявки" placement="right">
                            <NavLink to={'/lk/requests'}>
                                <Button icon={<SolutionOutlined />} />
                            </NavLink>
                        </Tooltip>
                        <Tooltip overlay="Шаблоны документов" placement="right">
                            <NavLink to={'/lk/templates'}>
                                <Button icon={<FileAddOutlined />} />
                            </NavLink>
                        </Tooltip>
                    </nav>
                    <Tooltip overlay="Выйти" placement="right">
                        <Button icon={<LogoutOutlined />} onClick={logout} />
                    </Tooltip>
                </div>
                <div className="tw-w-full">
                    <div className="tw-p-2 tw-h-full tw-overflow-auto">
                        <Outlet />
                    </div>
                </div>
            </div>
        </div>
    );
};

import { useQuery } from '@tanstack/react-query';
import { UsersApi } from '../../api/users';
import { Button, Spin, Table, Tag } from 'antd';
import { ColumnsType } from 'antd/es/table';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';

export const Users = () => {
    const { data, isLoading } = useQuery({
        queryKey: ['users'],
        queryFn: UsersApi,
    });
    if (isLoading)
        return (
            <div className="tw-flex tw-items-center tw-justify-center tw-h-full tw-flex-1 tw-flex-col tw-gap-4">
                <Spin></Spin>
                <span>Загружаем пользователей</span>
            </div>
        );

    if (!data) return null;

    const columns: ColumnsType<(typeof data.data)[number]> = [
        {
            title: 'ID',
            dataIndex: 'id',
            key: 'id',
            width: 80,
        },
        {
            title: 'Роль',
            dataIndex: 'role',
            key: 'role',
            render: (role: string) => {
                return <Tag color={role === 'admin' ? 'green' : 'cyan'}>{role === 'admin' ? 'Админ' : 'Клиент'}</Tag>;
            },
        },
        {
            title: 'Email',
            dataIndex: 'email',
            key: 'email',
        },
        {
            title: 'Имя',
            dataIndex: 'name',
            key: 'name',
            render: (name: string) => (name ? name : <span className="tw-text-gray-300">N/A</span>),
        },
        {
            title: 'Фамилия',
            dataIndex: 'surname',
            key: 'surname',
            render: (surname: string) => (surname ? surname : <span className="tw-text-gray-300">N/A</span>),
        },
        {
            title: 'Почта подтверждена',
            dataIndex: 'is_verified',
            key: 'is_verified',
            width: 200,
            render: (is_verified: boolean) => {
                if (typeof is_verified !== 'boolean') return <span className="tw-text-gray-300">N/A</span>;
                return <Tag color={is_verified ? 'green' : 'red'}>{is_verified ? 'Да' : 'Нет'}</Tag>;
            },
        },
        {
            title: '',
            dataIndex: 'id',
            key: 'id',
            width: 80,
            render: (id) => {
                return (
                    <div className="tw-flex tw-gap-2">
                        <Link to={String(id)}>
                            <Button icon={<EditOutlined />} />
                        </Link>
                        <Button loading danger icon={<DeleteOutlined />} />
                    </div>
                );
            },
        },
    ];
    return <Table dataSource={data.data} columns={columns} pagination={false} bordered scroll={{ x: true }} />;
};

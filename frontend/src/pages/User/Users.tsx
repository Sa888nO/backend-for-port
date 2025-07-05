import { DeleteOutlined, EditOutlined, UserAddOutlined } from '@ant-design/icons';
import { Button, Table, Tag } from 'antd';
import { ColumnsType } from 'antd/es/table';
import { Link } from 'react-router-dom';
import { useDeleteUser, useUsers } from '../../api/user';
import { Loading } from '../../common/Loading';
import { NA } from '../../common/NA';

const Delete = ({ id, refetch }: { id: string | number; refetch: any }) => {
    const { mutate: deleteUser, isPending } = useDeleteUser();
    const onDelete = () => deleteUser(Number(id), { onSuccess: () => refetch() });
    return <Button loading={isPending} danger onClick={onDelete} icon={<DeleteOutlined />} />;
};

export const Users = () => {
    const { data, isLoading, refetch } = useUsers();

    if (isLoading) return <Loading title="Загружаем пользователей" />;

    if (!data) return null;

    const columns: ColumnsType<(typeof data)[number]> = [
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
            render: (name: string) => (name ? name : <NA />),
        },
        {
            title: 'Фамилия',
            dataIndex: 'surname',
            key: 'surname',
            render: (surname: string) => (surname ? surname : <NA />),
        },
        {
            title: 'Почта подтверждена',
            dataIndex: 'is_verified',
            key: 'is_verified',
            width: 200,
            render: (is_verified: boolean) => {
                if (typeof is_verified !== 'boolean') return <NA />;
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
                        <Delete refetch={refetch} id={id} />
                    </div>
                );
            },
        },
    ];
    return (
        <div className="tw-flex tw-flex-col tw-gap-2">
            <div>
                <Link to={'new'}>
                    <Button className = "tw-w tw-bg-custom-blue hover:tw-bg-blue-100 tw-text-white">
                        <UserAddOutlined />
                        Добавить пользователя
                    </Button>
                </Link>
            </div>
            <Table dataSource={data} columns={columns} pagination={false} bordered scroll={{ x: true }} />
        </div>
    );
};

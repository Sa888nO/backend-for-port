import { useMutation, useQuery } from '@tanstack/react-query';
import { TemplatesApi } from '../../api/getTemplates';
import { Link } from 'react-router-dom';
import { Button, Spin, Table, Tag } from 'antd';
import { DeleteOutlined, EditOutlined, FileAddOutlined, UserAddOutlined } from '@ant-design/icons';
import { deleteUserApi } from '../../api/deleteUser';
import { ColumnsType } from 'antd/es/table';
import { deleteTemplate } from '../../api/deleteTemplate';

const Delete = ({ id, refetch }: { id: string | number; refetch: any }) => {
    const { mutate: deleteUser, isPending } = useMutation({
        mutationFn: (id: string | number) => deleteTemplate(id),
        onSuccess: () => refetch(),
    });
    return <Button loading={isPending} danger onClick={() => deleteUser(id)} icon={<DeleteOutlined />} />;
};

export const Templates = () => {
    const { data, isLoading, refetch } = useQuery({
        queryKey: ['templates'],
        queryFn: () => TemplatesApi(),
    });
    if (isLoading)
        return (
            <div className="tw-flex tw-items-center tw-justify-center tw-h-full tw-flex-1 tw-flex-col tw-gap-4">
                <Spin></Spin>
                <span>Загружаем шаблоны</span>
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
            title: 'Имя',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Сущности',
            dataIndex: 'schema',
            key: 'schema',
            render: (schema: Record<string, string>) => {
                const keys = Object.keys(schema);
                if (keys.length === 0) return <span className="tw-text-gray-300">N/A</span>;
                return (
                    <div className="tw-flex tw-gap-1 tw-flex-wrap">
                        {keys.map((key) => (
                            <Tag color="blue" key={key}>
                                {key}
                            </Tag>
                        ))}
                    </div>
                );
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
                            <Button icon={<FileAddOutlined />} />
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
                    <Button>
                        <FileAddOutlined />
                        Добавить шаблон
                    </Button>
                </Link>
            </div>
            <Table dataSource={data.data} columns={columns} pagination={false} bordered scroll={{ x: true }} />
        </div>
    );
};

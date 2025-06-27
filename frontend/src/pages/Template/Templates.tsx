import { useMutation, useQuery } from '@tanstack/react-query';
import { TemplatesApi } from '../../api/getTemplates';
import { Link } from 'react-router-dom';
import { Button, Spin, Table, Tag } from 'antd';
import { DeleteOutlined, DownloadOutlined, EditOutlined, FileAddOutlined, UserAddOutlined } from '@ant-design/icons';
import { deleteUserApi } from '../../api/deleteUser';
import { ColumnsType } from 'antd/es/table';
import { deleteTemplate } from '../../api/deleteTemplate';
import { useUser } from '../../contexts/UserContext';
import { downloadFileApi } from '../../api/downloadFile';
import { FilesApi } from '../../api/getFIles';

const Delete = ({ id, refetch }: { id: string | number; refetch: any }) => {
    const { mutate: deleteUser, isPending } = useMutation({
        mutationFn: (id: string | number) => deleteTemplate(id),
        onSuccess: () => refetch(),
    });
    return <Button loading={isPending} danger onClick={() => deleteUser(id)} icon={<DeleteOutlined />} />;
};

export const Templates = () => {
    const { user } = useUser();
    const { data, isLoading, refetch } = useQuery({
        queryKey: ['templates'],
        queryFn: () => TemplatesApi(),
    });
    const { data: files } = useQuery({
        queryKey: ['filesForTemplates'],
        queryFn: () => FilesApi(),
    });
    console.log(files);
    const { mutate: down } = useMutation({
        mutationFn: (id: string | number) =>
            downloadFileApi(id).then((v) => {
                const url = window.URL.createObjectURL(v.data);
                const link = document.createElement('a');
                link.href = url;
                link.download = 'document.docx';
                document.body.appendChild(link);
                link.click();
                link.remove();
                window.URL.revokeObjectURL(url);
            }),
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
            render: (id, { file_id }) => {
                return (
                    <div className="tw-flex tw-gap-2">
                        <Link to={String(id)}>
                            <Button icon={<FileAddOutlined />} />
                        </Link>
                        <Button
                            icon={<DownloadOutlined />}
                            onClick={() => {
                                down(files?.data.find((f) => f.id === file_id)?.path_to_file || '');
                            }}
                        />
                        {user?.role === 'admin' ? <Delete refetch={refetch} id={id} /> : null}
                    </div>
                );
            },
        },
    ];
    return (
        <div className="tw-flex tw-flex-col tw-gap-2">
            {user?.role === 'admin' ? (
                <div>
                    <Link to={'new'}>
                        <Button>
                            <FileAddOutlined />
                            Добавить шаблон
                        </Button>
                    </Link>
                </div>
            ) : null}
            <Table dataSource={data.data} columns={columns} pagination={false} bordered scroll={{ x: true }} />
        </div>
    );
};

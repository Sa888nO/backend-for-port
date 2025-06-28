import { useMutation, useQuery } from '@tanstack/react-query';
import { TemplatesApi } from '../../api/getTemplates';
import { Link } from 'react-router-dom';
import { Button, Spin, Table, Tag } from 'antd';
import { DeleteOutlined, DownloadOutlined, FileAddOutlined } from '@ant-design/icons';
import { ColumnsType } from 'antd/es/table';
import { deleteTemplate } from '../../api/deleteTemplate';
import { useUser } from '../../common/UserContext';
import { downloadFileApi } from '../../api/downloadFile';
import { FilesApi } from '../../api/getFIles';
import { download } from '../../common/download';
import { Loading } from '../../common/Loading';
import { NA } from '../../common/NA';

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
                download(v.data, 'document.docx');
            }),
    });

    if (isLoading) return <Loading title="Загружаем шаблоны" />;

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
                if (keys.length === 0) return <NA />;
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

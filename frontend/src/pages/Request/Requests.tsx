import { useMutation, useQuery } from '@tanstack/react-query';
import { TemplatesApi } from '../../api/getTemplates';
import { Link } from 'react-router-dom';
import { Button, Spin, Table, Tag } from 'antd';
import { DeleteOutlined, DownloadOutlined, EditOutlined, EyeOutlined, FileAddOutlined } from '@ant-design/icons';
import { ColumnsType } from 'antd/es/table';
import { deleteTemplate } from '../../api/deleteTemplate';
import { useUser } from '../../common/UserContext';
import { downloadFileApi } from '../../api/downloadFile';
import { FilesApi } from '../../api/getFIles';
import { Loading } from '../../common/Loading';
import { NA } from '../../common/NA';
import { Request, useDeleteRequest, useRequest, useRequests } from '../../api/request';
import { useUsers } from '../../api/user';
import { ModalDOCX } from '../../common/ModalDOCX';
import { useState } from 'react';
import { download } from '../../common/download';
// const { user_id, name, description } = req.body;
// const file = req.file;

const Delete = ({ id, refetch }: { id: string | number; refetch: any }) => {
    const { mutate, isPending } = useDeleteRequest();
    const onDelete = () => mutate(Number(id), { onSuccess: () => refetch() });
    return <Button loading={isPending} danger onClick={onDelete} icon={<DeleteOutlined />} />;
};

const StatusTag = ({ status }: { status: Request['status'] }) => {
    const text = {
        pending: 'Обрабатывается',
        accepted: 'Одобрена',
        rejected: 'Отклонена',
    };
    const color = {
        pending: 'blue',
        accepted: 'green',
        rejected: 'red',
    };
    return <Tag color={color[status as keyof typeof color]}>{text[status as keyof typeof text]}</Tag>;
};

export const Requests = () => {
    const [selectedDocument, setSelectedDocument] = useState<string | null>(null);
    const { user } = useUser();
    const { data, isLoading, refetch } = useRequests();
    const { data: users, isLoading: isLoadingUsers } = useUsers();
    const { data: files, isLoading: isLoadingFiles } = useQuery({
        queryKey: ['filesForTemplates'],
        queryFn: () => FilesApi(),
    });

    const { mutate: down } = useMutation({
        mutationFn: (id: string | number) =>
            downloadFileApi(id).then((v) => {
                download(v.data, 'document.docx');
            }),
    });

    if (isLoading || isLoadingUsers || isLoadingFiles) return <Loading title="Загружаем заявки" />;

    if (!data) return null;

    const columns: ColumnsType<Request> = [
        {
            title: 'ID',
            dataIndex: 'id',
            key: 'id',
            width: 80,
        },
        {
            title: 'Название',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Описание',
            dataIndex: 'description',
            key: 'description',
            render: (description: string) => (!description || description === '' ? <NA /> : description),
        },
        {
            title: 'Статус',
            dataIndex: 'status',
            key: 'status',
            render: (status: Request['status']) => <StatusTag status={status} />,
        },
        {
            title: 'Создатель',
            dataIndex: 'user_id',
            key: 'user_id',
            render: (user_id: number) => {
                const user = users?.find((u) => u.id === user_id);
                return user?.email || <NA />;
            },
        },
        {
            title: 'QR пропуск',
            dataIndex: 'user_id',
            key: 'user_id',
            // Подумать над этим моментом
            render: (user_id: number) => {
                const user = users?.find((u) => u.id === user_id);
                return user?.name || <NA />;
            },
        },
        {
            title: 'Комментарий',
            dataIndex: 'comment',
            key: 'comment',
            // Подумать над этим моментом
            render: (comment: string) => {
                if (!comment || comment === '') return <NA />;
                return comment;
            },
        },
        {
            title: 'Документ',
            dataIndex: 'file_id',
            key: 'file_id',
            width: 100,
            render: (file_id: number) => (
                <div className="tw-flex tw-gap-2">
                    <Button
                        icon={<EyeOutlined />}
                        onClick={() => {
                            if (!files) return;
                            const file = files.data.find((u) => u.id === file_id);
                            if (!file) return;
                            setSelectedDocument(file.path_to_file);
                        }}
                    />
                    <Button
                        icon={<DownloadOutlined />}
                        onClick={() => {
                            down(files?.data.find((f) => f.id === file_id)?.path_to_file || '');
                        }}
                    />
                </div>
            ),
        },
        // {
        //     title: 'Сущности',
        //     dataIndex: 'schema',
        //     key: 'schema',
        //     render: (schema: Record<string, string>) => {
        //         const keys = Object.keys(schema);
        //         if (keys.length === 0) return <NA />;
        //         return (
        //             <div className="tw-flex tw-gap-1 tw-flex-wrap">
        //                 {keys.map((key) => (
        //                     <Tag color="blue" key={key}>
        //                         {key}
        //                     </Tag>
        //                 ))}
        //             </div>
        //         );
        //     },
        // },
        {
            title: '',
            dataIndex: 'id',
            key: 'id',
            width: 50,
            render: (id) => {
                return (
                    <div className="tw-flex tw-gap-2">
                        <Link to={String(id)}>
                            <Button icon={<EditOutlined />} />
                        </Link>
                        {user?.role === 'admin' ? <Delete refetch={refetch} id={id} /> : null}
                    </div>
                );
            },
        },
    ];
    console.log(selectedDocument);
    return (
        <div className="tw-flex tw-flex-col tw-gap-2">
            <ModalDOCX
                title="Предварительный просмотр документа"
                pathToFile={selectedDocument || ''}
                modalProps={{
                    open: Boolean(selectedDocument),
                    onCancel: () => setSelectedDocument(null),
                }}
            />
            <div>
                <Link to={'new'}>
                    <Button>
                        <FileAddOutlined />
                        Создать заявку на пропуск
                    </Button>
                </Link>
            </div>
            <Table dataSource={data} columns={columns} pagination={false} bordered scroll={{ x: true }} />
        </div>
    );
};

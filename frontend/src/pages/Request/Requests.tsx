import {
    DeleteOutlined,
    DownloadOutlined,
    EditOutlined,
    EyeOutlined,
    FileAddOutlined,
    LockOutlined,
    QrcodeOutlined,
    UnlockOutlined,
} from '@ant-design/icons';
import { useMutation, useQuery } from '@tanstack/react-query';
import { Button, Modal, QRCode, Table, Tag } from 'antd';
import { ColumnsType } from 'antd/es/table';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { downloadFileApi } from '../../api/downloadFile';
import { FilesApi } from '../../api/getFIles';
import { useBlockQR, useQRs } from '../../api/qr';
import { Request, useDeleteRequest, useRequests } from '../../api/request';
import { useUsers } from '../../api/user';
import { download } from '../../common/download';
import { Loading } from '../../common/Loading';
import { ModalDOCX } from '../../common/ModalDOCX';
import { NA } from '../../common/NA';
import { useUser } from '../../common/UserContext';
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
    const [selectedQR, setSelectedQR] = useState<string | null>(null);
    const { user } = useUser();
    const { data, isLoading, refetch } = useRequests();
    const { data: users, isLoading: isLoadingUsers } = useUsers();
    const { data: files, isLoading: isLoadingFiles } = useQuery({
        queryKey: ['filesForTemplates'],
        queryFn: () => FilesApi(),
    });

    const { mutate: block } = useBlockQR();
    const { data: qrs, isLoading: isLoadingQrs, refetch: refetchQrs } = useQRs();
    console.log(qrs, ' QR ');
    const { mutate: down } = useMutation({
        mutationFn: (id: string | number) =>
            downloadFileApi(id).then((v) => {
                download(v.data, 'document.docx');
            }),
    });
    // const filteredData = data?.filter((;

    if (isLoading || isLoadingUsers || isLoadingFiles || isLoadingQrs) return <Loading title="Загружаем заявки" />;

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
            dataIndex: 'qr_id',
            key: 'qr_id',
            // Подумать над этим моментом
            render: (qr_id: number) => {
                const QR = qrs?.find((q) => q.id === qr_id);
                if (!QR || !files) return <NA />;
                const file = files.data.find((f) => f.id === QR?.file_id);
                if (!file) return <NA />;
                return (
                    <div className="tw-flex tw-gap-2">
                        <Button icon={<QrcodeOutlined />} disabled={QR.is_blocked} onClick={() => setSelectedQR(file.path_to_file)} />
                        {user?.role === 'admin' && (
                            <Button
                                danger={!QR.is_blocked}
                                icon={!QR.is_blocked ? <LockOutlined /> : <UnlockOutlined />}
                                onClick={() =>
                                    block(qr_id, {
                                        onSuccess: () => refetchQrs(),
                                    })
                                }
                            ></Button>
                        )}
                    </div>
                );
                // const user = users?.find((u) => u.id === user_id);
                // return user?.name || <NA />;
            },
        },
        {
            title: 'Комментарий',
            dataIndex: 'comment',
            key: 'comment',
            // Подумать над этим моментом
            render: (comment: string, { status }) => {
                if (!comment || comment === '') return <NA />;
                if (status === 'rejected') return <div className="tw-text-red-500">{comment}</div>;
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
        {
            title: '',
            dataIndex: 'id',
            key: 'id',
            width: 50,
            render: (id, { status }) => {
                return (
                    <div className="tw-flex tw-gap-2">
                        {user?.role === 'admin' && (
                            <Link to={String(id)}>
                                <Button icon={<EditOutlined />} disabled={status !== 'pending'} />
                            </Link>
                        )}
                        {<Delete refetch={refetch} id={id} />}
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
            <Modal
                styles={{
                    body: {
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                    },
                }}
                footer={false}
                centered
                onCancel={() => setSelectedQR(null)}
                open={Boolean(selectedQR)}
            >
                <QRCode value={`http://5.35.98.185:4444/${selectedQR}`} />
            </Modal>
            <div>
                <Link to={'new'}>
                    <Button className = "tw-w tw-bg-custom-blue tw-text-white">
                        <FileAddOutlined />
                        Создать заявку на пропуск
                    </Button>
                </Link>
            </div>
            <Table
                dataSource={user?.role === 'admin' ? data : data.filter((f) => f.user_id === user?.id)}
                columns={columns}
                pagination={false}
                bordered
                scroll={{ x: true }}
            />
        </div>
    );
};

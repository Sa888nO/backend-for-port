import { IdcardOutlined, LeftOutlined, LockOutlined, MailOutlined, TagsOutlined, UploadOutlined } from '@ant-design/icons';
import { useMutation } from '@tanstack/react-query';
import { Button, Form, Input, Select, Switch, Upload, UploadFile } from 'antd';
import { useForm, useWatch } from 'antd/es/form/Form';
import { Link, useNavigate, useParams } from 'react-router-dom';
// import { CreateUserApi, iCreateUser } from '../../api/createUser';
import { createTemplateApi } from '../../api/createTemplate';
import { useUser } from '../../common/UserContext';
import { useCreateRequest, useResolveRequest } from '../../api/request';

type FormValues = {
    status: 'accepted' | 'rejected';
    comment: string;
};

// const { user_id, name, description } = req.body;
// const file = req.file;

export const ResolveRequest = () => {
    const { id } = useParams();
    console.log(id);
    // const { user } = useUser();
    const [form] = useForm();
    // const normFile = (e: any) => {
    //     if (Array.isArray(e)) {
    //         return e;
    //     }
    //     return e && e.fileList;
    // };
    const navigate = useNavigate();
    const { mutate, isPending } = useResolveRequest();
    const onFinish = (props: FormValues) => {
        // if (!user || !props.document || !props.document[0]?.originFileObj) return;
        // const formData = new FormData();
        // if (props.document && props.document[0]?.originFileObj) {
        // formData.append('file', props.document[0].originFileObj as File);
        // // }
        // formData.append('user_id', String(user.id));
        // formData.append('name', props.name);
        // formData.append('description', props.description || '');
        mutate(
            {
                id: Number(id),
                ...props,
            },
            {
                onSuccess: () => navigate('/lk/requests'),
            },
        );
    };
    return (
        <div className="tw-flex tw-flex-col tw-gap-2">
            <div>
                <Link to={'/lk/requests'}>
                    <Button>
                        <LeftOutlined />
                        Назад
                    </Button>
                </Link>
            </div>
            <div className="tw-flex tw-justify-center tw-items-center">
                <Form form={form} onFinish={onFinish} layout="vertical" variant="outlined" className="tw-w-1/2 tw-max-w-80">
                    {/* <Form.Item
                        label="Название шаблона"
                        name="name"
                        required
                        rules={[{ required: true, message: 'Название шаблона не может быть пустым' }]}
                    >
                        <Input prefix={<TagsOutlined className="tw-mr-1.5" />} placeholder="Введите название шаблона"></Input>
                    </Form.Item> */}
                    <Form.Item
                        label="Комментарий"
                        name="comment"
                        // required
                        // rules={[{ required: true, message: 'Название шаблона не может быть пустым' }]}
                    >
                        <Input.TextArea placeholder="Введите название шаблона"></Input.TextArea>
                    </Form.Item>
                    <Form.Item
                        label="Результат"
                        name="status"
                        // required
                        // rules={[{ required: true, message: 'Название шаблона не может быть пустым' }]}
                    >
                        <Select
                            options={[
                                {
                                    value: 'accepted',
                                    label: 'Одобрена',
                                },
                                {
                                    value: 'rejected',
                                    label: 'Отклонена',
                                },
                            ]}
                            placeholder="Заявка согласована?"
                        />
                    </Form.Item>
                    {/* <Form.Item
                        label="Размеченный документ в формате docx"
                        name="document"
                        valuePropName="fileList"
                        getValueFromEvent={normFile}
                        rules={[{ required: true, message: 'Пожалуйста, загрузите файл' }]}
                    >
                        <Upload
                            name="file"
                            beforeUpload={() => false} // Отключает авто-загрузку, файл попадет в форму
                            maxCount={1} // Только один файл
                            prefixCls="tw-w-full"
                        >
                            <Button className="tw-w-full" icon={<UploadOutlined />}>
                                Выбрать файл
                            </Button>
                        </Upload>
                    </Form.Item> */}
                    <Button loading={isPending} htmlType="submit" className="tw-w-full" type="primary">
                        Вынести решение по пропуску
                    </Button>
                </Form>
            </div>
        </div>
    );
};

import { LeftOutlined, TagsOutlined, UploadOutlined } from '@ant-design/icons';
import { Button, Form, Input, Upload, UploadFile } from 'antd';
import { useForm } from 'antd/es/form/Form';
import { Link, useNavigate } from 'react-router-dom';
// import { CreateUserApi, iCreateUser } from '../../api/createUser';
import { useCreateRequest } from '../../api/request';
import { useUser } from '../../common/UserContext';

type FormValues = {
    name: string;
    description: string;
    document: UploadFile[];
};

// const { user_id, name, description } = req.body;
// const file = req.file;

export const CreateRequest = () => {
    const { user } = useUser();
    const [form] = useForm();
    const normFile = (e: any) => {
        if (Array.isArray(e)) {
            return e;
        }
        return e && e.fileList;
    };
    const navigate = useNavigate();
    const { mutate, isPending } = useCreateRequest();
    const onFinish = (props: FormValues) => {
        if (!user || !props.document || !props.document[0]?.originFileObj) return;
        const formData = new FormData();
        // if (props.document && props.document[0]?.originFileObj) {
        formData.append('file', props.document[0].originFileObj as File);
        // }
        formData.append('user_id', String(user.id));
        formData.append('name', props.name);
        formData.append('description', props.description || '');
        mutate(formData, {
            onSuccess: () => navigate('/lk/requests'),
        });
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
                    <Form.Item
                        label="Название заявки"
                        name="name"
                        required
                        rules={[{ required: true, message: 'Название заявки не может быть пустым' }]}
                    >
                        <Input prefix={<TagsOutlined className="tw-mr-1.5" />} placeholder="Введите название заявки"></Input>
                    </Form.Item>
                    <Form.Item
                        label="Описание заявки"
                        name="description"
                        // required
                        // rules={[{ required: true, message: 'Название шаблона не может быть пустым' }]}
                    >
                        <Input.TextArea placeholder="Введите название заявки"></Input.TextArea>
                    </Form.Item>
                    <Form.Item
                        label="Прикрепите шаблон (формат - docx) "
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
                    </Form.Item>
                    <Button loading={isPending} htmlType="submit" className="tw-w-full tw-bg-custom-blue hover:tw-bg-blue-700 tw-text-white" type="primary">
                        Создать
                    </Button>
                </Form>
            </div>
        </div>
    );
};

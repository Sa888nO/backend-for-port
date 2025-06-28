import { IdcardOutlined, LeftOutlined, LockOutlined, MailOutlined, TagsOutlined, UploadOutlined } from '@ant-design/icons';
import { useMutation } from '@tanstack/react-query';
import { Button, Form, Input, Select, Switch, Upload, UploadFile } from 'antd';
import { useForm, useWatch } from 'antd/es/form/Form';
import { Link, useNavigate } from 'react-router-dom';
// import { CreateUserApi, iCreateUser } from '../../api/createUser';
import { createTemplateApi } from '../../api/createTemplate';

type FormValues = {
    name: string;
    document: UploadFile[];
};

export const CreateTemplate = () => {
    const [form] = useForm();
    const role = useWatch('role', form);
    const normFile = (e: any) => {
        // Преобразуем e в массив файлов
        if (Array.isArray(e)) {
            return e;
        }
        return e && e.fileList;
    };
    const navigate = useNavigate();
    const { mutate, isPending } = useMutation({ mutationFn: (props: FormData) => createTemplateApi(props) });
    const onFinish = (props: FormValues) => {
        const formData = new FormData();
        if (props.document && props.document[0]?.originFileObj) {
            formData.append('template', props.document[0].originFileObj as File);
        }
        formData.append('name', props.name);
        mutate(formData, {
            onSuccess: () => navigate('/lk/templates'),
        });
    };
    return (
        <div className="tw-flex tw-flex-col tw-gap-2">
            <div>
                <Link to={'/lk/templates'}>
                    <Button>
                        <LeftOutlined />
                        Назад
                    </Button>
                </Link>
            </div>
            <div className="tw-flex tw-justify-center tw-items-center">
                <Form form={form} onFinish={onFinish} layout="vertical" variant="outlined" className="tw-w-1/2 tw-max-w-80">
                    <Form.Item
                        label="Название шаблона"
                        name="name"
                        required
                        rules={[{ required: true, message: 'Название шаблона не может быть пустым' }]}
                    >
                        <Input prefix={<TagsOutlined className="tw-mr-1.5" />} placeholder="Введите название шаблона"></Input>
                    </Form.Item>
                    <Form.Item
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
                    </Form.Item>
                    <Button loading={isPending} htmlType="submit" className="tw-w-full" type="primary">
                        Создать
                    </Button>
                </Form>
            </div>
        </div>
    );
};

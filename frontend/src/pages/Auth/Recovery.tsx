import { MailOutlined } from '@ant-design/icons';
import { Button, Form, Input } from 'antd';
import { Link } from 'react-router-dom';
// import { iLogin, LoginApi } from '../../api/login';
import { notification } from 'antd';
import { useForm } from 'antd/es/form/Form';
import { AxiosError } from 'axios';
// import { iRecovery, RecoveryApi } from '../../api/recovery';
import { useRecovery } from '../../api/auth';

type FormValues = {
    email: string;
};

export const Recovery = () => {
    const [api, contextHolder] = notification.useNotification();
    const [form] = useForm();
    const { isPending, mutate } = useRecovery();
    const onFinish = ({ email }: FormValues) =>
        mutate(
            { email },
            {
                onError: (error) => {
                    const ErrorMessage = (error as AxiosError<{ message: string }>)?.response?.data?.message;
                    api.error({ message: ErrorMessage || 'При входе в аккаунт произошла ошибка', duration: 10, placement: 'bottomRight' });
                },
                onSuccess: (answer) => {
                    api.success({ message: answer.data.message, duration: 10, placement: 'bottomRight' });
                },
            },
        );
    return (
        <>
            {contextHolder}
            <div className="tw-flex tw-w-full tw-justify-center tw-items-center tw-flex-col tw-gap-5">
                <h1 className="tw-text-xl tw-font-bold tw-text-center">Оформление пропусков в порт</h1>
                <Form form={form} onFinish={onFinish} layout="vertical" variant="outlined" className="tw-w-1/2 tw-max-w-80">
                    <Form.Item label="Email" name="email" required rules={[{ required: true, message: 'Email не может быть пустым' }]}>
                        <Input prefix={<MailOutlined className="tw-mr-1.5" />} placeholder="Введите ваш email"></Input>
                    </Form.Item>
                    <Button loading={isPending} htmlType="submit" className="tw-w-full" type="primary">
                        Восстановить пароль
                    </Button>
                </Form>
                <Link to="/auth/login" className="tw-w-1/2 tw-max-w-80">
                    <Button className="tw-w-full">У меня уже есть аккаунт</Button>
                </Link>
                <Link to="/auth/registration" className="tw-w-1/2 tw-max-w-80">
                    <Button className="tw-w-full">Зарегистрироваться</Button>
                </Link>
            </div>
        </>
    );
};

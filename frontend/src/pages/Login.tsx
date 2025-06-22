import { LockOutlined, MailOutlined } from '@ant-design/icons';
import { Button, Form, Input } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import { iLogin, LoginApi } from '../api/login';
import { notification } from 'antd';
import { useMutation } from '@tanstack/react-query';
import { useForm } from 'antd/es/form/Form';
import { AxiosError } from 'axios';
// import { api } from "../api";

type FormValues = {
    email: string;
    password: string;
};

export const Login = () => {
    const navigate = useNavigate();
    const [api] = notification.useNotification();
    const [form] = useForm();
    const { mutate } = useMutation({
        mutationFn: async (params: iLogin) => await LoginApi(params),
    });
    const onFinish = ({ email, password }: FormValues) =>
        mutate(
            { email, password },
            {
                onError: (error) => {
                    const ErrorMessage = (error as AxiosError<{ message: string }>)?.response?.data?.message;
                    api.error({ message: ErrorMessage || 'При входе в аккаунт произошла ошибка', duration: 10, placement: 'bottomRight' });
                },
                onSuccess: (answer) => {
                    console.log(answer);
                    navigate('/main');
                },
            },
        );
    return (
        <div className="tw-flex tw-w-full tw-justify-center tw-items-center tw-flex-col tw-gap-5">
            <h1 className="tw-text-xl tw-font-bold tw-text-center">Приложение для оформления пропусков в порт</h1>
            <Form form={form} onFinish={onFinish} layout="vertical" variant="outlined" className="tw-w-1/2 tw-max-w-80">
                <Form.Item label="Email" name="email" required rules={[{ required: true, message: 'Email не может быть пустым' }]}>
                    <Input prefix={<MailOutlined className="tw-mr-1.5" />} placeholder="Введите ваш email"></Input>
                </Form.Item>
                <Form.Item
                    label="Пароль"
                    name="password"
                    required
                    rules={[
                        {
                            required: true,
                            message: 'Пароль не может быть пустым',
                        },
                    ]}
                >
                    <Input prefix={<LockOutlined className="tw-mr-1.5" />} placeholder="Введите ваш пароль"></Input>
                </Form.Item>
                <Button htmlType="submit" className="tw-w-full" type="primary">
                    Войти
                </Button>
            </Form>
            <Link to="/auth/registration" className="tw-w-1/2 tw-max-w-80">
                <Button className="tw-w-full">Зарегистрироваться</Button>
            </Link>
        </div>
    );
};

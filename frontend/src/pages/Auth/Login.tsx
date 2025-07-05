import { LockOutlined, MailOutlined } from '@ant-design/icons';
import { Button, Form, Input } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
// import { iLogin, LoginApi } from '../../api/login';
import { notification } from 'antd';
//import { useMutation } from '@tanstack/react-query';
import { useForm } from 'antd/es/form/Form';
import { AxiosError } from 'axios';
import Cookies from 'universal-cookie';
import { jwtDecode } from 'jwt-decode';
import { useLogin } from '../../api/auth';

type FormValues = {
    email: string;
    password: string;
};

type Token = {
    exp: number;
    iat: number;
    role: 'admin' | 'client';
    user_id: number;
};

const cookies = new Cookies();

export const Login = () => {
    const navigate = useNavigate();
    const [api, contextHolder] = notification.useNotification();
    const [form] = useForm();
    const { isPending, mutate } = useLogin();
    // const { isPending, mutate } = useMutation({
    //     mutationFn: async (params: iLogin) => await LoginApi(params),
    // });
    const onFinish = ({ email, password }: FormValues) =>
        mutate(
            { email, password },
            {
                onError: (error) => {
                    const ErrorMessage = (error as AxiosError<{ message: string }>)?.response?.data?.message;
                    api.error({ message: ErrorMessage || 'При входе в аккаунт произошла ошибка', duration: 10, placement: 'bottomRight' });
                },
                onSuccess: (answer) => {
                    const { token } = answer.data;
                    const { exp } = jwtDecode(token) as Token;
                    cookies.remove('token');
                    cookies.set('token', token, { path: '/', expires: new Date(exp * 1000) });
                    setTimeout(() => navigate('/lk'), 100);
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
                        <Input.Password prefix={<LockOutlined className="tw-mr-1.5" />} placeholder="Введите ваш пароль"></Input.Password>
                    </Form.Item>
                    <Button loading={isPending} htmlType="submit" className="tw-w-full tw-bg-custom-blue hover:tw-bg-blue-700 tw-text-white" type="primary">
                        Войти
                    </Button>
                </Form>
                <Link to="/auth/registration" className="tw-w-1/2 tw-max-w-80">
                    <Button className="tw-w-full">Зарегистрироваться</Button>
                </Link>
                <Link to="/auth/recovery" className="tw-w-1/2 tw-max-w-80">
                    <Button className="tw-w-full">Восстановить пароль</Button>
                </Link>
            </div>
        </>
    );
};

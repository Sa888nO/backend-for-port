import { IdcardOutlined, LockOutlined, MailOutlined } from '@ant-design/icons';
import { useMutation, useQuery } from '@tanstack/react-query';
import { Button, Form, Input, notification, Switch } from 'antd';
import { useForm, useWatch } from 'antd/es/form/Form';
import { useUpdateUser, useUser } from '../api/user';
import { useEffect } from 'react';
// import { UpdateUserApi, iCreateUser } from '../api/updateUser';
import Cookies from 'universal-cookie';
import { jwtDecode } from 'jwt-decode';
import { Loading } from '../common/Loading';

type FormValues = { email: string; password: string; role: string; name?: string; surname?: string; is_verified?: boolean };
type Token = {
    exp: number;
    iat: number;
    role: 'admin' | 'client';
    user_id: number;
};

const cookies = new Cookies();

export const Profile = () => {
    const { user_id } = jwtDecode(cookies.get('token')) as Token;
    console.log(user_id);
    const { data, isLoading, refetch } = useUser(user_id, {
        enabled: !!user_id,
    });
    console.log(user_id);
    if (!user_id) return null;
    const [form] = useForm();
    const [api, contextHolder] = notification.useNotification();
    const role = useWatch('role', form);
    const { mutate, isPending } = useUpdateUser();
    const onFinish = (props: FormValues) => {
        mutate(
            props.role === 'admin'
                ? { id: user_id, email: props.email, password: props.password, role: data!.role }
                : { id: user_id, ...props, is_verified: !props.is_verified, role: data!.role },
            {
                onSuccess: () => {
                    refetch();
                    api.success({ message: 'Информация обновлена', duration: 10, placement: 'bottomRight' });
                },
            },
        );
    };

    useEffect(() => {
        if (data) form.setFieldsValue({ ...data, is_verified: !data.is_verified });
    }, [data]);

    if (isLoading) return <Loading title="Загружаем пользователя" />;

    if (!data) return null;

    return (
        <>
            {contextHolder}
            <div className="tw-flex tw-justify-center tw-items-center">
                <Form form={form} onFinish={onFinish} layout="vertical" variant="outlined" className="tw-w-1/2 tw-max-w-80">
                    <Form.Item label="Email" name="email" required rules={[{ required: true, message: 'Email не может быть пустым' }]}>
                        <Input prefix={<MailOutlined className="tw-mr-1.5" />} placeholder="Введите ваш email"></Input>
                    </Form.Item>
                    <Form.Item label="Пароль" name="password" required rules={[{ required: true, message: 'Пароль не может быть пустым' }]}>
                        <Input.Password prefix={<LockOutlined className="tw-mr-1.5" />} placeholder="Введите ваш пароль" />
                    </Form.Item>
                    <Form.Item
                        label="Подтвердите пароль"
                        name="confirm"
                        dependencies={['password']}
                        rules={[
                            {
                                required: true,
                                message: 'Пожалуйста, подтвердите пароль',
                            },
                            ({ getFieldValue }) => ({
                                validator(_, value) {
                                    if (!value || getFieldValue('password') === value) {
                                        return Promise.resolve();
                                    }
                                    return Promise.reject(new Error('Пароли не совпадают!'));
                                },
                            }),
                        ]}
                    >
                        <Input.Password prefix={<LockOutlined className="tw-mr-1.5" />} placeholder="Повторите ваш пароль" />
                    </Form.Item>
                    {data.role === 'client' ? (
                        <>
                            <Form.Item label="Имя" name="name" required rules={[{ required: true, message: 'Имя не может быть пустым' }]}>
                                <Input prefix={<IdcardOutlined className="tw-mr-1.5" />} placeholder="Введите ваше имя"></Input>
                            </Form.Item>
                            <Form.Item label="Фамилия" name="surname" required rules={[{ required: true, message: 'Фамилия не может быть пустой' }]}>
                                <Input prefix={<IdcardOutlined className="tw-mr-1.5" />} placeholder="Введите вашу фамилию" />
                            </Form.Item>
                            <Form.Item label="Нужно ли подтверждение по почте?" name="is_verified">
                                <Switch />
                            </Form.Item>
                        </>
                    ) : null}
                    <Button loading={isPending} htmlType="submit" className="tw-w-full" type="primary">
                        Обновить информацию
                    </Button>
                </Form>
            </div>
        </>
    );
};

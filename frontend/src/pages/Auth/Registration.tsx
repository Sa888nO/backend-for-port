import { IdcardOutlined, LockOutlined, MailOutlined } from '@ant-design/icons';
import { useMutation } from '@tanstack/react-query';
import { Button, Form, Input, notification } from 'antd';
// import { RegistrationApi, iRegistration } from '../../api/registration';
import { Link } from 'react-router-dom';
import { AxiosError } from 'axios';
import { useForm } from 'antd/es/form/Form';
import { useRegistration } from '../../api/auth';

type FormValues = {
    name: string;
    surname: string;
    email: string;
    password: string;
    confirm: string;
};

export const Registration = () => {
    const [api, contextHolder] = notification.useNotification();
    const [form] = useForm();
    const { isPending, mutate } = useRegistration();
    const onFinish = ({ email, name, surname, password }: FormValues) =>
        mutate(
            { email, name, surname, password },
            {
                onError: (error) => {
                    const ErrorMessage = (error as AxiosError<{ message: string }>)?.response?.data?.message;
                    api.error({ message: ErrorMessage || 'При регистрации произошла ошибка', duration: 10, placement: 'bottomRight' });
                },
                onSuccess: (answer) => {
                    api.success({ message: answer.data.message, duration: 10, placement: 'bottomRight' });
                    form.resetFields();
                },
            },
        );
    return (
        <>
            {contextHolder}
            <div className="tw-flex tw-w-full tw-justify-center tw-items-center tw-flex-col tw-gap-5">
                <h1 className="tw-text-xl tw-font-bold tw-text-center">Оформление пропусков в порт</h1>
                <Form form={form} onFinish={onFinish} layout="vertical" variant="outlined" className="tw-w-1/2 tw-max-w-80">
                    <Form.Item label="Имя" name="name" required rules={[{ required: true, message: 'Имя не может быть пустым' }]}>
                        <Input prefix={<IdcardOutlined className="tw-mr-1.5" />} placeholder="Введите ваше имя"></Input>
                    </Form.Item>
                    <Form.Item label="Фамилия" name="surname" required rules={[{ required: true, message: 'Фамилия не может быть пустой' }]}>
                        <Input prefix={<IdcardOutlined className="tw-mr-1.5" />} placeholder="Введите вашу фамилию"></Input>
                    </Form.Item>
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
                    <Button loading={isPending} htmlType="submit" className="tw-w-full" type="primary">
                        Зарегистрироваться
                    </Button>
                </Form>
                <Link to="/auth/login" className="tw-w-1/2 tw-max-w-80">
                    <Button className="tw-w-full">У меня уже есть аккаунт</Button>
                </Link>
                <Link to="/auth/recovery" className="tw-w-1/2 tw-max-w-80">
                    <Button className="tw-w-full">Восстановить пароль</Button>
                </Link>
            </div>
        </>
    );
};

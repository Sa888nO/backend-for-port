import { IdcardOutlined, LeftOutlined, LockOutlined, MailOutlined } from '@ant-design/icons';
import { useMutation } from '@tanstack/react-query';
import { Button, Form, Input, Select, Switch } from 'antd';
import { useForm, useWatch } from 'antd/es/form/Form';
import { Link, useNavigate } from 'react-router-dom';
import { useCreateUser } from '../../api/user';

type FormValues = { email: string; password: string; role: 'admin' | 'client'; name?: string; surname?: string; is_verified?: boolean };

export const CreateUser = () => {
    const [form] = useForm();
    const role = useWatch('role', form);
    const navigate = useNavigate();
    const { mutate, isPending } = useCreateUser();
    const onFinish = (props: FormValues) => {
        mutate(
            props.role === 'admin'
                ? { email: props.email, password: props.password, role: props.role }
                : { ...props, is_verified: !props.is_verified },
            {
                onSuccess: () => navigate('/lk/users'),
            },
        );
    };
    return (
        <div className="tw-flex tw-flex-col tw-gap-2">
            <div>
                <Link to={'/lk/users'}>
                    <Button>
                        <LeftOutlined />
                        Назад
                    </Button>
                </Link>
            </div>
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
                    <Form.Item label="Роль" name="role" required initialValue={'admin'}>
                        <Select
                            placeholder="Выберите роль"
                            options={[
                                { label: 'Администратор', value: 'admin' },
                                { label: 'Клиент', value: 'client' },
                            ]}
                        />
                    </Form.Item>
                    {role === 'client' ? (
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
                        Создать
                    </Button>
                </Form>
            </div>
        </div>
    );
};

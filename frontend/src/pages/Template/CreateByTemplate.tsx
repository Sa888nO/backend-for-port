import { useMutation, useQuery } from '@tanstack/react-query';
import { Link, useParams } from 'react-router-dom';
import { TemplateApi } from '../../api/Template';
import { Button, Form, Input, Spin } from 'antd';
import { LeftOutlined } from '@ant-design/icons';
import { createByTemplateApi } from '../../api/createByTemplate';

export const CreateByTemplate = () => {
    const { id } = useParams();
    const { data, isLoading } = useQuery({
        queryKey: ['template'],
        queryFn: () => TemplateApi(String(id)),
        staleTime: 0,
        enabled: !!id,
    });
    const [form] = Form.useForm();
    const { mutate, isPending } = useMutation({
        mutationFn: (props: any) => createByTemplateApi(props),
    });
    if (isLoading)
        return (
            <div className="tw-flex tw-items-center tw-justify-center tw-h-full tw-flex-1 tw-flex-col tw-gap-4">
                <Spin></Spin>
                <span>Загружаем шаблон</span>
            </div>
        );

    if (!data) return null;
    console.log(id);
    console.log(data);
    const onFinish = (values: any) => {
        const keys = Object.keys(values);
        const obj: any = {};
        keys.map((key) => {
            obj[`"${key}"`] = values[key];
        });
        mutate({
            id: Number(id),
            schema: values,
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
            <div className="tw-flex tw-justify-center tw-items-center tw-flex-col tw-gap-2">
                <h1 className="tw-font-bold">{`Создание документа по шаблону: "${data.data.template.name}"`}</h1>
                <Form form={form} onFinish={onFinish} layout="vertical" variant="outlined" className="tw-w-1/2 tw-max-w-80">
                    {Object.keys(data.data.template.schema).map((key) => (
                        <Form.Item name={key} label={key}>
                            <Input></Input>
                        </Form.Item>
                    ))}
                    <Button loading={isPending} htmlType="submit" className="tw-w-full" type="primary">
                        Создать Документ по шаблону
                    </Button>
                </Form>
            </div>
        </div>
    );
};

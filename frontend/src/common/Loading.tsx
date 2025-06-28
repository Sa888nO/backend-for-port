import { Spin } from 'antd';

export const Loading = ({ title }: { title: string }) => {
    return (
        <div className="tw-flex tw-items-center tw-justify-center tw-h-full tw-flex-1 tw-flex-col tw-gap-4">
            <Spin></Spin>
            <span>{title}</span>
        </div>
    );
};

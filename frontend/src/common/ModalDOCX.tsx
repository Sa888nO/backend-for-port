import { Modal, ModalProps } from 'antd';

type ModalDOCXProps = {
    modalProps: ModalProps;
    pathToFile: string;
    title: string;
};

export const ModalDOCX = ({ pathToFile, title, modalProps }: ModalDOCXProps) => {
    const height = window.innerHeight * 0.85;
    console.log(height);
    return (
        <Modal
            title={title}
            destroyOnHidden
            centered
            footer={null}
            {...modalProps}
            styles={{
                body: {
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                },
            }}
        >
            <iframe
                height={height - 80}
                src={`https://docs.google.com/gview?url=http://5.35.98.185:4444/${pathToFile}&embedded=true`}
                width="90%"
            ></iframe>
        </Modal>
    );
};

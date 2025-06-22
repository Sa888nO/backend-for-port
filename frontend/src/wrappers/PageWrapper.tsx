import { Outlet } from 'react-router-dom';

export const PageWrapper = () => {
    return (
        <div>
            <div>HEADER</div>
            <Outlet />
        </div>
    );
};

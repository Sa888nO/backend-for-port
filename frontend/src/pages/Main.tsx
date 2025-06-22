import { Button } from 'antd';
import { useNavigate } from 'react-router-dom';
import Cookies from 'universal-cookie';

const cookies = new Cookies();

export const Main = () => {
    const navigate = useNavigate();
    return (
        <div className="main">
            <h1>Main Page</h1>
            <Button
                onClick={() => {
                    cookies.remove('token', { path: '/' });
                    navigate('/');
                }}
            >
                Выйти
            </Button>
        </div>
    );
};

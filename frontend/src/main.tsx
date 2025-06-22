import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router';
import { ConfigProvider } from 'antd';
import { Login, Registration } from './pages';
import './index.css';
import { IsNotAuthWrapper } from './wrappers/IsNotAuthWrapper';
import { Main } from './pages/Main';
import { IsAuthWrapper } from './wrappers/IsAuthWrapper';
import { PageWrapper } from './wrappers/PageWrapper';

const queryClient = new QueryClient();

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <ConfigProvider>
            <QueryClientProvider client={queryClient}>
                <BrowserRouter>
                    <Routes>
                        <Route path="/" element={<Navigate to="auth" />} />
                        <Route path="auth" element={<IsNotAuthWrapper />}>
                            <Route index element={<Navigate to="login" />} />
                            <Route path="login" element={<Login />} />
                            <Route path="registration" element={<Registration />} />
                        </Route>
                        <Route path="lk" element={<IsAuthWrapper />}>
                            <Route element={<PageWrapper />}>
                                <Route index element={<Navigate to="main" />} />
                                <Route path="main" element={<Main />} />
                            </Route>
                        </Route>
                    </Routes>
                </BrowserRouter>
            </QueryClientProvider>
        </ConfigProvider>
    </StrictMode>,
);

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router';
import { ConfigProvider } from 'antd';
import { Login, Profile, Registration } from './pages';
import './index.css';
import { IsNotAuthWrapper } from './wrappers/IsNotAuthWrapper';
import { Main } from './pages/Main';
import { IsAuthWrapper } from './wrappers/IsAuthWrapper';
import { PageWrapper } from './wrappers/PageWrapper';
import { UserProvider } from './contexts/UserContext';
import { GetCurrentUser } from './wrappers/GetCurrentUser';
import { Requests } from './pages/Request/Requests';
import { EditRequests } from './pages/Request/EditRequest';
import { CreateRequests } from './pages/Request/CreateRequest';
import { Users } from './pages/User/Users';

const queryClient = new QueryClient();

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <ConfigProvider>
            <QueryClientProvider client={queryClient}>
                <UserProvider>
                    <BrowserRouter>
                        <Routes>
                            <Route path="/" element={<Navigate to="auth" />} />
                            <Route path="auth" element={<IsNotAuthWrapper />}>
                                <Route index element={<Navigate to="login" />} />
                                <Route path="login" element={<Login />} />
                                <Route path="registration" element={<Registration />} />
                            </Route>
                            <Route path="lk" element={<IsAuthWrapper />}>
                                <Route element={<GetCurrentUser />}>
                                    <Route element={<PageWrapper />}>
                                        <Route index element={<Navigate to="main" />} />
                                        <Route path="main" element={<Main />} />
                                        <Route path="profile" element={<Profile />} />
                                        <Route path="requests">
                                            <Route index element={<Requests />} />
                                            <Route path=":id" element={<EditRequests />} />
                                            <Route path="new" element={<CreateRequests />} />
                                        </Route>
                                        <Route path="users">
                                            <Route index element={<Users />} />
                                            {/* <Route path=":id" element={<Edit />} /> */}
                                            {/* <Route path="new" element={<CreateUser />} /> */}
                                        </Route>
                                    </Route>
                                </Route>
                            </Route>
                        </Routes>
                    </BrowserRouter>
                </UserProvider>
            </QueryClientProvider>
        </ConfigProvider>
    </StrictMode>,
);

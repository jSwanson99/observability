'use client'

import Image from 'next/image';
import { useCallback, useState } from 'react';
import axios from 'axios';
import axiosInstance, { AxiosContext } from './utils/axiosSingleton';

interface LoginData {
    userName: string;
    password: string;
}

const useLoginForm = () => {
    const [loginData, _setLoginData] = useState<LoginData>({
        userName: '',
        password: ''
    });

    const setLoginData = useCallback((key: string, value: string) => {
        _setLoginData(prevState => ({
            ...prevState,
            [key]: value
        }))
    }, []);

    return { loginData, setLoginData };
}
export default function Home() {
    const { loginData, setLoginData } = useLoginForm();

    return (
        <AxiosContext.Provider value={axiosInstance}>
            <main className="flex min-h-screen flex-col items-center justify-between p-24">
                <div className="z-10 w-full max-w-5xl items-center justify-between font-mono text-sm lg:flex">
                    <p className="fixed left-0 top-0 flex w-full justify-center border-b border-gray-300 bg-gradient-to-b from-zinc-200 pb-6 pt-8 backdrop-blur-2xl dark:border-neutral-800 dark:bg-zinc-800/30 dark:from-inherit lg:static lg:w-auto  lg:rounded-xl lg:border lg:bg-gray-200 lg:p-4 lg:dark:bg-zinc-800/30">
                        Get started by editing&nbsp;
                        <code className="font-mono font-bold">app/page.tsx</code>
                    </p>
                </div>
                <div>
                    <form>
                        <input type="text" value={loginData.userName} onChange={(e) => setLoginData('userName', e.target.value)}/>
                        <input type="password" value={loginData.password} onChange={(e) => setLoginData('password', e.target.value)}/>
                    </form>
                    <button onClick={() => console.log(loginData)}>Login</button>
                </div>
            </main>
        </AxiosContext.Provider>
    );
}

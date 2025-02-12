import { useCallback, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { FloatLabel } from 'primereact/floatlabel';
// import transparentLogo from '../../assets/logo.png';
import { ProgressSpinner } from "primereact/progressspinner";


export const LoginPage = () => {
    const navigate = useNavigate();

    const [username, setUsername] = useState<string>('');
    const [password, setPassword] = useState<string>('');

    const [usernameError, setUsernameError] = useState<string>();
    const [passwordError, setPasswordError] = useState<string>();

    const [loginInProgress, setLoginInProgress] = useState(false);

    const [showPassword, setShowPassword] = useState(false);

    const handleClickShowPassword = (event: any) => {
        event.preventDefault();
        setShowPassword((show) => !show);
    }

    const handleSubmit = useCallback(async (e?: any) => {
        e?.preventDefault();
        if (loginInProgress) {
            return;
        }
        setLoginInProgress(true);
        let hasError = false;
        if (!username || username.trim() == '') {
            setUsernameError('Digite seu nome de usuário');
            hasError = true;
        } else {
            setUsernameError(undefined);
        }
        if (!password || password.trim() == '') {
            setPasswordError("Digite sua senha");
            hasError = true;
        } else {
            setPasswordError(undefined);
        }

        if (!hasError) {
            try {
                const response = await axios.post(
                    `${import.meta.env.VITE_API_URL}/login`,
                    {
                        username: username,
                        password: password,
                    }
                )
                if (response.status == 200) {
                    const token = response.data;
                    window.localStorage.setItem('token', token);
                    navigate('/report/occupation');
                } else {
                    window.alert('Usuário ou senha inválidos')
                }
            } catch {
                window.alert('Usuário ou senha inválidos')
            }
        }
        setLoginInProgress(false);
    }, [username, password]);

    const handlePasswordKeyUp = (event: any) => {
        if (event.keyCode == 13) {
            event.preventDefault();
            event.stopPropagation();
            handleSubmit();
        };
    }

    const handleLoginKeyUp = (event: any) => {
        if (event.keyCode == 13) {
            event.preventDefault();
            event.stopPropagation();
            (document.querySelector('#senha') as HTMLElement)?.focus();
        };
    }

    return (
        <section className="login-page flex flex-column align-items-center">
            {/* <img className="mb-5" width="230" src={transparentLogo} alt="" /> */}
            <div onSubmit={handleSubmit}>
                <div className="login-box flex flex-column justify-content-center align-items-center">
                    <div className="field card">
                        <FloatLabel>
                            <label htmlFor="username">Login</label>
                            <InputText
                                tabIndex={1}
                                id="username"
                                className={"username"}
                                invalid={!!usernameError && usernameError.trim() != ''}
                                value={username}                                
                                onKeyUp={handleLoginKeyUp}
                                onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                                    setUsername(event.target.value);
                                }}
                            />
                        </FloatLabel>
                        <small className="p-error">{usernameError}</small>
                    </div>
                    <div className="field">
                        <div className="login-password-wrapper">
                            <FloatLabel>
                                <label htmlFor="senha">Senha</label>
                                <InputText
                                    tabIndex={2}
                                    id="senha"
                                    className={"password"}
                                    invalid={!!passwordError && passwordError.trim() != ''}
                                    type={showPassword ? "text" : "password"}
                                    value={password}
                                    onKeyUp={handlePasswordKeyUp}
                                    onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                                        setPassword(event.target.value);
                                    }}
                                />
                            </FloatLabel>
                            <Button text className="p-2" onClick={handleClickShowPassword} tabIndex={3} >
                                <i className={"pi pi-eye" + (showPassword ? "-slash" : "")} ></i>
                            </Button>
                        </div>
                        <small className="p-error">{passwordError}</small>
                    </div>
                    <Button className="login-button align-self-end" onClick={handleSubmit} label={!loginInProgress ? "Entrar" : ''}>
                        {
                            loginInProgress && <ProgressSpinner />
                        }
                    </Button>
                </div>
            </div>
        </section>
    );
}
import {Title} from "../components/layout/typography";
import {useForm} from "react-hook-form";
import {StyledErrorMessage, TextInput} from "../components/text-input/input-field";
import {useContext, useState} from "react";
import {useNavigate} from "react-router-dom";
import {EMAIL_ERROR, EMAIL_PATTERN, REQUIRED_FIELD_ERROR} from "../constants";
import LoginContext from "../login-context";

interface LoginData {
    mail: string;
    password: string;
}


export const Login = () => {
    const [apiError, setApiError] = useState<string>('')
    const {setIsLoggedIn} = useContext(LoginContext)
    let navigate = useNavigate()
    const {
        handleSubmit,
        control
    } = useForm<LoginData>({
        mode: 'onSubmit',
    });

    const onSubmit = async ({mail, password}: LoginData) => {
        fetch('http://localhost:3000/login', {
            method: 'GET',
            headers: {
                'authorization': mail + ' ' + password,

            }
        })
            .then(response => {
                if (response.ok) {
                    setApiError("")
                    return response.text()
                }
                setApiError("API Error")
                return response.text().then(response => {throw new Error(response)})
            })
            .then((token) => {
                localStorage.setItem('meme-token', token)
                setIsLoggedIn(true)
                navigate('/')
            })
            .catch(err => {
               setApiError(err.message)
            })
    }

    return (
        <>
            <Title>Log In</Title>
            <form name="login" onSubmit={handleSubmit(onSubmit)}>
                <TextInput name={'mail'} type={'text'} control={control} label={"E-Mail"} rules={{
                    required: REQUIRED_FIELD_ERROR,
                    pattern: {value: EMAIL_PATTERN, message: EMAIL_ERROR}
                }}/>
                <TextInput name={'password'} type={'password'} control={control} label={"Password"}
                           rules={{required: REQUIRED_FIELD_ERROR}}/>
                <input type="submit"/>
                {apiError && <StyledErrorMessage>{apiError}</StyledErrorMessage>}
            </form>
        </>
    )
}
import {Title} from "../components/layout/typography";
import {useForm} from "react-hook-form";
import {StyledErrorMessage, TextInput} from "../components/text-input/input-field";
import {useState} from "react";
import {useNavigate} from "react-router-dom";
import {EMAIL_ERROR, EMAIL_PATTERN, REQUIRED_FIELD_ERROR} from "../constants";

interface SignUpData {
    fullName: string;
    email: string;
    username: string;
    password: string;
}

export const SignUp = () => {
    const [apiError, setApiError] = useState<string>('')
    let navigate = useNavigate()
    const {
        handleSubmit,
        control
    } = useForm<SignUpData>({
        mode: 'onSubmit',
    });

    const onSubmit = async ({fullName, email, username, password}: SignUpData) => {

        fetch('http://localhost:3000/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({fullName, email, username, password})
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
                navigate('/')
            })
            .catch(err => {
                setApiError(err.message)
            })
    }

    return (
        <>
            <Title>Sign Up</Title>
            <form name="sign-up" onSubmit={handleSubmit(onSubmit)}>
                <TextInput name={'fullName'} type={'text'} control={control} label={"Full Name"}
                           rules={{required: REQUIRED_FIELD_ERROR}}/>
                <TextInput name={'username'} type={'text'} control={control} label={"User Name"}
                           rules={{required: REQUIRED_FIELD_ERROR}}/>
                <TextInput name={'email'} type={'text'} control={control} label={"E-Mail"} rules={{
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


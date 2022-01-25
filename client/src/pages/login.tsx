import {Title} from "../components/layout/typography";
import {useForm} from "react-hook-form";
import {TextInput} from "../components/text-input/input-field";

const REQUIRED_FIELD_ERROR = "This is a required field"
const EMAIL_ERROR = "Something is wrong with your mail"
const EMAIL_PATTERN = /.+@.+\..+/;

interface LoginData {
    mail: string;
    password: string;
}


export const Login = () => {
    const {
        handleSubmit,
        control
    } = useForm<LoginData>({
        mode: 'onSubmit',
    });

    const onSubmit = async ({mail, password}: LoginData) => {
        //todo
        const response = await fetch('http://localhost:3000/login')
    }

    return (
        <>
            <Title>Log In</Title>
            <form name="contact" onSubmit={handleSubmit(onSubmit)}>
                <TextInput name={'mail'} type={'text'} control={control} label={"E-Mail"} rules={{
                    required: REQUIRED_FIELD_ERROR,
                    pattern: {value: EMAIL_PATTERN, message: EMAIL_ERROR}
                }}/>
                <TextInput name={'password'} type={'password'} control={control} label={"Password"}
                           rules={{required: REQUIRED_FIELD_ERROR}}/>
                <input type="submit"/>
            </form>
        </>
    )
}
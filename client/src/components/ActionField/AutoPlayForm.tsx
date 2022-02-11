import {TextInput} from "../text-input/input-field";
import {StyledButton} from "../../pages/editor";
import {useForm} from "react-hook-form";

interface memeSingle {
    memeId: string,
    autoplay: boolean,
    gap: number,
    currentAddress: string,
    next: Function,
}

export const AutoPlayForm = ({memeId, currentAddress, autoplay, gap, next}: memeSingle) => {
    const {
        handleSubmit,
        control
    } = useForm<memeSingle>({
        mode: 'onSubmit',
    });

    const useAutoplay = () => {

    }

    return (
        <>
            <form name="autoplay" onSubmit={handleSubmit(useAutoplay)}>
                <TextInput name={'gap'} type={'text'} label={'gap between switches in' +
                ' seconds'} control={control}/>
                <StyledButton>Autoplay</StyledButton>
                <input type="submit"/>
            </form>
        </>
    )
}
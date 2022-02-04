import BaseImageEditor from "@toast-ui/react-image-editor";
import './editor.css'


export const imageDataBase64 = "data:image/png;base64,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"

interface ImageEditorProps {
    editorRef: any,
    base64String?: string
}

export const ImageEditor = ({editorRef, base64String}: ImageEditorProps) => {
    return (
        <>
            {base64String ?
                <>
                <BaseImageEditor
                    includeUI={{
                        menu: ['text', 'filter'],
                        menuBarPosition: 'bottom',
                        initMenu: "",
                        loadImage: {
                            path: base64String,
                            name: 'Your Base64 image'
                        }
                    }}
                    usageStatistics={false}
                    //@ts-ignore
                    ref={editorRef}
                />
                </>
                :
                <BaseImageEditor
                    includeUI={{
                        menu: ['text', 'filter'],
                        menuBarPosition: 'bottom',
                        initMenu: "",
                    }}
                    usageStatistics={false}
                    //@ts-ignore
                    ref={editorRef}
                />
            }
        </>
    )
}
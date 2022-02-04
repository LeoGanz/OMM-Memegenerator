import BaseImageEditor from "@toast-ui/react-image-editor";
import './editor.css'


interface ImageEditorProps {
    editorRef: any,
    base64String?: string,
    drawModeActive: boolean
}

export const ImageEditor = ({editorRef, base64String, drawModeActive}: ImageEditorProps) => {
    return (
        <>
            {base64String ?
                <>
                <BaseImageEditor
                    includeUI={{
                        menu: ['text', 'filter', drawModeActive ? 'draw' : ''],
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
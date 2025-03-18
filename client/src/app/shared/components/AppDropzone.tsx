import {
    FieldValues,
    useController,
    UseControllerProps,
} from "react-hook-form";
import { useDropzone } from "react-dropzone";
import { useCallback } from "react";
import { FormControl, FormHelperText, Typography } from "@mui/material";
import { UploadFile } from "@mui/icons-material";

type Props<T extends FieldValues> = {
    name: keyof T;
} & UseControllerProps<T>; // có thể truyền nhiều props cho input

export default function AppDropzone<T extends FieldValues>(props: Props<T>) {
    const { fieldState, field } = useController({ ...props });

    const onDrop = useCallback(
        (acceptedFiles: File[]) => {
            if (acceptedFiles.length > 0) {
                const fileWithPreview = Object.assign(acceptedFiles[0], {
                    preview: URL.createObjectURL(acceptedFiles[0]),
                });

                field.onChange(fileWithPreview);
            }
        },
        [field]
    ); // thiết lập file tạm thời và tạo url tạm thời cho file, onDrop sẽ được gọi khi có file đc thả vao

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
    });

    const dzStyles = {
        display: "flex",
        border: "dashed 2px #eee",
        borderColor: "#eee",
        borderRadius: "5px",
        paddingTop: "30px",
        alignItems: "center",
        height: 200,
        width: 500,
    };

    const dzActive = {
        borderColor: "green",
    };

    return (
        <div {...getRootProps()}>
            <FormControl
                style={isDragActive ? { ...dzStyles, ...dzActive } : dzStyles}
                error={!!fieldState.error}
            >
                <input {...getInputProps()} />
                <UploadFile sx={{ fontSize: "100px" }} />
                <Typography variant="h4">Kéo thả ảnh</Typography>
                <FormHelperText>{fieldState.error?.message}</FormHelperText>
            </FormControl>
        </div>
    );
}

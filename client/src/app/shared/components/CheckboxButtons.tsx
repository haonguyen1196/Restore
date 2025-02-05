import { FormGroup, FormControlLabel, Checkbox } from "@mui/material";
import { useEffect, useState } from "react";

type Props = {
    items: string[];
    checked: string[];
    onChange: (items: string[]) => void;
};

export default function CheckboxButtons({ items, checked, onChange }: Props) {
    const [checkedItems, setCheckedItems] = useState(checked);

    useEffect(() => {
        setCheckedItems(checked);
    }, [checked]);

    const handleToggle = (value: string) => {
        const updatedChecked = checkedItems?.includes(value)
            ? checkedItems?.filter((item) => item !== value) // loại bỏ item khỏi mảng nếu đang check
            : [...checkedItems, value]; // thêm item vào mảng nếu đang không check

        setCheckedItems(updatedChecked);

        onChange(updatedChecked);
    };
    return (
        <FormGroup>
            {items.map((item) => (
                <FormControlLabel
                    key={item}
                    label={item}
                    control={
                        <Checkbox
                            checked={checkedItems.includes(item)}
                            onClick={() => handleToggle(item)}
                            color="secondary"
                            sx={{ py: 0.7, fontSize: 40 }}
                        />
                    }
                />
            ))}
        </FormGroup>
    );
}

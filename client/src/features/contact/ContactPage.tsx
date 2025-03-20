// import { decrement, increment } from "./counterReducer";
// import { Button, ButtonGroup, Typography } from "@mui/material";
// import { useAppDispatch, useAppSelector } from "../../app/store/store";

import { Typography } from "@mui/material";

// export default function ContactPage() {
//     const { data } = useAppSelector((state) => state.counter);
//     const dispatch = useAppDispatch();

//     return (
//         <>
//             <Typography variant="h2">Contact page</Typography>
//             <Typography variant="body1">The data is: {data}</Typography>
//             <ButtonGroup>
//                 <Button onClick={() => dispatch(decrement(1))} color="error">
//                     Decrement
//                 </Button>
//                 <Button
//                     onClick={() => dispatch(increment(1))}
//                     color="secondary"
//                 >
//                     Increment
//                 </Button>
//                 <Button onClick={() => dispatch(increment(5))} color="primary">
//                     Increment 5
//                 </Button>
//             </ButtonGroup>
//         </>
//     );
// }
export default function ContactPage() {
    return <Typography variant="h4">Liên hệ</Typography>;
}

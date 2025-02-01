import {
    Button,
    Card,
    CardActions,
    CardContent,
    CardMedia,
    Typography,
} from "@mui/material";

import { Product } from "../../app/models/product";
import { Link } from "react-router-dom";
import { useAddBasketItemMutation } from "../basket/basketApi";
import { currencyFormat } from "../../lib/util";

type Props = {
    product: Product;
};

export default function ProductCard({ product }: Props) {
    const [addBasketItem] = useAddBasketItemMutation();
    return (
        <Card
            elevation={3}
            sx={{
                width: 280,
                borderRadius: 2,
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
            }}
        >
            <CardMedia
                sx={{ height: 240, backgroundSize: "cover" }}
                image={product.pictureUrl}
                title={product.name}
            />
            <CardContent>
                <Typography
                    gutterBottom
                    variant="subtitle2"
                    sx={{ textTransform: "uppercase" }}
                >
                    {product.name}
                </Typography>
                <Typography variant="h6" sx={{ color: "secondary.main" }}>
                    {currencyFormat(product.price)}
                </Typography>
            </CardContent>
            <CardActions sx={{ justifyContent: "space-between" }}>
                <Button onClick={() => addBasketItem({ product, quantity: 1 })}>
                    Thêm vào giỏ hàng
                </Button>
                <Button component={Link} to={`/catalog/${product.id}`}>
                    Chi tiết
                </Button>
            </CardActions>
        </Card>
    );
}

import { Product } from "./product";

export type Basket = {
    basketId: string;
    items: Item[];
    clientSecret?: string;
    paymentIntentId?: string;
};

export class Item {
    constructor(product: Product, quantity: number) {
        this.productId = product.id;
        this.name = product.name;
        this.price = product.price;
        this.pictureUrl = product.pictureUrl;
        this.brand = product.brand;
        this.type = product.type;
        this.quantity = quantity;
    } // khi khỏi tạo class này và truyền đối tượng product và quantity thì output sẽ là object chứa các cặp key value được định nghĩa bên trong

    productId: number;
    name: string;
    price: number;
    pictureUrl: string;
    brand: string;
    type: string;
    quantity: number;
}

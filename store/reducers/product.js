
import Product from "../../models/product";
import {
    DELETE_PRODUCT,
    CREATE_PRODUCT,
    UPDATE_PRODUCT,
    SET_PRODUCTS,
    UPLOAD_IMAGES,
    UPLOAD_IMAGES_SUCCESS
} from "../actions/products";

const initialState = {
    availableProducts: [],
    userProducts: [],
    uploadedImage: null
};
export default (state = initialState, action) => {
    switch (action.type) {
        case SET_PRODUCTS:
            return {
                availableProducts: action.products,
                userProducts: action.userProducts
            }
        case CREATE_PRODUCT:
            const newProduct = new Product(
                action.productData.id,
                action.productData.ownerId,
                action.productData.title,
                action.productData.imageUrl,
                action.productData.description,
                action.productData.price
            );
            return {
                ...state,
                availableProducts: state.availableProducts.concat(newProduct),
                userProducts: state.userProducts.concat(newProduct)
            };
        case UPDATE_PRODUCT:
            const productIndex = state.userProducts.findIndex(
                prod => prod.id === action.pid
            );
            const updatedProduct = new Product(
                action.pid,
                state.userProducts[productIndex].ownerId,
                action.productData.title,
                action.productData.imageUrl,
                action.productData.description,
                action.productData.price
            );
            const updatedUserProducts = [...state.userProducts];
            updatedUserProducts[productIndex] = updatedProduct;
            const availableProductIndex = state.availableProducts.findIndex(
                prod => prod.id === action.pid
            );
            const updatedAvialableProducts = [...state.availableProducts];
            updatedAvialableProducts[availableProductIndex] = updatedProduct;
            return {
                ...state,
                availableProducts: updatedAvialableProducts,
                userProducts: updatedUserProducts
            }

        case DELETE_PRODUCT:
            return {
                ...state,
                userProducts: state.userProducts.filter(
                    product => product.id !== action.pid
                ),
                availableProducts: state.availableProducts.filter(
                    product => product.id !== action.pid
                )
            };
        case UPLOAD_IMAGES:
            return {
                ...state,
                uploadedImage: null
            }
        case UPLOAD_IMAGES_SUCCESS:
            return {
                ...state,
                uploadedImage: action.payload
            }
        default:
            return state
    }

};
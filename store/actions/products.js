import Product from "../../models/product";
import storage from "../../constants/Firebase";
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'
export const DELETE_PRODUCT = 'DELETE_PRODUCT';
export const CREATE_PRODUCT = 'CREATE_PRODUCT';
export const UPDATE_PRODUCT = 'UPDATE_PRODUCT';
export const UPLOAD_IMAGES = 'UPLOAD_IMAGES';
export const UPLOAD_IMAGES_SUCCESS = 'UPLOAD_IMAGES_SUCCESS';
export const SET_PRODUCTS = 'SET_PRODUCTS';



export const fetchProducts = () => {
    return async (dispatch, getState) => {
        const userId = getState().authentication.userId;
        console.log(userId);
        //istediğimiz async kodu redux thunk sayesinde bu fonksiyona yazabiliriz.
        try {
            const response = await fetch(
                'https://shopapp-a1d8f-default-rtdb.firebaseio.com/products.json'
            );

            if (!response.ok) {
                throw new Error('Ürünler bulunamadı!')
            }

            const resData = await response.json();
            const loadedProducts = []
            for (const key in resData) {
                loadedProducts.push(
                    new Product(
                        key,
                        resData[key].ownerId,
                        resData[key].title,
                        resData[key].imageUrl,
                        resData[key].description,
                        resData[key].price,
                    )
                )
            }
            dispatch({
                type: SET_PRODUCTS,
                products: loadedProducts,
                userProducts: loadedProducts.filter(prod => prod.ownerId === userId)
            });
        } catch (error) {
            throw error;
        }

    }

}


export const deleteProduct = productId => {
    return async (dispatch, getState) => {
        const token = getState().authentication.token;
        const response = await fetch(`https://shopapp-a1d8f-default-rtdb.firebaseio.com/products/${productId}.json?auth=${token}`, {
            method: 'DELETE'
        })
        if (!response.ok) {
            throw new Error('Ürün silinemiyor.')
        }
        dispatch({
            type: DELETE_PRODUCT, pid: productId,
        });
    }

};
export const uploadProductImage = (uri) => {
    return async (dispatch, getState) => {
        dispatch({ type: UPLOAD_IMAGES })
        try {
            const userId = getState().authentication.userId;
            const response = await fetch(uri);
            const blob = await response.blob();
            const tempId = new Date().toString();
            const imageRef = ref(storage, `user-images/${userId}/${tempId}`)
            uploadBytes(imageRef, blob).then((snapshot) => {
                console.log('Image has been uploaded');
                getDownloadURL(imageRef)
                    .then((url) => {
                        dispatch({
                            type: UPLOAD_IMAGES_SUCCESS,
                            payload: url
                        })
                        console.log(url)
                    })
            });

        } catch (err) {
            throw new Error(err.message);
        }
    }
}
export const clearUploadedImage = () => {
    return async (dispatch) => {
        dispatch({ type: UPLOAD_IMAGES })
    }
}

export const createProduct = (title, description, imageUrl, price) => {
    return async (dispatch, getState) => {
        const token = getState().authentication.token;
        const userId = getState().authentication.userId;
        //istediğimiz async kodu redux thunk sayesinde bu fonksiyona yazabiliriz.
        const response = await fetch(`https://shopapp-a1d8f-default-rtdb.firebaseio.com/products.json?auth=${token}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application.json'
            },
            body: JSON.stringify({
                title,
                description,
                imageUrl,
                price,
                ownerId: userId
            })
        })
        const resData = await response.json();
        dispatch({
            type: CREATE_PRODUCT,
            productData: {
                id: resData.name,
                title,
                description,
                imageUrl,
                price,
                ownerId: userId
            }
        });
    }

};

export const updateProduct = (id, title, description, imageUrl, price) => {
    return async (dispatch, getState) => {
        const token = getState().authentication.token;
        const userId = getState().authentication.userId;
        console.log(token)
        //istediğimiz async kodu redux thunk sayesinde bu fonksiyona yazabiliriz.
        const response = await fetch(
            `https://shopapp-a1d8f-default-rtdb.firebaseio.com/products/${id}.json?auth=${token}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application.json'
            },
            body: JSON.stringify({
                title,
                description,
                imageUrl,
                price,
                ownerId: userId
            })
        })
        if (!response.ok) {
            throw new Error('Ürün şuanda düzenlenemiyor.')
        }
        dispatch({
            type: UPDATE_PRODUCT,
            pid: id,
            productData: {
                title,
                description,
                imageUrl,
                price,
                ownerId: userId
            }
        });
    }
};

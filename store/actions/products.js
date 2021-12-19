import Product from "../../models/product";

export const DELETE_PRODUCT = 'DELETE_PRODUCT';
export const CREATE_PRODUCT = 'CREATE_PRODUCT';
export const UPDATE_PRODUCT = 'UPDATE_PRODUCT';
export const SET_PRODUCTS = 'SET_PRODUCTS';

export const fetchProducts = () => {
    return async (dispatch) => {
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
                        'u1',
                        resData[key].title,
                        resData[key].imageUrl,
                        resData[key].description,
                        resData[key].price,
                    )
                )
            }
            dispatch({
                type: SET_PRODUCTS,
                products: loadedProducts
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

export const createProduct = (title, description, imageUrl, price) => {
    return async (dispatch, getState) => {
        const token = getState().authentication.token;
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
                price
            }
        });
    }

};

export const updateProduct = (id, title, description, imageUrl, price) => {
    return async (dispatch, getState) => {
        const token = getState().authentication.token;
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
                price
            }
        });
    }
};

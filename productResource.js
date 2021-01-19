const urljoin = require('url-join');
const request = require('request-promise-native').defaults({json: true});


class ProductResource{
    static productURL(resourceURL) {
        const productServer = (process.env.PRODUCTS_URL || 'http://host.docker.internal:5678/api/v2');
        return urljoin(productServer, resourceURL);
    }

    static requestHeaders() {
        const productsKey = (process.env.PRODUCTS_APIKEY || 'kskskssjsnwiwi78lla98$/ffsd%');
        return {
            apikey: productsKey
        };
    }

    static getAllProducts() {
        const url = ProductResource.productURL('/products');
        const options = {
            headers: ProductResource.requestHeaders()
        }
        return request.get(url, options);
    }
}


module.exports = ProductResource;
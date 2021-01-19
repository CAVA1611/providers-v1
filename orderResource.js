const urljoin = require('url-join');
const request = require('request-promise-native').defaults({json: true});


class OrderResource{
    static orderURL(resourceURL) {
        const orderServer = (process.env.ORDERS_URL || 'http://host.docker.internal:3000/api/v2');
        return urljoin(orderServer, resourceURL);
    }

    static requestHeaders() {
        const ordersKey = (process.env.ORDERS_APIKEY || 'kskskssjsnwiwi78lla98$/ffsd%');
        return {
            apikey: ordersKey
        };
    }

    static getAllOrders() {
        const url = OrderResource.orderURL('/orders');
        const options = {
            headers: OrderResource.requestHeaders()
        }
        return request.get(url, options);
    }
}


module.exports = OrderResource;
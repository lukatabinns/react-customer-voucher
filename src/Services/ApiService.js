import axios from 'axios';
const header = {'Content-Type': 'application/json'};
const options = {
    method: 'GET',
    headers: {'Content-Type': 'application/json'}
};

export const ApiService = {

    searchCustomers (txt) {

        let data = {
            'bc_store_id':sessionStorage.getItem('bc_store_id'),
        };

        return axios.post('/search-customer/' + txt, data, {headers: header});
    },

    searchVoucherCoupon (txt) {
        let data = {
            'bc_store_id':sessionStorage.getItem('bc_store_id'),
        };

        return axios.post('/search-voucher-coupon/' + txt, data, {headers: header});
    },

    allVoucherCoupon (id) {
        return axios.post('/all-voucher-coupon', {'bc_shop_id':id},{headers: header});
    },
};

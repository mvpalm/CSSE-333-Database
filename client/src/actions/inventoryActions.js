import axios from 'axios';

export function getTransactions(state) {
    return (dispatch) => {
        return axios.get(`/api/inventory/getTransactions?companyID=${state.companyID}&page=${state.currentPage}&sortBy=${state.sortBy}&sortType=${state.sortType}&itemsperPage=${state.itemsPerPage}&searchBy=${state.searchBy}&searchQuery=${state.searchQuery}`);
    }
}
export function getChartData(itemID) {
    console.log(itemID);
    return (dispatch) => {
        return axios.get(`/api/inventory?itemID=${itemID}`);
    }
}
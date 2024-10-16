import HTTP from "../common/http";

export default {

    async findAll(){

        const response = await HTTP.get('users');
        return response.data;

    },

    async deleteUser(deleteId){

        const response = await HTTP.delete(`users/${deleteId}` );
        return response.data;

    },

    async deactivateUser(deactivateId){

        const response = await HTTP.delete(`users/${deactivateId}/active` );
        return response.data;

    },

    async activateUser(activateId){

        const response = await HTTP.put(`users/${activateId}/active` );
        return response.data;

    }



};
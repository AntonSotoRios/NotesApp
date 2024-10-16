import HTTP from "@/common/http";

const resource = "categories";

export default {

  async findAll() {

    return (await HTTP.get(resource)).data;

  },

  async findOne(id){

    const response = (await HTTP.get(`${resource}/${id}`));
    return response.data;

  },

  async create(category){

    const response = (await HTTP.post(`${resource}`, category));
    return response.data;

  },

  async update(category){

    const response = (await HTTP.put(`${resource}/${category.id}`, category));
    return response.data;

  },

  async deleteCategory(deleteId){

    const response = await HTTP.delete(`${resource}/${deleteId}` );
    return response.data;

  }

};

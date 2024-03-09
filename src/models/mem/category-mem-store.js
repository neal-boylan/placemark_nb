import { v4 } from "uuid";
import { poiMemStore } from "./poi-mem-store.js";

let categories = [];

export const categoryMemStore = {
  async getAllCategories() {
    return categories;
  },

  async addCategory(category) {
    category._id = v4();
    categories.push(category);
    return category;
  },

  async updateCategory(category, updatedCategory) {
    category.name = updatedCategory.name;
  },

  async getCategoryById(id) {
    const u = categories.find((category) => category._id === id);
    if (u === undefined) return null;
    u.pois = await poiMemStore.getPoisByCategoryId(u._id);
    return u;
  },

  async getUserCategories(userid) {
    return categories.filter((category) => category.userid === userid);
  },

  async deleteCategoryById(id) {
    const index = categories.findIndex((category) => category._id === id);
    if (index !== -1) categories.splice(index, 1);
  },

  async deleteAllCategories() {
    categories = [];
  },
};
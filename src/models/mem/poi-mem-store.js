import { v4 } from "uuid";

let pois = [];

export const poiMemStore = {
  async getAllPois() {
    return tracks;
  },

  async addPoi(categoryId, poi) {
    poi._id = v4();
    poi.categoryid = categoryId;
    pois.push(poi);
    return poi;
  },

  async getPoisByCategoryId(id) {
    return pois.filter((poi) => poi.categoryid === id);
  },

  async getPoiById(id) {
    return pois.find((poi) => poi._id === id);
  },

  async getCategoryPois(categoryId) {
    return pois.filter((poi) => poi.categoryid === categoryId);
  },

  async deletePoi(id) {
    const index = pois.findIndex((poi) => poi._id === id);
    pois.splice(index, 1);
  },

  async deleteAllPois() {
    pois = [];
  },

  async updatePoi(poi, updatedPoi) {
    poi.title = updatedPoi.name;
    poi.artist = updatedPoi.latitude;
    poi.duration = updatedPoi.longitude;
  },
};
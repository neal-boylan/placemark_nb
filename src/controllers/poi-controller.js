import { db } from "../models/db.js";
// import { PlacemarkSpec } from "../models/joi-schemas.js";

export const poiController = {
  index: {
    handler: async function (request, h) {
      const poi = await db.poiStore.getPoiById(request.params.id);
      const viewData = {
        name: "Poi",
        poi: poi,
      };
      return h.view("poi-view", viewData);
    },
  },
};
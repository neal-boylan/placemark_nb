import { assert } from "chai";
import { assertSubset } from "../test-utils.js";
import { placemarkService } from "./placemark-service.js";
import { maggie, gyms, testCategories, testPois, diners, mcdonalds } from "../fixtures.js";

suite("Track API tests", () => {
  let user = null;
  let fastFoodDiners = null;

  setup(async () => {
		await placemarkService.deleteAllCategories();
    await placemarkService.deleteAllUsers();
    await placemarkService.deleteAllPois();
    user = await placemarkService.createUser(maggie);
    diners.userid = user._id;
    fastFoodDiners = await placemarkService.createCategory(diners);
  });

  teardown(async () => {});

  test("create poi", async () => {
		const returnedPoi = await placemarkService.createPoi(fastFoodDiners._id, mcdonalds);
    assertSubset(mcdonalds, returnedPoi);
  });

  test("create Multiple pois", async () => {
		for (let i = 0; i < testPois.length; i += 1) {
      // eslint-disable-next-line no-await-in-loop
      await placemarkService.createPoi(fastFoodDiners._id, testPois[i]);
    }
    const returnedPois = await placemarkService.getAllPois();
    assert.equal(returnedPois.length, testPois.length);
    for (let i = 0; i < returnedPois.length; i += 1) {
      // eslint-disable-next-line no-await-in-loop
      const poi = await placemarkService.getPoi(returnedPois[i]._id);
      assertSubset(poi, returnedPois[i]);
    }
  });

  test("Delete poi", async () => {
		for (let i = 0; i < testPois.length; i += 1) {
      // eslint-disable-next-line no-await-in-loop
      await placemarkService.createPoi(fastFoodDiners._id, testPois[i]);
    }
    let returnedPois = await placemarkService.getAllPois();
    assert.equal(returnedPois.length, testPois.length);
    for (let i = 0; i < returnedPois.length; i += 1) {
      // eslint-disable-next-line no-await-in-loop
      const poi = await placemarkService.deletePoi(returnedPois[i]._id);
    }
    returnedPois = await placemarkService.getAllPois();
    assert.equal(returnedPois.length, 0);
  });

  test("test denormalised category", async () => {
		for (let i = 0; i < testPois.length; i += 1) {
      // eslint-disable-next-line no-await-in-loop
      await placemarkService.createPoi(fastFoodDiners._id, testPois[i]);
    }
    const returnedCategory = await placemarkService.getCategory(fastFoodDiners._id);
    assert.equal(returnedCategory.pois.length, testPois.length);
    for (let i = 0; i < testPois.length; i += 1) {
      assertSubset(testPois[i], returnedCategory.pois[i]);
    }
  });
});
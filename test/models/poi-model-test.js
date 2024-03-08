import { assert } from "chai";
import { db } from "../../src/models/db.js";
import { testCategories, testPois, diners, gyms, flyefit, testUsers } from "../fixtures.js";
import { assertSubset } from "../test-utils.js";

suite("Poi Model tests", () => {

  let dinersCat = null;

  setup(async () => {
    db.init("json");
    await db.categoryStore.deleteAllCategories();
    await db.poiStore.deleteAllPois();
    dinersCat = await db.categoryStore.addCategory(diners);
    for (let i = 0; i < testPois.length; i += 1) {
      // eslint-disable-next-line no-await-in-loop
      testPois[i] = await db.poiStore.addPoi(dinersCat._id, testPois[i]);
    }
  });

  test("create single track", async () => {
    const gymsCat = await db.categoryStore.addCategory(gyms);
    const poi = await db.poiStore.addPoi(gymsCat._id, flyefit)
    assert.isNotNull(poi._id);
		// assert.equal(flyefit, poi);
    assertSubset (flyefit, poi);
  });

 test("get multiple pois", async () => {
    const pois = await db.poiStore.getPoisByCategoryId(dinersCat._id);
    assert.equal(pois.length, testPois.length)
  });

  test("delete all pois", async () => {
    const pois = await db.poiStore.getAllPois();
    assert.equal(testPois.length, pois.length);
    await db.poiStore.deleteAllPois();
    const newPois = await db.poiStore.getAllPois();
    assert.equal(0, newPois.length);
  });

  test("get a poi - success", async () => {
    const gymsCat = await db.categoryStore.addCategory(gyms);
    const poi = await db.poiStore.addPoi(gymsCat._id, flyefit)
    const newPoi = await db.poiStore.getPoiById(poi._id);
		// assert.deepEqual(flyefit, newPoi);
    assertSubset (flyefit, newPoi);
  });

  test("delete One Poi - success", async () => {
    await db.poiStore.deletePoi(testPois[0]._id);
    const pois = await db.poiStore.getAllPois();
    assert.equal(pois.length, testPois.length - 1);
    const deletedPoi = await db.poiStore.getPoiById(testPois[0]._id);
    assert.isNull(deletedPoi);
  });

  test("get a poi - bad params", async () => {
    assert.isNull(await db.poiStore.getPoiById(""));
    assert.isNull(await db.poiStore.getPoiById());
  });

  test("delete one poi - fail", async () => {
    await db.poiStore.deletePoi("bad-id");
    const pois = await db.poiStore.getAllPois();
    assert.equal(pois.length, testPois.length);
  });
});
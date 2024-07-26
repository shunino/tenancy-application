const TenancyContract = artifacts.require("TenancyContract");

contract("TenancyContract", (accounts) => {
  const [landlord, tenant1, tenant2] = accounts;

  let tenancyContract;

  beforeEach(async () => {
    tenancyContract = await TenancyContract.new();
  });

  describe("Initialization", () => {
    it("Should initialize landlord correctly", async () => {
      const landlordOnly = await tenancyContract.landLordOnly();
      assert.equal(landlordOnly, landlord, "Landlord is not initialized correctly");
    });

    it("Should initialize rooms correctly", async () => {
      const rooms = await tenancyContract.rooms(0);
      assert.equal(rooms.roomId.toNumber(), 1, "First room ID is not correct");
      assert.equal(rooms.isAvailable, true, "First room should be available");
      assert.equal(rooms.status, "Vacant", "First room status should be 'Vacant'");
    });
  });

  describe("Room Management", () => {
    it("Should allow landlord to add rooms", async () => {
      await tenancyContract.addRoom(150, "Double", "Some Address", "Some Location", "Description", { from: landlord });
      const room3 = await tenancyContract.rooms(2);
      assert.equal(room3.roomId.toNumber(), 3, "Third room ID is not correct");
      assert.equal(room3.isAvailable, true, "Third room should be available");
      assert.equal(room3.status, "Vacant", "Third room status should be 'Vacant'");
    });

    it("Should not allow tenant to add rooms", async () => {
      try {
        await tenancyContract.addRoom(150, "Double", "Some Address", "Some Location", "Description", { from: tenant1 });
        assert.fail("Tenant should not be able to add rooms");
      } catch (error) {
        assert(error.message.includes("Only landlord can perform this action"), "Expected only landlord can perform this action");
      }
    });
  });

  describe("Tenant Management", () => {
    it("Should allow landlord to add tenants", async () => {
      await tenancyContract.addTenant(tenant1, 1622548800, "Tenant1", "tenant1@example.com", "123456789", "Country1", "Passport1", { from: landlord });
      const tenant = await tenancyContract.tenants(0);
      assert.equal(tenant.tenantAddress, tenant1, "Tenant address is not correct");
    });
  });

  describe("Rent Management", () => {
    it("Should allow landlord to update rent info", async () => {
      await tenancyContract.addTenant(tenant1, 1622548800, "Tenant1", "tenant1@example.com", "123456789", "Country1", "Passport1", { from: landlord });
      await tenancyContract.rentRoom(1, 1, 1622548800, 1625140800, 1625140800, "Monthly", "500", "Description", { from: landlord });
      const rentInfo = await tenancyContract.getTenantRentInfo(1);
      assert.equal(rentInfo.tenantAddress, tenant1, "Tenant address in rent info is not correct");
    });
  });

  describe("Maintenance Requests", () => {
    it("Should allow tenants to create maintenance requests", async () => {
      await tenancyContract.creatRequest("Room Info", 1, "Plumbing", "Description", 1622548800, { from: tenant1 });
      const request = await tenancyContract.maintenanceRequests(0);
      assert.equal(request.requestType, "Plumbing", "Request type is not correct");
      assert.equal(request.isResolved, false, "Request should not be resolved");
    });

    it("Should allow landlord to resolve maintenance requests", async () => {
      await tenancyContract.creatRequest("Room Info", 1, "Plumbing", "Description", 1622548800, { from: tenant1 });
      await tenancyContract.modifyRequest(1, 1625140800, { from: landlord });
      const request = await tenancyContract.maintenanceRequests(0);
      assert.equal(request.isResolved, true, "Request should be resolved");
      assert.equal(request.endTime.toNumber(), 1625140800, "End time is not correct");
    });
  });
});
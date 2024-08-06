const TenancyContract = artifacts.require("TenancyContract");

contract("TenancyContract", (accounts) => {
  let tenancyContract;
  const landlord = accounts[0];
  const tenant1 = accounts[1];
  const tenant2 = accounts[2];

  beforeEach(async () => {
    tenancyContract = await TenancyContract.new({ from: landlord });
  });

  it("should initialize with landlord as the contract deployer", async () => {
    const landlordAddress = await tenancyContract.landlordAddress();
    assert.equal(landlordAddress, landlord, "Landlord address should be the contract deployer");
  });

  it("should add a tenant", async () => {
    await tenancyContract.addTenant(tenant1, Math.floor(Date.now() / 1000), "Alice", "alice@example.com", "12345678", "USA", "P12345678", { from: landlord });
    const tenant = await tenancyContract.tenants(0);
    assert.equal(tenant.tenantAddress, tenant1, "Tenant address should be correctly added");
  });

  it("should add a room", async () => {
    await tenancyContract.addRoom(150, "Double", "123 Street", "501", "Nice Room", { from: landlord });
    const room = await tenancyContract.rooms(2); // 第三个房间，索引为2
    assert.equal(room.rent, 150, "Room rent should be correctly added");
    assert.equal(room.roomType, "Double", "Room type should be correctly added");
  });

  it("should allow tenant to rent a room", async () => {
    await tenancyContract.addTenant(tenant1, Math.floor(Date.now() / 1000), "Alice", "alice@example.com", "12345678", "USA", "P12345678", { from: landlord });
    await tenancyContract.rentRoom(1, 1, Math.floor(Date.now() / 1000), Math.floor(Date.now() / 1000) + 86400 * 30, Math.floor(Date.now() / 1000) + 86400 * 30, "100", "100", "Rent for a month", { from: tenant1 });

    const room = await tenancyContract.rooms(0);
    assert.equal(room.isAvailable, false, "Room should be marked as not available");
    assert.equal(room.status, "Occupied", "Room status should be 'Occupied'");
  });

  it("should allow landlord to update room state", async () => {
    await tenancyContract.updateRoomState(1, false, { from: landlord });
    const room = await tenancyContract.rooms(0);
    assert.equal(room.isAvailable, false, "Room should be marked as not available");
  });

  it("should allow tenant to create a maintenance request", async () => {
    await tenancyContract.addTenant(tenant1, Math.floor(Date.now() / 1000), "Alice", "alice@example.com", "12345678", "USA", "P12345678", { from: landlord });
    await tenancyContract.creatRequest("Room 501", 1, "Plumbing", "Leaky faucet", Math.floor(Date.now() / 1000), { from: tenant1 });

    const request = await tenancyContract.maintenanceRequests(0);
    assert.equal(request.description, "Leaky faucet", "Maintenance request description should be correctly added");
  });

  it("should allow landlord to resolve a maintenance request", async () => {
    await tenancyContract.addTenant(tenant1, Math.floor(Date.now() / 1000), "Alice", "alice@example.com", "12345678", "USA", "P12345678", { from: landlord });
    await tenancyContract.creatRequest("Room 501", 1, "Plumbing", "Leaky faucet", Math.floor(Date.now() / 1000), { from: tenant1 });
    await tenancyContract.modifyRequest(1, Math.floor(Date.now() / 1000) + 86400, { from: landlord });

    const request = await tenancyContract.maintenanceRequests(0);
    assert.equal(request.isResolved, true, "Maintenance request should be marked as resolved");
  });

  // 你可以添加更多测试用例以覆盖所有功能
});
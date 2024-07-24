const TenancyContract = artifacts.require("TenancyContract");

contract("TenancyContract", (accounts) => {
  let contractInstance;
  const landlord = accounts[0];
  const tenant = accounts[1];

  before(async () => {
    contractInstance = await TenancyContract.deployed();
  });

  it("should initialize the contract correctly", async () => {
    const landlordAddress = await contractInstance.landlord();
    assert.equal(landlordAddress, landlord, "Landlord address should be the deployer");

    const agreement = await contractInstance.agreements();
    assert.equal(agreement.title, "Tenancy Agreement", "Agreement should be initialized");
  });

  it("should add a tenant", async () => {
    await contractInstance.addTenant(tenant, Date.now(), "John Doe", "johndoe@example.com", "123456789", "American", "A1234567");
    const tenantInfo = await contractInstance.tenants(0); // First tenant
    assert.equal(tenantInfo.name, "John Doe", "Tenant name should be 'John Doe'");
  });

  it("should create a request", async () => {
    await contractInstance.creatRequest(1, 1, "Plumbing", "Fix the sink", Date.now(), { from: tenant });
    const request = await contractInstance.maintenanceRequests(0); // First request
    assert.equal(request.requestType, "Plumbing", "Request type should be 'Plumbing'");
  });

  it("should modify a request", async () => {
    await contractInstance.modifyRequest(1, Date.now(), { from: tenant });
    const request = await contractInstance.maintenanceRequests(0); // First request
    assert.equal(request.isResolved, true, "Request should be resolved");
  });

  it("should rent a room", async () => {
    await contractInstance.rentRoom(1, 1, Date.now(), Date.now() + 30 * 24 * 60 * 60, Date.now() + 30 * 24 * 60 * 60, "Next month", "1000", "First month's rent", { from: tenant });
    const rentInfo = await contractInstance.rentInfos(0); // First rent info
    assert.equal(rentInfo.tenantAddress, tenant, "Tenant address should match");
    const room = await contractInstance.rooms(0); // First room
    assert.equal(room.status, "Occupied", "Room should be occupied");
  });

  it("should pay rent", async () => {
    await contractInstance.payRent(1, "Next month", "1000", { from: tenant, value: web3.utils.toWei("1", "ether") });
    const rentInfo = await contractInstance.rentInfos(0); // First rent info
    assert.equal(rentInfo.nextPay, "1000", "Next pay should be updated");
  });

  it("should update rent info", async () => {
    await contractInstance.updateRentInfo(1);
    const rentInfo = await contractInstance.rentInfos(0); // First rent info
    assert.equal(rentInfo.isTerminated, true, "Rent info should be terminated");
    const room = await contractInstance.rooms(0); // First room
    assert.equal(room.status, "Vacant", "Room should be vacant");
  });

  it("should get tenant rent info", async () => {
    const rentInfo = await contractInstance.getTenantRentInfo("someKey");
    assert.equal(rentInfo.roomId, 0, "Rent info should be empty");
  });

  it("should add an agreement tenant", async () => {
    await contractInstance.addAgreementTenant(tenant, "2024-01-01", "2024-12-31", { from: landlord });
    const agreementTenant = await contractInstance.agreementTenant(0); // First agreement tenant
    assert.equal(agreementTenant.tenant, tenant, "Tenant address should match");
  });

  it("should execute dailyAction by landlord", async () => {
    await contractInstance.dailyAction({ from: landlord });
    const lastExecutionTime = await contractInstance.lastExecutionTime();
    assert(lastExecutionTime > 0, "Daily action should be executed");
  });
});
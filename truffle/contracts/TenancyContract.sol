// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

contract TenancyContract {
    uint256 public lastExecutionTime;
    bool public isInitialized;
    address landlordAddress;
    

    struct Tenant {
        uint256 tenantId;
        address tenantAddress;
        uint256 createTime;
        string name;
        string email; // e.g., "Monthly", "Yearly"
        string phone; // e.g., "Monthly", "Yearly" 
        string nationality;
        string passport;
    }

    struct Room {
        uint256 roomId;
        uint256 rent;
        bool isAvailable;
        string roomType; // e.g., "Single", "Double"
        string status; // e.g., "Occupied", "Vacant"
        string location;
        string description;
        string addressInfo;
    }

    struct RentInfo{
        uint256 rentId;
        address tenantAddress;
        uint256 roomId;
        uint256 createTime;
        uint256 endTime;
        uint256 nextTime;
        string nextPay;
        string paymentMethod;
        string leaseType; // e.g., "Monthly", "Yearly"
        string description;
        string payTotal;
        string uniqueKey;
        bool isTerminated;
    }

    struct MaintenanceRequest {
        uint256 requestId;
        string roomInfo;
        uint256 TenantId;
        string requestType; // e.g., "Plumbing", "Electrical"
        string description;
        uint256 createTime;
        uint256 endTime;
        bool isResolved;
    }


    Room[] public rooms;
    Tenant[] public tenants;
    RentInfo[] public rentInfos;
    MaintenanceRequest[] public maintenanceRequests;

    event RentPaid(address indexed tenant, uint256 roomId, uint256 amount, uint256 timestamp);
    event RoomStatusUpdated(uint256 roomId, string newStatus, uint256 timestamp);
    event MaintenanceRequested(uint256 requestId, uint256 roomId, string requestType, string description, uint256 timestamp);
    event MaintenanceResolved(uint256 requestId, uint256 timestamp);

    modifier onlyLandlord() {
        require(msg.sender == landlordAddress, "Only landlord can perform this action");
        _;
    }

    modifier oncePerDay() {
        require(block.timestamp >= lastExecutionTime + 1 days, "Action can only be performed once per day");
        _;
    }

    modifier onlyOnce() {
        require(!isInitialized, "This function can only be called once");
        _;
    }

    function dailyAction(uint256 curTime) public onlyLandlord {
        lastExecutionTime = curTime;

        for (uint i = 0; i < rentInfos.length; i++) {
            if (rentInfos[i].endTime < lastExecutionTime) {
                updateRentInfo(rentInfos[i].rentId); // Expired, update this rental information
            }
        }
        
    }
    string[] private lordAgreementTerms;
    function getAgreementTermsforlord() public returns (string[] memory) {
        // 先清空数组
        delete lordAgreementTerms;
        lordAgreementTerms.push("1. The landlord must update daily tasks every day. If there are no updates, the landlord will bear any resulting losses.");
        lordAgreementTerms.push("2. The landlord must ensure that all provided information is accurate and lawful. If any false information is provided, the landlord must compensate the tenant for any incurred losses and bear the appropriate legal responsibilities.");
        lordAgreementTerms.push("3. The landlord must resolve any reasonable requests submitted by the tenant within three (3) days.");
        lordAgreementTerms.push("4. If the landlord delays or neglects to address tenant requests, the landlord must compensate the tenant for any resulting losses.");
        lordAgreementTerms.push("5. The landlord agrees to all the above terms and consents to activate all codes of the contract.");
        return lordAgreementTerms;
    }
    
    string[] private userAgreementTerms;
    function getAgreementTermsforuser() public returns (string[] memory) {
        // 先清空数组
        delete userAgreementTerms;
        userAgreementTerms.push("1. The tenants must ensure that all provided information is accurate and lawful. If any false information is provided, the landlord must compensate the tenant for any incurred losses and bear the appropriate legal responsibilities.");
        userAgreementTerms.push("2. the tenant needs to keep the function of the room facilities normal and clean, if the room facilities are damaged, the landlord should be compensated for the corresponding loss.");
        userAgreementTerms.push("3. the tenant needs to pay the rent on time, if there is overtime payment, the landlord has the right to terminate the contract.");
        userAgreementTerms.push("4. The tenant agrees to all the above terms and consents to activate all codes of the contract.");
        return userAgreementTerms;
    }

    constructor() {

        // another init landlordAddress

        landlordAddress = msg.sender;

        // Initialize some rooms
        rooms.push(Room({
            roomId: 1,
            rent: 125,
            isAvailable: true,
            roomType: "Single",
            status: "Vacant",
            addressInfo:'Aberdeen, Causeway View',
            location:'501D',
            description:'Aberdeen, Causeway View 501D,'
        }));

        rooms.push(Room({
            roomId: 2,
            rent: 125,
            isAvailable: true,
            roomType: "Single",
            status: "Vacant",
            addressInfo:'Aberdeen, Causeway View',
            location:'501C',
            description:'Aberdeen, Causeway View 501D,'
        }));

    }

    function addRoom(uint256 rent, string memory roomType, string memory addressInfo, string memory location, string memory description) public onlyLandlord  {
        uint256 roomId = rooms.length + 1;
        rooms.push(Room({
            roomId: roomId,
            rent: rent,
            isAvailable: true,
            roomType: roomType,
            status: "Vacant",
            addressInfo:addressInfo,
            location:location,
            description:description
        }));
    }

    function updateRoomState(uint256 roomId, bool state) public onlyLandlord {
        rooms[roomId-1].isAvailable = state;
    }

    function creatRequest(string memory roomInfo, uint256 TenantId, string memory requestType, string memory description,uint256 createTime) public {
        uint256 requestId = maintenanceRequests.length + 1;
        maintenanceRequests.push(MaintenanceRequest({
            requestId: requestId,
            roomInfo: roomInfo,
            TenantId: TenantId,
            requestType: requestType,
            description: description,
            createTime: createTime,
            endTime: 0,
            isResolved: false
        }));
    }

    function modifyRequest(uint256 requestId, uint256 endTime) public onlyLandlord {
        uint256 idx = requestId - 1;
        maintenanceRequests[idx].isResolved = true;
        maintenanceRequests[idx].endTime = endTime;
    }

    function getTenantRentInfoByAd(address tenantAddress) public onlyLandlord view returns (RentInfo memory) {
        RentInfo memory emptyRentInfo; // 默认空的 RentInfo 对象

        for (uint i = 0; i < rentInfos.length; i++) {
            if (rentInfos[i].tenantAddress==tenantAddress && rentInfos[i].isTerminated == false) {
                return rentInfos[i]; // 找到匹配的 RentInfo 对象，立即返回
            }
        }

        return emptyRentInfo; // 没有找到匹配的 RentInfo 对象，返回空对象
    }


    function addTenant(address tenantAddress, uint256 createTime, string memory name, string memory email, string memory phone, string memory nationality, string memory passport) public  {
        uint256 tenantId = tenants.length + 1;
        tenants.push(Tenant({
            tenantId: tenantId,
            tenantAddress: tenantAddress,
            createTime: createTime,
            name: name,
            email: email,
            phone: phone,
            nationality: nationality,
            passport: passport
        }));
    }

    function updateRentInfo(uint256 rentId) public {
        uint256 idx = rentId - 1;
        uint256 roomId = rentInfos[idx].roomId;
        rentInfos[idx].isTerminated = true;
        rooms[roomId - 1].isAvailable = true;
        rooms[roomId - 1].status = "Vacant";
    
        emit RoomStatusUpdated(roomId, "Vacant", block.timestamp);
    }

    function rentRoom(uint256 tenantId, uint256 _roomId, uint256 createTime,uint256 endTime,uint256 nextTime, string memory nextPay, string memory payTotal, string memory description) public {
        require(_roomId <= rooms.length, "Room does not exist");
        require(rooms[_roomId - 1].isAvailable, "Room is not available");
        require(isActivate(), "Caller is not an active tenant");
        uint256 rentId = rentInfos.length + 1;
        rentInfos.push(RentInfo({
            rentId:rentId,
            tenantAddress: tenants[tenantId - 1].tenantAddress,
            roomId: _roomId,
            createTime: createTime,
            endTime: endTime,
            nextTime: nextTime,
            nextPay: nextPay,
            paymentMethod:'ETH',
            leaseType:'Monthly',
            isTerminated: false,
            description:description,
            payTotal:payTotal,
            uniqueKey:''
        }));
        rooms[_roomId - 1].isAvailable = false;
        rooms[_roomId - 1].status = "Occupied";
        emit RoomStatusUpdated(_roomId, "Occupied", block.timestamp);
    }

    function payRent(uint256 rentId,uint256 nextTime) external payable {
        require(rentId > 0 && rentId <= rentInfos.length, "Invalid rentId");
        rentInfos[rentId - 1].nextTime = nextTime;

        payable(landlordAddress).transfer(msg.value);
        emit RentPaid(msg.sender, rentId, msg.value, block.timestamp);
    }


    // 判断指定地址是否在 tenants 数组中，并返回相应的 Tenant 信息或空对象
    function hasRegister(address tenantAddress) public view returns (Tenant memory) {
        Tenant memory emptyTenant; // 默认空的 Tenant 对象

        for (uint i = 0; i < tenants.length; i++) {
            if (tenants[i].tenantAddress == tenantAddress) {
                return tenants[i]; // 找到匹配的 Tenant 对象，立即返回
            }
        }

        return emptyTenant; // 没有找到匹配的 Tenant 对象，返回空对象
    }


    // 判断指定地址是否在 rentInfos 数组中，并返回相应的 RentInfo 信息或空对象
    function hasRentInfo(address tenantAddress, uint256 curTime) public view returns (RentInfo memory) {
        RentInfo memory emptyRentInfo; // 默认空的 RentInfo 对象

        for (uint i = 0; i < rentInfos.length; i++) {
            if (rentInfos[i].tenantAddress == tenantAddress && rentInfos[i].isTerminated==false && curTime<=rentInfos[i].endTime) {
                return rentInfos[i]; // 找到匹配的 RentInfo 对象，立即返回
            }
        }

        return emptyRentInfo; // 没有找到匹配的 RentInfo 对象，返回空对象
    }


    function getAllRooms() public view returns (Room[] memory) {
        return rooms;
    }

    function getAllRequest() public onlyLandlord view returns (MaintenanceRequest[] memory) {
        return maintenanceRequests;
    }
    
    function judgeAdType(address userAddress) public view returns (uint8) {
        if (userAddress == landlordAddress) {
            return 2;
        } else {
            return 1;
        }
    }

    function isActivate() public view returns (bool) {
        for (uint i = 0; i < tenants.length; i++) {
            if (tenants[i].tenantAddress == msg.sender) {
                return true; // 找到匹配的租户地址，返回true
            }
        }
        return false; // 没有找到匹配的租户地址，返回false
    }

    //test
    function getallTe() public view returns (RentInfo[] memory) {
        return rentInfos;
    }
    function getallUser() public view returns (Tenant[] memory) {
        return tenants;
    }

}
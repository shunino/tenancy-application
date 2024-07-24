// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

contract TenancyContract {
    uint256 public lastExecutionTime;
    bool public isInitialized;
    struct Landlord{
        address landlordAddress;
        uint256 createTime;
        string name;
        string email; // e.g., "Monthly", "Yearly"
        string phone; // e.g., "Monthly", "Yearly" 
        string nationality;
        string passport;
    }

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

    struct Clause {
        string title;
        string[] points;
    }

    struct Agreement {
        string title;
        Clause[] sections;
    }

    Agreement public agreements;


    // Event to log new agreement creation
    event AgreementCreated(uint256 id, address tenant, string startTime, string endTime);

    Landlord public landLordOnly;
    Room[] public rooms;
    Tenant[] public tenants;
    RentInfo[] public rentInfos;
    MaintenanceRequest[] public maintenanceRequests;

    event RentPaid(address indexed tenant, uint256 roomId, uint256 amount, uint256 timestamp);
    event RoomStatusUpdated(uint256 roomId, string newStatus, uint256 timestamp);
    event MaintenanceRequested(uint256 requestId, uint256 roomId, string requestType, string description, uint256 timestamp);
    event MaintenanceResolved(uint256 requestId, uint256 timestamp);

    modifier onlyLandlord() {
        require(msg.sender == landLordOnly.landlordAddress, "Only landlord can perform this action");
        _;
    }

    modifier onlyTenant(uint256 roomId) {
        bool isTenant = false;
        require(isTenant, "Only the tenant of this room can perform this action");
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

    function dailyAction(uint256 curTime) public onlyLandlord oncePerDay {
        // 房东每日执行的操作
        lastExecutionTime = curTime;
        // 在这里添加具体的操作

        for (uint i = 0; i < rentInfos.length; i++) {
            if (rentInfos[i].endTime < lastExecutionTime) {
                updateRentInfo(rentInfos[i].rentId); // 已经到期，更新此租房信息
            }
        }
        
    }

    function initAgreement() public onlyOnce {
        isInitialized = true;

        // Initialize the agreement
        agreements.title = "Tenancy Agreement";

        // Section 1: PARTIES
        Clause memory section1;
        section1.title = "1. PARTIES";
        string[] memory points1 = new string[](2);
        points1[0] = "1.1 Landlord: [Landlord's Full Name]";
        points1[1] = "1.2 Tenant: [Tenant's Full Name]";
        section1.points = points1;
        agreements.sections.push(section1);

        // // Section 2: PROPERTY
        // Clause memory section2;
        // section2.title = "2. PROPERTY";
        // string[] memory points2 = new string[](1);
        // points2[0] = "2.1 Address: [Full Address of the Rental Property]";
        // section2.points = points2;
        // agreements.sections.push(section2);

        // // Section 3: TERM
        // Clause memory section3;
        // section3.title = "3. TERM";
        // string[] memory points3 = new string[](3);
        // points3[0] = "3.1 Start Date: [Start Date]";
        // points3[1] = "3.2 End Date: [End Date]";
        // points3[2] = "3.3 Type of Tenancy: Assured Shorthold Tenancy (AST)";
        // section3.points = points3;
        // agreements.sections.push(section3);

        // // Section 4: RENT
        // Clause memory section4;
        // section4.title = "4. RENT";
        // string[] memory points4 = new string[](3);
        // points4[0] = "4.1 Amount: [Monthly Rent Amount]";
        // points4[1] = "4.2 Due Date: [Day of the Month Rent is Due]";
        // points4[2] = "4.3 Payment Method: [Bank Transfer/Standing Order/etc.]";
        // section4.points = points4;
        // agreements.sections.push(section4);

        // // Section 5: DEPOSIT
        // Clause memory section5;
        // section5.title = "5. DEPOSIT";
        // string[] memory points5 = new string[](2);
        // points5[0] = "5.1 Amount: [Deposit Amount]";
        // points5[1] = "5.2 Deposit Protection Scheme: The deposit will be protected under [Name of the Deposit Protection Scheme]";
        // section5.points = points5;
        // agreements.sections.push(section5);

        // // Section 6: UTILITIES AND BILLS
        // Clause memory section6;
        // section6.title = "6. UTILITIES AND BILLS";
        // string[] memory points6 = new string[](1);
        // points6[0] = "6.1 The tenant is responsible for paying all utility bills, including electricity, gas, water, and council tax";
        // section6.points = points6;
        // agreements.sections.push(section6);

        // // Section 7: USE OF PROPERTY
        // Clause memory section7;
        // section7.title = "7. USE OF PROPERTY";
        // string[] memory points7 = new string[](1);
        // points7[0] = "7.1 The property is to be used solely as a private residence by the tenant and their immediate family";
        // section7.points = points7;
        // agreements.sections.push(section7);

        // // Section 8: MAINTENANCE AND REPAIRS
        // Clause memory section8;
        // section8.title = "8. MAINTENANCE AND REPAIRS";
        // string[] memory points8 = new string[](2);
        // points8[0] = "8.1 The landlord is responsible for maintaining the structure and exterior of the property, as well as ensuring that the installations for the supply of water, gas, electricity, and sanitation are in working order";
        // points8[1] = "8.2 The tenant is responsible for keeping the property in a clean and tidy condition and for minor repairs such as changing light bulbs";
        // section8.points = points8;
        // agreements.sections.push(section8);

        // // Section 9: TENANT OBLIGATIONS
        // Clause memory section9;
        // section9.title = "9. TENANT OBLIGATIONS";
        // string[] memory points9 = new string[](3);
        // points9[0] = "9.1 The tenant must not make any alterations to the property without the landlord's written consent";
        // points9[1] = "9.2 The tenant must not sublet the property or take in lodgers without the landlord's written consent";
        // points9[2] = "9.3 The tenant must notify the landlord of any damage or repairs needed as soon as possible";
        // section9.points = points9;
        // agreements.sections.push(section9);

        // // Section 10: LANDLORD OBLIGATIONS
        // Clause memory section10;
        // section10.title = "10. LANDLORD OBLIGATIONS";
        // string[] memory points10 = new string[](2);
        // points10[0] = "10.1 The landlord must ensure that the property is fit for habitation at the start of the tenancy";
        // points10[1] = "10.2 The landlord must give at least 24 hours' notice before entering the property, except in emergencies";
        // section10.points = points10;
        // agreements.sections.push(section10);

        // // Section 11: TERMINATION
        // Clause memory section11;
        // section11.title = "11. TERMINATION";
        // string[] memory points11 = new string[](2);
        // points11[0] = "11.1 The landlord or tenant may terminate the tenancy by giving at least [Notice Period, typically two months] notice in writing";
        // points11[1] = "11.2 The tenancy may be terminated early if both parties agree in writing";
        // section11.points = points11;
        // agreements.sections.push(section11);

        // // Section 12: GOVERNING LAW
        // Clause memory section12;
        // section12.title = "12. GOVERNING LAW";
        // string[] memory points12 = new string[](1);
        // points12[0] = "12.1 This agreement is governed by the laws of England and Wales";
        // section12.points = points12;
        // agreements.sections.push(section12);
    }


    constructor() {
        initAgreement();

        // another init landlord

        landLordOnly.landlordAddress = msg.sender;
        landLordOnly.createTime = block.timestamp;

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
            addressInfo:addressInfo',
            location:location,
            description:description
        }));
    }

    function updateRoomState(uint256 roomId, bool state) public {
        rooms[roomId-1].isAvailable = state
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

    function modifyRequest(uint256 requestId, uint256 endTime) public {
        uint256 idx = requestId - 1;
        maintenanceRequests[idx].isResolved = true;
        maintenanceRequests[idx].endTime = endTime;
    }

    function getTenantRentInfo(string memory uniqueKey) public view returns (RentInfo memory) {
        RentInfo memory emptyRentInfo; // 默认空的 RentInfo 对象

        for (uint i = 0; i < rentInfos.length; i++) {
            if (keccak256(abi.encodePacked(rentInfos[i].uniqueKey)) == keccak256(abi.encodePacked(uniqueKey)) && rentInfos[i].isTerminated == false) {
                return rentInfos[i]; // 找到匹配的 RentInfo 对象，立即返回
            }
        }

        return emptyRentInfo; // 没有找到匹配的 RentInfo 对象，返回空对象
    }

    function getTenantRentInfoByAd(address tenantAddress) public view returns (RentInfo memory) {
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
            uniqueKey:getUniqueKey(rentId, tenants[tenantId - 1].tenantAddress)
        }));
        rooms[_roomId - 1].isAvailable = false;
        rooms[_roomId - 1].status = "Occupied";
        emit RoomStatusUpdated(_roomId, "Occupied", block.timestamp);
    }

    function addressToString(address _addr) internal pure returns (string memory) {
        bytes32 value = bytes32(uint256(uint160(_addr)));
        bytes memory alphabet = "0123456789abcdef";

        bytes memory str = new bytes(42);
        str[0] = '0';
        str[1] = 'x';
        for (uint256 i = 0; i < 20; i++) {
            str[2 + i * 2] = alphabet[uint8(value[i + 12] >> 4)];
            str[3 + i * 2] = alphabet[uint8(value[i + 12] & 0x0f)];
        }
        return string(str);
    }

    function payRent(uint256 rentId,uint256 nextTime) external payable {
        require(rentId > 0 && rentId <= rentInfos.length, "Invalid rentId");
        rentInfos[rentId - 1].nextTime = nextTime;

        payable(landLordOnly.landlordAddress).transfer(msg.value);
        emit RentPaid(msg.sender, rentId, msg.value, block.timestamp);
    }

    function getUniqueKey(uint256 randomNumber, address addr) internal pure returns (string memory) {
        return string(abi.encodePacked(randomNumber, addressToString(addr)));
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

    function getAgreement() public view returns (Agreement memory) {
        return agreements;
    }

    function getAllRooms() public view returns (Room[] memory) {
        return rooms;
    }

    function getAllRequest() public view returns (MaintenanceRequest[] memory) {
        return maintenanceRequests;
    }
    
    //test
    function getallTe() public view returns (RentInfo[] memory) {
        return rentInfos;
    }

}
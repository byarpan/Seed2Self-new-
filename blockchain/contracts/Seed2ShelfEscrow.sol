// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract Seed2ShelfEscrow {
    enum PaymentStatus { WAITING_FOR_PAYMENT, LOCKED, RELEASED }
    enum DeliveryStatus { PENDING, SHIPPED, DELIVERED }
    enum OrderStatus { PENDING, ACCEPTED, REJECTED, COMPLETED }

    struct Batch {
        string batchId;
        string[] parentBatchIds;
        address currentOwner;
        string currentOwnerRole;
        uint256 quantity;
        string cropName;
        uint256 createdTimestamp;
        string status;
    }

    struct Order {
        string orderId;
        address buyer;
        address seller;
        uint256 amount;
        uint256 quantity;
        string batchId;
        PaymentStatus paymentStatus;
        DeliveryStatus deliveryStatus;
        OrderStatus orderStatus;
    }

    mapping(string => Batch) private batches;
    mapping(string => Order) private orders;
    
    // Tracking parent-to-child relationships for history
    mapping(string => string[]) private batchChildren;
    
    // Store lists of keys for retrieval
    string[] private batchIds;
    string[] private orderIds;

    // Events
    event BatchCreated(string batchId, string cropName, uint256 quantity, address owner);
    event BatchSplit(string parentBatchId, string childBatchId, uint256 quantitySplit, address newOwner);
    event BatchMerged(string[] parentBatchIds, string childBatchId, uint256 quantityMerged, address newOwner);
    event OrderCreated(string orderId, string batchId, address buyer, address seller, uint256 amount);
    event PaymentLocked(string orderId, address buyer, uint256 amount);
    event OrderAccepted(string orderId, address seller);
    event ShipmentStarted(string orderId, string batchId);
    event ShipmentDelivered(string orderId, string batchId);
    event PaymentReleased(string orderId, address seller, uint256 amount);
    event OwnershipTransferred(string batchId, address previousOwner, address newOwner);

    modifier onlyBatchOwner(string memory _batchId) {
        require(batches[_batchId].currentOwner == msg.sender, "Not the batch owner");
        _;
    }

    modifier onlyOrderSeller(string memory _orderId) {
        require(orders[_orderId].seller == msg.sender, "Not the order seller");
        _;
    }

    modifier onlyOrderBuyer(string memory _orderId) {
        require(orders[_orderId].buyer == msg.sender, "Not the order buyer");
        _;
    }

    // Smart contract functions
    function createBatch(
        string memory _batchId,
        uint256 _quantity,
        string memory _cropName,
        string memory _role,
        string memory _status
    ) external {
        require(bytes(batches[_batchId].batchId).length == 0, "Batch already exists");
        
        string[] memory emptyParents;
        batches[_batchId] = Batch({
            batchId: _batchId,
            parentBatchIds: emptyParents,
            currentOwner: msg.sender,
            currentOwnerRole: _role,
            quantity: _quantity,
            cropName: _cropName,
            createdTimestamp: block.timestamp,
            status: _status
        });
        batchIds.push(_batchId);

        emit BatchCreated(_batchId, _cropName, _quantity, msg.sender);
    }

    function createChildBatch(
        string memory _childBatchId,
        string[] memory _parentBatchIds,
        uint256 _quantity,
        string memory _cropName,
        string memory _role,
        string memory _status
    ) external {
        require(bytes(batches[_childBatchId].batchId).length == 0, "Child batch already exists");
        
        batches[_childBatchId] = Batch({
            batchId: _childBatchId,
            parentBatchIds: _parentBatchIds,
            currentOwner: msg.sender,
            currentOwnerRole: _role,
            quantity: _quantity,
            cropName: _cropName,
            createdTimestamp: block.timestamp,
            status: _status
        });
        batchIds.push(_childBatchId);

        for (uint256 i = 0; i < _parentBatchIds.length; i++) {
            batchChildren[_parentBatchIds[i]].push(_childBatchId);
        }

        emit BatchCreated(_childBatchId, _cropName, _quantity, msg.sender);
    }

    function splitBatch(
        string memory _parentBatchId,
        string memory _childBatchId,
        uint256 _quantityToSplit,
        address _newOwner,
        string memory _newOwnerRole
    ) external {
        Batch storage parent = batches[_parentBatchId];
        require(bytes(parent.batchId).length > 0, "Parent batch does not exist");
        require(parent.quantity >= _quantityToSplit, "Insufficient quantity in parent batch");

        parent.quantity -= _quantityToSplit;
        if (parent.quantity == 0) {
            parent.status = "SOLD";
        } else {
            parent.status = "PARTIALLY_SOLD";
        }

        string[] memory parentsList = new string[](1);
        parentsList[0] = _parentBatchId;

        batches[_childBatchId] = Batch({
            batchId: _childBatchId,
            parentBatchIds: parentsList,
            currentOwner: _newOwner,
            currentOwnerRole: _newOwnerRole,
            quantity: _quantityToSplit,
            cropName: parent.cropName,
            createdTimestamp: block.timestamp,
            status: "AVAILABLE"
        });
        batchIds.push(_childBatchId);
        batchChildren[_parentBatchId].push(_childBatchId);

        emit BatchSplit(_parentBatchId, _childBatchId, _quantityToSplit, _newOwner);
        emit BatchCreated(_childBatchId, parent.cropName, _quantityToSplit, _newOwner);
    }

    function mergeBatch(
        string[] memory _parentBatchIds,
        string memory _childBatchId,
        uint256 _newQuantity,
        string memory _cropName,
        string memory _role
    ) external {
        require(bytes(batches[_childBatchId].batchId).length == 0, "Child batch already exists");
        require(_parentBatchIds.length > 0, "No parent batches provided");

        for (uint256 i = 0; i < _parentBatchIds.length; i++) {
            string memory parentId = _parentBatchIds[i];
            Batch storage parent = batches[parentId];
            require(bytes(parent.batchId).length > 0, "Parent batch does not exist");
            parent.quantity = 0;
            parent.status = "SOLD";
            batchChildren[parentId].push(_childBatchId);
        }

        batches[_childBatchId] = Batch({
            batchId: _childBatchId,
            parentBatchIds: _parentBatchIds,
            currentOwner: msg.sender,
            currentOwnerRole: _role,
            quantity: _newQuantity,
            cropName: _cropName,
            createdTimestamp: block.timestamp,
            status: "AVAILABLE"
        });
        batchIds.push(_childBatchId);

        emit BatchMerged(_parentBatchIds, _childBatchId, _newQuantity, msg.sender);
        emit BatchCreated(_childBatchId, _cropName, _newQuantity, msg.sender);
    }

    function createOrder(
        string memory _orderId,
        address _seller,
        uint256 _amount,
        uint256 _quantity,
        string memory _batchId
    ) external payable {
        require(bytes(orders[_orderId].orderId).length == 0, "Order already exists");
        
        orders[_orderId] = Order({
            orderId: _orderId,
            buyer: msg.sender,
            seller: _seller,
            amount: _amount,
            quantity: _quantity,
            batchId: _batchId,
            paymentStatus: PaymentStatus.LOCKED,
            deliveryStatus: DeliveryStatus.PENDING,
            orderStatus: OrderStatus.PENDING
        });
        orderIds.push(_orderId);

        emit OrderCreated(_orderId, _batchId, msg.sender, _seller, _amount);
        emit PaymentLocked(_orderId, msg.sender, _amount);
    }

    function lockPayment(string memory _orderId) external payable {
        Order storage order = orders[_orderId];
        require(bytes(order.orderId).length > 0, "Order does not exist");
        require(order.paymentStatus == PaymentStatus.WAITING_FOR_PAYMENT, "Payment already locked or released");
        
        order.paymentStatus = PaymentStatus.LOCKED;
        emit PaymentLocked(_orderId, order.buyer, order.amount);
    }

    function acceptOrder(string memory _orderId) external onlyOrderSeller(_orderId) {
        Order storage order = orders[_orderId];
        require(order.orderStatus == OrderStatus.PENDING, "Order is not pending");
        
        order.orderStatus = OrderStatus.ACCEPTED;
        emit OrderAccepted(_orderId, msg.sender);
    }

    function shipOrder(string memory _orderId) external onlyOrderSeller(_orderId) {
        Order storage order = orders[_orderId];
        require(order.orderStatus == OrderStatus.ACCEPTED, "Order is not accepted yet");
        require(order.deliveryStatus == DeliveryStatus.PENDING, "Order already shipped or delivered");

        order.deliveryStatus = DeliveryStatus.SHIPPED;
        emit ShipmentStarted(_orderId, order.batchId);
    }

    function confirmDelivery(string memory _orderId) external onlyOrderBuyer(_orderId) {
        Order storage order = orders[_orderId];
        require(order.deliveryStatus == DeliveryStatus.SHIPPED, "Order must be shipped first");
        
        order.deliveryStatus = DeliveryStatus.DELIVERED;
        emit ShipmentDelivered(_orderId, order.batchId);
    }

    function releasePayment(string memory _orderId) external {
        Order storage order = orders[_orderId];
        require(bytes(order.orderId).length > 0, "Order does not exist");
        require(order.deliveryStatus == DeliveryStatus.DELIVERED, "Order not delivered yet");
        require(order.paymentStatus == PaymentStatus.LOCKED, "Payment not locked");

        order.paymentStatus = PaymentStatus.RELEASED;
        order.orderStatus = OrderStatus.COMPLETED;

        uint256 amt = order.amount;
        if (address(this).balance >= amt) {
            payable(order.seller).transfer(amt);
        }

        emit PaymentReleased(_orderId, order.seller, amt);
    }

    function transferOwnership(string memory _batchId, address _newOwner, string memory _newOwnerRole) external {
        Batch storage batch = batches[_batchId];
        require(bytes(batch.batchId).length > 0, "Batch does not exist");

        address prev = batch.currentOwner;
        batch.currentOwner = _newOwner;
        batch.currentOwnerRole = _newOwnerRole;

        emit OwnershipTransferred(_batchId, prev, _newOwner);
    }

    // Getters
    function getBatch(string memory _batchId) external view returns (Batch memory) {
        require(bytes(batches[_batchId].batchId).length > 0, "Batch does not exist");
        return batches[_batchId];
    }

    function getOrder(string memory _orderId) external view returns (Order memory) {
        require(bytes(orders[_orderId].orderId).length > 0, "Order does not exist");
        return orders[_orderId];
    }

    function getBatchHistory(string memory _batchId) external view returns (string[] memory) {
        return batchChildren[_batchId];
    }

    function getParentBatches(string memory _batchId) external view returns (string[] memory) {
        return batches[_batchId].parentBatchIds;
    }
}

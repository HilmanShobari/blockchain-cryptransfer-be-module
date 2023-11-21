// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "./ERC721Soulbound.sol";
import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";

contract DigitalHealth is ERC721Soulbound {
	using Strings for uint256;
	using ECDSA for bytes32;

	bytes32 public constant messagehash = keccak256("secret");
	address private _chief;
	uint256[] private _listNoID;

	// Mapping staff address to authorization
	mapping(address => bool) private _staff;

	// Mapping owner address to No ID
	mapping(address => uint256) private _ownedNoID;

	// Mapping No ID to is Exist
	mapping(uint256 => bool) private _isExist;

	// Mapping No ID to tokenId
	mapping(uint256 => uint256) private _noID;

	// Mapping No ID to Data (key => value)
	mapping(uint256 => string) private _data;

	constructor(string memory name, string memory symbol, address[] memory staffs) ERC721Soulbound(name, symbol) {
		_chief = _msgSender();

		for (uint256 i; i < staffs.length; i++) {
			address staff = staffs[i];
			_staff[staff] = true;
		}
	}

	modifier onlyChiefStaff() {
		require(_msgSender() == _chief, "Only Chief Staff can used this function");
		_;
	}

	modifier onlyStaff() {
		require(_staff[_msgSender()] || _msgSender() == _chief, "Only Staff can used this function");
		_;
	}

	// Function for Chief Staff

	function setStaff(address staff, bool approval) public onlyChiefStaff {
		_staff[staff] = approval;
	}

	function handoverChiefStaff(address newChief) public onlyChiefStaff {
		_chief = newChief;
	}

	// Function for staff

	function addData(address user, uint256 noID, string memory data) public onlyStaff {
		require(!_isExist[noID], "This No ID is owned by other user");
		require(_ownedNoID[user] == 0, "This address is already have token");

		_data[noID] = data;
		_safeMint(user, noID);
		_ownedNoID[user] = noID;
		_isExist[noID] = true;
		_noID[noID] = noID;
		_listNoID.push(noID);
	}

	function editData(uint256 oldNoID, uint256 newNoID, string memory data) public onlyStaff {
		require(_isExist[oldNoID], "Data is not exist");

		if (oldNoID == newNoID) {
			_data[oldNoID] = data;
		} else {
			_data[oldNoID] = "";
			_data[newNoID] = data;
		}
		_isExist[oldNoID] = false;
		_isExist[newNoID] = true;
	}

	function deleteData(uint256 noID) public onlyStaff {
		require(_isExist[noID], "Data is not exist");

		_isExist[noID] = false;
	}

	// Function getter

	function getStaff(address staff) public view onlyStaff returns (bool) {
		return _staff[staff];
	}

	function getChiefStaff() public view onlyStaff returns (address) {
		return _chief;
	}

	function getOwnedData() public view returns (string memory, uint256) {
		uint256 noID = _ownedNoID[_msgSender()];

		require(_isExist[noID], "Data is not exist");

		string memory data = _data[noID];

		return (data, noID);
	}

	function getDataByNoID(uint256 noID) public view returns (string memory) {
		require(_isExist[noID], "Data is not exist");

		string memory data = _data[noID];

		return (data);
	}

	function getDataByAddress(address user) public view returns (string memory, uint256) {
		uint256 noID = _ownedNoID[user];

		require(_isExist[noID], "Data is not exist");

		string memory data = _data[noID];

		return (data, noID);
	}

	function validate(bytes memory signature, string memory data) public view returns (bool) {
		address user = messagehash.toEthSignedMessageHash().recover(signature);
		uint256 noID = _ownedNoID[user];
		string memory tempData;

		require(_isExist[noID], "Data is not exist");

		if (noID == 0) return false;

		tempData = _data[noID];
		bytes32 tempByte = keccak256(bytes(tempData));
		bytes32 dataByte = keccak256(bytes(data));
		if (tempByte != dataByte) return false;

		return true;
	}

	function getListData(
		int256 page,
		bool isLatest,
		int256 _itemsPerPage
	) public view onlyStaff returns (uint256[] memory, uint256[] memory, address[] memory) {
		require(page > 0, "Page input is invalid");
		require(_itemsPerPage > 0, "Item per page input is not valid");

		int256 startIndex;
		int256 endIndex;
		int256 length;

		if (isLatest) {
			startIndex = int256(_listNoID.length) - (_itemsPerPage * (page - 1)) - 1;
			endIndex = int256(_listNoID.length) - (_itemsPerPage * page);

			require(startIndex >= 0, "Page is not exist");
			if (endIndex >= 0) length = _itemsPerPage;
			else length = startIndex + 1;
		} else {
			startIndex = _itemsPerPage * (page - 1);
			endIndex = (_itemsPerPage * page) - 1;

			require(startIndex < int256(_listNoID.length), "Page is not exist");
			if (endIndex < int256(_listNoID.length)) length = _itemsPerPage;
			else length = int256(_listNoID.length) - (_itemsPerPage * (page - 1));
		}

		// Data[] memory listData = new Data[](uint(length));
		uint256[] memory listTokenID = new uint256[](uint256(length));
		uint256[] memory listNoID = new uint256[](uint256(length));
		address[] memory listAddress = new address[](uint256(length));

		if (isLatest) {
			for (uint256 i; i < uint256(length); i++) {
				uint256 noID = _listNoID[uint256(startIndex) - i];
				uint256 tokenId = _noID[noID];
				// listData[i] = _data[noID];
				listTokenID[i] = tokenId;
				listNoID[i] = noID;
				listAddress[i] = _ownerOf(tokenId);
			}
		} else {
			for (uint256 i; i < uint256(length); i++) {
				uint256 noID = _listNoID[uint256(startIndex) + i];
				uint256 tokenId = _noID[noID];
				// listData[i] = _data[noID];
				listTokenID[i] = tokenId;
				listNoID[i] = noID;
				listAddress[i] = _ownerOf(tokenId);
			}
		}

		// return (listData, listNoID, listAddress);
		return (listTokenID, listNoID, listAddress);
	}
}

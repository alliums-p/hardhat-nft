// SPDX-License-Identifier: MIT
pragma solidity 0.8.9;

contract encoding {
    function combineString() public pure returns (string memory) {
        return string(abi.encodePacked("Hi Mom! ", "Miss you!"));
    }

    function encodeStringData(string memory data) public pure returns (bytes memory) {
        return abi.encode(data);
    } 

    function decodeStringData(bytes memory data) public pure returns (string memory) {
        (string memory _returnData) = abi.decode(data, (string));
        return _returnData;
    }

    function encodeNumber() public pure returns (bytes memory) {
        return abi.encode(1);
    }

    function encodeString() public pure returns (bytes memory) {
        return abi.encode("hello world");
    }

    function encodeStringPacked() public pure returns (bytes memory) {
        return abi.encodePacked("hello world");
    }

    function encodeStringBytes() public pure returns (bytes memory) {
        return bytes("hello world");
    }

    function multiEncode() public pure returns (bytes memory) {
        return abi.encode("some string", "it's bigger!");
    }

    function multiDecode() public pure returns (string memory, string memory) {
        (string memory someString, string memory otherString) = abi.decode(multiEncode(), (string, string));
        return (someString, otherString);
    }

    function multiEncodePacked() public pure returns (bytes memory) {
        return abi.encodePacked("some string", "it's bigger!");
    }

    // Only type casting works for bytes encoded using encodePacked function
    function multiStringCastPacked() public pure returns (string memory) {
        string memory someString = string(multiEncodePacked());
        return someString;
    }
}
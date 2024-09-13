// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

// modules
import {LSP8Mintable} from "@lukso/lsp-smart-contracts/contracts/LSP8IdentifiableDigitalAsset/presets/LSP8Mintable.sol";

// constants
import {_LSP8_TOKENID_FORMAT_NUMBER} from "@lukso/lsp-smart-contracts/contracts/LSP8IdentifiableDigitalAsset/LSP8Constants.sol";
import {_LSP4_TOKEN_TYPE_COLLECTION} from "@lukso/lsp-smart-contracts/contracts/LSP4DigitalAssetMetadata/LSP4Constants.sol";

contract ContentPostCollection is LSP8Mintable {
    constructor(
        string memory nftCollectionName,
        string memory nftCollectionSymbol,
        address contractOwner
    )
        LSP8Mintable(
            nftCollectionName, // NFT collection name
            nftCollectionSymbol, // NFT collection symbol
            contractOwner, // owner of the NFT contract (the address that controls it, sets metadata, can transfer the ownership of the contract)
            _LSP4_TOKEN_TYPE_COLLECTION, // type of the token is collection
            _LSP8_TOKENID_FORMAT_NUMBER // format of each `tokenId`s is number (represented as bytes32)
        )
    {
        // contract logic goes here...
    }
}

// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/AccessControl.sol";

contract EvidenceChain is AccessControl {

    // ================= ROLES =================

    bytes32 public constant JUDGE_ROLE = keccak256("JUDGE_ROLE");

    // ================= ENUM =================

    enum EvidenceStatus {
        ACTIVE,
        MARKED_FALSE
    }

    // ================= STRUCT =================

    struct Evidence {
        string caseId;          // Off-chain generated UUID
        string evidenceId;      // Off-chain generated ID
        bytes32 fileHash;       // SHA-256 of original file
        string ipfsCID;         // Encrypted file CID
        uint256 aiScore;        // AI deepfake score
        address registeredBy;   // Admin wallet
        uint256 registeredAt;
        EvidenceStatus status;
        bool exists;
    }

    // ================= STORAGE =================

    mapping(string => Evidence) private evidenceRecords;

    // ================= EVENTS =================

    event EvidenceRegistered(
        string indexed evidenceId,
        string caseId,
        bytes32 fileHash,
        string ipfsCID,
        uint256 aiScore,
        address indexed registeredBy,
        uint256 timestamp
    );

    event EvidenceViewed(
        string indexed evidenceId,
        address indexed judge,
        uint256 timestamp
    );

    event EvidenceMarkedFalse(
        string indexed evidenceId,
        address indexed judge,
        uint256 timestamp
    );

    // ================= CONSTRUCTOR =================

    constructor() {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(DEFAULT_ADMIN_ROLE, 0xee0EBD633fC6f3Be3720e194c1Ed5e9Bd869567E);
    }

    // ================= REGISTER APPROVED EVIDENCE =================
    // Called by Admin wallet AFTER AWS verification

    function registerEvidence(
        string memory caseId,
        string memory evidenceId,
        bytes32 fileHash,
        string memory ipfsCID,
        uint256 aiScore
    ) external onlyRole(DEFAULT_ADMIN_ROLE) {

        require(!evidenceRecords[evidenceId].exists, "Already registered");

        evidenceRecords[evidenceId] = Evidence({
            caseId: caseId,
            evidenceId: evidenceId,
            fileHash: fileHash,
            ipfsCID: ipfsCID,
            aiScore: aiScore,
            registeredBy: msg.sender,
            registeredAt: block.timestamp,
            status: EvidenceStatus.ACTIVE,
            exists: true
        });

        emit EvidenceRegistered(
            evidenceId,
            caseId,
            fileHash,
            ipfsCID,
            aiScore,
            msg.sender,
            block.timestamp
        );
    }

    // ================= JUDGE VIEW =================

    function viewEvidence(string memory evidenceId)
        external
        onlyRole(JUDGE_ROLE)
    {
        require(evidenceRecords[evidenceId].exists, "Not found");

        emit EvidenceViewed(
            evidenceId,
            msg.sender,
            block.timestamp
        );
    }

    // ================= JUDGE MARK FALSE =================

    function markEvidenceFalse(string memory evidenceId)
        external
        onlyRole(JUDGE_ROLE)
    {
        require(evidenceRecords[evidenceId].exists, "Not found");
        require(
            evidenceRecords[evidenceId].status == EvidenceStatus.ACTIVE,
            "Already marked"
        );

        evidenceRecords[evidenceId].status = EvidenceStatus.MARKED_FALSE;

        emit EvidenceMarkedFalse(
            evidenceId,
            msg.sender,
            block.timestamp
        );
    }

 

    function getEvidence(string memory evidenceId)
        external
        view
        returns (Evidence memory)
    {
        require(evidenceRecords[evidenceId].exists, "Not found");
        return evidenceRecords[evidenceId];
    }



    function addJudge(address account)
        external
        onlyRole(DEFAULT_ADMIN_ROLE)
    {
        grantRole(JUDGE_ROLE, account);
    }
}
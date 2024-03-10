"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteCaseAttachment = exports.updateCaseAttachment = exports.GetCaseAttachmentById = exports.downloadingCaseAttachments = exports.uploadingCaseAttachments = void 0;
const path_1 = __importDefault(require("path"));
const CaseAttachment_1 = require("../../prisma/queries/CaseAttachment");
const fs_1 = __importDefault(require("fs"));
const rbacMiddleware_1 = require("../../src/middleware/rbacMiddleware");
const UPLOADS_FOLDER = path_1.default.join(__dirname, '..', 'uploads');
const prismaCaseAttachment = new CaseAttachment_1.PrismaCaseAttachment();
const uploadingCaseAttachments = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId } = req;
        const isOk = (0, rbacMiddleware_1.checkForUser)(req, res);
        if (!isOk) {
            return res.status(401).json({
                error: 'Unauthorized',
            });
        }
        const { caseId } = req.params;
        const file = req.file;
        if (!file) {
            return;
        }
        const { fileName, fileUrl } = file;
        if (!fileName ||
            !fileName ||
            typeof fileName !== 'string' ||
            typeof fileUrl !== 'string') {
            return res.status(403).json({ error: 'Invalid File , Try Again' });
        }
        const data = {
            fileUrl,
            fileName,
            uploadTime: new Date(),
        };
        yield prismaCaseAttachment.createCaseAttachment(data, // Assuming you have other attachment data to include
        BigInt(caseId), userId);
        res
            .status(201)
            .json({ message: 'File uploaded successfully', fileName, caseId });
    }
    catch (error) {
        console.error('Error uploading attachment:', error);
        res.status(500).json({ error: 'Failed to upload attachment' });
    }
});
exports.uploadingCaseAttachments = uploadingCaseAttachments;
const downloadingCaseAttachments = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { filename } = req.params;
        const userId = req;
        if (!userId || typeof userId !== 'string') {
            return res.status(401).json({
                error: 'Unauthorized',
            });
        }
        // Construct the file path
        const filePath = path_1.default.join(UPLOADS_FOLDER, filename);
        // Check if the file exists
        if (!fs_1.default.existsSync(filePath)) {
            return res.status(404).json({ error: 'File not found' });
        }
        // Download the file
        res.download(filePath, filename);
    }
    catch (error) {
        console.error('Error downloading attachment:', error);
        res.status(500).json({ error: 'Failed to download attachment' });
    }
});
exports.downloadingCaseAttachments = downloadingCaseAttachments;
function GetCaseAttachmentById(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const attachmentId = BigInt(req.params.attachmentId);
            const attachment = yield prismaCaseAttachment.getCaseAttachmentById(attachmentId, req.userId);
            if (!attachment) {
                return res.status(404).json({ error: 'Attachment not found' });
            }
            res.json(attachment);
        }
        catch (error) {
            console.error('Error retrieving attachment:', error);
            res.status(500).json({ error: 'Failed to retrieve attachment' });
        }
    });
}
exports.GetCaseAttachmentById = GetCaseAttachmentById;
function updateCaseAttachment(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const attachmentId = BigInt(req.params.attachmentId);
            const { data } = req.body;
            const attachment = yield prismaCaseAttachment.updateCaseAttachment(attachmentId, req.userId, data);
            if (!attachment) {
                return res.status(404).json({ error: 'Attachment not found' });
            }
            res.json(attachment);
        }
        catch (error) {
            console.error('Error updating attachment:', error);
            res.status(500).json({ error: 'Failed to update attachment' });
        }
    });
}
exports.updateCaseAttachment = updateCaseAttachment;
function deleteCaseAttachment(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const attachmentId = BigInt(req.params.attachmentId);
            const attachment = yield prismaCaseAttachment.deleteCaseAttachment(attachmentId, req.userId);
            if (!attachment) {
                return res.status(404).json({ error: 'Attachment not found' });
            }
            res.json({ message: 'Attachment deleted successfully' });
        }
        catch (error) {
            console.error('Error deleting attachment:', error);
            res.status(500).json({ error: 'Failed to delete attachment' });
        }
    });
}
exports.deleteCaseAttachment = deleteCaseAttachment;

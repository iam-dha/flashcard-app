//Models
const Folder = require("../../models/folder.model");
const Flashcard = require("../../models/flashcard.model");
const FolderFlashcard = require("../../models/folderFlashcard.model");
const User = require("../../models/user.model");

// [GET] /api/v1/folders?page=x&limit=y
module.exports.getAllFolders = async (req, res) => {
    const userId = req.userId;
    const page = parseInt(req.query.page) > 0 ? parseInt(req.query.page) : 1;
    const limit = parseInt(req.query.limit) > 0 ? parseInt(req.query.limit) : 10;
    const skip = (page - 1) * limit;

    try {
        const totalCount = await Folder.countDocuments({ userId });

        const folders = await Folder.find({ userId })
            .select("-__v -createdAt -updatedAt -userId -_id")
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        return res.status(200).json({
            total_count: folders.length,
            page: page,
            total_pages: Math.ceil(totalCount / limit),
            folders: folders,
        });
    } catch (error) {
        console.error(`[GET /api/v1/folders] Error:`, error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

//[POST] /api/v1/folders
module.exports.createFolder = async (req, res) => {
    const userId = req.userId;
    const { name, description, tags, isPublic } = req.body;
    try {
        if(typeof name !== "string" || name.trim() === ""){
            return res.status(400).json({message: "Name is required and must be a string"});
        }
        if (isPublic !== undefined && typeof isPublic !== "boolean") {
            return res.status(400).json({ message: "'isPublc' must be a boolean" });
        }
        const folder = new Folder({
            name,
            description,
            tags,
            isPublic,
            userId,
        });
        await folder.save();
        return res.status(201).json({
            message: "Folder created successfully",
            folder: {
                name: folder.name,
                slug: folder.slug,
                description: folder.description,
                tags: folder.tags,
                isPublic: folder.isPublic,
                createdAt: folder.createdAt,
            },
        });
    } catch (error) {
        console.error(`[POST /api/v1/folders] Error:`, error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

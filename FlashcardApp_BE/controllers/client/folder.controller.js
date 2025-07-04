const mongoose = require("mongoose");
//Models
const Folder = require("../../models/folder.model");
const Flashcard = require("../../models/flashcard.model");
const FolderFlashcard = require("../../models/folderFlashcard.model");
const User = require("../../models/user.model");
const { parse } = require("path");
const { exist } = require("joi");

// [GET] /api/v1/folders?page=x&limit=y&sort=createdAt&order=asc&getAll=true
module.exports.getAllFolders = async (req, res) => {
    const userId = req.userId;
    const getAll = req.query.getAll == "true" ? true : false;
    if (!getAll) {
        const page =
            parseInt(req.query.page) > 0 ? parseInt(req.query.page) : 1;
        const limit =
            parseInt(req.query.limit) > 0 ? parseInt(req.query.limit) : 10;
        const skip = (page - 1) * limit;
        const { sort = "createdAt", order = "asc" } = req.query;
        const sortFields = ["createdAt", "name", "updatedAt", "isPublic"];
        const sortFilter = sortFields.includes(sort) ? sort : "createdAt";
        const sortOrder = order === "asc" ? 1 : -1;
        try {
            const totalCount = await Folder.countDocuments({ userId });
            const folders = await Folder.find({ userId })
                .select("-__v -updatedAt -userId -_id")
                .sort({ [sortFilter]: sortOrder })
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
    } else {
        try {
            const folders = await Folder.find({ userId })
                .select("-__v -updatedAt -userId -_id")
                .sort({ flashcardCount: -1 });
            return res.status(200).json({
                total_count: folders.length,
                folders: folders,
            });
        } catch (error) {
            console.error(`[GET /api/v1/folders] Error:`, error);
            return res.status(500).json({ message: "Internal server error" });
        }
    }
};

//[POST] /api/v1/folders
module.exports.createFolder = async (req, res) => {
    const userId = req.userId;
    const { name, description, tags, isPublic } = req.body;
    try {
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

// [GET] /api/v1/folders/:slug
module.exports.getFolderBySlug = async (req, res) => {
    const userId = req.userId;
    const slug = req.params.slug;
    try {
        const folder = await Folder.findOne({
            slug: slug,
        }).select("-__v -updatedAt -_id");

        if (!folder) {
            return res.status(404).json({ message: "Folder is not found" });
        }
        if (folder.userId.toString() !== userId) {
            if (!folder.isPublic) {
                return res.status(403).json({
                    message: "You do not have permission to access this folder",
                });
            }
            return res.status(200).json(folder);
        }
        return res.status(200).json(folder);
    } catch (error) {
        console.error(`[GET /api/v1/folders/:slug] Error:`, error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

// [PATCH] /api/v1/folders/:slug
module.exports.updateFolder = async (req, res) => {
    const userId = req.userId;
    const slug = req.params.slug;
    const { name, description, tags, isPublic } = req.body;
    try {
        const folder = await Folder.findOne({
            slug: slug,
            userId: userId,
        });
        if (!folder) {
            return res.status(404).json({ message: "Folder is not found" });
        }
        if (folder.isDefault) {
            return res
                .status(400)
                .json({ message: "Cannot update default folder" });
        }
        folder.name = name || folder.name;
        folder.description = description || folder.description;
        if (Array.isArray(tags)) {
            folder.tags = tags;
        }
        folder.isPublic = isPublic !== undefined ? isPublic : folder.isPublic;
        await folder.save();
        return res.status(200).json({
            message: "Folder updated successfully",
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
        console.error(`[PATCH /api/v1/folders/${id}] Error:`, error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

// [DELETE] /api/v1/folders/:slug
module.exports.deleteFolder = async (req, res) => {
    const userId = req.userId;
    const slug = req.params.slug;

    try {
        const folder = await Folder.findOne({
            slug: slug,
            userId: userId,
        });
        if (!folder) {
            return res.status(404).json({ message: "Folder is not found" });
        }
        if (folder.isDefault) {
            return res
                .status(400)
                .json({ message: "Cannot delete default folder" });
        }
        // Delete all mapping to flashcards
        await FolderFlashcard.deleteMany({ folderId: folder._id });
        await Folder.deleteOne({ _id: folder._id });
        res.status(200).json({
            message: "Delete folder successfully",
            folder: {
                name: folder.name,
                slug: folder.slug,
                description: folder.description,
            },
        });
    } catch (error) {
        console.error(`[DELETE /api/v1/folders/:slug] Error:`, error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

// [GET] /api/v1/folders/:slug/flashcards?page=x&limit=y&sort=createdAt&order=asc
module.exports.getFolderFlashcards = async (req, res) => {
    const userId = req.userId;
    const slug = req.params.slug;
    const page = parseInt(req.query.page) > 0 ? parseInt(req.query.page) : 1;
    const limit =
        parseInt(req.query.limit) > 0 ? parseInt(req.query.limit) : 10;
    const skip = (page - 1) * limit;
    const { sort = "addedAt", order = "asc" } = req.query;
    const sortFields = ["addedAt", "updatedAt", "word"];
    const sortFilter = sortFields.includes(sort) ? sort : "addedAt";
    const sortOrder = order === "asc" ? 1 : -1;
    try {
        const folder = await Folder.findOne({
            slug: slug,
        }).select("-__v -updatedAt");
        if (!folder) {
            return res.status(404).json({ message: "Folder is not found" });
        }
        if (folder.userId.toString() !== userId) {
            if (!folder.isPublic) {
                return res.status(403).json({
                    message: "You do not have permission to access this folder",
                });
            }
        }
        const totalCount = await FolderFlashcard.countDocuments({
            folderId: folder._id,
        });
        console.log(sortFilter);
        let flashcards = await FolderFlashcard.find({
            folderId: folder._id,
        })
            .skip(skip)
            .limit(limit)
            .populate({
                path: "flashcardId",
                select: "word _id slug vi_meanings",
            })
            .sort({ [sortFilter]: sortOrder });
        if (sortFilter === "word") {
            flashcards = flashcards.sort((a, b) => {
                const word_1 = a.flashcardId?.word.toLowerCase() || "";
                const word_2 = b.flashcardId?.word.toLowerCase() || "";
                return sortOrder === 1
                    ? word_1.localeCompare(word_2)
                    : word_2.localeCompare(word_1);
            });
        }
        const flashcardsList = flashcards
            .map((flashcard) => {
                return flashcard.flashcardId;
            })
            .filter((flashcard) => {
                return flashcard !== null;
            });

        return res.status(200).json({
            total_count: totalCount,
            page: page,
            total_pages: Math.ceil(totalCount / limit),
            flashcards: flashcardsList,
        });
    } catch (error) {
        console.error(`[GET /api/v1/folders/:slug/flashcards] Error:`, error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

// [POST] /api/v1/folders/flashcards
module.exports.addFlashcard = async (req, res) => {
    const userId = req.userId;
    const foldersSlug = req.body.folders;
    const noSelectedFoldersSlug = req.body.noSelectedFolders || [];
    const flashcardId = req.body.flashcardId;
    if (!flashcardId) {
        return res.status(400).json({ message: "Flashcard ID is required" });
    }
    if (!mongoose.Types.ObjectId.isValid(flashcardId)) {
        return res.status(400).json({ message: "Invalid flashcard ID" });
    }
    try {
        const flashcard = await Flashcard.findOne({
            _id: flashcardId,
        });

        if (!flashcard) {
            return res.status(404).json({ message: "Flashcard is not found" });
        }
        for (const slug of foldersSlug) {
            if (typeof slug !== "string" || slug.trim() === "") continue;
            const folder = await Folder.findOne({
                slug: slug,
                userId: userId,
            });
            if (!folder) {
                return res.status(404).json({
                    message: `Folder with slug ${slug} is not found`,
                });
            }
            const existingInFolder = await FolderFlashcard.findOne({
                folderId: folder._id,
                flashcardId: flashcard._id,
            });

            if (!existingInFolder) {
                const folderFlashcardMapping = new FolderFlashcard({
                    folderId: folder._id,
                    flashcardId: flashcard._id,
                });
                await folderFlashcardMapping.save();
                folder.flashcardCount += 1;
                await folder.save();
            }
        }
        for (const slug of noSelectedFoldersSlug) {
            if (typeof slug !== "string" || slug.trim() === "") continue;
            const folder = await Folder.findOne({
                slug: slug,
                userId: userId,
            });
            if (!folder) {
                return res.status(404).json({
                    message: `Folder with slug ${slug} is not found`,
                });
            }
            const deleted = await FolderFlashcard.findOneAndDelete({
                folderId: folder._id,
                flashcardId: flashcard._id,
            });

            if(deleted) {
                folder.flashcardCount -= 1;
                await folder.save();
            }
        }
        res.status(200).json({
            message: "Flashcard added to folder successfully",
            folder: foldersSlug,
        });
    } catch (error) {
        console.error(`[POST /api/v1/folders/:slug/flashcards] Error:`, error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

// [GET] /api/v1/folders/:slug/flashcards/:fc_slug
module.exports.getFlashcardInFolder = async (req, res) => {
    const userId = req.userId;
    const folder_slug = req.params.slug;
    const flashcard_slug = req.params.fc_slug;

    try {
        const folder = await Folder.findOne({
            slug: folder_slug,
            userId: userId,
        }).select("_id");
        if (!folder) {
            return res.status(404).json({ message: "Folder is not found" });
        }
        const flashcard = await Flashcard.findOne({
            slug: flashcard_slug,
        }).select("-__v -updatedAt -createdAt");
        if (!flashcard) {
            return res.status(404).json({ message: "Flashcard is not found" });
        }
        const existingInFolder = await FolderFlashcard.findOne({
            folderId: folder._id,
            flashcardId: flashcard._id,
        });

        if (!existingInFolder) {
            return res
                .status(404)
                .json({ message: "Flashcard is not in the folder" });
        }
        return res.status(200).json({
            flashcard: {
                word: flashcard.word,
                meanings: flashcard.meanings,
                vi_definition: flashcard.vi_definition,
                phonetics: flashcard.phonetics,
                slug: flashcard.slug,
                addedAt: existingInFolder.createdAt,
            },
        });
    } catch (error) {
        console.error(
            `[GET /api/v1/folders/:slug/flashcards/:fc_slug] Error:`,
            error
        );
        return res.status(500).json({ message: "Internal server error" });
    }
};

// [DELETE] /api/v1/folders/:slug/flashcards/:fc_slug
module.exports.deleteFlashcardInFolder = async (req, res) => {
    const userId = req.userId;
    const folder_slug = req.params.slug;
    const flashcard_slug = req.params.fc_slug;

    try {
        const folder = await Folder.findOne({
            slug: folder_slug,
            userId: userId,
        });
        if (!folder) {
            return res.status(404).json({ message: "Folder is not found" });
        }
        const flashcard = await Flashcard.findOne({
            slug: flashcard_slug,
        }).select("-__v -updatedAt -createdAt");
        if (!flashcard) {
            return res.status(404).json({ message: "Flashcard is not found" });
        }
        const existingInFolder = await FolderFlashcard.findOne({
            folderId: folder._id,
            flashcardId: flashcard._id,
        });

        if (!existingInFolder) {
            return res
                .status(404)
                .json({ message: "Flashcard is not in the folder" });
        }
        await FolderFlashcard.deleteOne({
            _id: existingInFolder._id,
        });
        if (folder.flashcardCount > 0) {
            folder.flashcardCount -= 1;
            await folder.save();
        }
        return res.status(200).json({
            message: "Flashcard deleted from folder successfully",
            flashcard: {
                word: flashcard.word,
            },
        });
    } catch (error) {
        console.error(
            `[DELETE /api/v1/folders/:slug/flashcards/:fc_slug] Error:`,
            error
        );
        return res.status(500).json({ message: "Internal server error" });
    }
};

// [GET] /api/v1/folders/flashcards/:fc_slug/favourite
module.exports.checkFlashcardInFavourite = async (req, res) => {
    const userId = req.userId;
    const flashcard_slug = req.params.fc_slug;
    try {
        const favouriteFolder = await Folder.findOne({
            userId: userId,
            name: "Favourites",
            isDefault: true,
        });
        const flashcard = await Flashcard.findOne({
            slug: flashcard_slug,
        }).select("-__v -updatedAt -createdAt");
        const isExistingFlashcard = await FolderFlashcard.findOne({
            folderId: favouriteFolder._id,
            flashcardId: flashcard._id,
        });
        if (!isExistingFlashcard) {
            return res.status(404).json({
                message: "Flashcard is not in the favourites",
                found: false,
            });
        }
        return res.status(200).json({
            message: "Flashcard is in the favourites",
            found: true,
        });
    } catch (error) {
        console.error(
            `[GET /api/v1/folders/flashcards/:fc_slug/favourite] Error:`,
            error
        );
        return res.status(500).json({ message: "Internal server error" });
    }
};

// [POST] /api/v1/folders/share/flashcards/
module.exports.addMultiFlashcardToFolder = async (req, res) => {
    const userId = req.userId;
    const flashcardIds = req.body.flashcards;
    const foldersSlug = req.body.folders;
    try {
        for (const flashcardId of flashcardIds) {
            if (!mongoose.Types.ObjectId.isValid(flashcardId)) {
                continue;
            }
            const flashcard = await Flashcard.findOne({
                _id: flashcardId,
            });
            if (!flashcard) {
                return res
                    .status(404)
                    .json({ message: "Flashcard is not found" });
            }
            for (const slug of foldersSlug) {
                if (typeof slug !== "string" || slug.trim() === "") continue;
                const folder = await Folder.findOne({
                    slug: slug,
                    userId: userId,
                });
                if (!folder) {
                    return res.status(404).json({
                        message: `Folder with slug ${slug} is not found`,
                    });
                }
                const existingInFolder = await FolderFlashcard.findOne({
                    folderId: folder._id,
                    flashcardId: flashcard._id,
                });

                if (!existingInFolder) {
                    const folderFlashcardMapping = new FolderFlashcard({
                        folderId: folder._id,
                        flashcardId: flashcard._id,
                    });
                    await folderFlashcardMapping.save();
                    folder.flashcardCount += 1;
                    await folder.save();
                }
            }
        }
        res.status(200).json({
            message: "Flashcards added to folder successfully",
            flashcards: flashcardIds,
            folders: foldersSlug,
        });
    } catch (error) {
        console.error(`[POST /api/v1/folders/share/flashcards] Error:`, error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

// [GET] /api/v1/folders/check/flashcards/:fc_slug
module.exports.checkFlashcardInFolder = async (req, res) => {
    const userId = req.userId;
    const flashcard_slug = req.params.fc_slug;
    try {
        const flashcard = await Flashcard.findOne({
            slug: flashcard_slug,
        }).select("-__v -updatedAt -createdAt");
        if (!flashcard) {
            return res.status(404).json({ message: "Flashcard is not found" });
        }
        const folders = await Folder.find({ userId: userId });
        const response = [];
        for (const folder of folders) {
            const existingInFolder = await FolderFlashcard.findOne({
                folderId: folder._id,
                flashcardId: flashcard._id,
            });
            if (existingInFolder) {
                response.push({
                    folder: {
                        name: folder.name,
                        slug: folder.slug,
                    },
                    existing: true,
                });
            } else {
                response.push({
                    folder: {
                        name: folder.name,
                        slug: folder.slug,
                    },
                    existing: false,
                });
            }
        }
        return res.status(200).json({
            message: "Check flashcard in folders successfully",
            found: response.length > 0,
            folders: response,
        });
    } catch (error) {
        console.error(
            `[GET /api/v1/folders/check/flashcards/:fc_slug] Error:`,
            error
        );
        return res.status(500).json({ message: "Internal server error" });
    }
};

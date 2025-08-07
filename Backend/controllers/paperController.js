import Paper from "../models/Paper.js";
import mongoose from "mongoose";

const normalizeSubject = (str) => {
    if (!str || typeof str !== 'string') return '';
    return str
        .trim()
        .toLowerCase()
        .replace(/\b\w/g, (char) => char.toUpperCase());
};

export const uploadPaper = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'A file is required for upload.' });
        }

        const { semester, subject, year, examType } = req.body;

        const normalizedSubject = normalizeSubject(subject);
        const trimmedExamType = examType.trim();

        const newPaper = new Paper({
            semester: Number(semester),
            subject: normalizedSubject, // Use the normalized subject
            year: Number(year),
            examType: trimmedExamType,   // Use the trimmed exam type
            uploadedBy: req.user.id,
            file: {
                data: req.file.buffer,
                contentType: req.file.mimetype,
                originalName: req.file.originalname
            }
        });

        await newPaper.save();

        res.status(201).json({ message: 'Paper uploaded successfully!', paper: newPaper });

    } catch (error) {
        console.error('[CONTROLLER] Critical error during paper upload:', error);
        res.status(500).json({ message: 'Internal server error during upload.' });
    }
};


export const accessPaper = async (req, res) => {
     try {
        const { semester, subject, year, examType, page = 1, limit = 10 } = req.query;
        
        // Start with an empty filter object
        const filter = {};

        // If a semester is provided, parse it to a number and add to the filter
        if (semester) {
            const semesterNumber = parseInt(semester, 10);
            if (!isNaN(semesterNumber)) {
                filter.semester = semesterNumber;
            }
        }

        // If a subject is provided, add it to the filter
        // (Assuming you have already normalized it on upload)
        if (subject) {
            filter.subject = subject; // Your frontend is sending the correct case already
        }

        // Add other filters if they exist
        if (year) {
            const yearNumber = parseInt(year, 10);
            if (!isNaN(yearNumber)) {
                filter.year = yearNumber;
            }
        }
        if (examType) {
            filter.examType = examType;
        }

        const papers = await Paper.find(filter)
            .sort({ year: -1 })
            .limit(Number(limit))
            .skip((page - 1) * limit);

        const total = await Paper.countDocuments(filter);

        res.json({
            papers,
            totalPages: Math.ceil(total / limit),
            currentPage: Number(page)
        });

    } catch (error) {
        console.error('Error searching papers:', error);
        res.status(500).json({ message: 'Server error while searching for papers.' });
    }
};

export const downloadPaper = async (req, res) => {

    try {
        const { id } = req.params;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(404).json({ message: 'Paper not found (Invalid ID)' });
        }

        // --- STEP 2: Find the paper by its ID ---
        const paper = await Paper.findById(id);

        // --- STEP 3: Check if the paper and its file data exist ---
        if (!paper) {
            return res.status(404).json({ message: 'Paper not found' });
        }
        
        if (!paper.file || !paper.file.data) {
            return res.status(404).json({ message: 'File data for this paper is missing' });
        }

        // --- STEP 4: Send the file if everything is okay ---
        res.set('Content-Type', paper.file.contentType);
        // Important: Use 'attachment' to force download, 'inline' to try to display in browser
        res.set('Content-Disposition', `attachment; filename="${paper.file.originalName}"`); 
        res.send(paper.file.data);

    } catch (error) {
        console.error(`[CONTROLLER] Error in downloadPaper:`, error);
        res.status(500).json({ message: 'Server error while downloading paper.' });
    }
};

export const availableSubjects = async (req, res) => {
    try {
        const { semester } = req.query;
        let filter = {};

        if (semester) {
            const semesterNumber = parseInt(semester, 9);
            if (!isNaN(semesterNumber)) {
                filter.semester = semesterNumber;
            }
        }
        
        const subjects = await Paper.distinct('subject', filter);

        res.json({ subjects: subjects.sort() });

    } catch (err) {
        console.error('Error fetching available subjects:', err);
        res.status(500).json({ message: "Server error while fetching subjects." });
    }
};
import Paper from "../models/Paper.js";

export const uploadPaper = async (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Only admins can upload papers' });
  }

  const { title, semester, subject, year, examType } = req.body;

  const paper = new Paper({
    title,
    semester,
    subject,
    year,
    examType,
    file: {
      data: req.file.buffer,
      contentType: req.file.mimetype,
      originalName: req.file.originalname
    },
    uploadedBy: req.user.id
  });

  await paper.save();
  res.json({ message: 'Paper uploaded successfully', paper });
};


export const accessPaper=async(req,res)=>{
  
  const { semester, subject, year, examType, page = 1, limit = 10 } = req.query;

  if (!semester || !subject) {
    return res.status(400).json({ message: "Semester and subject are required" });
  }

  const filter = { semester, subject };
  if (year) filter.year = Number(year);
  if (examType) filter.examType = examType;

  const papers = await Paper.find(filter)
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(Number(limit));

  const total = await Paper.countDocuments(filter);

  res.json({ papers, total });
};

export const downloadPaper=async(req,res)=>{
  const paper = await Paper.findById(req.params.id);

  if (!paper || !paper.file || !paper.file.data) {
    return res.status(404).json({ message: 'Paper not found' });
  }

  res.set('Content-Type', paper.file.contentType);
  res.set('Content-Disposition', `inline; filename="${paper.file.originalName}"`);
  res.send(paper.file.data);
}
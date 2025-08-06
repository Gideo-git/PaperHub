document.getElementById('paperForm').addEventListener('submit', async (e) => {
  e.preventDefault();

  const formData = new FormData(e.target);
  const params = new URLSearchParams();

  for (let [key, value] of formData.entries()) {
    if (value.trim()) params.append(key, value.trim());
  }

  try {
    const response = await fetch(`http://localhost:5000/api/papers?${params.toString()}`);
    const papers = await response.json();

    const resultsList = document.getElementById('resultsList');
    resultsList.innerHTML = '';

    if (papers.length === 0) {
      resultsList.innerHTML = '<li>No papers found.</li>';
    } else {
      papers.forEach(paper => {
        const li = document.createElement('li');
        li.innerHTML = `
          <strong>${paper.subject}</strong> - ${paper.examType || ''} ${paper.year || ''} 
          <a href="${paper.fileUrl}" target="_blank">Download</a>
        `;
        resultsList.appendChild(li);
      });
    }
  } catch (err) {
    console.error(err);
    document.getElementById('resultsList').innerHTML = '<li>Error fetching papers</li>';
  }
});

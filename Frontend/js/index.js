// Get elements from the HTML for the search form
const semesterSelect = document.getElementById('semesterSelect');
const subjectSelect = document.getElementById('subjectSelect');

// --- Function to fetch subjects for the dropdown ---
async function fetchSubjects(selectedSem) {
    const token = localStorage.getItem('token');
    try {
        const url = selectedSem
            ? `http://localhost:5000/api/papers/subjects?semester=${encodeURIComponent(selectedSem)}`
            : `http://localhost:5000/api/papers/subjects`;
        
        const response = await fetch(url, {
            headers: { 'Authorization': `Bearer ${token}` },
        });

        if (!response.ok) {
            throw new Error(`Failed to fetch subjects: ${response.status}`);
        }

        const data = await response.json();
        const subjects = data.subjects;

        subjectSelect.innerHTML = ""; // Clear dropdown

        const defaultOption = document.createElement('option');
        defaultOption.value = "";
        defaultOption.textContent = "-- Select Subject --";
        subjectSelect.appendChild(defaultOption);

        subjects.forEach((subj) => {
            const opt = document.createElement('option');
            opt.value = subj;
            opt.textContent = subj;
            subjectSelect.appendChild(opt);
        });

    } catch (err) {
        console.error('Error fetching subjects:', err);
        subjectSelect.innerHTML = '<option value="">Error loading subjects</option>';
    }
}

// --- Event Listeners for the Search Page ---

// 1. Fetch initial list of subjects when the page loads
fetchSubjects();

// 2. Update subjects when a semester is selected
semesterSelect.addEventListener('change', () => {
    const selectedSemester = semesterSelect.value;
    fetchSubjects(selectedSemester);
});

// 3. Handle the search form submission
document.getElementById('paperForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    const formData = new FormData(e.target);
    const params = new URLSearchParams();

    for (let [key, value] of formData.entries()) {
        if (value.trim()) params.append(key, value.trim());
    }

    try {
        const response = await fetch(`http://localhost:5000/api/papers?${params.toString()}`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        const papersArray = result.papers;
        const resultsList = document.getElementById('resultsList');
        resultsList.innerHTML = '';

        if (!Array.isArray(papersArray) || papersArray.length === 0) {
            resultsList.innerHTML = '<li>No papers found for this selection.</li>';
        } else {
            papersArray.forEach(paper => {
                const li = document.createElement('li');
                li.innerHTML = `
                    <strong>${paper.subject}</strong> - ${paper.examType || ''} ${paper.year || ''}
                    <a href="#" class="download-link" data-paper-id="${paper._id}">Download</a>
                `;
                resultsList.appendChild(li);
            });
        }
    } catch (err) {
        console.error(err);
        document.getElementById('resultsList').innerHTML = '<li>Error fetching papers. You may need to log in again.</li>';
    }
});

// 4. Handle clicks on the download links in the results
document.getElementById('resultsList').addEventListener('click', async (e) => {
    if (e.target.classList.contains('download-link')) {
        e.preventDefault();
        const paperId = e.target.dataset.paperId;
        const token = localStorage.getItem('token');

        if (!token) {
            alert('You must be logged in to download papers.');
            return;
        }

        try {
            const response = await fetch(`http://localhost:5000/api/papers/download/${paperId}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (!response.ok) {
                throw new Error(`Failed to download file: ${response.statusText}`);
            }

            const disposition = response.headers.get('content-disposition');
            let filename = 'downloaded-paper.pdf';
            if (disposition && disposition.includes('filename=')) {
                const matches = /filename="([^"]+)"/.exec(disposition);
                if (matches && matches[1]) filename = matches[1];
            }

            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.style.display = 'none';
            a.href = url;
            a.download = filename;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);

        } catch (err) {
            console.error('Download error:', err);
            alert('Could not download the paper. Please try again.');
        }
    }
});
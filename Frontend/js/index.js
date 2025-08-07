import { getUserRole } from './utils/auth.js';


// Get elements from the HTML using their IDs
const semesterSelect = document.getElementById('semesterSelect');
const subjectSelect = document.getElementById('subjectSelect'); // This is the one we are targeting

// Function to fetch subjects based on the selected semester
async function fetchSubjects(selectedSem) {
  // Assuming you have a login system that saves a token
  const token = localStorage.getItem('token'); 
  
  try {
    // If a semester is selected, add it as a query parameter.
    // Otherwise, fetch all subjects.
    const url = selectedSem
      ? `http://localhost:5000/api/papers/subjects?semester=${encodeURIComponent(selectedSem)}`
      : `http://localhost:5000/api/papers/subjects`;
    
    const response = await fetch(url, {
      headers: {
        // This line is for authorization, if your API requires it
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch subjects: ${response.status}`);
    }

    const data = await response.json();
    const subjects = data.subjects;

    if (!Array.isArray(subjects)) {
      console.error('API response for subjects is not an array:', data);
      throw new Error('Invalid response for subjects');
    }

    // Clear any existing options in the subject dropdown
    subjectSelect.innerHTML = ""; 

    // Add a default "Select Subject" option first
    const defaultOption = document.createElement('option');
    defaultOption.value = "";
    defaultOption.textContent = "-- Select Subject --";
    subjectSelect.appendChild(defaultOption);

    // Create and add a new <option> for each subject received from the API
    subjects.forEach((subj) => {
      const opt = document.createElement('option');
      opt.value = subj;
      opt.textContent = subj;
      subjectSelect.appendChild(opt);
    });

  } catch (err) {
    console.error('Error fetching subjects:', err);
    // Optionally, display an error to the user in the dropdown
    subjectSelect.innerHTML = '<option value="">Error loading subjects</option>';
  }
}

// --- Event Listeners ---

// 1. Initial Load: When the page first loads, fetch all subjects.
document.addEventListener('DOMContentLoaded', () => {
    const userRole = getUserRole();
    const adminUploadSection = document.getElementById('adminUploadSection');

    if (userRole === 'admin' && adminUploadSection) {
        adminUploadSection.style.display = 'block';
    }

    const logoutButton = document.getElementById('logoutButton');

    if (logoutButton) {
        logoutButton.addEventListener('click', () => {
            // 1. Clear the user's token and role from storage
            localStorage.removeItem('token');
            localStorage.removeItem('userRole');

            // 2. Redirect the user to the login page
            window.location.href = 'login.html';
        });
    }

      // --- NEW: UPLOAD FORM SUBMISSION LOGIC ---
    const uploadForm = document.getElementById('uploadForm');
    const uploadStatus = document.getElementById('uploadStatus');

    if (uploadForm) {
        uploadForm.addEventListener('submit', async (e) => {
            e.preventDefault(); // Prevent the form from reloading the page

            // 1. Get the auth token and the form data
            const token = localStorage.getItem('token');
            const formData = new FormData(uploadForm);

            // Clear previous status messages
            uploadStatus.textContent = 'Uploading...';
            uploadStatus.style.color = 'black';

            try {
                // 2. Make the fetch request to your backend upload endpoint
                const response = await fetch('http://localhost:5000/api/papers/upload', {
                    method: 'POST',
                    headers: {
                        // The 'Authorization' header is crucial
                        'Authorization': `Bearer ${token}`
                        // For FormData, you DO NOT set the 'Content-Type' header.
                        // The browser sets it automatically with the correct boundary.
                    },
                    body: formData
                });

                const result = await response.json();

                if (response.ok) {
                    // Success!
                    console.log('Upload successful:', result);
                    uploadStatus.textContent = 'Paper uploaded successfully!';
                    uploadStatus.style.color = 'green';
                    uploadForm.reset(); // Clear the form fields
                } else {
                    // Handle server errors (e.g., validation errors, etc.)
                    throw new Error(result.message || 'Upload failed');
                }

            } catch (error) {
                // Handle network errors or errors thrown from the response
                console.error('Upload error:', error);
                uploadStatus.textContent = `Error: ${error.message}`;
                uploadStatus.style.color = 'red';
            }
        });
    }

    fetchSubjects();
});


// 2. On Semester Change: When the user selects a new semester, fetch the subjects for it.
semesterSelect.addEventListener('change', () => {
  const selectedSemester = semesterSelect.value;
  // If the user selects "-- Select Semester --" (value=""), fetch all subjects.
  // Otherwise, fetch subjects for the specific semester.
  fetchSubjects(selectedSemester); 
});

// 3. On Form Submit: When the user clicks "Search", find the papers.
document.getElementById('paperForm').addEventListener('submit', async (e) => {
  e.preventDefault();

  // --- START OF CORRECTED CODE ---

  const formData = new FormData(e.target);
  const params = new URLSearchParams();

  for (let [key, value] of formData.entries()) {
    if (value.trim()) params.append(key, value.trim());
  }

  try {
    // Get the token from localStorage, just like in your other function
    const token = localStorage.getItem('token');
    
    // THE FIX: Add the 'headers' object with the Authorization token to the fetch call
    const response = await fetch(`http://localhost:5000/api/papers?${params.toString()}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    // BEST PRACTICE: Check if the response was successful. If not, handle the error.
    if (!response.ok) {
        // This will catch 401, 404, 500 etc., and jump to the catch block
        throw new Error(`HTTP error! status: ${response.status}`);
    }

    const papers = await response.json();
    
    // The 'papers' variable from a successful call is an object like { papers: [], ... }
    // We need to iterate over the array inside it.
    const papersArray = papers.papers; 

    const resultsList = document.getElementById('resultsList');
    resultsList.innerHTML = '';

    if (!Array.isArray(papersArray) || papersArray.length === 0) {
      resultsList.innerHTML = '<li>No papers found.</li>';
    } else {
      // Now this forEach will work because papersArray is a guaranteed array
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
  // --- END OF CORRECTED CODE ---
});


document.getElementById('resultsList').addEventListener('click', async (e) => {
    // Check if the clicked element is a download link
    if (e.target.classList.contains('download-link')) {
        e.preventDefault(); // Stop the link from trying to navigate

        const paperId = e.target.dataset.paperId;
        const token = localStorage.getItem('token');

        if (!token) {
            alert('You must be logged in to download papers.');
            return;
        }

        try {
            console.log(`Fetching paper with ID: ${paperId}`);
            
            // Step 1: Fetch the file with the Authorization header
            const response = await fetch(`http://localhost:5000/api/papers/download/${paperId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error(`Failed to download file: ${response.status} ${response.statusText}`);
            }

            // Step 2: Extract the filename from the 'Content-Disposition' header
            const disposition = response.headers.get('content-disposition');
            let filename = 'downloaded-paper.pdf'; // A default filename
            if (disposition && disposition.indexOf('filename=') !== -1) {
                // A simple regex to pull the filename from the header
                const matches = /filename="([^"]+)"/.exec(disposition);
                if (matches != null && matches[1]) {
                    filename = matches[1];
                }
            }

            // Step 3: Get the file data as a 'blob'
            const blob = await response.blob();

            // Step 4: Create a temporary URL for the blob
            const url = window.URL.createObjectURL(blob);

            // Step 5: Create a temporary, invisible link element
            const a = document.createElement('a');
            a.style.display = 'none';
            a.href = url;
            a.download = filename; // Use the extracted filename
            document.body.appendChild(a);

            // Step 6: Programmatically click the link to trigger the browser's download prompt
            a.click();

            // Step 7: Clean up by removing the temporary link and URL
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);

        } catch (err) {
            console.error('Download error:', err);
            alert('Could not download the paper. Please try again.');
        }
    }
});
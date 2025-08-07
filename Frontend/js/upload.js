// js/upload.js

document.addEventListener('DOMContentLoaded', () => {
    // Redirect if not an admin
    const userRole = localStorage.getItem('userRole');
    if (userRole !== 'admin') {
        alert('You do not have permission to view this page.');
        window.location.href = 'index.html';
        return;
    }

    const uploadForm = document.getElementById('uploadForm');
    const uploadStatus = document.getElementById('uploadStatus');

    if (uploadForm) {
        uploadForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const token = localStorage.getItem('token');
            const formData = new FormData(uploadForm);

            uploadStatus.textContent = 'Uploading...';
            uploadStatus.style.color = 'black';

            try {
                // Point this to your live backend URL when deploying
                const response = await fetch('https://paperhub-gorr.onrender.com/api/papers/upload', {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${token}`
                    },
                    body: formData
                });

                const result = await response.json();

                if (response.ok) {
                    uploadStatus.textContent = 'Paper uploaded successfully!';
                    uploadStatus.style.color = 'green';
                    uploadForm.reset();
                } else {
                    throw new Error(result.message || 'Upload failed');
                }
            } catch (error) {
                console.error('Upload error:', error);
                uploadStatus.textContent = `Error: ${error.message}`;
                uploadStatus.style.color = 'red';
            }
        });
    }
});
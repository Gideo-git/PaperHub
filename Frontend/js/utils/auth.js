export function decodeToken(token) {
    try {
        // The payload is the middle part of the token
        return JSON.parse(atob(token.split('.')[1]));
    } catch (e) {
        console.error("Failed to decode token:", e);
        return null; // Return null if decoding fails
    }
}

export function getUserRole() {
    return localStorage.getItem('userRole');
}
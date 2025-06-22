class ApiService {
    constructor() {
        this.apiUrl = process.env.NODE_ENV === 'production' 
            ? '/api' 
            : 'http://localhost:5000/api';
    }

    async get(url, params = {}) {
        const queryString = Object.keys(params)
            .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
            .join('&');
        
        const response = await fetch(`${this.apiUrl}${url}${queryString ? `?${queryString}` : ''}`, {
            headers: {
                'Content-Type': 'application/json',
                'x-auth-token': localStorage.getItem('token') || ''
            }
        });
        
        return this._handleResponse(response);
    }

    async post(url, data) {
        const response = await fetch(`${this.apiUrl}${url}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-auth-token': localStorage.getItem('token') || ''
            },
            body: JSON.stringify(data)
        });
        
        return this._handleResponse(response);
    }

    async put(url, data) {
        const response = await fetch(`${this.apiUrl}${url}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'x-auth-token': localStorage.getItem('token') || ''
            },
            body: JSON.stringify(data)
        });
        
        return this._handleResponse(response);
    }

    async delete(url) {
        const response = await fetch(`${this.apiUrl}${url}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'x-auth-token': localStorage.getItem('token') || ''
            }
        });
        
        return this._handleResponse(response);
    }

    async upload(url, formData) {
        const response = await fetch(`${this.apiUrl}${url}`, {
            method: 'POST',
            headers: {
                'x-auth-token': localStorage.getItem('token') || ''
            },
            body: formData
        });
        
        return this._handleResponse(response);
    }

    async _handleResponse(response) {
        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.error || 'Something went wrong');
        }
        
        return data;
    }
}

export default new ApiService();

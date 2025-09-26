// github-json.js
export class GitHubJSON {
    constructor(owner, repo, token) {
        this.owner = owner;
        this.repo = repo;
        this.token = GitHubJSON.decodeBase64(token);
    }

    // Static method to decode Base64
    static decodeBase64(encodedData) {
        if (typeof window !== "undefined" && window.atob) {
            // Browser environment
            return atob(encodedData);
        } else {
            // Node.js environment
            return Buffer.from(encodedData, 'base64').toString('utf-8');
        }
    }

    async getFile(filePath) {
        const url = `https://api.github.com/repos/${this.owner}/${this.repo}/contents/${filePath}`;
        const response = await fetch(url, {
            headers: {
                'Authorization': `Bearer ${this.token}`,
                'Accept': 'application/vnd.github.v3+json'
            }
        });
        if (response.status === 200) {
            const data = await response.json();
            return {
                sha: data.sha,
                content: JSON.parse(atob(data.content))
            };
        }
        return { sha: null, content: [] };
    }

    async saveFile(filePath, content, sha = null, message = "Update JSON file") {
        const base64Content = btoa(JSON.stringify(content, null, 2));
        const url = `https://api.github.com/repos/${this.owner}/${this.repo}/contents/${filePath}`;
        const response = await fetch(url, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${this.token}`,
                'Accept': 'application/vnd.github.v3+json'
            },
            body: JSON.stringify({
                message,
                content: base64Content,
                sha: sha || undefined
            })
        });
        return response.json();
    }

    generateId() {
        return '_' + Math.random().toString(36).substr(2, 9);
    }

    // Append data to any file
    async append(filePath, dataText) {
        const { sha, content } = await this.getFile(filePath);
        const arrayContent = Array.isArray(content) ? content : [];

        const newEntry = {
            id: this.generateId(),
            timestamp: new Date().toISOString(),
            data: dataText
        };

        arrayContent.push(newEntry);
        return await this.saveFile(filePath, arrayContent, sha, "Append data");
    }

    // Delete by ID in any file
    async deleteById(filePath, id) {
        const { sha, content } = await this.getFile(filePath);
        const arrayContent = Array.isArray(content) ? content : [];
        const index = arrayContent.findIndex(item => item.id === id);
        if (index === -1) throw new Error("ID not found");
        arrayContent.splice(index, 1);
        return await this.saveFile(filePath, arrayContent, sha, "Delete data by ID");
    }

    // Get all entries from any file
    async getAll(filePath) {
        const { content } = await this.getFile(filePath);
        return Array.isArray(content) ? content : [];
    }

    // Check if an ID exists in any file
    async exists(filePath, id) {
        const { content } = await this.getFile(filePath);
        const arrayContent = Array.isArray(content) ? content : [];
        return arrayContent.some(item => item.id === id);
    }
}

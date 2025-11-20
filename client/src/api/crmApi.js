export const getLeads = async () => {
    try {
        const response = await fetch('/api/crm/leads');
        if (!response.ok) {
            throw new Error('Failed to fetch leads');
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching leads:', error);
        throw error;
    }
}

export const getLeadFields = async () => {
    try {
        const response = await fetch('/api/crm/lead-fields');
        if (!response.ok) {
            throw new Error('Failed to fetch lead fields');
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching lead fields:', error);
        throw error;
    }
}
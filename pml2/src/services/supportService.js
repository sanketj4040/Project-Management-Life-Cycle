// This file contains functions to interact with the backend API for help requests
import axios from 'axios';

// API base URL - adjust this to match your Django backend URL
const API_BASE_URL = 'http://127.0.0.1:8000';

// Get all help requests from the Django API
export const getAllSupportRequests = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/api/help/`);
    
    // Transform the response data to match the expected format
    return response.data.map(help => ({
      id: help.help_id,
      name: help.name,
      email: help.email,
      mobile: help.number,
      subject: help.subject,
      description: help.description,
      createdAt: help.created_at || new Date().toISOString() // Use current date if not available
    }));
  } catch (error) {
    console.error('Error fetching help data:', error);
    throw error;
  }
};

// Get a single help request by ID
export const getSupportRequestById = async (id) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/api/help/${id}/`);
    
    // Transform the response data to match the expected format
    return {
      id: response.data.help_id,
      name: response.data.name,
      email: response.data.email,
      mobile: response.data.number,
      subject: response.data.subject,
      description: response.data.description,
      createdAt: response.data.created_at || new Date().toISOString() // Use current date if not available
    };
  } catch (error) {
    console.error(`Error fetching help request with ID ${id}:`, error);
    throw error;
  }
};

// Create a new help request
export const createSupportRequest = async (requestData) => {
  try {
    // Transform data to match Django API expectations
    const apiData = {
      name: requestData.name,
      email: requestData.email,
      number: requestData.mobile,
      subject: requestData.subject,
      description: requestData.description
    };
    
    const response = await axios.post(`${API_BASE_URL}/api/help/create/`, apiData);
    
    // Return transformed data
    return {
      id: response.data.help_id,
      name: response.data.name,
      email: response.data.email,
      mobile: response.data.number,
      subject: response.data.subject,
      description: response.data.description,
      createdAt: response.data.created_at || new Date().toISOString()
    };
  } catch (error) {
    console.error('Error creating help request:', error);
    throw error;
  }
};

// Update a help request
export const updateSupportRequest = async (id, updates) => {
  try {
    // Transform updates to match Django API expectations
    const apiUpdates = {};
    if (updates.name) apiUpdates.name = updates.name;
    if (updates.email) apiUpdates.email = updates.email;
    if (updates.mobile) apiUpdates.number = updates.mobile;
    if (updates.subject) apiUpdates.subject = updates.subject;
    if (updates.description) apiUpdates.description = updates.description;
    
    const response = await axios.put(`${API_BASE_URL}/api/help/update/${id}/`, apiUpdates);
    
    // Return transformed data
    return {
      id: response.data.help_id,
      name: response.data.name,
      email: response.data.email,
      mobile: response.data.number,
      subject: response.data.subject,
      description: response.data.description,
      createdAt: response.data.created_at || new Date().toISOString()
    };
  } catch (error) {
    console.error(`Error updating help request with ID ${id}:`, error);
    throw error;
  }
};

// Delete a help request
export const deleteSupportRequest = async (id) => {
  try {
    await axios.delete(`${API_BASE_URL}/api/help/delete/${id}/`);
    return { success: true };
  } catch (error) {
    console.error(`Error deleting help request with ID ${id}:`, error);
    throw error;
  }
};

import axios from 'axios';

export const generateContentAPI = async(userPrompt) => {
	return await axios.post('http://localhost:4000/api/v1/openai/generate-content', {prompt: userPrompt},{withCredentials: true})?.data;
};
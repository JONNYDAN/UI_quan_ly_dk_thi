import api from './api';

export const getExams = async () => {
  try {
    const response = await api.get('/exams');
    return response.data;
  } catch (error: any) {
    throw error.response?.data?.message || error.message || 'Get exams failed';
  }
};

export const getTurns = async () => {
  try {
    const response = await api.get('/turninexams');
    return response.data;
  } catch (error: any) {
    throw error.response?.data?.message || error.message || 'Get turns failed';
  }
};

export const getAllOrganizations = async () => {
  try {
    const response = await api.get('/organizations');
    return response.data;
  } catch (error: any) {
    throw error.response?.data?.message || error.message || 'Get organizations failed';
  }
};

export const getTurnsByExam = async (examId: number) => {
  try {
    const response = await api.get(`/exam/turns/${examId}`);
    return response.data;
  } catch (error: any) {
    throw error.response?.data?.message || error.message || 'Get turns by exam failed';
  }
};

export const getAllBookedTurnsByExam = async (examId: number) => {
  try {
    const response = await api.get(`/exam/all-booked-turns/${examId}`);
    return response.data;
  } catch (error: any) {
    throw error.response?.data?.message || error.message || 'Get all booked turns failed';
  }
};

export const getBookedTurnsByExam = async (examId: number) => {
  try {
    const response = await api.get(`/exam/booked-turns/${examId}`);
    return response.data;
  } catch (error: any) {
    throw error.response?.data?.message || error.message || 'Get booked turns failed';
  }
};

export const getExamResults = async (cccd: string) => {
  try {
    const response = await api.get(`/exam/results/${cccd}`);
    return response.data;
  } catch (error: any) {
    throw error.response?.data?.message || error.message || 'Get exam results failed';
  }
};

export const getReexamResults = async (cccd: string) => {
  try {
    const response = await api.get(`/reexam/results/${cccd}`);
    return response.data;
  } catch (error: any) {
    throw error.response?.data?.message || error.message || 'Get reexam results failed';
  }
};

export const getExamResultSubjects = async (examId: number, cccd: string) => {
  try {
    const response = await api.get(`/exam/results/${examId}/${cccd}`);
    return response.data;
  } catch (error: any) {
    throw error.response?.data?.message || error.message || 'Get exam result subjects failed';
  }
};

export const putReExam = async (data: any) => {
  try {
    const response = await api.put('/exam/re-exam', data);
    return response.data;
  } catch (error: any) {
    throw error.response?.data?.message || error.message || 'Put re-exam failed';
  }
};

export const putCancelReExam = async (data: any) => {
  try {
    const response = await api.put('/exam/cancel-re-exam', data);
    return response.data;
  } catch (error: any) {
    throw error.response?.data?.message || error.message || 'Cancel re-exam failed';
  }
};

// Exam admin
export const getAllExams = async () => {
  try {
    const response = await api.get('/allExam');
    return response.data;
  } catch (error: any) {
    throw error.response?.data?.message || error.message || 'Get all exams failed';
  }
};

// Paged / server-side support (optional query params: q, page, limit, sortBy, order)
export const getAllExamsPaged = async (params?: any) => {
  try {
    const response = await api.get('/allExam', { params });
    return response.data; // expected { items: [], total: number } or fallback to array
  } catch (error: any) {
    throw error.response?.data?.message || error.message || 'Get paged exams failed';
  }
};

export const postExam = async (data: any) => {
  try {
    const response = await api.post('/exam', data);
    return response.data;
  } catch (error: any) {
    throw error.response?.data?.message || error.message || 'Create exam failed';
  }
};

export const updateExam = async (id: string|number, data: any) => {
  try {
    const response = await api.put(`/exam/${id}`, data);
    return response.data;
  } catch (error: any) {
    throw error.response?.data?.message || error.message || 'Update exam failed';
  }
};

export const deleteExam = async (id: string|number) => {
  try {
    const response = await api.delete(`/exam/${id}`);
    return response.data;
  } catch (error: any) {
    throw error.response?.data?.message || error.message || 'Delete exam failed';
  }
};

// Exam turn admin
export const getExamsTurns = async () => {
  try {
    const response = await api.get('/exams/examturns');
    return response.data;
  } catch (error: any) {
    throw error.response?.data?.message || error.message || 'Get exam turns failed';
  }
};

// Paged exam turns (optional params: q, page, limit, sortBy, order, examId)
export const getExamsTurnsPaged = async (params?: any) => {
  try {
    const response = await api.get('/exams/examturns', { params });
    return response.data; // expected { items: [], total: number } or fallback to array
  } catch (error: any) {
    throw error.response?.data?.message || error.message || 'Get exam turns paged failed';
  }
};

export const createExamTurn = async (data: any) => {
  try {
    const response = await api.post('/addExamturn', data);
    return response.data;
  } catch (error: any) {
    throw error.response?.data?.message || error.message || 'Create exam turn failed';
  }
};

export const updateExamTurn = async (examTurnId: string|number, data: any) => {
  try {
    const response = await api.put(`/examturn/${examTurnId}`, data);
    return response.data;
  } catch (error: any) {
    throw error.response?.data?.message || error.message || 'Update exam turn failed';
  }
};

export const deleteExamTurn = async (id: string|number) => {
  try {
    const response = await api.delete(`/examturn/${id}`);
    return response.data;
  } catch (error: any) {
    throw error.response?.data?.message || error.message || 'Delete exam turn failed';
  }
};

export const getExamTicketsByUserAndExam = async (cccd: string) => {
  try {
    const response = await api.get(`/exam/${cccd}/ticket`);
    return response.data;
  } catch (error: any) {
    throw error.response?.data?.message || error.message || 'Get exam tickets failed';
  }
};

export default {
  getExams,
  getTurnsByExam,
  getBookedTurnsByExam,
  getAllBookedTurnsByExam,
  getExamResults,
  getReexamResults,
  getExamResultSubjects,
  putReExam,
  putCancelReExam,
  getAllExams,
  postExam,
  updateExam,
  deleteExam,
  getExamsTurns,
  getExamsTurnsPaged,
  createExamTurn,
  updateExamTurn,
  deleteExamTurn,
  getAllOrganizations,
  getExamTicketsByUserAndExam,
  getTurns,
  getAllExamsPaged,
};
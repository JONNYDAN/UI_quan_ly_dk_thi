import { useNavigate } from 'react-router-dom';
import React, { useEffect, useState } from 'react';

import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import TuneIcon from '@mui/icons-material/Tune';
import DeleteIcon from '@mui/icons-material/Delete';
import SearchIcon from '@mui/icons-material/Search';
import {
  Box,
  Card,
  Typography,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  IconButton,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Stack,
  CircularProgress,
  TablePagination,
  TableSortLabel,
} from '@mui/material';

import examService from 'src/services/examService';

export default function ExamManagementView() {
  const [exams, setExams] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [editing, setEditing] = useState<any | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<any | null>(null);
  const [search, setSearch] = useState<string>('');
  const [page, setPage] = useState<number>(0);
  const [rowsPerPage, setRowsPerPage] = useState<number>(10);
  const [sortBy, setSortBy] = useState<string>('');
  const [order, setOrder] = useState<'asc'|'desc'>('asc');
  const [totalCount, setTotalCount] = useState<number>(0);

  const navigate = useNavigate();

  async function load(options?: { page?: number, limit?: number, q?: string, sortBy?: string, order?: 'asc'|'desc' }) {
    setLoading(true);
    try {
      const params = {
        page: options?.page ?? page + 1, // API pages often 1-based
        limit: options?.limit ?? rowsPerPage,
        q: options?.q ?? search,
        sortBy: options?.sortBy ?? sortBy,
        order: options?.order ?? order,
      };

      // Try server-side paged endpoint first
      const res: any = await examService.getAllExamsPaged(params);

      if (res && (Array.isArray(res.items) || typeof res.total === 'number')) {
        setExams(res.items || []);
        setTotalCount(res.total || (res.items || []).length);
      } else if (Array.isArray(res)) {
        // backend returned plain list, fallback to client-side
        setExams(res || []);
        setTotalCount((res || []).length);
      } else {
        setExams([]);
        setTotalCount(0);
      }
    } catch (err) {
      console.warn('Paged fetch failed, fallback to full list', err);
      try {
        const resAll: any = await examService.getAllExams();
        setExams(resAll || []);
        setTotalCount((resAll || []).length);
      } catch (e) {
        setExams([]);
        setTotalCount(0);
      }
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load({ page, limit: rowsPerPage, q: search, sortBy, order }); }, [page, rowsPerPage, search, sortBy, order]);

  function handleOpenCreate() {
    setEditing(null);
    setOpenDialog(true);
  }

  function handleOpenEdit(row: any) {
    setEditing(row);
    setOpenDialog(true);
  }

  // Client-side fallback filtering when API does not provide paged data
  const filteredExams = exams.filter((e) => {
    if (!search) return true;
    const s = search.toLowerCase();
    return String(e.id || e._id).includes(s) || String(e.name || e.title || '').toLowerCase().includes(s) || String(e.description || e.note || '').toLowerCase().includes(s);
  });

  const paginatedExams = filteredExams.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  function handleSortRequest(column: string) {
    if (sortBy === column) {
      setOrder(order === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setOrder('asc');
    }
    setPage(0);
  }

  async function handleSave(data: any) {
    try {
      if (editing?.id || editing?._id) {
        await examService.updateExam(editing.id || editing._id, data);
      } else {
        await examService.postExam(data);
      }
      setOpenDialog(false);
      load();
    } catch (err: any) {
      console.error('Save exam failed', err);
      alert(err?.message || String(err));
    }
  }

  function handleConfirmDelete(row: any) {
    setConfirmDelete(row);
  }

  async function handleDelete() {
    if (!confirmDelete) return;
    try {
      await examService.deleteExam(confirmDelete.id || confirmDelete._id);
      setConfirmDelete(null);
      load();
    } catch (err: any) {
      console.error('Delete failed', err);
      alert(err?.message || String(err));
    }
  }

  return (
    <Box sx={{ p: 3 }}>
      <Card sx={{ p: 3 }}>
        <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 2 }}>
          <Typography variant="h6">Exam management</Typography>
          <Stack direction="row" spacing={2} alignItems="center">
            <TextField
              size="small"
              placeholder="Tìm kiếm..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(0); }}
              InputProps={{ startAdornment: <SearchIcon sx={{ mr: 1 }} /> }}
            />
            <Button startIcon={<AddIcon />} variant="contained" onClick={handleOpenCreate}>Create exam</Button>
          </Stack>
        </Stack>

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}><CircularProgress /></Box>
        ) : (
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sortDirection={sortBy === 'id' ? order : false}>
                    <TableSortLabel active={sortBy === 'id'} direction={sortBy === 'id' ? order : 'asc'} onClick={() => handleSortRequest('id')}>ID</TableSortLabel>
                  </TableCell>
                  <TableCell sortDirection={sortBy === 'name' ? order : false}>
                    <TableSortLabel active={sortBy === 'name'} direction={sortBy === 'name' ? order : 'asc'} onClick={() => handleSortRequest('name')}>Tên</TableSortLabel>
                  </TableCell>
                  <TableCell>Mô tả</TableCell>
                  <TableCell>Hành động</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {paginatedExams.map((row: any) => (
                  <TableRow key={row.id || row._id}>
                    <TableCell>{row.id || row._id}</TableCell>
                    <TableCell>{row.name || row.title}</TableCell>
                    <TableCell>{row.description || row.note || ''}</TableCell>
                    <TableCell>
                      <IconButton onClick={() => handleOpenEdit(row)} title="Edit"><EditIcon /></IconButton>
                      <IconButton onClick={() => handleConfirmDelete(row)} title="Delete"><DeleteIcon /></IconButton>
                      <IconButton onClick={() => navigate(`/admin/exam-turns?examId=${row.id || row._id}`)} title="Manage turns"><TuneIcon /></IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}

        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
          <TablePagination
            component="div"
            count={totalCount}
            page={page}
            onPageChange={(_e: unknown, newPage: number) => setPage(newPage)}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => { setRowsPerPage(Number(e.target.value)); setPage(0); }}
            rowsPerPageOptions={[10, 25, 50]}
          />
        </Box>

        {/* Create / Edit Dialog */}
        <Dialog open={openDialog} onClose={() => setOpenDialog(false)} fullWidth maxWidth="sm">
          <DialogTitle>{editing ? 'Edit exam' : 'Create exam'}</DialogTitle>
          <DialogContent>
            <ExamForm initial={editing} onSave={handleSave} onCancel={() => setOpenDialog(false)} />
          </DialogContent>
        </Dialog>

        {/* Delete confirm */}
        <Dialog open={!!confirmDelete} onClose={() => setConfirmDelete(null)}>
          <DialogTitle>Xác nhận xóa</DialogTitle>
          <DialogContent>
            Bạn có chắc muốn xóa kỳ thi <b>{confirmDelete?.name || confirmDelete?.title}</b>?
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setConfirmDelete(null)}>Hủy</Button>
            <Button color="error" onClick={handleDelete}>Xóa</Button>
          </DialogActions>
        </Dialog>
      </Card>
    </Box>
  );
}

function ExamForm({ initial, onSave, onCancel }: any) {
  const [name, setName] = useState(initial?.name || initial?.title || '');
  const [description, setDescription] = useState(initial?.description || initial?.note || '');

  useEffect(() => {
    setName(initial?.name || initial?.title || '');
    setDescription(initial?.description || initial?.note || '');
  }, [initial]);

  function handleSubmit(e: any) {
    e.preventDefault();
    const payload = { name, description };
    onSave(payload);
  }

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
      <Stack spacing={2} sx={{ mt: 1 }}>
        <TextField label="Tên kỳ thi" value={name} onChange={(e) => setName(e.target.value)} fullWidth required />
        <TextField label="Mô tả" value={description} onChange={(e) => setDescription(e.target.value)} fullWidth multiline rows={3} />
        <Stack direction="row" spacing={2} justifyContent="flex-end">
          <Button onClick={onCancel}>Hủy</Button>
          <Button type="submit" variant="contained">Lưu</Button>
        </Stack>
      </Stack>
    </Box>
  );
}
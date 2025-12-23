import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
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

export default function ExamTurnManagementView() {
  const [turns, setTurns] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [editing, setEditing] = useState<any | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<any | null>(null);

  const [searchParams] = useSearchParams();
  const examIdFilter = searchParams.get('examId');

  const [search, setSearch] = useState<string>('');
  const [page, setPage] = useState<number>(0);
  const [rowsPerPage, setRowsPerPage] = useState<number>(10);
  const [sortBy, setSortBy] = useState<string>('');
  const [order, setOrder] = useState<'asc'|'desc'>('asc');
  const [totalCount, setTotalCount] = useState<number>(0);

  async function load(options?: { page?: number, limit?: number, q?: string, sortBy?: string, order?: 'asc'|'desc' }) {
    setLoading(true);
    try {
      const params: any = {
        page: options?.page ?? page + 1,
        limit: options?.limit ?? rowsPerPage,
        q: options?.q ?? search,
        sortBy: options?.sortBy ?? sortBy,
        order: options?.order ?? order,
      };

      if (examIdFilter) params.examId = examIdFilter;

      const res: any = await examService.getExamsTurnsPaged(params);
      if (res && (Array.isArray(res.items) || typeof res.total === 'number')) {
        setTurns(res.items || []);
        setTotalCount(res.total || (res.items || []).length);
      } else if (Array.isArray(res)) {
        let data = res || [];
        if (examIdFilter) data = data.filter((d: any) => String(d.examId || d.exam?._id || d.exam?.id) === String(examIdFilter));
        setTurns(data);
        setTotalCount(data.length);
      } else {
        setTurns([]);
        setTotalCount(0);
      }
    } catch (err) {
      console.warn('Paged fetch failed, fallback to full list', err);
      try {
        const resAll: any = await examService.getExamsTurns();
        let data = resAll || [];
        if (examIdFilter) data = data.filter((d: any) => String(d.examId || d.exam?._id || d.exam?.id) === String(examIdFilter));
        setTurns(data);
        setTotalCount(data.length);
      } catch (e) {
        setTurns([]);
        setTotalCount(0);
      }
    } finally {
      setLoading(false);
    }
  }

  const filteredTurns = turns.filter((t) => {
    if (!search) return true;
    const s = search.toLowerCase();
    return String(t.id || t._id).includes(s) || String(t.name || t.turnName || '').toLowerCase().includes(s) || String(t.exam?.name || t.exam?.title || t.examId || '').toLowerCase().includes(s) || String(t.scheduledAt || t.date || '').toLowerCase().includes(s);
  });

  const paginatedTurns = filteredTurns.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  useEffect(() => { load({ page, limit: rowsPerPage, q: search, sortBy, order }); }, [examIdFilter, page, rowsPerPage, search, sortBy, order]);

  function handleOpenCreate() { setEditing(null); setOpenDialog(true); }
  function handleOpenEdit(t: any) { setEditing(t); setOpenDialog(true); }
  function handleConfirmDelete(t: any) { setConfirmDelete(t); }

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
        await examService.updateExamTurn(editing.id || editing._id, data);
      } else {
        await examService.createExamTurn(data);
      }
      setOpenDialog(false);
      load();
    } catch (err: any) {
      console.error('Save turn failed', err);
      alert(err?.message || String(err));
    }
  }

  async function handleDelete() {
    if (!confirmDelete) return;
    try {
      await examService.deleteExamTurn(confirmDelete.id || confirmDelete._id);
      setConfirmDelete(null);
      load();
    } catch (err: any) {
      console.error('Delete turn failed', err);
      alert(err?.message || String(err));
    }
  }

  return (
    <Box sx={{ p: 3 }}>
      <Card sx={{ p: 3 }}>
        <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 2 }}>
          <Typography variant="h6">Exam turns</Typography>
          <Stack direction="row" spacing={2} alignItems="center">
            <TextField
              size="small"
              placeholder="Tìm kiếm..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(0); }}
              InputProps={{ startAdornment: <SearchIcon sx={{ mr: 1 }} /> }}
            />
            <Button startIcon={<AddIcon />} variant="contained" onClick={handleOpenCreate}>Create turn</Button>
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
                  <TableCell sortDirection={sortBy === 'exam' ? order : false}>
                    <TableSortLabel active={sortBy === 'exam'} direction={sortBy === 'exam' ? order : 'asc'} onClick={() => handleSortRequest('exam')}>Kỳ thi</TableSortLabel>
                  </TableCell>
                  <TableCell sortDirection={sortBy === 'scheduledAt' ? order : false}>
                    <TableSortLabel active={sortBy === 'scheduledAt'} direction={sortBy === 'scheduledAt' ? order : 'asc'} onClick={() => handleSortRequest('scheduledAt')}>Ngày</TableSortLabel>
                  </TableCell>
                  <TableCell>Hành động</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {paginatedTurns.map((row: any) => (
                  <TableRow key={row.id || row._id}>
                    <TableCell>{row.id || row._id}</TableCell>
                    <TableCell>{row.name || row.turnName}</TableCell>
                    <TableCell>{row.exam?.name || row.exam?.title || row.examId}</TableCell>
                    <TableCell>{row.scheduledAt || row.date || ''}</TableCell>
                    <TableCell>
                      <IconButton onClick={() => handleOpenEdit(row)} title="Edit"><EditIcon /></IconButton>
                      <IconButton onClick={() => handleConfirmDelete(row)} title="Delete"><DeleteIcon /></IconButton>
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

        <Dialog open={openDialog} onClose={() => setOpenDialog(false)} fullWidth maxWidth="sm">
          <DialogTitle>{editing ? 'Edit turn' : 'Create turn'}</DialogTitle>
          <DialogContent>
            <TurnForm initial={editing} examId={examIdFilter} onSave={handleSave} onCancel={() => setOpenDialog(false)} />
          </DialogContent>
        </Dialog>

        <Dialog open={!!confirmDelete} onClose={() => setConfirmDelete(null)}>
          <DialogTitle>Xác nhận xóa</DialogTitle>
          <DialogContent>Bạn có chắc muốn xóa ca thi <b>{confirmDelete?.name || confirmDelete?.turnName}</b>?</DialogContent>
          <DialogActions>
            <Button onClick={() => setConfirmDelete(null)}>Hủy</Button>
            <Button color="error" onClick={handleDelete}>Xóa</Button>
          </DialogActions>
        </Dialog>
      </Card>
    </Box>
  );
}

function TurnForm({ initial, examId, onSave, onCancel }: any) {
  const [name, setName] = useState(initial?.name || initial?.turnName || '');
  const [exam, setExam] = useState(initial?.examId || initial?.exam?._id || examId || '');
  const [scheduledAt, setScheduledAt] = useState(initial?.scheduledAt || initial?.date || '');
  const [capacity, setCapacity] = useState(initial?.capacity || initial?.max || '');

  useEffect(() => {
    setName(initial?.name || initial?.turnName || '');
    setExam(initial?.examId || initial?.exam?._id || examId || '');
    setScheduledAt(initial?.scheduledAt || initial?.date || '');
    setCapacity(initial?.capacity || initial?.max || '');
  }, [initial, examId]);

  function handleSubmit(e: any) {
    e.preventDefault();
    const payload: any = { name, scheduledAt, capacity };
    if (exam) payload.examId = exam;
    onSave(payload);
  }

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
      <Stack spacing={2} sx={{ mt: 1 }}>
        <TextField label="Tên ca" value={name} onChange={(e) => setName(e.target.value)} fullWidth required />
        <TextField label="Kỳ thi (ID)" value={exam} onChange={(e) => setExam(e.target.value)} fullWidth />
        <TextField label="Ngày" value={scheduledAt} onChange={(e) => setScheduledAt(e.target.value)} fullWidth />
        <TextField label="Sức chứa" value={capacity} onChange={(e) => setCapacity(e.target.value)} fullWidth />
        <Stack direction="row" spacing={2} justifyContent="flex-end">
          <Button onClick={onCancel}>Hủy</Button>
          <Button type="submit" variant="contained">Lưu</Button>
        </Stack>
      </Stack>
    </Box>
  );
}
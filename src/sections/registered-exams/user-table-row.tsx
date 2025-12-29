import React, { useState } from 'react';

import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Menu from '@mui/material/Menu';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import Popover from '@mui/material/Popover';
import MenuList from '@mui/material/MenuList';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import SchoolOutlined from '@mui/icons-material/SchoolOutlined';
import MenuItem, { menuItemClasses } from '@mui/material/MenuItem';
import AccessTimeOutlined from '@mui/icons-material/AccessTimeOutlined';
import LocationOnOutlined from '@mui/icons-material/LocationOnOutlined';
import DescriptionOutlined from '@mui/icons-material/DescriptionOutlined';

import { Iconify } from 'src/components/iconify';

import ModalLayout from 'src/sections/upcoming-exams/modal-layout';
import Section from 'src/sections/upcoming-exams/components/Section';
import InfoCard from 'src/sections/upcoming-exams/components/InfoCard';
import CardPaper from 'src/sections/upcoming-exams/components/CardPaper';
import IconAvatar from 'src/sections/upcoming-exams/components/IconAvatar';

export type ExamProps = {
  id: string;
  title: string;
  code?: string;
  school?: string;
  date?: string;
  time?: string;
  place?: string;
  description?: string;
  deadline?: string;
  fee?: string;
  registered?: number;
  capacity?: number;
  isOpen?: boolean;
  requirement?: string;
  notice?: string;
};

interface Props {
  row: ExamProps;
  selected: boolean;
  onSelectRow: () => void;
}

export const UserTableRow: React.FC<Props> = ({ row, selected, onSelectRow }) => {
  const [openPopover, setOpenPopover] = useState<null | HTMLElement>(null);
  const [openDetail, setOpenDetail] = useState(false);
  const [tab, setTab] = useState<string>('info');

  const handleOpenPopover = (event: React.MouseEvent<HTMLElement>) => {
    setOpenPopover(event.currentTarget);
  };

  const handleClosePopover = () => {
    setOpenPopover(null);
  };

  const handleViewDetail = () => {
    handleClosePopover();
    setOpenDetail(true);
  };

  const handleCloseDetail = () => setOpenDetail(false);

  return (
    <>
      <TableRow hover selected={selected}>
        <TableCell>
          <Typography variant="subtitle2">{row.title}</Typography>
        </TableCell>

        <TableCell>
          <Box>
            <Typography variant="body2" color="text.secondary">
              {row.date || '-'}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {row.time || '-'}
            </Typography>
          </Box>
        </TableCell>

        <TableCell>
          <Typography variant="body2">{row.place || '-'}</Typography>
        </TableCell>

        <TableCell>
          <Typography variant="body2" color="text.secondary">
            {/* Placeholder trạng thái thanh toán */}
            Chưa thanh toán
          </Typography>
        </TableCell>

        <TableCell align="right">
          <Tooltip title="Thao tác">
            <IconButton size="small" onClick={handleOpenPopover}>
              <MoreVertIcon />
            </IconButton>
          </Tooltip>

          <Popover
            open={!!openPopover}
            anchorEl={openPopover}
            onClose={handleClosePopover}
            anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
            transformOrigin={{ vertical: 'top', horizontal: 'right' }}
          >
            <MenuList
              disablePadding
              sx={{
                p: 0.5,
                gap: 0.5,
                width: 140,
                display: 'flex',
                flexDirection: 'column',
                [`& .${menuItemClasses.root}`]: {
                  px: 1,
                  gap: 2,
                  borderRadius: 0.75,
                  [`&.${menuItemClasses.selected}`]: { bgcolor: 'action.selected' },
                },
              }}
            >
              <MenuItem onClick={handleViewDetail}>
                <Iconify icon="solar:eye-bold" />
                Xem chi tiết
              </MenuItem>

              {/* <MenuItem onClick={handleClosePopover} sx={{ color: 'error.main' }}>
                <Iconify icon="solar:trash-bin-trash-bold" />
                Delete
              </MenuItem> */}
            </MenuList>
          </Popover>
        </TableCell>
      </TableRow>

      {/* Modal chi tiết nhỏ: 2 tab (Thông tin kỳ thi + Hoá đơn) */}
      <ModalLayout
        isOpen={openDetail}
        onClose={handleCloseDetail}
        title={row.title}
        status={{ isOpen: !!row.isOpen, label: row.isOpen ? 'Đang mở đăng ký' : 'Chưa mở đăng ký' }}
        maxWidth="md"
        headerContent={
          <Tabs
            value={tab}
            onChange={(_, v) => setTab(v)}
            variant="scrollable"
            scrollButtons="auto"
          >
            <Tab value="info" label="Thông tin kỳ thi" />
            <Tab value="invoice" label="Hoá đơn" />
          </Tabs>
        }
        footer={
          <Box sx={{ display: 'flex', gap: 2, width: '100%', justifyContent: 'flex-end' }}>
            <Button variant="outlined" onClick={handleCloseDetail}>
              Đóng
            </Button>
            <Button
              variant="contained"
              onClick={() => {
                /* đăng ký/thoán hành */
              }}
            >
              Hành động
            </Button>
          </Box>
        }
      >
        <Box sx={{ p: 3 }}>
          {tab === 'info' && (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              <Section title="Thông tin kỳ thi">
                <Box
                  sx={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: 2,
                    '& > *': { flex: '1 1 calc(50% - 16px)', minWidth: '200px' },
                  }}
                >
                  <InfoCard
                    icon={<DescriptionOutlined />}
                    label="Mã kỳ thi"
                    value={row.code || '-'}
                  />
                  <InfoCard icon={<SchoolOutlined />} label="Trường" value={row.school || '-'} />
                  <InfoCard
                    icon={<AccessTimeOutlined />}
                    label="Ngày thi"
                    value={row.date || '-'}
                  />
                  <InfoCard
                    icon={<AccessTimeOutlined />}
                    label="Thời gian thi"
                    value={row.time || '-'}
                  />
                </Box>
              </Section>

              {row.place && (
                <Section title="Địa điểm thi">
                  <CardPaper>
                    <Box display="flex" alignItems="center" gap={2}>
                      <IconAvatar icon={<LocationOnOutlined />} />
                      <Typography variant="body2">{row.place}</Typography>
                    </Box>
                  </CardPaper>
                </Section>
              )}

              {row.description && (
                <Section title="Mô tả">
                  <CardPaper>
                    <Typography variant="body2" color="text.secondary" lineHeight={1.6}>
                      {row.description}
                    </Typography>
                  </CardPaper>
                </Section>
              )}
            </Box>
          )}

          {tab === 'invoice' && (
            <Box>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                Hoá đơn / thông tin thanh toán sẽ hiển thị tại đây.
              </Typography>
              <CardPaper>
                <Typography variant="body2">- Mã hoá đơn: (chưa có dữ liệu)</Typography>
                <Typography variant="body2">
                  - Số tiền: {row.fee ? `${row.fee} VND` : '-'}
                </Typography>
              </CardPaper>
            </Box>
          )}
        </Box>
      </ModalLayout>
    </>
  );
};

export default UserTableRow;

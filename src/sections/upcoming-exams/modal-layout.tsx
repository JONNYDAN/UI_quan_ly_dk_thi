import React from 'react';

import CloseIcon from '@mui/icons-material/Close';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Box,
  Typography,
  Chip,
  DialogProps,
  useMediaQuery,
  useTheme
} from '@mui/material';

type Status = { isOpen?: boolean; label?: string };

interface Props {
  isOpen: boolean;
  onClose: () => void;
  title?: React.ReactNode;
  children?: React.ReactNode;
  status?: Status;
  footer?: React.ReactNode | null;
  maxWidth?: DialogProps['maxWidth'];
  notice?: React.ReactNode | null;
  headerContent?: React.ReactNode | null;
  className?: string;
}

const ModalLayout: React.FC<Props> = ({
  isOpen,
  onClose,
  title,
  children,
  status = { isOpen: false, label: '' },
  footer = null,
  maxWidth = 'md',
  notice = null,
  headerContent = null,
  className = ''
}) => {
  const theme = useTheme();
  const isFullScreen = useMediaQuery(theme.breakpoints.down('sm'));

  if (!isOpen) return null;

  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      fullWidth
      maxWidth={maxWidth}
      fullScreen={isFullScreen}
      PaperProps={{
        sx: {
          borderRadius: isFullScreen ? 0 : 2,
          m: 0,
          maxHeight: '90vh',
          overflow: 'hidden',
          [theme.breakpoints.down('sm')]: {
            maxHeight: '100vh',
            height: '100vh',
            margin: 0,
            borderRadius: 0
          }
        }
      }}
      className={className}
    >
      <DialogTitle sx={{ 
        p: 0,
        [theme.breakpoints.down('sm')]: {
          position: 'sticky',
          top: 0,
          zIndex: 1
        }
      }}>
        <Box sx={{ 
          px: 3, 
          py: 2, 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between', 
          bgcolor: '#124874',
          [theme.breakpoints.down('sm')]: {
            px: 2,
            py: 1.5
          }
        }}>
          <Typography 
            variant="h6" 
            component="div" 
            sx={{ 
              color: 'common.white', 
              fontWeight: 600, 
              lineHeight: 1,
              [theme.breakpoints.down('sm')]: {
                fontSize: '1.1rem'
              }
            }}
          >
            {title}
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {status?.label && (
              <Chip
                label={status.label}
                size="small"
                sx={{
                  bgcolor: status.isOpen ? 'success.lighter' : 'grey.100',
                  color: status.isOpen ? 'success.dark' : 'text.secondary',
                  px: 0.5,
                  [theme.breakpoints.down('sm')]: {
                    fontSize: '0.75rem',
                    height: 24
                  }
                }}
              />
            )}
            <IconButton 
              onClick={onClose} 
              size="small" 
              sx={{ 
                color: 'common.white',
                [theme.breakpoints.down('sm')]: {
                  padding: '6px'
                }
              }} 
              aria-label="close"
            >
              <CloseIcon />
            </IconButton>
          </Box>
        </Box>

        {headerContent && (
          <Box sx={{ 
            borderBottom: 1, 
            borderColor: 'divider',
            [theme.breakpoints.down('sm')]: {
              position: 'sticky',
              top: 56, 
              zIndex: 1,
              bgcolor: 'background.paper'
            }
          }}>
            {headerContent}
          </Box>
        )}
      </DialogTitle>

      <DialogContent 
        dividers 
        sx={{ 
          p: 0, 
          overflowY: 'auto',
          [theme.breakpoints.down('sm')]: {
            height: 'calc(100vh - 56px)',
            overflowY: 'auto',
            WebkitOverflowScrolling: 'touch' 
          }
        }}
      >
        {children}
      </DialogContent>

      {notice && (
        <Box sx={{ 
          px: 3, 
          py: 1, 
          borderTop: 1, 
          borderColor: 'divider',
          [theme.breakpoints.down('sm')]: {
            px: 3,
            py: 1,
            position: 'sticky',
            bottom: 0,
            bgcolor: 'background.paper'
          }
        }}>
          {notice}
        </Box>
      )}

      {footer && (
        <DialogActions sx={{ 
          px: 3, 
          py: 2,
          [theme.breakpoints.down('sm')]: {
            px: 3,
            py: 2,
            position: 'sticky',
            bottom: 0,
            bgcolor: 'background.paper',
            borderTop: 1,
            borderColor: 'divider'
          }
        }}> 
          {footer}
        </DialogActions>
      )}
    </Dialog>
  );
};

export default ModalLayout;
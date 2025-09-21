import { useState, useCallback } from 'react';

import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import CardContent from '@mui/material/CardContent';

import { DashboardContent } from 'src/layouts/dashboard';

import { Iconify } from 'src/components/iconify';

import { ProfileTabs } from '../profile-tabs';
import { ProfileCover } from '../profile-cover';
import { ProfileInfoItem } from '../profile-info-item';

import type { IUserProfile } from '../profile-info-item';

// ----------------------------------------------------------------------

type Props = {
  user: IUserProfile;
};

export function ProfileView({ user }: Props) {
  const [activeTab, setActiveTab] = useState('overview');

  const handleTabChange = useCallback((newTab: string) => {
    setActiveTab(newTab);
  }, []);

  return (
    <DashboardContent>
      <Container maxWidth="lg">
        {/* Cover Section */}
        <ProfileCover 
          coverUrl={user.coverUrl} 
          isOwnProfile
        />

        <Grid container spacing={4}>
          {/* Sidebar Profile Card */}
          <Grid size={{ xs: 12, md: 4 }}>
            <Card sx={{ position: 'relative', mt: -8 }}>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  mt: -6,
                  mb: 2,
                }}
              >
                <Avatar
                  src={user.avatarUrl}
                  sx={{
                    width: 120,
                    height: 120,
                    border: (theme) => `4px solid ${theme.palette.background.paper}`,
                  }}
                >
                  {user.displayName?.charAt(0).toUpperCase()}
                </Avatar>
              </Box>

              <CardContent sx={{ textAlign: 'center', mt: 4 }}>
                <Typography variant="h5" gutterBottom>
                  {user.displayName}
                </Typography>

                <Typography variant="body2" color="text.secondary" gutterBottom>
                  {user.title}
                </Typography>

                <Button
                  variant="outlined"
                  startIcon={<Iconify icon="solar:pen-bold" />}
                  sx={{ mb: 3 }}
                >
                  Edit Profile
                </Button>

                <Divider sx={{ my: 3 }} />

                {/* Contact Information */}
                <Box sx={{ textAlign: 'left' }}>
                  <ProfileInfoItem
                    icon="mingcute:mail-line"
                    label="Email"
                    value={user.email}
                  />
                  
                  <ProfileInfoItem
                    icon="mingcute:phone-line"
                    label="Phone"
                    value={user.phone}
                  />
                  
                  <ProfileInfoItem
                    icon="mingcute:location-line"
                    label="Location"
                    value={user.location}
                  />
                  
                  <ProfileInfoItem
                    icon="mingcute:calendar-line"
                    label="Joined"
                    value={user.joinDate}
                  />
                </Box>

                <Divider sx={{ my: 3 }} />

                {/* Social Links */}
                <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1 }}>
                  {user.socialLinks?.linkedin && (
                    <Button
                      variant="outlined"
                      size="small"
                      href={user.socialLinks.linkedin}
                      target="_blank"
                      startIcon={<Iconify icon="socials:linkedin" />}
                    >
                      LinkedIn
                    </Button>
                  )}
                  
                  {user.socialLinks?.github && (
                    <Button
                      variant="outlined"
                      size="small"
                      href={user.socialLinks.github}
                      target="_blank"
                      startIcon={<Iconify icon="socials:github" />}
                    >
                      GitHub
                    </Button>
                  )}
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Main Content */}
          <Grid size={{ xs: 12, md: 8 }}>
            <Card>
              <CardContent>
                {/* Profile Tabs */}
                <ProfileTabs
                  activeTab={activeTab}
                  onTabChange={handleTabChange}
                  tabs={[
                    { value: 'overview', label: 'Overview' },
                    { value: 'experience', label: 'Experience' },
                    { value: 'education', label: 'Education' },
                    { value: 'skills', label: 'Skills' },
                  ]}
                />

                {/* Tab Content */}
                {activeTab === 'overview' && (
                  <Box sx={{ py: 3 }}>
                    <Typography variant="h6" gutterBottom>
                      About
                    </Typography>
                    <Typography variant="body1" color="text.secondary" paragraph>
                      {user.bio || 'No bio available.'}
                    </Typography>

                    <Typography variant="h6" gutterBottom sx={{ mt: 4 }}>
                      Basic Information
                    </Typography>
                    
                    <Grid container spacing={2}>
                      <Grid size={{ xs: 12, sm: 6 }}>
                        <ProfileInfoItem
                          icon="mingcute:briefcase-line"
                          label="Current Position"
                          value={user.currentPosition}
                        />
                      </Grid>
                      <Grid size={{ xs: 12, sm: 6 }}>
                        <ProfileInfoItem
                          icon="mingcute:building-line"
                          label="Company"
                          value={user.company}
                        />
                      </Grid>
                    </Grid>
                  </Box>
                )}

                {activeTab === 'experience' && (
                  <Box sx={{ py: 3 }}>
                    <Typography variant="h6" gutterBottom>
                      Work Experience
                    </Typography>
                    
                    {user.experience?.map((exp, index) => (
                      <Box key={index} sx={{ mb: 3 }}>
                        <Typography variant="subtitle1" fontWeight="bold">
                          {exp.position}
                        </Typography>
                        <Typography variant="body2" color="primary" gutterBottom>
                          {exp.company} • {exp.period}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {exp.description}
                        </Typography>
                        {user.experience && index < user.experience.length - 1 && <Divider sx={{ my: 2 }} />}
                      </Box>
                    ))}

                    {(!user.experience || user.experience.length === 0) && (
                      <Typography variant="body2" color="text.secondary">
                        No work experience added.
                      </Typography>
                    )}
                  </Box>
                )}

                {activeTab === 'education' && (
                  <Box sx={{ py: 3 }}>
                    <Typography variant="h6" gutterBottom>
                      Education
                    </Typography>
                    
                    {user.education?.map((edu, index) => (
                      <Box key={index} sx={{ mb: 3 }}>
                        <Typography variant="subtitle1" fontWeight="bold">
                          {edu.degree}
                        </Typography>
                        <Typography variant="body2" color="primary" gutterBottom>
                          {edu.school} • {edu.period}
                        </Typography>
                        {edu.description && (
                          <Typography variant="body2" color="text.secondary">
                            {edu.description}
                          </Typography>
                        )}
                        {user.education && index < user.education.length - 1 && <Divider sx={{ my: 2 }} />}
                      </Box>
                    ))}

                    {(!user.education || user.education.length === 0) && (
                      <Typography variant="body2" color="text.secondary">
                        No education information added.
                      </Typography>
                    )}
                  </Box>
                )}

                {activeTab === 'skills' && (
                  <Box sx={{ py: 3 }}>
                    <Typography variant="h6" gutterBottom>
                      Skills & Expertise
                    </Typography>
                    
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                      {user.skills?.map((skill, index) => (
                        <Button
                          key={index}
                          variant="outlined"
                          size="small"
                          color="primary"
                        >
                          {skill}
                        </Button>
                      ))}
                    </Box>

                    {(!user.skills || user.skills.length === 0) && (
                      <Typography variant="body2" color="text.secondary">
                        No skills added.
                      </Typography>
                    )}
                  </Box>
                )}
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </DashboardContent>
  );
}
import { useEffect, useMemo, useState } from 'react';
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Tab,
  Tabs,
  TextField,
  Typography,
} from '@mui/material';
import { useChangePasswordMutation, useGetCurrentUserQuery, useUpdateCurrentUserMutation } from '@core/store/api';
import { IUpdateProfilePayload } from '@core/interfaces/api/IUser';

interface IUserProfileDialogProps {
  open: boolean;
  onClose: () => void;
}

const defaultProfile: IUpdateProfilePayload = {
  FirstName: '',
  LastName: '',
  DisplayName: '',
  Phone: '',
  Address: '',
  DateOfBirth: null,
};

export default function UserProfileDialog({ open, onClose }: Readonly<IUserProfileDialogProps>) {
  const { data, isFetching } = useGetCurrentUserQuery(undefined, {
    skip: !open,
  });
  const [updateCurrentUser, { isLoading: isSavingProfile }] = useUpdateCurrentUserMutation();
  const [changePassword, { isLoading: isSavingPassword }] = useChangePasswordMutation();
  const [activeTab, setActiveTab] = useState(0);
  const [profileForm, setProfileForm] = useState<IUpdateProfilePayload>(defaultProfile);
  const [passwordForm, setPasswordForm] = useState({
    CurrentPassword: '',
    NewPassword: '',
    ConfirmPassword: '',
  });
  const [profileMessage, setProfileMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [passwordMessage, setPasswordMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const currentUser = data?.Data;

  useEffect(() => {
    if (!currentUser || !open) {
      return;
    }

    setProfileForm({
      FirstName: currentUser.FirstName ?? '',
      LastName: currentUser.LastName ?? '',
      DisplayName: currentUser.DisplayName ?? '',
      Phone: currentUser.Phone ?? '',
      Address: currentUser.Address ?? '',
      DateOfBirth: currentUser.DateOfBirth ?? null,
    });
    setProfileMessage(null);
    setPasswordMessage(null);
  }, [currentUser, open]);

  const initialProfileSnapshot = useMemo(() => ({
    FirstName: currentUser?.FirstName ?? '',
    LastName: currentUser?.LastName ?? '',
    DisplayName: currentUser?.DisplayName ?? '',
    Phone: currentUser?.Phone ?? '',
    Address: currentUser?.Address ?? '',
    DateOfBirth: currentUser?.DateOfBirth ?? null,
  }), [currentUser]);

  const isProfileChanged = JSON.stringify(profileForm) !== JSON.stringify(initialProfileSnapshot);
  const isPasswordValid =
    passwordForm.CurrentPassword.trim() !== '' &&
    passwordForm.NewPassword.trim().length >= 6 &&
    passwordForm.NewPassword === passwordForm.ConfirmPassword;

  const handleProfileChange = (field: keyof IUpdateProfilePayload, value: string) => {
    setProfileMessage(null);
    setProfileForm(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handlePasswordChange = (field: keyof typeof passwordForm, value: string) => {
    setPasswordMessage(null);
    setPasswordForm(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleProfileSave = async () => {
    try {
      await updateCurrentUser({ payload: profileForm }).unwrap();
      setProfileMessage({ type: 'success', text: 'Profile updated successfully.' });
    } catch (error: any) {
      setProfileMessage({
        type: 'error',
        text: error?.data?.message || 'Unable to update profile.',
      });
    }
  };

  const handlePasswordSave = async () => {
    if (!isPasswordValid) {
      setPasswordMessage({ type: 'error', text: 'Please provide valid password details.' });
      return;
    }

    try {
      await changePassword({
        payload: {
          CurrentPassword: passwordForm.CurrentPassword,
          NewPassword: passwordForm.NewPassword,
        },
      }).unwrap();
      setPasswordForm({
        CurrentPassword: '',
        NewPassword: '',
        ConfirmPassword: '',
      });
      setPasswordMessage({ type: 'success', text: 'Password changed successfully.' });
    } catch (error: any) {
      setPasswordMessage({
        type: 'error',
        text: error?.data?.message || 'Unable to change password.',
      });
    }
  };

  const handleDialogClose = () => {
    setActiveTab(0);
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleDialogClose} fullWidth maxWidth="sm">
      <DialogTitle>Profile Settings</DialogTitle>
      <DialogContent dividers>
        {isFetching ? (
          <Box className="flex items-center justify-center py-10">
            <CircularProgress size={28} />
          </Box>
        ) : (
          <>
            <Box className="mb-4">
              <Typography variant="h6" sx={{ color: 'var(--palette-text-primary)' }}>
                {currentUser?.DisplayName || 'User Profile'}
              </Typography>
              <Typography variant="body2" sx={{ color: 'var(--palette-text-secondary)' }}>
                {currentUser?.Email || ''}
              </Typography>
            </Box>

            <Tabs value={activeTab} onChange={(_, value) => setActiveTab(value)} sx={{ mb: 3 }}>
              <Tab label="Profile" />
              <Tab label="Change Password" />
            </Tabs>

            {activeTab === 0 && (
              <Box className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {profileMessage && <Alert severity={profileMessage.type} className="md:col-span-2">{profileMessage.text}</Alert>}
                <TextField
                  label="First Name"
                  value={profileForm.FirstName}
                  onChange={event => handleProfileChange('FirstName', event.target.value)}
                  fullWidth
                />
                <TextField
                  label="Last Name"
                  value={profileForm.LastName}
                  onChange={event => handleProfileChange('LastName', event.target.value)}
                  fullWidth
                />
                <TextField
                  label="Display Name"
                  value={profileForm.DisplayName}
                  onChange={event => handleProfileChange('DisplayName', event.target.value)}
                  fullWidth
                />
                <TextField
                  label="Phone"
                  value={profileForm.Phone}
                  onChange={event => handleProfileChange('Phone', event.target.value)}
                  fullWidth
                />
                <TextField
                  label="Email"
                  value={currentUser?.Email ?? ''}
                  fullWidth
                  disabled
                />
                <TextField
                  label="Address"
                  value={profileForm.Address}
                  onChange={event => handleProfileChange('Address', event.target.value)}
                  fullWidth
                />
              </Box>
            )}

            {activeTab === 1 && (
              <Box className="grid grid-cols-1 gap-4">
                {passwordMessage && <Alert severity={passwordMessage.type}>{passwordMessage.text}</Alert>}
                <TextField
                  label="Current Password"
                  type="password"
                  value={passwordForm.CurrentPassword}
                  onChange={event => handlePasswordChange('CurrentPassword', event.target.value)}
                  fullWidth
                />
                <TextField
                  label="New Password"
                  type="password"
                  value={passwordForm.NewPassword}
                  onChange={event => handlePasswordChange('NewPassword', event.target.value)}
                  helperText="Minimum 6 characters"
                  fullWidth
                />
                <TextField
                  label="Confirm New Password"
                  type="password"
                  value={passwordForm.ConfirmPassword}
                  onChange={event => handlePasswordChange('ConfirmPassword', event.target.value)}
                  error={passwordForm.ConfirmPassword !== '' && passwordForm.NewPassword !== passwordForm.ConfirmPassword}
                  helperText={
                    passwordForm.ConfirmPassword !== '' && passwordForm.NewPassword !== passwordForm.ConfirmPassword
                      ? 'Passwords do not match'
                      : ''
                  }
                  fullWidth
                />
              </Box>
            )}
          </>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleDialogClose}>Close</Button>
        {activeTab === 0 ? (
          <Button
            variant="contained"
            onClick={handleProfileSave}
            disabled={!isProfileChanged || isSavingProfile || isFetching}
          >
            {isSavingProfile ? 'Saving...' : 'Save Profile'}
          </Button>
        ) : (
          <Button
            variant="contained"
            onClick={handlePasswordSave}
            disabled={!isPasswordValid || isSavingPassword}
          >
            {isSavingPassword ? 'Updating...' : 'Change Password'}
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
}

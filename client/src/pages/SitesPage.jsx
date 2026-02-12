import React, { useEffect, useState } from 'react';

import {
  Table,
  TextInput,
  Button,
  Group,
  Loader,
  Text,
  Paper,
  Stack,
  Pagination,
  Select,
} from '@mantine/core';

import { IconSearch, IconPlus, IconRefresh, IconDeviceFloppy, IconTrash } from '@tabler/icons-react';

import sitesApi from '../api/sites.api.js';
import timezonesApi from '../api/timezones.api.js';
import useAuth from '../hooks/useAuth.js';

const EMPTY_SITE_FORM = {
  id: null,
  name: '',
  location: '',
  timezone: '',
  status: 'active',
};

const SitesPage = () => {
  const { hasPermission } = useAuth();

  const canRead = hasPermission('sites:read');
  const canCreate = hasPermission('sites:create');
  const canUpdate = hasPermission('sites:update');
  const canDelete = hasPermission('sites:delete');

  const [sites, setSites] = useState([]);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 1,
  });
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [formError, setFormError] = useState('');
  const [siteForm, setSiteForm] = useState(EMPTY_SITE_FORM);
  const [isEditing, setIsEditing] = useState(false);

  const [timezones, setTimezones] = useState([]);
  const [timezonesLoading, setTimezonesLoading] = useState(false);
  const [timezonesError, setTimezonesError] = useState('');

  const fetchSites = async (page = 1) => {
    if (!canRead) return;
    setLoading(true);
    setError('');
    try {
      const result = await sitesApi.getSites({
        page,
        limit: pagination.limit,
        search,
        status: statusFilter,
      });
      setSites(result.data);
      setPagination((prev) => ({
        ...prev,
        page,
        total: result.pagination.total,
        totalPages: result.pagination.totalPages,
      }));
    } catch (err) {
      const message =
        err.response?.data?.message || 'Failed to load sites';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const fetchTimezones = async () => {
    setTimezonesLoading(true);
    setTimezonesError('');
    try {
      const data = await timezonesApi.getTimezones();
      const options = (data || []).map((tz) => ({
        value: tz,
        label: tz,
      }));
      setTimezones(options);
    } catch (err) {
      const message =
        err.response?.data?.message || 'Failed to load timezones';
      setTimezonesError(message);
    } finally {
      setTimezonesLoading(false);
    }
  };

  useEffect(() => {
    fetchSites(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, statusFilter]);

  useEffect(() => {
    fetchTimezones();
  }, []);

  const handlePageChange = (page) => {
    fetchSites(page);
  };

  const handleStartCreate = () => {
    setSiteForm(EMPTY_SITE_FORM);
    setIsEditing(false);
    setFormError('');
  };

  const handleStartEdit = (site) => {
    setSiteForm({
      id: site.id,
      name: site.name,
      location: site.location || '',
      timezone: site.timezone || '',
      status: site.status || 'active',
    });
    setIsEditing(true);
    setFormError('');
  };

  const handleFormChange = (field, value) => {
    setSiteForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!canCreate && !isEditing) return;
    if (!canUpdate && isEditing) return;

    if (!siteForm.name.trim()) {
      setFormError('Site name is required');
      return;
    }

    setSaving(true);
    setFormError('');
    try {
      if (isEditing && siteForm.id) {
        await sitesApi.updateSite(siteForm.id, {
          name: siteForm.name,
          location: siteForm.location,
          timezone: siteForm.timezone,
          status: siteForm.status,
        });
      } else {
        await sitesApi.createSite({
          name: siteForm.name,
          location: siteForm.location,
          timezone: siteForm.timezone,
          status: siteForm.status,
        });
      }

      await fetchSites(pagination.page);
      setSiteForm(EMPTY_SITE_FORM);
      setIsEditing(false);
    } catch (err) {
      const message =
        err.response?.data?.message || 'Failed to save site';
      setFormError(message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (site) => {
    if (!canDelete) return;
    // eslint-disable-next-line no-alert
    const confirmed = window.confirm(
      `Delete site "${site.name}"? This cannot be undone.`
    );
    if (!confirmed) return;

    setSaving(true);
    try {
      await sitesApi.deleteSite(site.id);
      await fetchSites(pagination.page);
    } catch (err) {
      const message =
        err.response?.data?.message ||
        'Failed to delete site (maybe assigned to users)';
      setError(message);
    } finally {
      setSaving(false);
    }
  };

  if (!canRead) {
    return <Text>You do not have permission to view sites.</Text>;
  }

  return (
    <div>
      <div className="page-title">Sites</div>

      <Paper shadow="xs" p="md" mb="md">
        <Stack gap="sm">
          <Group justify="space-between" align="center">
            <Group gap="sm" wrap="wrap">
              <TextInput
                placeholder="Search sites"
                leftSection={<IconSearch size={16} />}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                size="sm"
              />
              <Select
                placeholder="Status"
                data={[
                  { value: '', label: 'All' },
                  { value: 'active', label: 'Active' },
                  { value: 'inactive', label: 'Inactive' },
                ]}
                value={statusFilter}
                onChange={(value) => setStatusFilter(value || '')}
                clearable
                size="sm"
              />
            </Group>
            <Group gap="sm">
              <Button
                variant="light"
                color="blue"
                leftSection={<IconRefresh size={16} />}
                onClick={() => fetchSites(pagination.page)}
                size="sm"
              >
                Refresh
              </Button>
              {canCreate && (
                <Button
                  variant="filled"
                  color="blue"
                  leftSection={<IconPlus size={16} />}
                  onClick={handleStartCreate}
                  size="sm"
                >
                  New site
                </Button>
              )}
            </Group>
          </Group>
          {error && <Text c="red" fz="sm">{error}</Text>}
        </Stack>
      </Paper>

      {(canCreate || isEditing) && (
        <Paper shadow="xs" p="md" mb="md">
          <form onSubmit={handleSubmit}>
            <Stack gap="sm">
              <Group grow align="flex-start">
                <TextInput
                  label="Site name"
                  placeholder="Main Office"
                  value={siteForm.name}
                  onChange={(e) => handleFormChange('name', e.target.value)}
                  required
                  size="sm"
                />
                <TextInput
                  label="Location"
                  placeholder="City, Country"
                  value={siteForm.location}
                  onChange={(e) => handleFormChange('location', e.target.value)}
                  size="sm"
                />
              </Group>
              <Group grow align="flex-start">
                <Select
                  label="Timezone"
                  placeholder={timezonesLoading ? 'Loading...' : 'Select timezone'}
                  data={timezones}
                  value={siteForm.timezone}
                  onChange={(value) => handleFormChange('timezone', value || '')}
                  searchable
                  clearable
                  nothingFound={timezonesLoading ? 'Loading...' : 'No timezones'}
                  size="sm"
                />
                <Select
                  label="Status"
                  data={[
                    { value: 'active', label: 'Active' },
                    { value: 'inactive', label: 'Inactive' },
                  ]}
                  value={siteForm.status}
                  onChange={(value) =>
                    handleFormChange('status', value || 'active')
                  }
                  size="sm"
                />
              </Group>
              {timezonesError && <Text c="red" fz="sm">{timezonesError}</Text>}
              {formError && <Text c="red" fz="sm">{formError}</Text>}
              <Group justify="flex-end">
                {isEditing && (
                  <Button
                    variant="subtle"
                    color="gray"
                    onClick={() => {
                      setSiteForm(EMPTY_SITE_FORM);
                      setIsEditing(false);
                      setFormError('');
                    }}
                    size="sm"
                    type="button"
                  >
                    Cancel
                  </Button>
                )}
                <Button
                  leftSection={<IconDeviceFloppy size={16} />}
                  color="blue"
                  type="submit"
                  size="sm"
                  loading={saving}
                >
                  {isEditing ? 'Update site' : 'Create site'}
                </Button>
              </Group>
            </Stack>
          </form>
        </Paper>
      )}

      <Paper shadow="xs" p="md">
        {loading ? (
          <Group justify="center" py="xl">
            <Loader size="md" />
          </Group>
        ) : (
          <>
            <Table striped highlightOnHover withTableBorder withColumnBorders>
              <Table.Thead>
                <Table.Tr>
                  <Table.Th>Name</Table.Th>
                  <Table.Th>Location</Table.Th>
                  <Table.Th>Timezone</Table.Th>
                  <Table.Th>Status</Table.Th>
                  <Table.Th>Actions</Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {sites.length === 0 && (
                  <Table.Tr>
                    <Table.Td colSpan={5}>
                      <Text fz="sm" c="dimmed">
                        No sites found.
                      </Text>
                    </Table.Td>
                  </Table.Tr>
                )}
                {sites.map((site) => (
                  <Table.Tr key={site.id}>
                    <Table.Td>{site.name}</Table.Td>
                    <Table.Td>{site.location || '-'}</Table.Td>
                    <Table.Td>{site.timezone || '-'}</Table.Td>
                    <Table.Td>{site.status}</Table.Td>
                    <Table.Td>
                      <Group gap="xs">
                        {canUpdate && (
                          <Button
                            variant="subtle"
                            size="xs"
                            onClick={() => handleStartEdit(site)}
                          >
                            Edit
                          </Button>
                        )}
                        {canDelete && (
                          <Button
                            variant="subtle"
                            color="red"
                            size="xs"
                            leftSection={<IconTrash size={14} />}
                            onClick={() => handleDelete(site)}
                            loading={saving}
                          >
                            Delete
                          </Button>
                        )}
                      </Group>
                    </Table.Td>
                  </Table.Tr>
                ))}
              </Table.Tbody>
            </Table>

            <Group justify="space-between" mt="md" align="center">
              <Text fz="sm" c="dimmed">
                Page {pagination.page} of {pagination.totalPages} · {pagination.total} sites
              </Text>
              <Pagination
                value={pagination.page}
                onChange={handlePageChange}
                total={pagination.totalPages || 1}
                size="sm"
              />
            </Group>
          </>
        )}
      </Paper>
    </div>
  );
};

export default SitesPage;

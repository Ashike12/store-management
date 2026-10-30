import {Box, Card, Skeleton, Stack} from '@mui/material';

export function TableSkeleton({columns = 5, rows = 6}: Readonly<{columns?: number; rows?: number}>) {
  return (
    <>
      {Array.from({length: rows}, (_, rowIndex) => (
        <tr key={rowIndex} aria-hidden="true">
          {Array.from({length: columns}, (_, columnIndex) => (
            <td key={columnIndex} className="border px-4 py-3">
              <Skeleton
                animation="wave"
                variant="rounded"
                height={18}
                width={`${68 + ((rowIndex + columnIndex) % 3) * 10}%`}
              />
            </td>
          ))}
        </tr>
      ))}
    </>
  );
}

export function DashboardSkeleton() {
  return (
    <Box role="status" aria-label="Loading dashboard" sx={{width: '100%', p: {xs: '16px', md: '24px'}}}>
      <Box sx={{display: 'grid', gridTemplateColumns: {xs: '1fr', sm: 'repeat(2, 1fr)', xl: 'repeat(4, 1fr)'}, gap: '16px'}}>
        {Array.from({length: 4}, (_, index) => (
          <Card key={index} sx={{p: '20px'}}>
            <Skeleton animation="wave" width="52%" height={18} />
            <Skeleton animation="wave" width="72%" height={42} sx={{mt: '10px'}} />
          </Card>
        ))}
      </Box>
      <Box sx={{display: 'grid', gridTemplateColumns: {xs: '1fr', lg: '2fr 1fr'}, gap: '16px', mt: '16px'}}>
        {[0, 1].map(index => (
          <Card key={index} sx={{p: '20px'}}>
            <Skeleton animation="wave" width={180} height={26} />
            <Skeleton animation="wave" variant="rounded" height={260} sx={{mt: '16px'}} />
          </Card>
        ))}
      </Box>
    </Box>
  );
}

export function DetailSkeleton({rows = 5}: Readonly<{rows?: number}>) {
  return (
    <Stack role="status" aria-label="Loading details" gap="16px" sx={{width: '100%'}}>
      <Card variant="outlined" sx={{p: '24px'}}>
        <Skeleton animation="wave" width="38%" height={34} />
        <Skeleton animation="wave" width="64%" height={20} />
      </Card>
      {Array.from({length: rows}, (_, index) => (
        <Skeleton key={index} animation="wave" variant="rounded" height={56} />
      ))}
    </Stack>
  );
}

export function FormSkeleton() {
  return (
    <Box role="status" aria-label="Loading form" sx={{width: '100%', p: {xs: '16px', md: '32px'}}}>
      <Skeleton animation="wave" width={240} height={42} sx={{mb: '24px'}} />
      <Box sx={{display: 'grid', gridTemplateColumns: {xs: '1fr', md: 'repeat(2, 1fr)'}, gap: '20px'}}>
        {Array.from({length: 8}, (_, index) => (
          <Skeleton key={index} animation="wave" variant="rounded" height={56} />
        ))}
      </Box>
    </Box>
  );
}

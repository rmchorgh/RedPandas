import { Skeleton, Box } from "@mantine/core";

export default function Loading() {
  return (
    <Box px="lg" py="md">
      <Skeleton height={8} radius="xl" mb="md" />
      <Skeleton height={8} radius="xl" mb="md" />
      <Skeleton height={8} radius="xl" mb="md" />
      <Skeleton height={8} radius="xl" mb="md" />
    </Box>
  );
}
